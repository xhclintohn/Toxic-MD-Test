const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Boom } = require('@hapi/boom');

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive'));
app.listen(PORT);

const SESSION_DIR = path.join(__dirname, "Session");

async function start() {
    if (!fs.existsSync(SESSION_DIR)) {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const sessionData = process.env.SESSION || '';
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        const credsPath = path.join(SESSION_DIR, "creds.json");
        const decoded = Buffer.from(sessionData, 'base64').toString('utf-8');
        fs.writeFileSync(credsPath, decoded);
        console.log('Session loaded');
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        browser: Browsers.macOS("Safari"),
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('Scan this QR code with WhatsApp');
        }
        
        if (connection === 'open') {
            console.log('✅ Connected to WhatsApp');
        } else if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = code !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting...');
                setTimeout(start, 5000);
            } else {
                console.log('Logged out');
            }
        }
    });

    sock.ev.on('messages.upsert', (m) => {
        const msg = m.messages[0];
        if (!msg?.message) return;
        
        let text = '';
        if (msg.message.conversation) {
            text = msg.message.conversation;
        } else if (msg.message.extendedTextMessage) {
            text = msg.message.extendedTextMessage.text;
        } else {
            return;
        }
        
        if (!text.startsWith('.')) return;
        
        const cmd = text.slice(1).split(' ')[0].toLowerCase();
        const from = msg.key.remoteJid;
        
        if (cmd === 'ping') {
            sock.sendMessage(from, { text: '🏓 Pong!' });
        }
    });
}

start().catch(err => {
    console.error('Error:', err.message);
    setTimeout(start, 5000);
});