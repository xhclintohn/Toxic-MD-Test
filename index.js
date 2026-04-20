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

    // ─── FIXED Message handler with proper text extraction ───────────────────
    client.ev.on('messages.upsert', async (messageData) => {
        try {
            const { messages, type } = messageData;
            
            if (type !== 'notify') return;
            
            const msg = messages[0];
            if (!msg || !msg.key) return;
            
            // Don't respond to own messages
            if (msg.key.fromMe) return;
            
            const from = msg.key.remoteJid;
            if (!from) return;
            
            // PROPER text extraction - Baileys stores message in different places
            let body = '';
            
            // Try all possible message types
            if (msg.message) {
                // Direct conversation
                if (msg.message.conversation) {
                    body = msg.message.conversation;
                }
                // Extended text message
                else if (msg.message.extendedTextMessage) {
                    body = msg.message.extendedTextMessage.text || '';
                }
                // For image/video with caption
                else if (msg.message.imageMessage) {
                    body = msg.message.imageMessage.caption || '';
                }
                else if (msg.message.videoMessage) {
                    body = msg.message.videoMessage.caption || '';
                }
                // For protocol messages (sometimes contains text)
                else if (msg.message.protocolMessage) {
                    return; // Skip protocol messages
                }
            }
            
            console.log('[Toxic-MD] Raw body:', body);
            
            if (!body || !body.startsWith(PREFIX)) return;
            
            const command = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            console.log('[Toxic-MD] Command detected:', command);
            
            if (command === 'ping') {
                console.log('[Toxic-MD] Responding to ping from:', from);
                await client.sendMessage(from, { text: '🏓 Pong!' });
                console.log('[Toxic-MD] Response sent');
            }
        } catch (error) {
            console.error('[Toxic-MD] Error in message handler:', error);
        }
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    process.exit(1);
});