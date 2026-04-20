// Cmds/Groups.js — 41 commands
  'use strict';

  const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');
const afkFeature = require('../Functions/features').afkFeature;
const { getGroupSettings, updateGroupSetting, getWarnLimit } = require('../Database/config');
const middleware = require('../lib/middleware');

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
        return null;
    }
    const match = participants.find(p => {
        const pid = (p.jid || p.id || '').split('@')[0].split(':')[0].replace(/\D/g, '');
        return pid === user || pid.endsWith(user) || user.endsWith(pid);
    });
    if (match) return (match.jid || match.id).split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
    return user + '@s.whatsapp.net';
};

const BOX = (title, lines) => {
    const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
    return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
};
const middleware = require("../lib/middleware");
const { getGroupSettings, updateGroupSetting } = require('../Database/config');
const { getSettings } = require('../Database/config');

const formatStylishReply = (message) => {
    return `╭───(    TOXIC-MD    )───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
};
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
  const linkMiddleware = require('../lib/linkMiddleware');
const polls = new Map();
const { resetWarn, getWarnCount } = require('../Database/config');
const fs = require('fs');
const { setWarnLimit, getWarnLimit } = require('../Database/config');

const normalizeJid = (jid) => {
    if (!jid) return '';
    return jid.split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};
const https = require('https');

const GH_OWNER = 'xhclintohn';
const GH_REPO  = 'Toxic-v2';
const GH_BRANCH = 'main';
const GH_ASSET_DIR = 'assets/reactions';

const BOX = (title, lines) => {
    const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
    return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
};

async function ghApiPut(token, path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = https.request({
            hostname: 'api.github.com',
            path: `/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Toxic-MD-Bot',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let raw = '';
            res.on('data', c => raw += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode, body: raw }); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function ghApiGet(token, path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.github.com',
            path: `/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
            method: 'GET',
            headers: { 'Authorization': `token ${token}`, 'User-Agent': 'Toxic-MD-Bot' }
        }, (res) => {
            let raw = '';
            res.on('data', c => raw += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode, body: {} }); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}
const path = require('path');
const { getWarnCount, addWarn, resetWarn, getGroupSettings } = require('../Database/config');
const { getWarnCount, getWarnLimit } = require('../Database/config');

const getMentionedJid = (m) => {
    if (m.msg?.contextInfo?.mentionedJid?.length > 0) return m.msg.contextInfo.mentionedJid[0];
    if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) return m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    if (m.quoted?.mentionedJid?.length > 0) return m.quoted.mentionedJid[0];
    if (m.quoted?.contextInfo?.mentionedJid?.length > 0) return m.quoted.contextInfo.mentionedJid[0];
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
        return null;
    }
    const match = participants.find(p => {
        const pid = (p.jid || p.id || '').split('@')[0].split(':')[0].replace(/\D/g, '');
        return pid === user || pid.endsWith(user) || user.endsWith(pid);
    });
    if (match) return (match.jid || match.id).split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
    return user + '@s.whatsapp.net';
};

  // ── add
dreaded({
  pattern: "add",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, participants, botname, groupMetadata, text, pushname } = context;
        const fq = getFakeQuoted(m);

        const { getBinaryNodeChild, getBinaryNodeChildren } = require('@whiskeysockets/baileys');

        if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Provide number to be added.\n├ Format: add 254114885159\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const _participants = participants.map((user) => user.id);

        const users = (await Promise.all(
            text.split(',')
                .map((v) => v.replace(/[^0-9]/g, ''))
                .filter((v) => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
                .map(async (v) => [
                    v,
                    await client.onWhatsApp(v + '@s.whatsapp.net'),
                ]),
        )).filter((v) => v[1][0]?.exists).map((v) => v[0] + '@c.us');

        const response = await client.query({
            tag: 'iq',
            attrs: {
                type: 'set',
                xmlns: 'w:g2',
                to: m.chat,
            },
            content: users.map((jid) => ({
                tag: 'add',
                attrs: {},
                content: [{ tag: 'participant', attrs: { jid } }],
            })),
        });

        const add = getBinaryNodeChild(response, 'add');
        const participant = getBinaryNodeChildren(add, 'participant');

        let respon = await client.groupInviteCode(m.chat);

        for (const user of participant.filter((item) => item.attrs.error === 401 || item.attrs.error === 403 || item.attrs.error === 408)) {
            const jid = user.attrs.jid;
            const content = getBinaryNodeChild(user, 'add_request');
            const invite_code = content.attrs.code;
            const invite_code_exp = content.attrs.expiration;

            let teza;
            if (user.attrs.error === 401) {
                teza = `╭───(    TOXIC-MD    )───\n├ @${jid.split('@')[0]} has blocked the bot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            } else if (user.attrs.error === 403) {
                teza = `╭───(    TOXIC-MD    )───\n├ @${jid.split('@')[0]} has set privacy settings for group adding.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            } else if (user.attrs.error === 408) {
                teza = `╭───(    TOXIC-MD    )───\n├ @${jid.split('@')[0]} recently left the group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            } 

            await m.reply(teza);

            let links = `╭───(    TOXIC-MD    )───\n├───≫ GROUP INVITE ≪───\n├ \n├ ${pushname} is trying to add you to\n├ ${groupMetadata.subject}\n├ \n├ https://chat.whatsapp.com/${respon}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

            await client.sendMessage(jid, { text: links }, { quoted: fq });
        }
    });
});

// ── afk
dreaded({
  pattern: "afk",
  desc: "Set yourself as AFK",
  category: "Groups",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        const senderNum = m.sender.split('@')[0].split(':')[0];
        const reason = context.text || context.q || 'no reason';

        if (afkFeature.isAfk(senderNum)) {
            afkFeature.removeAfk(senderNum);
            return m.reply(`╭───(    TOXIC-MD    )───\n├ AFK removed. Welcome back, ghost. 👁️\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        afkFeature.setAfk(senderNum, reason);
        return client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ AFK SET ≪───\n├ @${senderNum} went AFK.\n├ Reason: ${reason}\n├ Don't bother them. 🚫\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [m.sender]
        });
    });

// ── antilink
dreaded({
  pattern: "antilink",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m, args, isAdmin, isBotAdmin } = context;
    const fq = getFakeQuoted(m);

    const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├───≫ ANTILINK ≪───\n├ \n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    if (!m.isGroup) {
        return await client.sendMessage(m.chat, { text: fmt('Groups only, genius. 😤') }, { quoted: fq });
    }

    if (!isAdmin) {
        return await client.sendMessage(m.chat, { text: fmt("Admins only. You're not special enough. 😒") }, { quoted: fq });
    }

    if (!isBotAdmin) {
        return await client.sendMessage(m.chat, { text: fmt("Make me admin first. I can't enforce rules without power. 🙄") }, { quoted: fq });
    }

    try {
        const groupSettings = await getGroupSettings(m.chat);
        const value = args.join(" ").toLowerCase();
        const validModes = ["off", "warn", "kick"];

        if (validModes.includes(value)) {
            const currentMode = String(groupSettings.antilink || "off").toLowerCase();
            if (currentMode === value) {
                return await client.sendMessage(m.chat, { text: fmt(`Antilink is already set to *${value.toUpperCase()}*. Pay attention. 😒`) }, { quoted: fq });
            }
            await updateGroupSetting(m.chat, 'antilink', value);
            const desc =
                value === 'off' ? 'Links are now allowed. Hope you know what you\'re doing. 🙄' :
                value === 'warn' ? `Links will be deleted and sender warned.\nAt the warn limit they\'re KICKED. 😈` :
                'Links = Instant kick. No second chances. 😈';
            return await client.sendMessage(m.chat, { text: fmt(`✅ Antilink set to *${value.toUpperCase()}*.\n├ ${desc}`) }, { quoted: fq });
        }

        const currentMode = String(groupSettings.antilink || "off").toUpperCase();
        const warnLimit = await getWarnLimit(m.chat);

        await client.sendMessage(m.chat, {
            text: fmt(`Current mode: *${currentMode}*\n├ Warn limit: *${warnLimit}* (set with .setwarncount)\n├ \n├ 📖 *How to use:*\n├ .antilink off — Allow links\n├ .antilink warn — Delete + warn user\n├ .antilink kick — Delete + instant kick\n├ \n├ In warn mode, hitting the limit\n├ = auto kick. 😈`)
        }, { quoted: fq });
    } catch (error) {
        console.error("Antilink command error:", error);
        await client.sendMessage(m.chat, { text: fmt('Something broke. Try again. 😤') }, { quoted: fq });
    }
});

