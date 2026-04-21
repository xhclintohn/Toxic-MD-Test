"use strict";

const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, makeCacheableSignalKeyStore, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const express = require('express');
const { Boom } = require('@hapi/boom');

// Initialize Store and Logger
const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

// Express Server Setup
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`[Toxic-MD] Web server on port ${PORT}`));

// Keep alive ping
setInterval(() => {
    fetch(`http://localhost:${PORT}`).catch(() => {});
}, 25000);

const PREFIX = ".";
const SESSION_DIR = path.join(__dirname, "Session");

/**
 * Loads session from environment variable
 */
async function loadSessionFromEnv() {
    try {
        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }

        const sessionData = process.env.SESSION || '';
        
        if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
            const credsPath = path.join(SESSION_DIR, "creds.json");
            const decoded = Buffer.from(sessionData, 'base64').toString('utf-8');
            fs.writeFileSync(credsPath, decoded);
            console.log("[Toxic-MD] Session loaded from env ✅");
            return true;
        } else {
            console.log("[Toxic-MD] No session in env - will show QR code");
            return false;
        }
    } catch (e) {
        console.log("[Toxic-MD] Session load error:", e.message);
        return false;
    }
}

async function connect() {
    await loadSessionFromEnv();
    
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        browser: ['Toxic-MD', "Chrome", "1.0.0"],
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 10000,
    });

    store.bind(sock.ev);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log("[Toxic-MD] Scan QR Code with WhatsApp");
        }
        
        if (connection === "close") {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reconnect = code !== DisconnectReason.loggedOut;
            console.log("[Toxic-MD] Disconnected, code:", code, "| reconnect:", reconnect);
            if (reconnect) {
                setTimeout(connect, 5000);
            }
        } else if (connection === "open") {
            console.log("[Toxic-MD] Connected ✅ Bot is ready!");
        }
    });

    // Message handler - INSTANT RESPONSE
    sock.ev.on("messages.upsert", async (m) => {
        try {
            const { messages, type } = m;
            if (type !== "notify") return;
            
            const msg = messages[0];
            if (!msg || !msg.message || !msg.key) return;
            
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Extract text FAST
            let text = "";
            if (msg.message.conversation) {
                text = msg.message.conversation;
            } else if (msg.message.extendedTextMessage?.text) {
                text = msg.message.extendedTextMessage.text;
            } else {
                return;
            }
            
            if (!text.startsWith(PREFIX)) return;
            
            const cmd = text.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            
            // Commands
            if (cmd === "ping") {
                await sock.sendMessage(from, { text: "🏓 Pong!" });
            }
        } catch (err) {
            // Silent for speed
        }
    });
}

// Error handling to prevent crashes
process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});

connect().catch(err => {
    console.error("[Toxic-MD] Fatal error:", err.message);
    setTimeout(connect, 5000);
});