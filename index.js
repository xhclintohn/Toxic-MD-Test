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
        logger: pino({ level: 'silent' }),
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
            console.log('[Toxic-MD] QR Code received, scan to login');
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

    // ─── FIXED Message handler ───────────────────────────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const { messages, type } = messageData;
            
            // Log to debug
            console.log('[Toxic-MD] Message received, type:', type);
            
            if (type !== 'notify' && type !== 'append') return;
            
            const msg = messages[0];
            if (!msg || !msg.message || !msg.key) return;
            
            // Don't respond to own messages
            if (msg.key.fromMe) return;
            
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Extract text properly
            let body = '';
            if (msg.message.conversation) {
                body = msg.message.conversation;
            } else if (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) {
                body = msg.message.extendedTextMessage.text;
            } else if (msg.message.imageMessage && msg.message.imageMessage.caption) {
                body = msg.message.imageMessage.caption;
            } else if (msg.message.videoMessage && msg.message.videoMessage.caption) {
                body = msg.message.videoMessage.caption;
            }
            
            console.log('[Toxic-MD] Message body:', body);
            
            if (!body || !body.startsWith(PREFIX)) return;
            
            const cmd = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            console.log('[Toxic-MD] Command:', cmd);
            
            if (cmd === 'ping') {
                console.log('[Toxic-MD] Sending pong to:', from);
                await client.sendMessage(from, {
                    text: '🏓 Pong!'
                });
                console.log('[Toxic-MD] Pong sent');
            }
        } catch (error) {
            console.error('[Toxic-MD] Message handler error:', error);
        }
    });
    
    // Add additional event listener for debugging
    client.ev.on('messaging-history.set', (data) => {
        console.log('[Toxic-MD] History sync received');
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});