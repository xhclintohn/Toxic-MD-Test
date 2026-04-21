const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { makeid } = require('./id');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

const router = express.Router();
const sessionDir = path.join(__dirname, "temp");

function removeFile(path) {
    if (fs.existsSync(path)) fs.rmSync(path, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    const num = (req.query.number || '').replace(/[^0-9]/g, '');
    const tempDir = path.join(sessionDir, id);
    let responseSent = false;

    try {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);

        const sock = makeWASocket({
            version: [2, 3000, 1015901307],
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
            },
            browser: Browsers.macOS("Safari"),
            syncFullHistory: false,
            generateHighQualityLinkPreview: false,
            markOnlineOnConnect: false,
            connectTimeoutMs: 30000,
            keepAliveIntervalMs: 30000,
            emitOwnEvents: false,
        });

        sock.ev.on('creds.update', saveCreds);

        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(num);
            if (!responseSent) {
                res.json({ code: code });
                responseSent = true;
            }
        }

        const userJid = num + '@s.whatsapp.net';
        let sessionSent = false;

        sock.ev.on('connection.update', async ({ connection }) => {
            if (connection === 'open' && !sessionSent) {
                sessionSent = true;
                
                await new Promise(r => setTimeout(r, 5000));
                
                const credsPath = path.join(tempDir, "creds.json");
                let sessionData = null;
                
                for (let i = 0; i < 15; i++) {
                    if (fs.existsSync(credsPath)) {
                        const data = fs.readFileSync(credsPath);
                        if (data && data.length > 100) {
                            sessionData = data;
                            break;
                        }
                    }
                    await new Promise(r => setTimeout(r, 2000));
                }
                
                if (sessionData) {
                    const base64 = Buffer.from(sessionData).toString('base64');
                    await sock.sendMessage(userJid, { text: base64 });
                    await sock.sendMessage(userJid, { text: 'Session ID sent successfully!' });
                } else {
                    await sock.sendMessage(userJid, { text: 'Failed to generate session. Try again.' });
                }
                
                await new Promise(r => setTimeout(r, 2000));
                sock.ws.close();
                removeFile(tempDir);
            }
        });

        setTimeout(() => {
            if (!sessionSent) {
                sock.ws.close();
                removeFile(tempDir);
                if (!responseSent) {
                    res.status(500).json({ code: 'Timeout' });
                }
            }
        }, 60000);

    } catch (err) {
        console.error('Error:', err.message);
        removeFile(tempDir);
        if (!responseSent) {
            res.status(500).json({ code: err.message });
        }
    }
});

module.exports = router;