// ── antistatusmention
dreaded({
  pattern: "antistatusmention",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m, args, isAdmin, isBotAdmin } = context;
    const fq = getFakeQuoted(m);

    const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├───≫ ANTISTATUSMENTION ≪───\n├ \n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    if (!m.isGroup) {
        return await client.sendMessage(m.chat, { text: fmt('Groups only, genius. 😤') }, { quoted: fq });
    }

    if (!isAdmin) {
        return await client.sendMessage(m.chat, { text: fmt("Admins only. You're not special enough. 😒") }, { quoted: fq });
    }

    if (!isBotAdmin) {
        return await client.sendMessage(m.chat, { text: fmt("Make me admin first. I can't delete messages without power. 🙄") }, { quoted: fq });
    }

    try {
        const groupSettings = await getGroupSettings(m.chat);
        const value = args.join(" ").toLowerCase();
        const validModes = ["off", "warn", "kick"];

        if (validModes.includes(value)) {
            const currentMode = String(groupSettings.antistatusmention || "off").toLowerCase();
            if (currentMode === value) {
                return await client.sendMessage(m.chat, { text: fmt(`AntiStatusMention is already *${value.toUpperCase()}*. Pay attention. 😒`) }, { quoted: fq });
            }
            await updateGroupSetting(m.chat, 'antistatusmention', value);
            const desc =
                value === 'off' ? 'Status mentions are now allowed. Hope that\'s intentional. 🙄' :
                value === 'warn' ? `Status mentions deleted + user warned.\nHit the warn limit and they\'re KICKED. 😈` :
                'Status mention = Instant kick. Zero tolerance. 😈';
            return await client.sendMessage(m.chat, { text: fmt(`✅ AntiStatusMention set to *${value.toUpperCase()}*.\n├ ${desc}`) }, { quoted: fq });
        }

        const currentMode = String(groupSettings.antistatusmention || "off").toUpperCase();
        const warnLimit = await getWarnLimit(m.chat);

        await client.sendMessage(m.chat, {
            text: fmt(`Current mode: *${currentMode}*\n├ Warn limit: *${warnLimit}* (set with .setwarncount)\n├ \n├ 📖 *How to use:*\n├ .antistatusmention off — Allow status mentions\n├ .antistatusmention warn — Delete + warn user\n├ .antistatusmention kick — Delete + instant kick\n├ \n├ In warn mode, hitting the limit\n├ = auto kick. 😈\n├ \n├ Aliases: .antimention`)
        }, { quoted: fq });
    } catch (error) {
        console.error("AntiStatusMention command error:", error);
        await client.sendMessage(m.chat, { text: fmt('Something broke. Try again. 😤') }, { quoted: fq });
    }
});

