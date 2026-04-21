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
const phoneNumber = '254781592593';
let pairingStarted = false;

async function start() {
    if (!fs.existsSync(SESSION_DIR)) {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const naze = makeWASocket({
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
        connectTimeoutMs: 120000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: false,
    });

    naze.ev.on('creds.update', saveCreds);

    naze.ev.on('connection.update', async (update) => {
        const { qr, connection, lastDisconnect } = update;

        if (connection === 'connecting' && !naze.authState.creds.registered && !pairingStarted) {
            setTimeout(async () => {
                pairingStarted = true;
                console.log('Requesting Pairing Code...');
                try {
                    let code = await naze.requestPairingCode(phoneNumber);
                    console.log('\n\n🔐 YOUR PAIRING CODE:', code);
                    console.log('Enter this code in WhatsApp → Linked Devices → Link with phone number\n\n');
                } catch (err) {
                    console.error('Pairing error:', err.message);
                }
            }, 3000);
        }

        if (connection === 'open') {
            console.log('✅ Connected successfully!');
            const credsPath = path.join(SESSION_DIR, "creds.json");
            if (fs.existsSync(credsPath)) {
                const data = fs.readFileSync(credsPath);
                const base64 = Buffer.from(data).toString('base64');
                console.log('\n\n========= SESSION BASE64 (COPY THIS) =========\n');
                console.log(base64);
                console.log('\n==============================================\n');
            }
        }

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log('Connection closed, code:', reason);
            
            if (reason === DisconnectReason.loggedOut) {
                console.log('Logged out, deleting session...');
                if (fs.existsSync(SESSION_DIR)) {
                    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
                }
                process.exit(0);
            } else if (reason !== DisconnectReason.connectionClosed) {
                console.log('Reconnecting in 5 seconds...');
                setTimeout(start, 5000);
            }
        }
    });

    naze.ev.on('messages.upsert', (m) => {
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
            naze.sendMessage(from, { text: '🏓 Pong!' });
        }
    });
}

start().catch(err => {
    console.error('Error:', err.message);
    setTimeout(start, 5000);
});