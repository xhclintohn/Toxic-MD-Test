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

let pairingCodeSent = false;

async function start() {
    console.log('Starting bot...');
    
    if (!fs.existsSync(SESSION_DIR)) {
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
        connectTimeoutMs: 120000,
        keepAliveIntervalMs: 30000,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
            console.log('✅ Connected successfully!');
            
            // Save session to env format
            const credsPath = path.join(SESSION_DIR, "creds.json");
            if (fs.existsSync(credsPath)) {
                const data = fs.readFileSync(credsPath);
                const base64 = Buffer.from(data).toString('base64');
                console.log('\n\n========= COPY THIS TO SESSION ENV VAR =========\n');
                console.log(base64);
                console.log('\n================================================\n');
            }
        } else if (connection === 'close') {
            console.log('Connection closed, reconnecting in 5s...');
            setTimeout(start, 5000);
        }
    });

    // Send pairing code if not registered
    if (!sock.authState.creds.registered && !pairingCodeSent) {
        pairingCodeSent = true;
        console.log('Requesting pairing code...');
        
        await new Promise(r => setTimeout(r, 3000));
        
        try {
            const code = await sock.requestPairingCode(NUMBER);
            console.log(`\n\n🔐 PAIRING CODE: ${code}\n`);
            console.log(`Open WhatsApp → Settings → Linked Devices → Link with phone number\n`);
            console.log(`Enter code: ${code}\n`);
        } catch (err) {
            console.error('Pairing error:', err.message);
            pairingCodeSent = false;
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
            console.log('Pong sent');
        }
    });
}

start().catch(err => {
    console.error('Error:', err.message);
    setTimeout(start, 5000);
});