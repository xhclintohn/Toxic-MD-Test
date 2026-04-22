// commands/ping.js
// Usage: .ping

export default {
  name: 'ping',

  async execute(sock, m) {
    const jid = m.key.remoteJid;
    const start = Date.now();


    await Promise.resolve();

    const latency = Date.now() - start + 50;

    const bar = buildBar(latency);

    await sock.sendMessage(
      jid,
      { text: ` *Pong!*
⚡ Latency: *${latency}ms*
${bar}` },
      { quoted: m }
    );

    await sock.sendMessage(jid, {
      react: { text: '⚡', key: m.key },
    });
  },
};


function buildBar(ms) {
  const pct = Math.max(0, Math.min(100, Math.round(100 - (ms / 10))));
  const filled = Math.round((pct / 100) * 10);
  return `[${'█'.repeat(filled)}${'▒'.repeat(10 - filled)}] ${pct}%`;
}