// ── approve-all
dreaded({
  pattern: "approve-all",
  category: "Groups",
  filename: __filename
}, async (context) => {
  const { client, m, chatUpdate, store, isBotAdmin, isAdmin } = context;
  const fq = getFakeQuoted(m);

  if (!m.isGroup) {
    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Yo, dumbass, this command's\n├ for groups only.\n├ Stop screwing around.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  if (!isAdmin) {
    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Nice try, loser. You need\n├ admin powers to pull this off.\n├ Get lost.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  if (!isBotAdmin) {
    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ I ain't got admin rights, moron.\n├ Make me admin or quit\n├ wasting my time.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  const responseList = await client.groupRequestParticipantsList(m.chat);

  if (responseList.length === 0) {
    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ NO REQUESTS ≪───\n├ \n├ What a surprise, no one's\n├ begging to join this dumpster fire.\n├ No pending requests, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  for (const participant of responseList) {
    try {
      const response = await client.groupRequestParticipantsUpdate(
        m.chat,
        [participant.jid],
        "approve"
      );
      console.log(response);
    } catch (error) {
      console.error('Error approving participant:', error);
      return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Shit hit the fan, couldn't approve\n├ @${participant.jid.split('@')[0]}.\n├ Fix your group, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [participant.jid] });
    }
  }

  m.reply(`╭───(    TOXIC-MD    )───\n├───≫ APPROVED ≪───\n├ \n├ Ugh, fine, all the desperate\n├ wannabes got approved.\n├ Happy now, you pest?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
});

// ── clear
dreaded({
  pattern: "clear",
  alias: ["clearchat","wipe"],
  desc: "Clears all messages in a chat from the bot view",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m } = context;
            const fq = getFakeQuoted(m);

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            try {
                await client.clearChatMessages(m.chat, m);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await m.reply('╭───(    TOXIC-MD    )───\n├───≥ CLEARED ≤───\n├ \n├ Chat cleared from my view.\n├ Gone. All of it. 🧹\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Couldn\'t clear this chat.\n├ Try again, genius.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
        });
    });

// ── close
dreaded({
  pattern: "close",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        await client.groupSettingUpdate(m.chat, 'announcement');
                m.reply(`╭───(    TOXIC-MD    )───\n├───≫ CLOSED ≪───\n├ \n├ Group closed. Shut up now.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});

// ── demote
dreaded({
  pattern: "demote",
  alias: ["unadmin","removeadmin","deadmin","demoteuser"],
  desc: "Demotes a user from admin in a group",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, prefix, isBotAdmin } = context;
            const fq = getFakeQuoted(m);

            if (!isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ I'm not admin here. Make me admin first.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

            const groupMetadata = await client.groupMetadata(m.chat);
            const participants = groupMetadata.participants;

            let rawJid = null;
            if (m.quoted?.sender) {
                rawJid = m.quoted.sender;
            } else {
                const mentioned = getMentionedJid(m);
                if (mentioned) rawJid = mentioned;
            }

            if (!rawJid) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├ Mention or quote a user. ${prefix}demote @user\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            const target = resolveTarget(rawJid, participants);
            if (!target) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├ Couldn't find that person in this group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            try {
                await client.groupParticipantsUpdate(m.chat, [target], 'demote');
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ DEMOTED ≪───\n├ \n├ @${target.split('@')[0]} got stripped of admin.\n├ Back to being a nobody.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                    mentions: [target]
                }, { quoted: fq });
            } catch (error) {
                await m.reply(`╭───(    TOXIC-MD    )───\n├ Demote failed: ${error.message?.slice(0, 60)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        });
    });

// ── demoteall
dreaded({
  pattern: "demoteall",
  alias: ["dall"],
  desc: "Demotes all admins to regular members (keeps superadmins)",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, isBotAdmin } = context;
            const fq = getFakeQuoted(m);

            if (!m.isGroup) return client.sendMessage(m.chat, { text: BOX('ERROR', ['Group only command.']) }, { quoted: fq });
            if (!isBotAdmin) return client.sendMessage(m.chat, { text: BOX('ERROR', ['Make me admin first.']) }, { quoted: fq });

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            try {
                const meta = await client.groupMetadata(m.chat);
                const botJid = client.user?.id ? client.user.id.split(':')[0] + '@s.whatsapp.net' : '';
                const demotable = meta.participants.filter(p => {
                    const jid = (p.jid || p.id || '').split(':')[0].replace(/\D(?=\d{10})/, '') + '@s.whatsapp.net';
                    return p.admin === 'admin' && jid !== botJid;
                });
                const jids = demotable.map(p => (p.jid || p.id).split(':')[0].replace(/\D(?=\d{10})/, '') + '@s.whatsapp.net').filter(Boolean);

                if (!jids.length) return client.sendMessage(m.chat, { text: BOX('DEMOTEALL', ['No admins to demote (other than me).']) }, { quoted: fq });

                await client.sendMessage(m.chat, { text: BOX('DEMOTEALL', [`Demoting ${jids.length} admin(s)...`]) }, { quoted: fq });

                const batchSize = 5;
                let demoted = 0;
                for (let i = 0; i < jids.length; i += batchSize) {
                    const batch = jids.slice(i, i + batchSize);
                    try { await client.groupParticipantsUpdate(m.chat, batch, 'demote'); demoted += batch.length; } catch {}
                    if (i + batchSize < jids.length) await new Promise(r => setTimeout(r, 1500));
                }

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await client.sendMessage(m.chat, {
                    text: BOX('DEMOTEALL', [`Done. ${demoted} admin(s) stripped of power.`, `Nobody special anymore. Back to being regular.`])
                }, { quoted: fq });
            } catch (err) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                await client.sendMessage(m.chat, { text: BOX('ERROR', [`Failed: ${err.message?.slice(0, 60)}`]) }, { quoted: fq });
            }
        });
    });

// ── foreigners
dreaded({
  pattern: "foreigners",
  category: "Groups",
  filename: __filename
}, async _0x4dc5e7 => {
  await middleware(_0x4dc5e7, async () => {
    const { client: _cl_, m: _m_ } = _0x4dc5e7;
    await _cl_.sendMessage(_m_.chat, { react: { text: '⌛', key: _m_.key } }).catch(()=>{});
    const {
      client: _0x5377ad,
      m: _0x4ac4f8,
      args: _0x2a9e6b,
      participants: _0x38d862,
      mycode: _0x5b3bed
    } = _0x4dc5e7;
    let _0x2f8982 = _0x38d862.filter(_0x3c9d8b => !_0x3c9d8b.admin).map(_0x1db3fb => _0x1db3fb.id).filter(_0x475052 => !_0x475052.startsWith(_0x5b3bed) && _0x475052 != _0x5377ad.decodeJid(_0x5377ad.user.id));
    if (!_0x2a9e6b || !_0x2a9e6b[0]) {
      if (_0x2f8982.length == 0) {
        return _0x4ac4f8.reply("╭───(    TOXIC-MD    )───\n├ No foreigners detected. Group is clean, for now.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      }
      let _0x2d7d67 = "╭───(    TOXIC-MD    )───\n├───≫ FOREIGNERS ≪───\n├ \n├ Country code not matching: " + _0x5b3bed + "\n├ Found " + _0x2f8982.length + " unwanted guests:\n├ \n";
      for (let _0x28761c of _0x2f8982) {
        _0x2d7d67 += "├ @" + _0x28761c.split("@")[0] + "\n";
      }
      _0x2d7d67 += "├ \n├ Send .foreigners -x to yeet them all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧";
      _0x5377ad.sendMessage(_0x4ac4f8.chat, {
        text: _0x2d7d67,
        mentions: _0x2f8982
      }, {
        quoted: _0x4ac4f8
      });
    } else if (_0x2a9e6b[0] == "-x") {
      setTimeout(() => {
        _0x5377ad.sendMessage(_0x4ac4f8.chat, {
          text: "╭───(    TOXIC-MD    )───\n├───≫ PURGE MODE ≪───\n├ \n├ Removing all " + _0x2f8982.length + " foreigners now.\n├ Goodbye losers, you won't be missed.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
        }, {
          quoted: _0x4ac4f8
        });
        setTimeout(() => {
          _0x5377ad.groupParticipantsUpdate(_0x4ac4f8.chat, _0x2f8982, "remove");
          setTimeout(() => {
            _0x4ac4f8.reply("╭───(    TOXIC-MD    )───\n├ All foreigners removed. Group cleansed.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
          }, 1000);
        }, 1000);
      }, 1000);
    }
  });
});

// ── goodbye
dreaded({
  pattern: "goodbye",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m, args, prefix, isAdmin } = context;
    const fq = getFakeQuoted(m);
    const jid = m.chat;

    const fmt = (msg) => {
        return `╭───(    TOXIC-MD    )───\n├───≫ Gᴏᴏᴅʙʏᴇ ≪───\n├ \n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
        if (!jid.endsWith('@g.us')) {
            return await client.sendMessage(m.chat, { text: fmt("Oi! This only works in groups. Not your personal DM, genius.") }, { quoted: fq });
        }

        if (!isAdmin) {
            return await client.sendMessage(m.chat, { text: fmt("Only group admins can toggle goodbye messages.\n├ You're not special.") }, { quoted: fq });
        }

        const groupSettings = await getGroupSettings(jid);
        const isEnabled = groupSettings?.goodbye === true || groupSettings?.goodbye === 1;
        const value = args[0]?.toLowerCase();

        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            if (isEnabled === action) {
                return await client.sendMessage(m.chat, { text: fmt(`Bruh 🙄 Goodbye is already ${value.toUpperCase()} in this group. Were you dropped as a kid?`) }, { quoted: fq });
            }
            await updateGroupSetting(jid, 'goodbye', action);
            return await client.sendMessage(m.chat, {
                text: fmt(`Goodbye messages ${value.toUpperCase()}! 🔥 ${action ? "Leavers will get roasted on their way out 😈" : "Let them leave in silence like the nobodies they are 🧊"}`)
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, {
            text: fmt(`Goodbye Status: *${isEnabled ? 'ON 🥶' : 'OFF 😴'}*\n├ Usage: *${prefix}goodbye on/off*\n├ Toggles goodbye messages for members leaving this group.`),
            buttons: [
                { buttonId: `${prefix}goodbye on`, buttonText: { displayText: 'ON 🥶' }, type: 1 },
                { buttonId: `${prefix}goodbye off`, buttonText: { displayText: 'OFF 😴' }, type: 1 },
            ],
            headerType: 1,
            viewOnce: true,
        }, { quoted: fq });
    } catch (error) {
        console.error('Toxic-MD: Error in goodbye.js:', error);
        await client.sendMessage(m.chat, { text: fmt(`Something crashed. Typical. 💀 Error: ${error.message}`) }, { quoted: fq });
    }
});

// ── gpp
dreaded({
  pattern: "gpp",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, quoted, isBotAdmin, IsGroup } = context;
        const fq = getFakeQuoted(m);
        
        if (!IsGroup) return m.reply(formatStylishReply("Group only command idiot"));
        
        if (!isBotAdmin) return m.reply(formatStylishReply("I need to be *admin* to change group picture. Please make me admin first."));
        
        const isAdmin = m.isAdmin;
        if (!isAdmin) return m.reply(formatStylishReply("You're not admin!"));
        
        let imageBuffer;
        
        if (quoted && quoted.mimetype && quoted.mimetype.startsWith('image/')) {
            try {
                imageBuffer = await quoted.download();
            } catch {
                return m.reply(formatStylishReply("Can't download image"));
            }
        }
        else if (m.message?.imageMessage) {
            try {
                imageBuffer = await m.download();
            } catch {
                return m.reply(formatStylishReply("Can't download image"));
            }
        }
        else {
            return m.reply(formatStylishReply("Send or reply with image"));
        }
        
        if (!imageBuffer) return m.reply(formatStylishReply("Invalid image"));
        
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            await client.updateProfilePicture(m.chat, imageBuffer);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return m.reply(formatStylishReply("Group picture updated"));
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply(formatStylishReply("Failed to update picture"));
        }
    });
});

