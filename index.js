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

const PREFIX = '.';
const SESSION_DIR = path.join(__dirname, 'Session');

// ─── Session management with auto-clean on error ──────────────────
function loadSessionFromEnv() {
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

    const sessionData = process.env.SESSION || '';
    
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        try {
            const credsPath = path.join(SESSION_DIR, 'creds.json');
            fs.writeFileSync(credsPath, Buffer.from(sessionData, 'base64').toString('utf8'), 'utf8');
            console.log('[Toxic-MD] Session loaded ✅');
            return true;
        } catch (e) {
            console.log('[Toxic-MD] Session decode failed');
            return false;
        }
    }
    return false;
}

async function connect() {
    loadSessionFromEnv();

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

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
        // Ignore decryption errors
        ignoreUnknownUnuploadedPrekeys: true,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code === DisconnectReason.loggedOut) {
                console.log('[Toxic-MD] Session expired! Clearing session...');
                // Delete corrupted session
                if (fs.existsSync(SESSION_DIR)) {
                    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
                }
                console.log('[Toxic-MD] Please restart and scan new QR code');
                process.exit(1);
            } else {
                console.log('[Toxic-MD] Reconnecting...');
                setTimeout(connect, 5000);
            }
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅');
        }
    });

    // ─── INSTANT RESPONSE - No async, no await, no decryption checks ───
    client.ev.on('messages.upsert', (messageData) => {
        try {
            const msg = messageData.messages[0];
            if (!msg || !msg.message) return;
            
            // Extract text instantly
            let text = '';
            const msgContent = msg.message;
            
            if (msgContent.conversation) {
                text = msgContent.conversation;
            } else if (msgContent.extendedTextMessage?.text) {
                text = msgContent.extendedTextMessage.text;
            } else {
                return;
            }
            
            if (!text.startsWith(PREFIX)) return;
            
            const cmd = text.slice(1).split(' ')[0].toLowerCase();
            
            // Fire and forget - NO AWAIT
            if (cmd === 'ping') {
                client.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
            }
        } catch(e) {}
    });
}

// Clear corrupted session on startup if needed
if (process.env.CLEAR_SESSION === 'true') {
    console.log('[Toxic-MD] Clearing session as requested...');
    if (fs.existsSync(SESSION_DIR)) {
        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
    }
}

connect().catch(err => {
    console.error('[Toxic-MD] Error:', err.message);
    setTimeout(connect, 5000);
});