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
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

/**
 * Handles session authentication by writing the session string 
 * from environment variable to a local creds.json file.
 */
async function authentication() {
    try {
        const session = process.env.SESSION || '';
        const credsPath = path.join(__dirname, "Session", "creds.json");

        if (!fs.existsSync(credsPath) || session !== "zokk") {
            console.log("Establishing connection...");
            if (!fs.existsSync(path.join(__dirname, "Session"))) {
                fs.mkdirSync(path.join(__dirname, "Session"), { recursive: true });
            }
            if (session && session !== 'zokk' && session !== 'PASTE_YOUR_SESSION_ID_HERE') {
                await fs.promises.writeFile(credsPath, Buffer.from(session, 'base64').toString('utf-8'));
            }
        }
    } catch (e) {
        console.log("Session Invalid: " + e);
    }
}

async function connect() {
    await authentication();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, "Session"));

    const sock = makeWASocket({
        version: [2, 3000, 1015901307],
        logger: pino({ level: "silent" }),
        browser: ['Toxic-MD', "safari", "1.0.0"],
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
    });

    store.bind(sock.ev);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log("Scan QR Code with WhatsApp");
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
            
            if (!text.startsWith(".")) return;
            
            const cmd = text.slice(1).trim().split(/\s+/)[0].toLowerCase();
            
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