// ── groupmeta
dreaded({
  pattern: "groupmeta",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, text, prefix, pict } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
        const args = text.trim().split(/ +/);
        const command = args[0]?.toLowerCase() || '';
        const newText = args.slice(1).join(' ').trim();

        switch (command) {
            case 'setgroupname':
                if (!newText) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ Yo, give me a new group name!\n├ Usage: ${prefix}setgroupname <new name>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                if (newText.length > 100) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Group name can't be longer\n├ than 100 characters, genius!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

                try {
                    await client.groupUpdateSubject(m.chat, newText);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ UPDATED ≪───\n├ \n├ Group name set to "${newText}".\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                } catch (error) {
                    await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to update group name.\n├ Make sure I'm an admin.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                }
                break;

            case 'setgroupdesc':
                if (!newText) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ Gimme a new description!\n├ Usage: ${prefix}setgroupdesc <new description>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

                try {
                    await client.groupUpdateDescription(m.chat, newText);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ UPDATED ≪───\n├ \n├ Group description updated.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                } catch (error) {
                    await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Couldn't update the description.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                }
                break;

            case 'setgrouprestrict':
                const action = newText.toLowerCase();
                if (!['on', 'off'].includes(action)) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ Usage: ${prefix}setgrouprestrict <on|off>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

                try {
                    const restrict = action === 'on';
                    await client.groupSettingUpdate(m.chat, restrict ? 'locked' : 'unlocked');
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ UPDATED ≪───\n├ \n├ Group editing is now\n├ ${restrict ? 'locked to admins only' : 'open to all members'}.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                } catch (error) {
                    await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to update group settings.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
                }
                break;

            default:
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ INVALID ≪───\n├ \n├ Invalid groupmeta command!\n├ Use ${prefix}setgroupname,\n├ ${prefix}setgroupdesc, or\n├ ${prefix}setgrouprestrict\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── gstatus
dreaded({
  pattern: "gstatus",
  alias: ["groupstatus","gs"],
  desc: "Posts a group status with text, image, video, or audio.",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m, prefix, IsGroup, botname, settings } = context;
    const fq = getFakeQuoted(m);

    const formatMsg = (text) => `╭───(    TOXIC-MD    )───\n├ \n├ ${text}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    try {
      if (!botname) {
        return client.sendText(m.chat, formatMsg(`Bot name is not set. Configure it before using this command.`), m);
      }

      if (!m.sender || typeof m.sender !== 'string' || !m.sender.includes('@s.whatsapp.net')) {
        return client.sendText(m.chat, formatMsg(`Could not identify your WhatsApp ID. Try again.`), m);
      }

      if (!IsGroup) {
        return client.sendText(m.chat, formatMsg(`This command can only be used in group chats.`), m);
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      const quoted = m.quoted ? m.quoted : m;
      const mime = (quoted.msg || quoted).mimetype || '';
      const caption = m.body
        .replace(new RegExp(`^${prefix}(gstatus|groupstatus|gs)\\s*`, 'i'), '')
        .trim();

      if (!/image|video|audio/.test(mime) && !caption) {
        return client.sendText(
          m.chat,
          formatMsg(`Reply to an image, video, audio, or include text.\nExample: ${prefix}gstatus Check out this update!`),
          m
        );
      }

      const defaultCaption = `Group status Posted By Toxic-MD\n\nxD\n🪽`;

      if (/image/.test(mime)) {
        const buffer = await client.downloadMediaMessage(quoted);
        await client.sendMessage(m.chat, {
          groupStatusMessage: {
            image: buffer,
            caption: caption || defaultCaption
          }
        });
        await client.sendText(m.chat, formatMsg(`Image status has been posted successfully.`), m);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } else if (/video/.test(mime)) {
        const buffer = await client.downloadMediaMessage(quoted);
        await client.sendMessage(m.chat, {
          groupStatusMessage: {
            video: buffer,
            caption: caption || defaultCaption
          }
        });
        await client.sendText(m.chat, formatMsg(`Video status has been posted successfully.`), m);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } else if (/audio/.test(mime)) {
        const buffer = await client.downloadMediaMessage(quoted);
        await client.sendMessage(m.chat, {
          groupStatusMessage: {
            audio: buffer,
            mimetype: 'audio/mp4'
          }
        });
        await client.sendText(m.chat, formatMsg(`Audio status has been posted successfully.`), m);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } else if (caption) {
        await client.sendMessage(m.chat, {
          groupStatusMessage: { text: caption }
        });
        await client.sendText(m.chat, formatMsg(`Text status has been posted successfully.`), m);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      }

    } catch (error) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      await client.sendText(
        m.chat,
        formatMsg(`An error occurred while posting status:\n${error.message}`),
        m
      );
    }
  });

// ── hidetag
dreaded({
  pattern: "hidetag",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, text } = context;
        const fq = getFakeQuoted(m);

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
await client.sendMessage(m.chat, { text : text ? text : 'ᅠᅠᅠᅠ' , mentions: participants.map(a => a.id)}, { quoted: fq });
await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

});

});

// ── jid
dreaded({
  pattern: "jid",
  desc: "Get group JID or extract JID from invite link",
  category: "Groups",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
          const args = m.text?.trim().split(/\s+/).slice(1) || [];
          const input = args[0] || '';

          let targetJid = '';
          let displayLabel = '';

          if (m.isGroup && !input) {
              targetJid = m.chat;
              displayLabel = 'Group JID';
          } else if (input && input.includes('chat.whatsapp.com/')) {
              await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
              const code = input.split('chat.whatsapp.com/')[1]?.split(/[\s?]/)[0];
              if (!code) {
                  await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                  return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ That's not a valid invite link, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞᠊ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
              }
              try {
                  const info = await client.groupGetInviteInfo(code);
                  targetJid = info.id;
                  displayLabel = info.subject || 'Group JID';
              } catch {
                  await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                  return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Couldn't fetch that group info.\n├ Invalid link or I'm not in that group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞᠊ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
              }
          } else {
              return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Use this in a group, or provide a\n├ WhatsApp group link in DM.\n├ Example: !jid https://chat.whatsapp.com/xxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞᠊ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          }

          const bodyText =
              `╭───(    TOXIC-MD    )───\n` +
              `├───≫ Gʀᴏᴜᴘ JID ≪───\n` +
              `├ \n` +
              `├ 📛 ${displayLabel}\n` +
              `├ 🆔 ${targetJid}\n` +
              `├ \n` +
              `├ There's your ID. Now leave me alone.\n` +
              `╰──────────────────☉\n` +
              `> ©𝐏𝐨𝐰𝐞𝐫𝐞᠊ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          try {
              const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                  interactiveMessage: {
                      body: { text: bodyText },
                      footer: { text: '' },
                      nativeFlowMessage: {
                          buttons: [{
                              name: 'cta_copy',
                              buttonParamsJson: JSON.stringify({ display_text: '📋 Copy JID', copy_code: targetJid })
                          }],
                          messageParamsJson: ''
                      }
                  }
              }), { quoted: fq, userJid: client.user.id });
              await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
          } catch {
              await m.reply(bodyText);
          }

          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      });

// ── link
dreaded({
  pattern: "link",
  category: "Groups",
  filename: __filename
}, async (context) => {
      await linkMiddleware(context, async () => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
          try {
              const code = await client.groupInviteCode(m.chat);
              const link = `https://chat.whatsapp.com/${code}`;

              const bodyText =
                  `╭───(    TOXIC-MD    )───\n` +
                  `├───≫ Gʀᴏᴜᴘ Lɪɴᴋ ≪───\n` +
                  `├ \n` +
                  `├ ${link}\n` +
                  `├ \n` +
                  `├ Here's your precious link.\n` +
                  `├ Copy it and stop bugging me.\n` +
                  `╰──────────────────☉\n` +
                  `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

              try {
                  const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                      interactiveMessage: {
                          body: { text: bodyText },
                          footer: { text: '' },
                          nativeFlowMessage: {
                              buttons: [{
                                  name: 'cta_copy',
                                  buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Link', copy_code: link })
                              }],
                              messageParamsJson: ''
                          }
                      }
                  }), { quoted: fq, userJid: client.user.id });
                  await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
              } catch {
                  await m.reply(bodyText);
              }

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Couldn't fetch the link.\n├ Either make me admin or quit.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞᠊ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          }
      });
  });

// ── listonline
dreaded({
  pattern: "listonline",
  alias: ["onlinelist","whosonline","online"],
  desc: "List group members who are currently online",
  category: "Groups",
  filename: __filename
}, async (context) => {
          const { client, m, isGroup } = context;
          const fq = getFakeQuoted(m);
          if (!isGroup) {
              return client.sendMessage(m.chat, {
                  text: '╭───(    TOXIC-MD    )───\n├───≫ Oɴʟɪɴᴇ Lɪsᴛ ≪───\n├\n├ This only works in groups, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
              }, { quoted: fq });
          }
          try {
              await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
              const meta = await client.groupMetadata(m.chat);
              const participants = meta.participants || [];
              const onlineList = [];
              for (const p of participants.slice(0, 20)) {
                  const pJid = (p.jid && !p.jid.endsWith('@lid'))
                      ? p.jid
                      : (p.id && !p.id.endsWith('@lid') ? p.id : null);
                  if (!pJid) continue;
                  try {
                      const status = await client.fetchStatus(pJid).catch(() => null);
                      if (status?.status?.includes('online') || status?.setAt?.getTime() > Date.now() - 5 * 60 * 1000) {
                          onlineList.push(pJid);
                      }
                  } catch {}
              }
              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              const body = onlineList.length > 0
                  ? onlineList.map((j, i) => `├ [${i+1}] @${j.split('@')[0]}`).join('\n')
                  : '├ Nobody is online right now. Dead group.';
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Oɴʟɪɴᴇ Mᴇᴍʙᴇʀs ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                  mentions: onlineList
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Oɴʟɪɴᴇ Lɪsᴛ ≪───\n├\n├ Couldn\'t fetch online members.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
          }
      });

// ── onlinelist
dreaded({
  pattern: "onlinelist",
  category: "Groups",
  filename: __filename
}, require('./listonline'));

// ── onlinerusers
dreaded({
  pattern: "onlinerusers",
  category: "Groups",
  filename: __filename
}, require('./listonline'));

// ── open
dreaded({
  pattern: "open",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        await client.groupSettingUpdate(m.chat, 'not_announcement');
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ OPENED ≪───\n├ \n├ Group opened. Talk your trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});

// ── pin
dreaded({
  pattern: "pin",
  alias: ["pinmsg","unpin"],
  desc: "Pin or unpin a message in a group",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, args } = context;
            const fq = getFakeQuoted(m);

            if (!m.quoted) {
                return m.reply('╭───(    TOXIC-MD    )───\n├───≥ PIN ≤───\n├ \n├ Quote a message to pin it,\n├ you absolute muppet.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }

            const isUnpin = (args[0] || '').toLowerCase() === 'unpin';

            const messageKey = {
                id: m.quoted.id,
                remoteJid: m.chat,
                participant: m.quoted.sender
            };

            try {
                await client.pinMessage(m.chat, messageKey, isUnpin ? 0 : 1);
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≥ ${isUnpin ? 'UNPINNED' : 'PINNED'} ≤───\n├ \n├ Message ${isUnpin ? 'unpinned' : 'pinned'} successfully.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            } catch (error) {
                console.error('[PIN ERROR]', error?.message || error);
                const msg = error?.message || String(error);
                const isAuth = msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('403');
                if (isAuth) {
                    await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Failed to pin. Make sure I\'m admin.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                } else {
                    await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Pin failed: ' + msg.slice(0, 80) + '\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                }
            }
        });
    });

// ── poll
dreaded({
  pattern: "poll",
  desc: "Create a group poll",
  category: "Groups",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ Group only command, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const input = (context.text || context.q || '').trim();
        if (!input.includes('|')) return m.reply(`╭───(    TOXIC-MD    )───\n├ Format: .poll Question | Option1 | Option2 | ...\n├ Example: .poll Best bot? | Toxic-MD | Other bots\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const parts = input.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length < 3) return m.reply(`╭───(    TOXIC-MD    )───\n├ Need at least a question + 2 options.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const question = parts[0];
        const options = parts.slice(1).slice(0, 12);

        try {
            await client.sendMessage(m.chat, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            });
        } catch {
            const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','⓫','⓬'];
            const optText = options.map((o,i) => `├ ${nums[i]||'•'} ${o}`).join('\n');
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ POLL ≪───\n├ ❓ ${question}\n${optText}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── promote
dreaded({
  pattern: "promote",
  alias: ["makeadmin","addadmin","promoteuser"],
  desc: "Promotes a user to admin in a group",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, prefix } = context;
            const fq = getFakeQuoted(m);

            const groupMetadata = await client.groupMetadata(m.chat);
            const participants = groupMetadata.participants;

            let rawJid = null;
            if (m.quoted?.sender) {
                rawJid = m.quoted.sender;
            } else {
                const mentioned = getMentionedJid(m);
                if (mentioned) rawJid = mentioned;
            }

            if (!rawJid) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ Mention or quote a user.\n├ Example: ${prefix}promote @user\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            const target = resolveTarget(rawJid, participants);
            if (!target) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├ Couldn't find that person in this group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            try {
                await client.groupParticipantsUpdate(m.chat, [target], 'promote');
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ PROMOTED ≪───\n├ \n├ @${target.split('@')[0]} is now an admin.\n├ Don't let the power go to\n├ your empty head.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                    mentions: [target]
                }, { quoted: fq });
            } catch (error) {
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to promote: ${error.message?.slice(0, 60)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        });
    });

// ── promoteall
dreaded({
  pattern: "promoteall",
  alias: ["pall"],
  desc: "Promotes all non-admin members to admin",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, isBotAdmin } = context;
            const fq = getFakeQuoted(m);

            if (!m.isGroup) return client.sendMessage(m.chat, { text: BOX('ERROR', ['Group only command.']) }, { quoted: fq });
            if (!isBotAdmin) return client.sendMessage(m.chat, { text: BOX('ERROR', ['Make me admin first.']) }, { quoted: fq });

            try {
                const meta = await client.groupMetadata(m.chat);
                const nonAdmins = meta.participants.filter(p => p.admin !== 'admin' && p.admin !== 'superadmin');
                const jids = nonAdmins.map(p => (p.jid || p.id).split(':')[0].replace(/\D(?=\d{10})/, '') + '@s.whatsapp.net').filter(Boolean);

                if (!jids.length) return client.sendMessage(m.chat, { text: BOX('PROMOTEALL', ['Everyone\'s already an admin. Nothing to do.']) }, { quoted: fq });

                await client.sendMessage(m.chat, { text: BOX('PROMOTEALL', [`Promoting ${jids.length} members...`]) }, { quoted: fq });

                const batchSize = 5;
                let promoted = 0;
                for (let i = 0; i < jids.length; i += batchSize) {
                    const batch = jids.slice(i, i + batchSize);
                    try { await client.groupParticipantsUpdate(m.chat, batch, 'promote'); promoted += batch.length; } catch {}
                    if (i + batchSize < jids.length) await new Promise(r => setTimeout(r, 1500));
                }

                await client.sendMessage(m.chat, {
                    text: BOX('PROMOTEALL', [`Done. ${promoted} member(s) promoted to admin.`, `You made everyone a boss. Congrats on the chaos.`])
                }, { quoted: fq });
            } catch (err) {
                await client.sendMessage(m.chat, { text: BOX('ERROR', [`Failed: ${err.message?.slice(0, 60)}`]) }, { quoted: fq });
            }
        });
    });

// ── reject-all
dreaded({
  pattern: "reject-all",
  category: "Groups",
  filename: __filename
}, async (context) => {
  await middleware(context, async () => {
    const { client, m, isBotAdmin, isAdmin } = context;
    const fq = getFakeQuoted(m);

    if (!m.isGroup) {
      return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Yo, genius, this command's\n├ for groups. Quit embarrassing\n├ yourself.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    if (!isAdmin) {
      return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Pfft, you? Admin? Get real,\n├ loser. Only admins can do this.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    if (!isBotAdmin) {
      return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ I'm not admin, dipshit.\n├ Promote me or stop wasting\n├ my time.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    const responseList = await client.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) {
      return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ NO REQUESTS ≪───\n├ \n├ Wow, no one's dumb enough to\n├ wanna join this trash group.\n├ No requests to reject, moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    for (const participant of responseList) {
      try {
        const response = await client.groupRequestParticipantsUpdate(
          m.chat,
          [participant.jid],
          "reject"
        );
        console.log(response);
      } catch (error) {
        console.error('Error rejecting participant:', error);
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Screw-up alert! Couldn't reject\n├ @${participant.jid.split('@')[0]}.\n├ Fix your damn group, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [participant.jid] });
      }
    }

    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ REJECTED ≪───\n├ \n├ All those pathetic join requests?\n├ REJECTED. Go cry about it, losers.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  });
});

// ── remove
dreaded({
  pattern: "remove",
  alias: ["kick","yeet","boot","removemember"],
  desc: "Removes a user from a group",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
      const { client, m, prefix } = context;
      const fq = getFakeQuoted(m);

      const normalizeJid = (jid) => {
        if (!jid) return '';
        return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
      };

      let user = null;
      if (m.mentionedJid && m.mentionedJid.length > 0) user = m.mentionedJid[0];
      if (!user && m.quoted?.sender) user = m.quoted.sender;

      if (!user) return m.reply(`╭───(    TOXIC-MD    )───\n├ Mention or quote a user. ${prefix}kick @user\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

      const botJid = normalizeJid(client.user.id);
      const targetJid = normalizeJid(user);

      if (targetJid === botJid) return m.reply(`╭───(    TOXIC-MD    )───\n├ You can't kick me, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

      const groupMetadata = await client.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const realMember = participants.find(p => normalizeJid(p.jid || p.id) === targetJid);
      const actualJid = realMember ? normalizeJid(realMember.jid || realMember.id) : targetJid;

      try {
        await client.groupParticipantsUpdate(m.chat, [actualJid], 'remove');
        await client.sendMessage(m.chat, {
          text: `╭───(    TOXIC-MD    )───\n├───≫ KICKED ≪───\n├ \n├ @${actualJid.split('@')[0]} got yeeted out.\n├ Good riddance, trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          mentions: [actualJid]
        }, { quoted: fq });
      } catch (error) {
        await m.reply(`╭───(    TOXIC-MD    )───\n├ Couldn't kick @${actualJid.split('@')[0]}.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
    });
  });

// ── requests
dreaded({
  pattern: "requests",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);


const response = await client.groupRequestParticipantsList(m.chat);

if (response.length === 0) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ There are no pending join requests.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

let jids = ''; 

response.forEach((participant, index) => {
    jids +='+' + participant.jid.split('@')[0];
    if (index < response.length - 1) {
        jids += '\n├ '; 
    }
});

 client.sendMessage(m.chat, {text:`╭───(    TOXIC-MD    )───\n├───≫ PENDING REQUESTS ≪───\n├ \n├ ${jids}\n├ \n├ Use .approve-all or .reject-all\n├ to handle these join requests.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`}, { quoted: fq }); 


})

});

// ── resetwarn
dreaded({
  pattern: "resetwarn",
  desc: "Reset warns for a user",
  category: "Groups",
  filename: __filename
}, async (context) => {
        const { client, m, isAdmin, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

        if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ Group only.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        if (!isAdmin && !isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ Admin only.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const target = m.quoted?.sender || m.mentionedJid?.[0];
        if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Reply or mention the user.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const userNum = target.split('@')[0].split(':')[0];
        await resetWarn(m.chat, userNum);

        return client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├ Warns cleared for @${userNum} 🧹\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [target]
        });
    });

// ── retrieve
dreaded({
  pattern: "retrieve",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    if (!m.quoted) return;

    try {
        const quoted = m.msg?.contextInfo?.quotedMessage || m.quoted || null;
        if (!quoted) return;

        const viewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessageV2Extension?.message || quoted?.viewOnceMessage || quoted;
        const imageMsg = viewOnce?.imageMessage || viewOnce?.imageMessageV2 || viewOnce?.imageMessageV1;
        const videoMsg = viewOnce?.videoMessage || viewOnce?.videoMessageV2 || viewOnce?.videoMessageV1;

        if (!imageMsg && !videoMsg) return;

        const buffer = await client.downloadMediaMessage(imageMsg || videoMsg);
        const botDM = client.user?.id;
        if (!buffer || !botDM) return;

        const caption = `╭───(    TOXIC-MD    )───\n├───≫ VIEW ONCE ≪───\n├ Sender: @${m.sender.split('@')[0]}\n├ Chat: ${m.isGroup ? 'Group' : 'DM'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        if (imageMsg) {
            await client.sendMessage(botDM, { image: buffer, caption });
        } else {
            await client.sendMessage(botDM, { video: buffer, caption });
        }
    } catch {}
});

// ── revoke
dreaded({
  pattern: "revoke",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, groupMetadata } = context;
        const fq = getFakeQuoted(m);

await client.groupRevokeInvite(m.chat); 
   await client.sendText(m.chat, `╭───(    TOXIC-MD    )───\n├───≫ REVOKED ≪───\n├ \n├ Group link revoked!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, m); 
   let response = await client.groupInviteCode(m.chat); 
 client.sendText(m.sender, `╭───(    TOXIC-MD    )───\n├───≫ NEW LINK ≪───\n├ \n├ https://chat.whatsapp.com/${response}\n├ \n├ New group link for ${groupMetadata.subject}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, m, { detectLink: true }); 
 client.sendText(m.chat, `╭───(    TOXIC-MD    )───\n├ \n├ Sent you the new group link in private!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, m); 

})

});

// ── setwarncount
dreaded({
  pattern: "setwarncount",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, body } = context;
        const fq = getFakeQuoted(m);

        const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├───≫ SET WARN LIMIT ≪───\n├ \n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        const current = await getWarnLimit(m.chat);

        const rawInput = body.trim().split(/\s+/).slice(1).join('').replace(/[^0-9]/g, '');

        if (!rawInput) {
            return await client.sendMessage(m.chat, {
                text: fmt(`Current warn limit for this group: *${current}*\n├ \n├ Usage: .setwarncount <number>\n├ Example: .setwarncount 5\n├ \n├ When a user hits the limit\n├ they get kicked automatically. 😈\n├ Min: 1 — Max: 10`)
            }, { quoted: fq });
        }

        const num = parseInt(rawInput, 10);

        if (isNaN(num) || num < 1 || num > 10) {
            return await client.sendMessage(m.chat, { text: fmt('Give me a number between 1 and 10. Is that too hard? 🙄') }, { quoted: fq });
        }

        if (num === current) {
            return await client.sendMessage(m.chat, { text: fmt(`Warn limit is already *${current}*. Pay attention. 😒`) }, { quoted: fq });
        }

        await setWarnLimit(m.chat, num);

        await client.sendMessage(m.chat, {
            text: fmt(`✅ Warn limit updated to *${num}*.\n├ Members now get kicked after ${num} warns. 😈`)
        }, { quoted: fq });
    });
});

// ── tagadmins
dreaded({
  pattern: "tagadmins",
  alias: ["tagadminto","pingjidmins","calladmins"],
  desc: "Mentions all admins in the group",
  category: "Groups",
  filename: __filename
}, async (context) => {
        await middleware(context, async () => {
            const { client, m, text, groupMetadata } = context;
            const fq = getFakeQuoted(m);

            if (!m.isGroup) return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├ Group only command.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });

            try {
                const participants = groupMetadata?.participants || [];
                const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
                const mentions = admins.map(p => normalizeJid(p.jid || p.id)).filter(Boolean);

                if (!mentions.length) return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├ No admins found in this group.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });

                const txt = [
                    `╭───(    TOXIC-MD    )───`,
                    `├───≫ ADMINS ≪───`,
                    `├ `,
                    text ? `├ ${text}` : `├ Calling all admins 📢`,
                    `├ `,
                    ...mentions.map(id => `├ @${id.split('@')[0]}`),
                    `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                ].join('\n');

                await client.sendMessage(m.chat, { text: txt, mentions }, { quoted: fq });
            } catch (err) {
                await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├ Failed to fetch admins.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
            }
        });
    });

