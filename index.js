import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import pino from 'pino';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.join(__dirname, 'session');

const PREFIX = process.env.PREFIX || '.';
const BOT_NAME = process.env.BOT_NAME || 'Toxic-MD';
const PORT = parseInt(process.env.PORT || '3000', 10);

const _noisyTokens = [
  'closing session','sessionentry','registrationid','currentratchet',
  'indexinfo','pendingprekey','ephemeralkeypair','lastremoteephemeralkey',
  'rootkey','basekey','signalkey','signalprotocol','_chains','chains',
  'chainkey','ratchet','cipher','decrypt','encrypt','prekey','signedkey',
  'identitykey','sessionstate','keystore','senderkey','groupcipher',
  'signalgroup','signalstore','signalrepository','signalprotocolstore',
  'sessioncipher','sessionbuilder','senderkeystore','senderkeydistribution',
  'keyexchange','<buffer','05 ','0x','pubkey','privkey',
  'connection.update','creds.update','presence.update','chat.update',
  'message.receipt.update','message.update',
  'failed to decrypt','received error','sessionerror','bad mac',
  'stream errored',
  '[asm-debug]',
  'interactive send:','native_flow','tag: \'biz\'',
  'app state resync','syncing critical app state',
  '[dotenv'
];

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleInfo = console.info;

function shouldFilter(message) {
  if (!message) return false;
  const msgStr = String(message);
  return _noisyTokens.some(token => msgStr.includes(token));
}

console.log = function(...args) {
  if (!shouldFilter(args[0])) {
    originalConsoleLog.apply(console, args);
  }
};

console.warn = function(...args) {
  if (!shouldFilter(args[0])) {
    originalConsoleWarn.apply(console, args);
  }
};

console.error = function(...args) {
  if (!shouldFilter(args[0])) {
    originalConsoleError.apply(console, args);
  }
};

console.info = function(...args) {
  if (!shouldFilter(args[0])) {
    originalConsoleInfo.apply(console, args);
  }
};

const log = {
  info: (...a) => console.log('[INFO]', ...a),
  success: (...a) => console.log('[OK]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERR]', ...a),
};

const baileysLogger = pino({ level: 'fatal' }).child({ level: 'fatal' });
const baileysKeyLog = pino().child({ level: 'silent', stream: 'store' });

function parseSessionId(raw) {
  const s = raw.trim();
  const decoded = Buffer.from(s, 'base64').toString('utf8');
  return JSON.parse(decoded);
}

function hydrateSession(sessionId) {
  const creds = parseSessionId(sessionId);
  if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
  fs.writeFileSync(path.join(SESSION_DIR, 'creds.json'), JSON.stringify(creds, null, 2));
  log.success('Session written to', SESSION_DIR);
}

const commands = new Map();

async function loadCommands() {
  const dir = path.join(__dirname, 'commands');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info('Created commands directory');
    return;
  }
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const mod = await import(`./commands/${file}`);
    const cmd = mod.default;
    if (cmd?.name && typeof cmd.execute === 'function') {
      commands.set(cmd.name.toLowerCase(), cmd);
      log.info(`Command loaded: ${PREFIX}${cmd.name}`);
    }
  }
}

function startKeepAliveServer() {
  const app = express();

  app.get('/', (_req, res) => res.send(`${BOT_NAME} is running ✅`));
  app.get('/health', (_req, res) => res.json({ status: 'ok', bot: BOT_NAME, ts: Date.now() }));

  app.listen(PORT, () => log.info(`Keep-alive server listening on port ${PORT}`));
}

async function startBot() {
  const sessionId = process.env.SESSION_ID;
  if (!sessionId || !sessionId.trim()) {
    log.error('SESSION_ID env var is required. Exiting.');
    process.exit(1);
  }

  try {
    hydrateSession(sessionId);
  } catch (err) {
    log.error('Failed to decode SESSION_ID (must be raw base64):', err.message);
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const versionRes = await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json');
  const { version } = await versionRes.json();

  log.info(`Connecting — Baileys v${version.join('.')} …`);

  const sock = makeWASocket({
    version,
    logger: baileysLogger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, baileysKeyLog),
    },
    browser: Browsers.macOS('Chrome'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
    getMessage: async () => undefined,
    markOnlineOnConnect: true,
    connectTimeoutMs: 120000,
    keepAliveIntervalMs: 30000,
    emitOwnEvents: true,
    fireInitQueries: true,
    defaultQueryTimeoutMs: 60000,
    transactionOpts: {
      maxCommitRetries: 10,
      delayBetweenTriesMs: 3000,
    },
    retryRequestDelayMs: 10000,
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      log.success(`${BOT_NAME} connected ✅`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const reason = DisconnectReason[code] ?? code;
      const loggedOut = code === DisconnectReason.loggedOut;

      log.warn(`Disconnected — reason: ${reason}`);

      if (loggedOut) {
        log.error('Session logged out. Update SESSION_ID and restart.');
        process.exit(1);
      }

      log.info('Reconnecting in 5s …');
      setTimeout(startBot, 5000);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const m of messages) {
      if (!m.message) continue;

      const body = extractText(m);
      if (!body.startsWith(PREFIX)) continue;

      const [rawCmd, ...args] = body.slice(PREFIX.length).trim().split(/\s+/);
      const cmdName = rawCmd.toLowerCase();

      const cmd = commands.get(cmdName);
      if (!cmd) continue;

      try {
        await cmd.execute(sock, m, args, PREFIX, BOT_NAME);
      } catch (err) {
        log.error(`Error in command "${cmdName}":`, err.message);
      }
    }
  });
}

function extractText(m) {
  return (
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  );
}

await loadCommands();
startKeepAliveServer();
await startBot();