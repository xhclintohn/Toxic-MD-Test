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

// Keep alive ping
setInterval(() => {
    fetch(`http://localhost:${PORT}`).catch(() => {});
}, 25000);

const PREFIX = '.';

async function connect() {
    // Session setup
    const sessionDir = path.join(__dirname, 'Session');
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const sessionData = process.env.SESSION || '';
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        try {
            fs.writeFileSync(
                path.join(sessionDir, 'creds.json'),
                Buffer.from(sessionData, 'base64').toString('utf8')
            );
            console.log('[Toxic-MD] Session loaded');
        } catch(e) {}
    }

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
        defaultQueryTimeoutMs: 3000,
        keepAliveIntervalMs: 20000,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('[Toxic-MD] Scan QR with WhatsApp');
            console.log(qr);
        }
        
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) {
                console.log('[Toxic-MD] Reconnecting...');
                setTimeout(connect, 3000);
            } else {
                console.log('[Toxic-MD] Logged out');
            }
        } else if (connection === 'open') {
            console.log('[Toxic-MD] ✅ Connected and ready!');
        }
    });

    // SIMPLE WORKING MESSAGE HANDLER
    client.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg || !msg.message) return;
            
            // Get the chat ID
            const chatId = msg.key.remoteJid;
            if (!chatId) return;
            
            // Get message text
            let text = '';
            if (msg.message.conversation) {
                text = msg.message.conversation;
            } else if (msg.message.extendedTextMessage) {
                text = msg.message.extendedTextMessage.text;
            }
            
            if (!text) return;
            
            // Check command
            if (text === '.ping') {
                await client.sendMessage(chatId, { text: '🏓 Pong!' });
                console.log('[Toxic-MD] Pong sent to', chatId);
            }
        } catch (err) {
            // Silent
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Error:', err.message);
    setTimeout(connect, 5000);
});