// ── tagall
dreaded({
  pattern: "tagall",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m, groupMetadata, text } = context;
    const fq = getFakeQuoted(m);

    if (!m.isGroup) return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├ Command meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });

    const normalizeJid = (jid) => {
        if (!jid) return '';
        return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
    };

    try {
        const participants = (groupMetadata?.participants || []);
        const mentions = participants.map(p => normalizeJid(p.jid || p.id)).filter(Boolean);
        const txt = [
            `╭───(    TOXIC-MD    )───`,
            `├───≫ TAG ALL ≪───`,
            `├ `,
            `├ Message: ${text ? text : 'No Message!'}`,
            `├ `,
            ...mentions.map(id => `├ @${id.split('@')[0]}`),
            `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        ].join('\n');
        await client.sendMessage(m.chat, { text: txt, mentions }, { quoted: fq });
    } catch (error) {
        await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├ Failed to tag participants.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
    }
});

// ── upx
dreaded({
  pattern: "upx",
  alias: ["uploadmedia","ghupload"],
  desc: "Upload replied sticker/image/video to GitHub and get the link",
  category: "Groups",
  filename: __filename
}, async (context) => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);

        let token = '';
        try { token = require('../keys').GITHUB_TOKEN || ''; } catch {}
        if (!token) token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
        if (!token) {
            return client.sendMessage(m.chat, {
                text: BOX('UPX ERROR', ['No GITHUB_TOKEN set. Add it to keys.js or environment variables.'])
            }, { quoted: fq });
        }

        if (!m.quoted) {
            return client.sendMessage(m.chat, {
                text: BOX('UPX USAGE', [
                    'Reply to a sticker, image, or video with:',
                    '.upx [optional-filename]',
                    '',
                    'Example: .upx slap_sticker'
                ])
            }, { quoted: fq });
        }

        const msgType = m.quoted?.mtype;
        if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(msgType)) {
            return client.sendMessage(m.chat, {
                text: BOX('UPX ERROR', ['Reply must be a sticker, image, or video.'])
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        try {
            const buffer = m.quoted.download ? await m.quoted.download() : await client.downloadMediaMessage(m.quoted);
            if (!buffer || !buffer.length) throw new Error('Download failed — empty buffer');

            const extMap = { imageMessage: 'jpg', videoMessage: 'mp4', stickerMessage: 'webp' };
            const ext = extMap[msgType] || 'bin';
            const customName = (args[0] || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
            const filename = customName ? `${customName}.${ext}` : `media_${Date.now()}.${ext}`;
            const ghPath = `${GH_ASSET_DIR}/${filename}`;
            const b64 = buffer.toString('base64');

            let sha = null;
            const existing = await ghApiGet(token, ghPath);
            if (existing.status === 200 && existing.body?.sha) sha = existing.body.sha;

            const putBody = {
                message: `upx: add ${filename}`,
                content: b64,
                branch: GH_BRANCH,
                ...(sha ? { sha } : {})
            };
            const result = await ghApiPut(token, ghPath, putBody);

            if (result.status !== 200 && result.status !== 201) {
                throw new Error(`GitHub API returned ${result.status}: ${JSON.stringify(result.body).slice(0, 100)}`);
            }

            const rawUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${ghPath}`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, {
                text: BOX('UPX DONE', [
                    `File: ${filename}`,
                    `Type: ${msgType.replace('Message', '')}`,
                    ``,
                    `Raw link (copy this):`,
                    rawUrl,
                    ``,
                    `Paste in reaction plugin as the sticker URL.`
                ])
            }, { quoted: fq });
        } catch (err) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await client.sendMessage(m.chat, {
                text: BOX('UPX ERROR', [`Upload failed: ${err.message?.slice(0, 80)}`])
            }, { quoted: fq });
        }
    });

