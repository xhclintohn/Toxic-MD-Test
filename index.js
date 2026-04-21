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
            console.log('[Toxic-MD] Session decode failed');
        }
    }
}

// ─── Express ──────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`[Toxic-MD] Web server on port ${PORT}`));

// ─── Bot Configuration ────────────────────────────────────────────
const PREFIX = '.';
const COMMANDS = new Map([['ping', '🏓 Pong!']]); // Pre-defined commands

async function connect() {
    loadSessionFromEnv();

    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'Session'));

    const client = makeWASocket({
        logger: pino({ level: 'fatal' }), // Almost no logging
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        syncFullHistory: false,
        markOnlineOnConnect: false, // Don't broadcast online status
        defaultQueryTimeoutMs: 5000, // Shorter timeout
        keepAliveIntervalMs: 30000, // Less frequent pings
        patchMessageBeforeSending: (msg) => msg,
        emitOwnEvents: false,
        // Optimize for speed
        transactionOpts: { maxRetries: 0 },
        qrTimeout: 20000,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) setTimeout(connect, 5000);
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅');
        }
    });

    // ─── FASTEST MESSAGE HANDLER - No async/await, No overhead ─────
    let lastMsgTime = 0;
    const COOLDOWN = 100; // 100ms cooldown to prevent spam
    
    client.ev.on('messages.upsert', (messageData) => {
        // Anti-spam
        const now = Date.now();
        if (now - lastMsgTime < COOLDOWN) return;
        lastMsgTime = now;
        
        try {
            const msg = messageData.messages?.[0];
            if (!msg?.message || msg.key.fromMe) return;
            
            // Direct access - no function calls
            const body = msg.message.conversation || 
                        msg.message.extendedTextMessage?.text;
            
            if (!body || body[0] !== PREFIX) return;
            
            // Fast command extraction
            const spaceIdx = body.indexOf(' ');
            const cmd = (spaceIdx === -1 ? body.slice(1) : body.slice(1, spaceIdx)).toLowerCase();
            
            // Command lookup
            const response = COMMANDS.get(cmd);
            if (response) {
                // Fire and forget - don't wait
                client.sendMessage(msg.key.remoteJid, { text: response })
                    .catch(() => {});
            }
        } catch(e) {}
    });
}

connect().catch(() => setTimeout(connect, 5000));