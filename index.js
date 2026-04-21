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
const NUMBER = '254781592593';

async function start() {
    console.log('Starting bot...');
    
    if (fs.existsSync(SESSION_DIR)) {
        const credsPath = path.join(SESSION_DIR, "creds.json");
        if (fs.existsSync(credsPath)) {
            console.log('Session folder exists, attempting to connect...');
        }
    } else {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        browser: Browsers.macOS("Safari"),
        markOnlineOnConnect: true,
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        emitOwnEvents: false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
            console.log('✅ Connected successfully!');
            console.log(`Bot is ready! Send .ping to test`);
        } else if (connection === 'close') {
            console.log('Connection closed');
            setTimeout(start, 5000);
        }
    });

    // Check if not registered and send pairing code
    if (!sock.authState.creds.registered) {
        console.log('Not registered, sending pairing code in 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
        
        try {
            const code = await sock.requestPairingCode(NUMBER);
            console.log(`\n\n🔐 YOUR PAIRING CODE: ${code}\n`);
            console.log(`Enter this code in WhatsApp → Linked Devices → Link with phone number\n`);
        } catch (err) {
            console.error('Failed to send pairing code:', err.message);
        }
    }

    // Message handler
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
            console.log('Pong sent to', from);
        }
    });
}

start().catch(err => {
    console.error('Error:', err.message);
    setTimeout(start, 5000);
});