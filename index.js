"use strict";

const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const express = require('express');
const { Boom } = require('@hapi/boom');

// Express Server Setup
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const SESSION_DIR = path.join(__dirname, "Session");

// Session authentication
async function authentication() {
    try {
        const session = process.env.SESSION || '';
        const credsPath = path.join(SESSION_DIR, "creds.json");

        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }

        if (session && session !== 'zokk' && session !== 'PASTE_YOUR_SESSION_ID_HERE') {
            const decodedSession = Buffer.from(session, 'base64').toString('utf-8');
            
            if (fs.existsSync(credsPath)) {
                const existingSession = fs.readFileSync(credsPath, 'utf-8');
                if (existingSession !== decodedSession) {
                    await fs.promises.writeFile(credsPath, decodedSession);
                }
            } else {
                await fs.promises.writeFile(credsPath, decodedSession);
            }
            console.log("Session loaded");
        }
    } catch (e) {
        console.log("Session error:", e.message);
    }
}

async function connect() {
    await authentication();
    
    // Use static version for speed (no fetch delay)
    const version = [2, 3000, 1015901307];
    
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        version: version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        browser: Browsers.macOS("Safari"),
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 30000,
        keepAliveIntervalMs: 20000,
        defaultQueryTimeoutMs: 5000,
        emitOwnEvents: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) {
                setTimeout(connect, 5000);
            }
        } else if (connection === "open") {
            console.log("[Toxic-MD] ✅ Connected!");
        }
    });

    // INSTANT MESSAGE HANDLER - NO AWAIT, NO DELAYS
    sock.ev.on("messages.upsert", (m) => {
        try {
            const msg = m.messages[0];
            if (!msg?.message || msg.key.fromMe) return;
            
            // Fastest text extraction
            let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text || text[0] !== '.') return;
            
            const cmd = text.slice(1).split(' ')[0].toLowerCase();
            
            // Fire and forget - NO AWAIT
            if (cmd === 'ping') {
                sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
            }
        } catch(e) {}
    });
}

connect().catch(console.error);