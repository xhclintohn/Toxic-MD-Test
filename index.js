'use strict';

const fs = require('fs');
const path = require('path');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const express = require('express');

// ─── Express ──────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`[Toxic-MD] Web server on port ${PORT}`));

// ─── Session loading ──────────────────────────────────────────────
function loadSessionFromEnv() {
    const sessionDir = path.join(__dirname, 'Session');
    const credsPath = path.join(sessionDir, 'creds.json');
    
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const sessionData = process.env.SESSION || '';
    
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        try {
            fs.writeFileSync(credsPath, Buffer.from(sessionData, 'base64').toString('utf8'), 'utf8');
            console.log('[Toxic-MD] Session loaded ✅');
        } catch (e) {
            console.log('[Toxic-MD] Session decode failed:', e.message);
        }
    } else {
        console.log('[Toxic-MD] No session in env — will show QR code');
    }
}

const PREFIX = '.';

async function connect() {
    loadSessionFromEnv();

    const sessionDir = path.join(__dirname, 'Session');
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const client = makeWASocket({
        logger: pino({ level: 'error' }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'error' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 10000,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reconnect = code !== DisconnectReason.loggedOut;
            console.log('[Toxic-MD] Disconnected, code:', code, '| reconnect:', reconnect);
            if (reconnect) setTimeout(connect, 5000);
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅');
        }
    });

    // ─── FAST MESSAGE HANDLER - Responds to ALL messages ───────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const msg = messageData.messages[0];
            if (!msg) return;
            
            // Get the message content correctly
            let body = '';
            let messageType = Object.keys(msg.message || {})[0];
            
            if (messageType === 'conversation') {
                body = msg.message.conversation;
            } else if (messageType === 'extendedTextMessage') {
                body = msg.message.extendedTextMessage.text;
            } else if (messageType === 'imageMessage') {
                body = msg.message.imageMessage.caption || '';
            } else if (messageType === 'videoMessage') {
                body = msg.message.videoMessage.caption || '';
            }
            
            if (!body) return;
            
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Check prefix
            if (!body.startsWith(PREFIX)) return;
            
            const cmd = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            
            // Commands - responds instantly
            if (cmd === 'ping') {
                await client.sendMessage(from, { text: '🏓 Pong!' });
            }
            
        } catch (error) {
            // Silent fail for speed
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});