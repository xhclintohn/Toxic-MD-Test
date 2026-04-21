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
        // Don't try to decrypt own messages
        shouldSyncHistoryMessage: () => false,
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

    // ─── Message handler ──────────────────────────────────────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const { messages, type } = messageData;
            if (type !== 'notify') return;
            
            const msg = messages[0];
            if (!msg?.message) return;
            
            // Skip if no remoteJid
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // Extract text
            let body = '';
            if (msg.message.conversation) {
                body = msg.message.conversation;
            } else if (msg.message.extendedTextMessage?.text) {
                body = msg.message.extendedTextMessage.text;
            } else {
                return;
            }
            
            // Check prefix
            if (!body.startsWith(PREFIX)) return;
            
            const cmd = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            
            if (cmd === 'ping') {
                // Send response without quoting to avoid decryption issues
                await client.sendMessage(from, { text: '🏓 Pong!' });
            }
        } catch (error) {
            // Silent fail
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    setTimeout(connect, 5000);
});