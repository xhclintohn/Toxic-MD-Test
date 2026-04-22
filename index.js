const fs = require('fs');
const path = require('path');
const express = require('express');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');

const SESSION_DIR = path.join(__dirname, 'session');

const PREFIX = process.env.PREFIX || '.';
const BOT_NAME = process.env.BOT_NAME || 'Toxic-MD';
const PORT = parseInt(process.env.PORT || '3000', 10);

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
    const cmd = require(`./commands/${file}`);
    if (cmd.name && typeof cmd.execute === 'function') {
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
      console.log('🤖 Bot number:', sock.user.id);
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

loadCommands();
startKeepAliveServer();
startBot();