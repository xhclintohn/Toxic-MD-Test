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

// ─── Pre-load commands into memory for INSTANT access ─────────────
const COMMANDS = {
    '.ping': '🏓 Pong!',
    '.hi': '👋 Hello!',
    '.hello': '👋 Hi there!',
    '.time': () => new Date().toLocaleTimeString(),
    '.date': () => new Date().toLocaleDateString(),
};

const PREFIX = '.';

async function connect() {
    const sessionDir = path.join(__dirname, 'Session');
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    // Load session from env
    const sessionData = process.env.SESSION || '';
    if (sessionData && sessionData !== 'zokk') {
        try {
            fs.writeFileSync(
                path.join(sessionDir, 'creds.json'),
                Buffer.from(sessionData, 'base64').toString('utf8')
            );
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
        markOnlineOnConnect: false,
        defaultQueryTimeoutMs: 5000,
        keepAliveIntervalMs: 30000,
        // CRITICAL OPTIMIZATIONS
        transactionOpts: { maxRetries: 0 },
        emitOwnEvents: false,
        fireInitQueries: false,
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) setTimeout(connect, 5000);
        } else if (connection === 'open') {
            console.log('[Toxic-MD] ✅ Connected');
        }
    });

    // ─── OPTIMIZED: Direct string matching, no async in event loop ───
    client.ev.on('messages.upsert', (msgData) => {
        const msg = msgData.messages[0];
        if (!msg?.message) return;
        
        // Extract text using fastest method
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text || text[0] !== PREFIX) return;
        
        // Direct command lookup
        const response = COMMANDS[text];
        if (response) {
            const reply = typeof response === 'function' ? response() : response;
            client.sendMessage(msg.key.remoteJid, { text: reply });
        }
    });
}

connect().catch(console.error);