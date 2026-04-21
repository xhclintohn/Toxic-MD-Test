"use strict";

const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const express = require('express');
const { Boom } = require('@hapi/boom');

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const SESSION_DIR = path.join(__dirname, "Session");

let reconnectAttempts = 0;
let isConnecting = false;

async function connect() {
    if (isConnecting) return;
    isConnecting = true;

    try {
        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }

        const sessionData = process.env.SESSION || '';
        if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
            const credsPath = path.join(SESSION_DIR, "creds.json");
            const decoded = Buffer.from(sessionData, 'base64').toString('utf-8');
            fs.writeFileSync(credsPath, decoded);
            console.log("[Toxic-MD] Session loaded");
        }

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

        const sock = makeWASocket({
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
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            defaultQueryTimeoutMs: 5000,
            emitOwnEvents: false,
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
            if (connection === "open") {
                reconnectAttempts = 0;
                console.log("[Toxic-MD] Connected");
            } else if (connection === "close") {
                const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
                if (code !== DisconnectReason.loggedOut) {
                    reconnectAttempts++;
                    const delay = Math.min(5000 * reconnectAttempts, 30000);
                    console.log(`[Toxic-MD] Reconnecting in ${delay/1000}s`);
                    setTimeout(() => {
                        isConnecting = false;
                        connect();
                    }, delay);
                } else {
                    console.log("[Toxic-MD] Logged out");
                    if (fs.existsSync(SESSION_DIR)) {
                        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
                    }
                }
            }
        });

        sock.ev.on("messages.upsert", (m) => {
            try {
                const msg = m.messages[0];
                if (!msg?.message) return;
                
                let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                if (!text || !text.startsWith(".")) return;
                
                const cmd = text.slice(1).split(" ")[0].toLowerCase();
                const from = msg.key.remoteJid;
                
                if (cmd === "ping") {
                    sock.sendMessage(from, { text: "🏓 Pong!" });
                }
            } catch(e) {}
        });

    } catch (err) {
        console.log("[Toxic-MD] Error:", err.message);
        setTimeout(() => {
            isConnecting = false;
            connect();
        }, 5000);
    }
}

connect();