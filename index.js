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
        logger: pino({ level: 'debug' }), // Changed to debug to see events
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'debug' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 10000,
    });

    client.ev.on('creds.update', saveCreds);

    // Debug all events
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
            // Send a test message to yourself to verify
            console.log('[Toxic-MD] Bot is ready and listening for messages');
        }
    });

    // Listen to ALL events to debug
    client.ev.on('messages.receipt', (update) => {
        console.log('[Toxic-MD] Receipt event:', JSON.stringify(update).slice(0, 100));
    });

    client.ev.on('messages.update', (update) => {
        console.log('[Toxic-MD] Messages update:', JSON.stringify(update).slice(0, 100));
    });

    // Main message handler
    client.ev.on('messages.upsert', async (messageData) => {
        console.log('[Toxic-MD] ===== MESSAGE RECEIVED EVENT =====');
        console.log('[Toxic-MD] Full event data:', JSON.stringify(messageData, null, 2).slice(0, 500));
        
        try {
            const { messages, type } = messageData;
            console.log('[Toxic-MD] Type:', type);
            
            if (!messages || messages.length === 0) {
                console.log('[Toxic-MD] No messages in array');
                return;
            }
            
            const msg = messages[0];
            console.log('[Toxic-MD] Message key:', JSON.stringify(msg.key));
            
            if (msg.key.fromMe) {
                console.log('[Toxic-MD] Message from self, ignoring');
                return;
            }
            
            const from = msg.key.remoteJid;
            console.log('[Toxic-MD] From:', from);
            
            // Extract text - log the entire message structure
            console.log('[Toxic-MD] Full message:', JSON.stringify(msg.message, null, 2).slice(0, 500));
            
            let body = '';
            
            if (msg.message) {
                if (msg.message.conversation) {
                    body = msg.message.conversation;
                    console.log('[Toxic-MD] Found conversation text:', body);
                } else if (msg.message.extendedTextMessage) {
                    body = msg.message.extendedTextMessage.text || '';
                    console.log('[Toxic-MD] Found extended text:', body);
                } else {
                    console.log('[Toxic-MD] Unknown message type:', Object.keys(msg.message));
                }
            }
            
            if (!body) {
                console.log('[Toxic-MD] No text body found');
                return;
            }
            
            if (!body.startsWith(PREFIX)) {
                console.log('[Toxic-MD] No prefix match:', body);
                return;
            }
            
            const command = body.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
            console.log('[Toxic-MD] Command:', command);
            
            if (command === 'ping') {
                console.log('[Toxic-MD] Sending pong response');
                await client.sendMessage(from, { text: '🏓 Pong!' });
                console.log('[Toxic-MD] Response sent successfully');
            }
        } catch (error) {
            console.error('[Toxic-MD] Error in message handler:', error);
            console.error(error.stack);
        }
    });
    
    // Also try to listen for raw events
    client.ev.on('chats.upsert', (chats) => {
        console.log('[Toxic-MD] Chats upsert event');
    });
    
    client.ev.on('contacts.upsert', (contacts) => {
        console.log('[Toxic-MD] Contacts upsert event');
    });
}

connect().catch(err => {
    console.error('[Toxic-MD] Fatal error:', err);
    console.error(err.stack);
    process.exit(1);
});