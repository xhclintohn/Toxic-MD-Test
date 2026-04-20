import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@whiskeysockets/baileys';
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    makeCacheableSignalKeyStore, 
    Browsers 
} = pkg;
import pino from 'pino';
import { Boom } from '@hapi/boom';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadSession() {
    const sessionDir = path.join(__dirname, 'Session');
    const credsPath = path.join(sessionDir, 'creds.json');
    const sessionFile = path.join(__dirname, 'session.json');
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    let sessionData = process.env.SESSION || '';
    if (!sessionData || sessionData === 'zokk') {
        if (fs.existsSync(sessionFile)) {
            try {
                const raw = fs.readFileSync(sessionFile, 'utf8').trim();
                try {
                    const parsed = JSON.parse(raw);
                    sessionData = parsed.SESSION_ID || parsed.session || parsed.SESSION || '';
                } catch { sessionData = raw; }
            } catch {}
        }
    }
    if (sessionData && sessionData !== 'zokk' && sessionData !== 'PASTE_YOUR_SESSION_ID_HERE') {
        try {
            const decoded = Buffer.from(sessionData, 'base64').toString('utf8');
            fs.writeFileSync(credsPath, decoded, 'utf8');
            console.log('[Toxic-MD] Session loaded ✅');
        } catch (e) {
            console.log('[Toxic-MD] Session decode failed:', e.message);
        }
    }
}

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Toxic-MD is alive 🤙'));
app.listen(PORT, () => console.log(`[Toxic-MD] Web server on port ${PORT}`));

const PREFIX = '.';

async function connect() {
    loadSession();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'Session'));

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
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) connect();
        } else if (connection === 'open') {
            console.log('[Toxic-MD] Connected ✅');
        }
    });

    client.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg?.message) return;

        const from = msg.key.remoteJid;
        if (from === 'status@broadcast') return;

        const messageContent = 
            msg.message?.conversation || 
            msg.message?.extendedTextMessage?.text || 
            msg.message?.imageMessage?.caption || 
            msg.message?.videoMessage?.caption || 
            '';

        console.log(`[Message] From: ${from} | Content: ${messageContent}`);

        if (msg.key.fromMe) return;

        if (messageContent.startsWith(PREFIX)) {
            await client.readMessages([msg.key]);
            const args = messageContent.slice(PREFIX.length).trim().split(/\s+/);
            const cmd = args[0].toLowerCase();

            if (cmd === 'ping') {
                const t = Date.now();
                await client.sendPresenceUpdate('composing', from);
                await client.sendMessage(from, {
                    text: `🏓 *Pong!*\n⚡ Speed: ${Date.now() - t}ms`
                }, { quoted: msg });
            }
        }
    });
}

connect().catch(() => process.exit(1));
