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

// ─── Session loading from env var ────────────────────────────────────
function loadSessionFromEnv() {
    const sessionDir = path.join(__dirname, 'Session');
    const credsPath = path.join(sessionDir, 'creds.json');
    
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    const sessionData = process.env.SESSION || '';
    
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        try {
            const decoded = Buffer.from(sessionData, 'base64').toString('utf8');
            fs.writeFileSync(credsPath, decoded, 'utf8');
            console.log('[Toxic-MD] Session loaded from env ✅');
            return true;
        } catch (e) {
            console.log('[Toxic-MD] Session decode failed:', e.message);
            return false;
        }
    } else {
        console.log('[Toxic-MD] No session in env — will show QR code');
        return false;
    }
}

// ─── Express keep-alive ──────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`[Toxic-MD] Web server on port ${PORT}`));

// ─── WhatsApp connection ───────────────────────────────────────────
const PREFIX = '.';

async function connect() {
    loadSessionFromEnv();

    const sessionDir = path.join(__dirname, 'Session');
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const client = makeWASocket({
        logger: pino({ level: 'silent' }), // Silent to reduce logs
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 10000,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('[Toxic-MD] QR Code received');
        }
        
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reconnect = code !== DisconnectReason.loggedOut;
            console.log('[Toxic-MD] Disconnected, code:', code, '| reconnect:', reconnect);
            if (reconnect) setTimeout(connect, 5000);
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅');
        }
    });

    // ─── Message handler - responds to self and others ───────────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const { messages, type } = messageData;
            
            // Only process notify messages
            if (type !== 'notify') return;
            
            const msg = messages[0];
            if (!msg || !msg.message) return;
            
            // Get the chat ID
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Extract text message (ignore other message types)
            let body = '';
            
            if (msg.message.conversation) {
                body = msg.message.conversation;
            } else if (msg.message.extendedTextMessage?.text) {
                body = msg.message.extendedTextMessage.text;
            } else {
                // Ignore images, videos, documents, etc.
                return;
            }
            
            // Check for prefix
            if (!body.startsWith(PREFIX)) return;
            
            // Extract command
            const command = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            
            // Handle ping command (responds even to self)
            if (command === 'ping') {
                await client.sendMessage(from, { text: '🏓 Pong!' });
            }
            
        } catch (error) {
            console.error('[Toxic-MD] Error:', error.message);
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});