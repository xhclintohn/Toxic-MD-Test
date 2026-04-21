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
            console.log('[Toxic-MD] Session loaded ✅');
            return true;
        } catch (e) {
            console.log('[Toxic-MD] Session decode failed:', e.message);
            return false;
        }
    } else {
        console.log('[Toxic-MD] No session — will show QR');
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
        logger: pino({ level: 'error' }), // Only errors
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'error' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: false, // Don't broadcast online status
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 30000, // Less frequent keep-alive
        patchMessageBeforeSending: (msg) => msg,
        // Critical: Don't emit receipts or read status
        emitOwnEvents: false,
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

    // ─── FASTEST possible message handler ──────────────────────────────
    // Use 'messages.reaction' event? No. Use the raw message event without await
    
    client.ev.on('messages.upsert', (messageData) => {
        // NO async/await overhead in the event listener
        try {
            const { messages, type } = messageData;
            if (type !== 'notify') return;
            
            const msg = messages[0];
            if (!msg?.message) return;
            
            // Fastest text extraction - single line
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
            if (!body || body[0] !== PREFIX) return;
            
            const cmd = body.slice(1).trim().split(/\s+/)[0].toLowerCase();
            
            if (cmd === 'ping') {
                // Fire and forget - don't wait for promise
                client.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' }).catch(() => {});
            }
        } catch (e) {
            // Silent fail - don't log errors
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});