// ── usersonline
dreaded({
  pattern: "usersonline",
  category: "Groups",
  filename: __filename
}, require('./listonline'));

// ── vvx
dreaded({
  pattern: "vvx",
  category: "Groups",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    if (!m.quoted) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Reply to a view-once image or video.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

    try {
        const quoted = m.msg?.contextInfo?.quotedMessage || m.quoted || null;
        if (!quoted) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Could not find the quoted message.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const viewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessageV2Extension?.message || quoted?.viewOnceMessage || quoted;
        const imageMsg = viewOnce?.imageMessage || viewOnce?.imageMessageV2 || viewOnce?.imageMessageV1;
        const videoMsg = viewOnce?.videoMessage || viewOnce?.videoMessageV2 || viewOnce?.videoMessageV1;

        if (!imageMsg && !videoMsg) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ This message does not contain\n├ view-once media.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const mediaMessage = imageMsg || videoMsg;
        const returnedPath = await client.downloadAndSaveMediaMessage(mediaMessage);
        if (!returnedPath || !fs.existsSync(returnedPath)) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ Failed to download media.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const buffer = fs.readFileSync(returnedPath);
        const chatId = m.chat || client.user?.id;
        
        const caption = `╭───(    TOXIC-MD    )───\n├───≫ VIEW ONCE ≪───\n├ \n├ Here's your media, perv.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        if (imageMsg) {
            await client.sendMessage(chatId, { image: buffer, caption }, { quoted: fq });
        } else {
            await client.sendMessage(chatId, { video: buffer, caption }, { quoted: fq });
        }

        try {
            fs.unlinkSync(returnedPath);
        } catch (e) {}
    } catch (error) {
        console.error('VVX Error:', error);
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to retrieve view-once media.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── warn
dreaded({
  pattern: "warn",
  desc: "Warn a group member",
  category: "Groups",
  filename: __filename
}, async (context) => {
        const { client, m, isAdmin, isBotAdmin } = context;
        const fq = getFakeQuoted(m);

        if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├ Group only command.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        if (!isAdmin && !isBotAdmin) return m.reply(`╭───(    TOXIC-MD    )───\n├ Admin only.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const target = m.quoted?.sender || m.mentionedJid?.[0];
        if (!target) return m.reply(`╭───(    TOXIC-MD    )───\n├ Reply to or mention the rat you wanna warn.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        const gs = await getGroupSettings(m.chat);
        const warnLimit = gs.warn_limit || 3;
        const userNum = target.split('@')[0].split(':')[0];
        const count = await addWarn(m.chat, userNum);

        if (count >= warnLimit) {
            await resetWarn(m.chat, userNum);
            try { await client.groupParticipantsUpdate(m.chat, [target], 'remove'); } catch {}
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ KICKED ≪───\n├ @${userNum} hit \`${count}/${warnLimit}\` warns.\n├ Bye bye rat 👋\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [target]
            });
        }

        return client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ WARNED ≪───\n├ @${userNum}\n├ Warns: \`${count}/${warnLimit}\`\n├ One more and it's the door.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [target]
        });
    });

// ── warncount
dreaded({
  pattern: "warncount",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await middleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);

        const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├───≫ WARN COUNT ≪───\n├ \n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        let rawJid = null;
        if (m.quoted && m.quoted.sender) {
            rawJid = m.quoted.sender;
        } else {
            const mentioned = getMentionedJid(m);
            if (mentioned) rawJid = mentioned;
        }
        if (!rawJid && args[0]) rawJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        if (!rawJid) {
            return await client.sendMessage(m.chat, { text: fmt("Tag someone or reply to their message. I can't read minds, fool. 😒") }, { quoted: fq });
        }

        const target = resolveTarget(rawJid, participants);
        if (!target) {
            return await client.sendMessage(m.chat, { text: fmt("Couldn't find that person in this group. 🙄") }, { quoted: fq });
        }

        const targetInGroup = participants.find(p => {
            const pid = (p.jid || p.id || '').split(':')[0].split('@')[0].replace(/\D/g, '');
            return pid === target.split('@')[0];
        });
        if (!targetInGroup) {
            return await client.sendMessage(m.chat, { text: fmt("That person isn't even in this group. Are you seeing ghosts? 👻") }, { quoted: fq });
        }

        const username = target.split('@')[0];
        const count = await getWarnCount(m.chat, target);
        const limit = await getWarnLimit(m.chat);
        const remaining = limit - count;

        await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ WARN COUNT ≪───\n├ \n├ 📊 @${username}\n├ Warns: *${count}/${limit}*\n├ Remaining: *${remaining}*\n├ ${count === 0 ? 'Clean record. For now. 😏' : remaining <= 1 ? "One more and they're OUT. 💀" : 'Walking on thin ice. ⚠️'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [target]
        }, { quoted: fq });
    });
});

// ── welcome
dreaded({
  pattern: "welcome",
  category: "Groups",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);
        const jid = m.chat;

        const fmt = (msg) =>
            `╭───(    TOXIC-MD    )───\n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            if (!jid.endsWith('@g.us')) {
                return await client.sendMessage(m.chat, { text: fmt("Oi! 😤 This only works in groups. Not your personal DM, genius. 🖕") }, { quoted: fq });
            }

            const groupSettings = await getGroupSettings(jid);
            const isEnabled = groupSettings?.welcome === true || groupSettings?.welcome === 1;
            const value = args[0]?.toLowerCase();

            if (value === 'on' || value === 'off') {
                const action = value === 'on';
                if (isEnabled === action) {
                    return await client.sendMessage(m.chat, { text: fmt(`Bruh 🙄 Welcome is already ${value.toUpperCase()} in this group. Pay attention!`) }, { quoted: fq });
                }
                await updateGroupSetting(jid, 'welcome', action);
                return await client.sendMessage(m.chat, {
                    text: fmt(`Welcome messages ${value.toUpperCase()}! 🔥 ${action ? "New members better brace themselves 😈" : "No more warm welcomes. Cold group energy 🧊"}`)
                }, { quoted: fq });
            }

            await client.sendMessage(m.chat, {
                text: fmt(`Welcome Status: *${isEnabled ? 'ON 🥶' : 'OFF 😴'}*\n├ Usage: *${prefix}welcome on/off*\n├ Toggles welcome messages for new members in this group.`),
                buttons: [
                    { buttonId: `${prefix}welcome on`, buttonText: { displayText: 'ON 🥶' }, type: 1 },
                    { buttonId: `${prefix}welcome off`, buttonText: { displayText: 'OFF 😴' }, type: 1 },
                ],
                headerType: 1,
                viewOnce: true,
            }, { quoted: fq });
        } catch (error) {
            console.error('Toxic-MD: Error in welcome.js:', error);
            await client.sendMessage(m.chat, { text: fmt(`Something crashed. Typical. 💀 Error: ${error.message}`) }, { quoted: fq });
        }
    });
});

// ── xkill
dreaded({
  pattern: "xkill",
  category: "Groups",
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
  