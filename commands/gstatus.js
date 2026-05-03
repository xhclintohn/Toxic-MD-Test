import { downloadContentFromMessage, getContentType } from '@whiskeysockets/baileys';

const fmt = (text) =>
  `╭───(    TOXIC-MD    )───\n├ \n├ ${text}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

const getBuffer = async (msgObj, type) => {
  const stream = await downloadContentFromMessage(msgObj, type);
  let buf = Buffer.from([]);
  for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
  return buf;
};

export default {
  name: 'gstatus',

  async execute(sock, m, args, PREFIX, BOT_NAME) {
    const jid = m.key.remoteJid;
    const isGroup = jid?.endsWith('@g.us');

    const fakeQuoted = {
      key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', id: m.key.id },
      message: { conversation: 'Verified' },
      contextInfo: { mentionedJid: [], forwardingScore: 999, isForwarded: true },
    };

    const reply = (text) => sock.sendMessage(jid, { text: fmt(text) }, { quoted: fakeQuoted });
    const react = (emoji) => sock.sendMessage(jid, { react: { text: emoji, key: m.key } });

    if (!isGroup) {
      return reply('This command can only be used in group chats.');
    }

    await react('⌛');

    try {
      const caption = args.join(' ').trim();
      const defaultCaption = `Group status Posted By ${BOT_NAME}\n\nxD\n🪽`;

      const rawType = getContentType(m.message);
      let mime = '';
      let quotedMsg = null;

      if (rawType === 'imageMessage') {
        mime = m.message.imageMessage?.mimetype || 'image/jpeg';
      } else if (rawType === 'videoMessage') {
        mime = m.message.videoMessage?.mimetype || 'video/mp4';
      } else if (rawType === 'audioMessage') {
        mime = m.message.audioMessage?.mimetype || 'audio/mp4';
      } else {
        const ctx = m.message?.extendedTextMessage?.contextInfo;
        if (ctx?.quotedMessage) {
          const qType = getContentType(ctx.quotedMessage);
          quotedMsg = ctx.quotedMessage;
          if (qType === 'imageMessage') mime = quotedMsg.imageMessage?.mimetype || 'image/jpeg';
          else if (qType === 'videoMessage') mime = quotedMsg.videoMessage?.mimetype || 'video/mp4';
          else if (qType === 'audioMessage') mime = quotedMsg.audioMessage?.mimetype || 'audio/mp4';
        }
      }

      const direct = m.message;

      if (!/image|video|audio/.test(mime) && !caption) {
        await react('❌');
        return reply(
          `Reply to an image, video, or audio — or type text after the command.\nExample: ${PREFIX}gstatus Check out this update!`
        );
      }

      if (/image/.test(mime)) {
        const src = quotedMsg ? quotedMsg.imageMessage : direct.imageMessage;
        const buffer = await getBuffer(src, 'image');
        await sock.sendMessage(jid, { groupStatusMessage: { image: buffer, caption: caption || defaultCaption } });
        await reply('Image status has been posted successfully.');
        await react('✅');

      } else if (/video/.test(mime)) {
        const src = quotedMsg ? quotedMsg.videoMessage : direct.videoMessage;
        const buffer = await getBuffer(src, 'video');
        await sock.sendMessage(jid, { groupStatusMessage: { video: buffer, caption: caption || defaultCaption } });
        await reply('Video status has been posted successfully.');
        await react('✅');

      } else if (/audio/.test(mime)) {
        const src = quotedMsg ? quotedMsg.audioMessage : direct.audioMessage;
        const buffer = await getBuffer(src, 'audio');
        await sock.sendMessage(jid, { groupStatusMessage: { audio: buffer, mimetype: 'audio/mp4' } });
        await reply('Audio status has been posted successfully.');
        await react('✅');

      } else if (caption) {
        await sock.sendMessage(jid, { groupStatusMessage: { text: caption } });
        await reply('Text status has been posted successfully.');
        await react('✅');
      }

    } catch (err) {
      await react('❌');
      await reply(`An error occurred while posting status:\n${err.message || 'Unknown error'}`);
    }
  },
};
