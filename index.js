"use strict";

const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, makeCacheableSignalKeyStore, DisconnectReason, Browsers } = require("@whiskeysockets/baileys");
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

const SESSION_DIR = path.join(__dirname, "Session");

/**
 * Handles session authentication from environment variable
 */
async function authentication() {
    try {
        const session = process.env.SESSION || '';
        const credsPath = path.join(SESSION_DIR, "creds.json");

        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }

        if (session && session !== 'zokk' && session !== 'PASTE_YOUR_SESSION_ID_HERE') {
            console.log("Establishing connection...");
            const decodedSession = Buffer.from(session, 'base64').toString('utf-8');
            
            // Check if we need to update the session
            if (fs.existsSync(credsPath)) {
                const existingSession = fs.readFileSync(credsPath, 'utf-8');
                if (existingSession !== decodedSession) {
                    await fs.promises.writeFile(credsPath, decodedSession);
                    console.log("Session updated from environment variable");
                } else {
                    console.log("Session already exists and matches");
                }
            } else {
                await fs.promises.writeFile(credsPath, decodedSession);
                console.log("Session written from environment variable");
            }
        } else {
            console.log("No valid session in environment variable - will show QR code");
        }
    } catch (e) {
        console.log("Session error: " + e);
    }
}

async function connect() {
    await authentication();
    
    // Fetch latest version like the pairing code does
    let version = [2, 3000, 1015901307]; // default fallback
    try {
        const versionData = await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json();
        version = versionData.version;
        console.log("Fetched latest Baileys version:", version);
    } catch (e) {
        console.log("Using fallback version:", version);
    }
    
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        version: version,
        logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({ level: "silent", stream: 'store' }))
        },
        browser: Browsers.macOS("Safari"),
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
        getMessage: async () => undefined,
        markOnlineOnConnect: true,
        connectTimeoutMs: 120000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: false,
        fireInitQueries: true,
        defaultQueryTimeoutMs: 60000,
        transactionOpts: {
            maxCommitRetries: 10,
            delayBetweenTriesMs: 3000
        },
        retryRequestDelayMs: 10000
    });

    store.bind(sock.ev);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log("Scan QR Code with WhatsApp");
            console.log(qr);
        }
        
        if (connection === "close") {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reconnect = code !== DisconnectReason.loggedOut;
            console.log("[Toxic-MD] Disconnected, code:", code, "| reconnect:", reconnect);
            if (reconnect) {
                setTimeout(connect, 5000);
            } else {
                console.log("Logged out - clearing session...");
                if (fs.existsSync(SESSION_DIR)) {
                    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
                }
            }
        } else if (connection === "open") {
            console.log("[Toxic-MD] ✅ Connected successfully!");
            console.log("Bot is ready to respond to commands!");
        } else if (connection === "connecting") {
            console.log("Connecting to WhatsApp...");
        }
    });

    // Message handler - FAST RESPONSE
    sock.ev.on("messages.upsert", async (m) => {
        try {
            const { messages, type } = m;
            if (type !== "notify") return;
            
            const msg = messages[0];
            if (!msg || !msg.message || !msg.key) return;
            
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Extract text
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
                console.log("Pong sent to:", from);
            }
        } catch (err) {
            // Silent
        }
    });
}

// Error handling
process.on("uncaughtException", (err) => {
    console.log("Uncaught exception:", err.message);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection:", err.message);
});

connect().catch(err => {
    console.error("[Toxic-MD] Fatal error:", err.message);
    setTimeout(connect, 5000);
});