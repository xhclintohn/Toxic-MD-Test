import { inspect } from 'util';

export default {
  name: 'eval',

  async execute(sock, m, args, PREFIX, BOT_NAME) {
    const jid = m.key.remoteJid;

    // Loading reaction
    await sock.sendMessage(jid, { react: { text: '⌛', key: m.key } });

    try {
      // Reconstruct the full code string from the original message (handles spaces in code better than args)
      const body = (
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        ''
      ).trim();

      const prefixCmd = `${PREFIX}eval`;
      let code = body.startsWith(prefixCmd)
        ? body.slice(prefixCmd.length).trim()
        : args.join(' ').trim();

      const trimmedText = code;

      if (!trimmedText) {
        await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
        return await sock.sendMessage(
          jid,
          { text: `╭───(    TOXIC-MD    )───\n├ \n├ No code provided for eval!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` },
          { quoted: m }
        );
      }

      // Security: block dangerous patterns
      const BLOCKED_PATTERNS = [
        /process\.env/,
        /config\/settings/,
        /require\s*\(\s*['"].*settings['"]/
      ];

      for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(trimmedText)) {
          await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
          return await sock.sendMessage(
            jid,
            { text: `╭───(    TOXIC-MD    )───\n├───≫ BLOCKED ≪───\n├ \n├ That eval is blocked for security.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` },
            { quoted: m }
          );
        }
      }

      // Owner check (set OWNER_NUMBERS env var as comma-separated numbers, e.g. 254712345678,2547...)
      const senderJid = m.key.participant || m.key.remoteJid;
      const senderNumber = senderJid.split('@')[0].replace(/\D/g, '');
      const OWNER_NUMBERS = (process.env.OWNER_NUMBERS || '').split(',').map(n => n.replace(/\D/g, '')).filter(Boolean);
      const isOwner = OWNER_NUMBERS.length === 0 || OWNER_NUMBERS.includes(senderNumber);

      if (!isOwner && OWNER_NUMBERS.length > 0) {
        await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
        return await sock.sendMessage(
          jid,
          { text: `╭───(    TOXIC-MD    )───\n├───≫ ACCESS DENIED ≪───\n├ \n├ This command is for owners only.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` },
          { quoted: m }
        );
      }

      // Polyfill for compatibility (some codes expect m.chat)
      if (typeof m.chat === 'undefined') {
        m.chat = jid;
      }
      const client = sock; // alias for codes that use client

      // Evaluate with wrapper so user code can use sock, m, client and top-level await
      let evaled = await eval(`(async (sock, m, client) => {\n${trimmedText}\n})(sock, m, sock);`);

      if (typeof evaled !== 'string') {
        evaled = inspect(evaled, { depth: 2, colors: false });
      }

      await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });

      if (evaled && evaled !== 'undefined' && evaled !== 'null' && evaled.trim() !== '') {
        await sock.sendMessage(jid, { text: evaled }, { quoted: m });
      }
    } catch (err) {
      await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
      const errMsg = String(err).slice(0, 600);
      await sock.sendMessage(
        jid,
        { text: `╭───(    TOXIC-MD    )───\n├───≫ EVAL ERROR ≪───\n├ \n├ ${errMsg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` },
        { quoted: m }
      );
    }
  }
};
