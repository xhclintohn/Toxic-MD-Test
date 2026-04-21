const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive'));
app.listen(PORT);

const SESSION_DIR = path.join(__dirname, "Session");

async function start() {
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

    const sessionData = process.env.SESSION || '';
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        const credsPath = path.join(SESSION_DIR, "creds.json");
        fs.writeFileSync(credsPath, Buffer.from(sessionData, 'base64').toString('utf-8'));
        console.log('Session loaded');
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        browser: Browsers.macOS("Safari"),
        markOnlineOnConnect: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        emitOwnEvents: false,
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') console.log('Connected!');
    });

    sock.ev.on('messages.upsert', (m) => {
        const msg = m.messages[0];
        if (!msg?.message) return;
        
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text || text[0] !== '.') return;
        
        const cmd = text.slice(1).split(' ')[0].toLowerCase();
        const from = msg.key.remoteJid;
        
        if (cmd === 'ping') {
            sock.sendMessage(from, { text: '🏓 Pong!' });
        }
    });
}

start().catch(console.error);