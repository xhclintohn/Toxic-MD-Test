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
            console.log('[Toxic-MD] QR Code received - scan with WhatsApp');
        }
        
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const reconnect = code !== DisconnectReason.loggedOut;
            console.log('[Toxic-MD] Disconnected, code:', code, '| reconnect:', reconnect);
            if (reconnect) setTimeout(connect, 5000);
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅ Bot is ready!');
        }
    });

    // ─── WORKING Message handler with debug ───────────────────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const { messages, type } = messageData;
            
            // Log every message for debugging
            console.log('[DEBUG] Message received, type:', type);
            
            if (type !== 'notify') return;
            
            const msg = messages[0];
            if (!msg || !msg.message) {
                console.log('[DEBUG] No message content');
                return;
            }
            
            const from = msg.key.remoteJid;
            console.log('[DEBUG] From:', from);
            console.log('[DEBUG] FromMe:', msg.key.fromMe);
            
            // Don't respond to own messages
            if (msg.key.fromMe) {
                console.log('[DEBUG] Skipping own message');
                return;
            }
            
            // Extract text
            let body = '';
            if (msg.message.conversation) {
                body = msg.message.conversation;
            } else if (msg.message.extendedTextMessage) {
                body = msg.message.extendedTextMessage.text || '';
            } else {
                console.log('[DEBUG] Not a text message');
                return;
            }
            
            console.log('[DEBUG] Message body:', body);
            
            if (!body.startsWith(PREFIX)) {
                console.log('[DEBUG] No prefix match');
                return;
            }
            
            const cmd = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            console.log('[DEBUG] Command:', cmd);
            
            if (cmd === 'ping') {
                console.log('[DEBUG] Sending pong response');
                await client.sendMessage(from, { text: '🏓 Pong!' });
                console.log('[DEBUG] Pong sent successfully');
            }
            
        } catch (error) {
            console.error('[DEBUG] Error in message handler:', error.message);
            console.error(error.stack);
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});