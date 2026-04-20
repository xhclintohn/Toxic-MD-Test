// Cmds/Reactions.js — 5 commands
  'use strict';

  const { getBuffer } = require('../lib/botFunctions');
const links = {
      slap: 'https://files.catbox.moe/it6901.webp',
      kiss: 'https://files.catbox.moe/0vdy7y.webp',
      hug: 'https://files.catbox.moe/ba4zzh.webp',
      fuck: 'https://files.catbox.moe/c834fx.webp',
  };
const { getFakeQuoted } = require('../lib/fakeQuoted');

const getTarget = (m) => {
    const jid = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null;
    if (!jid) return null;
    if (!jid.includes('@s.whatsapp.net') && !jid.includes('@lid')) return null;
    return jid;
};

  // ── fuck
dreaded({
  pattern: "fuck",
  alias: ["screw","bang"],
  desc: "Send a savage reaction to a tagged or quoted user",
  category: "Reactions",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const target = getTarget(m);
            if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Tag or quote someone first.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            const tNum = target.split('@')[0];
            const sNum = m.sender.split('@')[0];
            if (links.fuck) {
                try {
                    const buf = await getBuffer(links.fuck);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} went off on @${tNum} 😤`, mentions: [m.sender, target] });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} absolutely roasted @${tNum}. The audacity. 🔥`,
                `@${sNum} just went full savage on @${tNum}. Someone's getting blocked. 😤`,
                `@${sNum} told @${tNum} exactly what they think. No filter whatsoever. 💀`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├ ${lines[Math.floor(Math.random() * lines.length)]}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender, target]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Command failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── hug
dreaded({
  pattern: "hug",
  alias: ["cuddle","embrace"],
  desc: "Hug a tagged or quoted user",
  category: "Reactions",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const target = getTarget(m);
            if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Tag or quote someone to hug.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            const tNum = target.split('@')[0];
            const sNum = m.sender.split('@')[0];
            if (links.hug) {
                try {
                    const buf = await getBuffer(links.hug);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} hugged @${tNum} 🤗`, mentions: [m.sender, target] });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} gave @${tNum} a hug they didn't ask for. 🤗`,
                `@${sNum} wrapped @${tNum} up in a hug. Wholesome or weird, you decide. 🫂`,
                `@${sNum} hugged @${tNum}. Finally some peace in this group. 🤗`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├ ${lines[Math.floor(Math.random() * lines.length)]}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender, target]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Hug failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── kiss
dreaded({
  pattern: "kiss",
  alias: ["smooch","peck"],
  desc: "Kiss a tagged or quoted user",
  category: "Reactions",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const target = getTarget(m);
            if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Tag or quote someone to kiss.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            const tNum = target.split('@')[0];
            const sNum = m.sender.split('@')[0];
            if (links.kiss) {
                try {
                    const buf = await getBuffer(links.kiss);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} kissed @${tNum} 💋`, mentions: [m.sender, target] });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} kissed @${tNum} and nobody asked. 💋`,
                `@${sNum} planted one right on @${tNum}. Bold move. 😘`,
                `@${sNum} kissed @${tNum}. The group just got awkward. 💋`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├ ${lines[Math.floor(Math.random() * lines.length)]}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender, target]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Kiss failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── links
dreaded({
  pattern: "links",
  category: "Reactions",
  filename: __filename
}, );

// ── slap
dreaded({
  pattern: "slap",
  alias: ["smack","hit"],
  desc: "Slap a tagged or quoted user",
  category: "Reactions",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const target = getTarget(m);
            if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Tag or quote someone to slap.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            const tNum = target.split('@')[0];
            const sNum = m.sender.split('@')[0];
            if (links.slap) {
                try {
                    const buf = await getBuffer(links.slap);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} slapped @${tNum} 💥`, mentions: [m.sender, target] });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} slapped @${tNum} so hard their Wi-Fi disconnected. 💥`,
                `@${sNum} slapped @${tNum} into next week. 👋`,
                `@${sNum} gave @${tNum} a slap that echoed through the whole chat. 😤`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├ ${lines[Math.floor(Math.random() * lines.length)]}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender, target]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Slap failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
  