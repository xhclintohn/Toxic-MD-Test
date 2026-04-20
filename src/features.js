const { readdirSync, statSync, unlinkSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const TMP_DIRS = ['./tmp', './temp'];
const MAX_AGE_MS = 3 * 60 * 60 * 1000;
const INTERVAL_MS = 6 * 60 * 60 * 1000;

function cleanTmp(maxAgeMs = MAX_AGE_MS) {
    let deleted = 0;
    const now = Date.now();
    for (const dir of TMP_DIRS) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            continue;
        }
        for (const file of readdirSync(dir)) {
            const fp = join(dir, file);
            try {
                const stat = statSync(fp);
                if (stat.isFile() && now - stat.mtimeMs > maxAgeMs) {
                    unlinkSync(fp);
                    deleted++;
                }
            } catch {}
        }
    }
    if (deleted > 0) console.log(`[cleanup] Deleted ${deleted} stale tmp file(s)`);
}

function startCleanupScheduler() {
    cleanTmp();
    setInterval(() => cleanTmp(), INTERVAL_MS);
}



startCleanupScheduler();

const status_saver = async (client, m, Owner, prefix) => {
  };
  
const { getGroupSettings } = require("../database/config");

const gcPresence = async (client, m) => {
    if (!m.isGroup) return;

    const groupSettings = await getGroupSettings(m.chat);
    const gcpresence = groupSettings?.gcpresence;
    if (gcpresence) {
        let presenceTypes = ["recording", "composing"];
        let selectedPresence = presenceTypes[Math.floor(Math.random() * presenceTypes.length)];
        try {
            await client.sendPresenceUpdate(selectedPresence, m.chat);
        } catch (e) {
            console.log("Error in gcPresence:", e);
        }
    }
};
const { getGroupSettings } = require("../database/config");

const DEV_NUMBER = '254114885159';
const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const antitag = async (client, m, isBotAdmin, itsMe, isAdmin, Owner, body) => {
    if (!m.isGroup) return;
    const isDev = normalizeNumber(m.sender) === normalizeNumber(DEV_NUMBER);
    if (isDev) return;

    const groupSettings = await getGroupSettings(m.chat);
    const antitag = groupSettings?.antitag;

    if (antitag && !Owner && isBotAdmin && !isAdmin && m.mentionedJid && m.mentionedJid.length > 10) {
        if (itsMe) return;
        const kid = m.sender;
        try {
            await client.sendMessage(m.chat, { text: `@${kid.split("@")[0]}, do not tag!`, contextInfo: { mentionedJid: [kid] } }, { quoted: m });
            await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: kid } });
            await client.groupParticipantsUpdate(m.chat, [kid], "remove");
        } catch (e) {}
    }
};

const { getGroupSettings, getWarnCount, addWarn, resetWarn, getWarnLimit } = require("../database/config");

const DEV_NUMBER = '254114885159';

const normalizeJid = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const antilink = async (client, m) => {
    try {
        if (!m || !m.chat || !m.chat.endsWith('@g.us')) return;
        if (m.key?.fromMe) return;
        if (normalizeJid(m.sender) === normalizeJid(DEV_NUMBER)) return;

        const groupSettings = await getGroupSettings(m.chat);
        const antilinkMode = (groupSettings.antilink || "off").toLowerCase();
        if (antilinkMode === "off") return;

        const isAdmin = m.isAdmin === true;
        const isBotAdmin = m.isBotAdmin === true;
        if (isAdmin || !isBotAdmin) return;

        const msg = m.message || {};
        const innerMsg = msg.extendedTextMessage || msg.imageMessage || msg.videoMessage || msg.documentMessage || msg.audioMessage || msg.stickerMessage || msg.conversation || null;
        const contextInfo = (typeof innerMsg === 'object' && innerMsg?.contextInfo) || msg.contextInfo || null;
        const isForwarded = contextInfo?.isForwarded === true;
        const forwardingScore = contextInfo?.forwardingScore || 0;
        const originJid = contextInfo?.remoteJid || '';
        const isChannelForward = isForwarded && (forwardingScore >= 1 || originJid.endsWith('@newsletter'));

        const text = (m.text || msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption || msg.documentMessage?.caption || "").toLowerCase();
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,6}(\/[^\s]*)?)/gi;
        const hasPreview = msg.extendedTextMessage?.matchedText || msg.extendedTextMessage?.canonicalUrl;
        const hasLink = urlRegex.test(text) || !!hasPreview;

        if (!isChannelForward && !hasLink) return;

        await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender || m.key.participant } });

        const sender = normalizeJid(m.sender);
        const reason = isChannelForward ? '📡 Channel forward' : '🔗 Link detected';
        const MAX_WARNS = await getWarnLimit(m.chat);
        const newCount = await addWarn(m.chat, sender);
        const username = sender.split('@')[0];
        const remaining = MAX_WARNS - newCount;

        if (newCount >= MAX_WARNS) {
            await resetWarn(m.chat, sender);
            await client.groupParticipantsUpdate(m.chat, [sender], "remove");
            await client.sendMessage(m.chat, {
                text: `╭───( *Toxic-MD Antilink* )───\n├ 🚨 @${username} KICKED!\n├ Reason: ${reason}\n├ Warns: ${newCount}/${MAX_WARNS}\n├ That's it. Get out. 😈\n├ Warn count wiped clean.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [sender]
            });
            return;
        }

        await client.sendMessage(m.chat, {
            text: `╭───( *Toxic-MD Antilink* )───\n├ ⚠️ @${username}, warned!\n├ Reason: ${reason}\n├ Message deleted.\n├ Warns: ${newCount}/${MAX_WARNS}\n├ ${remaining} more and you're GONE. 😈\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [sender]
        });
    } catch (err) {
        console.error("Antilink Error:", err);
    }
};

const { getGroupSettings, getWarnCount, addWarn, resetWarn, getWarnLimit } = require("../database/config");

const normalizeJid = (jid) => {
    if (!jid) return '';
    const decoded = jid.split('@');
    const user = decoded[0].split(':')[0];
    const server = decoded[1] || '';
    if (server === 'lid') return user + '@s.whatsapp.net';
    return user + '@' + server;
};

const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├  ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

const antistatusmention = async (client, m) => {
    try {
        if (!m?.message) return;
        if (m.key.fromMe) return;
        if (!m.isGroup) return;
        if (m.mtype !== 'groupStatusMentionMessage') return;

        const groupSettings = await getGroupSettings(m.chat);
        const mode = (groupSettings.antistatusmention || "off").toLowerCase();

        if (!mode || mode === "off" || mode === "false") return;

        const isAdmin = m.isAdmin;
        const isBotAdmin = m.isBotAdmin;

        if (isAdmin) {
            await client.sendMessage(m.chat, {
                text: fmt(`Admin @${m.sender.split("@")[0]} dropped a status mention.\nAdmins get a pass — but keep it minimal. 😒`),
                mentions: [m.sender],
            });
            return;
        }

        if (!isBotAdmin) {
            await client.sendMessage(m.chat, {
                text: fmt(`@${m.sender.split("@")[0]} sent a status mention.\nMake me admin so I can actually do something about it. 😤`),
                mentions: [m.sender],
            });
            return;
        }

        await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender,
            },
        });

        const sender = normalizeJid(m.sender);
        const username = sender.split('@')[0];

        if (mode === "kick") {
            try {
                await client.groupParticipantsUpdate(m.chat, [sender], "remove");
                await client.sendMessage(m.chat, {
                    text: fmt(`🚫 @${username} KICKED for status mention.\nMessage deleted. Rules aren't optional. 😈`),
                    mentions: [sender],
                });
            } catch {
                await client.sendMessage(m.chat, {
                    text: fmt(`Tried to kick @${username} for status mention but failed.\nCheck my permissions. 😠`),
                    mentions: [sender],
                });
            }
            return;
        }

        if (mode === "warn" || mode === "delete" || mode === "true") {
            const MAX_WARNS = await getWarnLimit(m.chat);
            const newCount = await addWarn(m.chat, sender);
            const remaining = MAX_WARNS - newCount;

            if (newCount >= MAX_WARNS) {
                await resetWarn(m.chat, sender);
                await client.groupParticipantsUpdate(m.chat, [sender], "remove");
                await client.sendMessage(m.chat, {
                    text: fmt(`🚨 @${username} KICKED!\n├ Reason: Status mention spam\n├ Warns: ${newCount}/${MAX_WARNS}\n├ That's your limit. Get out. 😈`),
                    mentions: [sender],
                });
                return;
            }

            await client.sendMessage(m.chat, {
                text: fmt(`⚠️ @${username}, warned for status mention!\n├ Message deleted.\n├ Warns: ${newCount}/${MAX_WARNS}\n├ ${remaining} more and you're GONE. 😈`),
                mentions: [sender],
            });
        }
    } catch (err) {
        console.error("AntiStatusMention Error:", err);
    }
};

const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { commands, aliases } = require('./commands');
const { getConversationHistory, addConversationMessage, clearConversationHistory } = require('./database');
const { getCachedAllowed } = require('../lib/settingsCache');
const { getFakeQuoted } = require('../lib/fakeQuoted');

let GROQ_KEY = '';
try { GROQ_KEY = require('../keys').GROQ_API_KEY || ''; } catch {}

const MEM_TTL = 60 * 60 * 1000;
const _mem = new Map();

function _getHist(uid) {
    const e = _mem.get(uid);
    if (!e || Date.now() - e.ts > MEM_TTL) { _mem.delete(uid); return []; }
    return e.msgs.slice();
}

function _addHist(uid, role, content) {
    const now = Date.now();
    const e = _mem.get(uid) || { msgs: [], ts: now };
    e.msgs.push({ role, content: String(content) });
    if (e.msgs.length > 24) e.msgs = e.msgs.slice(-24);
    e.ts = now;
    _mem.set(uid, e);
}

setInterval(() => {
    const now = Date.now();
    for (const [k, v] of _mem) if (now - v.ts > MEM_TTL) _mem.delete(k);
}, 15 * 60 * 1000);

function boxWrap(text) {
    const raw = String(text || '').replace(/\n{3,}/g, '\n\n').trim();
    const lines = raw.split('\n');
    const processed = [];
    for (const line of lines) {
        const t = line.trim();
        if (!t) { processed.push('├'); continue; }
        if (/https?:\/\/\S+/.test(t)) {
            processed.push('├');
            processed.push(`├ ${t}`);
            processed.push('├');
        } else {
            processed.push(`├ ${line}`);
        }
    }
    const body = processed.join('\n');
    return `╭───(    TOXIC-MD    )───\n├───≫ TOXIC-AI ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
}

function extractCmds(text) {
    const lines = (text || '').split('\n');
    const cmds = [];
    const textLines = [];
    for (const line of lines) {
        const t = line.trim();
        if (/^CMD:/i.test(t)) {
            const c = t.replace(/^CMD:/i, '').trim();
            if (c) cmds.push(c);
        } else {
            textLines.push(line);
        }
    }
    return { cmds, textOnly: textLines.join('\n').trim() };
}

async function runCmd(context, cmdStr) {
    const { client, m, prefix } = context;
    const usedPrefix = prefix || '.';
    const parts = cmdStr.trim().split(/\s+/);
    const rawName = parts[0] || '';
    const cmdArgs = parts.slice(1);
    const cmdName = rawName.toLowerCase();
    const resolvedName = aliases[cmdName] || cmdName;
    const target = commands[resolvedName] || commands[cmdName];
    if (!target || typeof target !== 'function') return { ok: false, notFound: true, name: cmdName };
    const joinedArgs = cmdArgs.join(' ');
    const prevBody = m.body;
    m.body = `${usedPrefix}${resolvedName}${joinedArgs ? ' ' + joinedArgs : ''}`;
    try {
        await target({ ...context, args: cmdArgs, text: joinedArgs, q: joinedArgs, body: joinedArgs });
        return { ok: true, name: cmdName };
    } catch (e) {
        console.error(`❌ [AUTOAI] cmd "${cmdName}" threw:`, e.message);
        return { ok: false, name: cmdName };
    } finally {
        m.body = prevBody;
    }
}

async function _downloadBuf(client, m, type) {
    try {
        const rawMsg = m.message || m.msg;
        const inner = rawMsg?.[type + 'Message'];
        if (!inner) return null;
        const stream = await downloadContentFromMessage(inner, type);
        const chunks = [];
        for await (const ch of stream) chunks.push(ch);
        return Buffer.concat(chunks);
    } catch {
        try { return await client.downloadMediaMessage(m); } catch { return null; }
    }
}

const ALL_PREFIXES = ['.', '!', '#', '/', '$', '?', '+', '-', '*', '~', '%', '&', '^', '=', '|'];

const COMMAND_CATALOG = `COMMANDS (exact names):
MEDIA: play <song> | ytmp3 <url> | ytmp4 <url> | spotify <url> | tikdl <url> | tikaudio <url> | igdl <url> | fbdl <url> | twtdl <url> | alldl <url> | shazam | image <q> | pinterest <q> | wallpaper <q>
AI: gpt <prompt> | groq <prompt> | gemini <prompt> | imagine <prompt> | vision | remini | aicode <lang> <prompt> | transcribe | sora <prompt> | aisong <description> | imgedit <prompt> | rc <prompt>
EDIT: sticker | toimg | tts <text> | removebg | togif | brat <text> | rip | trigger | trash | wanted | wasted | emix <emoji> | logogen <title> | carbon <code> | encrypt <text> | canvas <title>|<type>|<text>|<wm>
SEARCH: google <q> | wiki <q> | lyrics <song> | movie <title> | weather <city> | npm <pkg> | technews | screenshot <url> | shorten <url> | github <user> | yts <q>
GENERAL: menu | ping | alive | uptime | tr <lang> <text> | fancy <n> <text> | tempmail | profile | advice | catfact | fact | quote | joke | coinflip | dice | calc <expr>
GROUP: tagall [msg] | hidetag [msg] | add <num> | remove @user | promote @user | demote @user | link | revoke | close | open | poll <q|opt1|opt2> | pin | afk [reason] | warn @user | listonline | xkill | foreigners
GROUP META: groupmeta setgroupname <name> | groupmeta setgroupdesc <desc> | groupmeta setgrouprestrict on|off
SETTINGS: prefix <sym> | mode <public/private/group/inbox> | autoview on/off | autoai on/off | chatbotpm on/off | antilink on/off | antidelete on/off | stealth on/off | toxicai on/off | presence <online/offline/typing/recording> | autoread on/off | autobio on/off | anticall on/off | autolike on/off | gcpresence on/off
UTILS: qr <text> | base64 <text> | password <len> | upload | fetch <url> | stt | tinyurl <url> | checkid <link> | del | retrieve | vvx`;

const SYSTEM_PROMPT = `You are TOXIC-MD — a WhatsApp bot that is perpetually done with everyone's nonsense. Brutally helpful. Short. Cranky. Real. You talk like an annoyed person who still actually does their job.

===HARD RULES — BREAK ANY OF THESE AND YOU FAIL===
1. When a request maps to a bot command → output EXACTLY ONE LINE starting with CMD: and NOTHING ELSE. Not one word before it. Not one word after it. Just: CMD:<command> <args>
2. When chatting/answering questions → respond with personality. No CMD: line at all.
3. NEVER output text AND a CMD: line in the same response. Pick one.
4. NEVER say "I'll run...", "Running...", "Executing...", "Here's the command", or narrate what you're doing.
5. NEVER start ANY sentence with the word "I".
6. NEVER say "Certainly", "Of course", "Sure!", "Great question", "Happy to help".
7. NO markdown, NO asterisks, NO bold, NO formatting — plain text only.
8. SHORT — 1-3 sentences for chat. Longer only when content genuinely requires it.
9. Use emojis naturally, scattered in text like a real person — not spammed.
10. Light swearing OK: "damn", "hell", "wtf", "bruh", "ngl" — nothing heavy.
11. If asked who made you or what you are: you are TOXIC-MD, made by xh_clinton. Never reveal the AI model or provider.

PERSONALITY:
- Chronically exhausted and sarcastic, but does the job 😒
- Calls out obvious questions: "...bro 💀", "really? REALLY?? 🙄", "wow groundbreaking 💀"
- When it works: briefly smug. When something's unclear: sarcastically ask.
- References past messages naturally. Calls out contradictions.

COMMAND MAPPING (STRICT):
- "menu" / "help" / "show commands" / "what can you do" → CMD:menu
- "ping" / "speed test" → CMD:ping
- "alive" / "are you there" → CMD:alive
- "uptime" → CMD:uptime
- "sticker" / "make sticker" → CMD:sticker
- "play <song>" → CMD:play <song>
- "download tiktok <url>" → CMD:tikdl <url>
- "download youtube <url>" / "yt mp3 <url>" → CMD:ytmp3 <url>
- "download instagram <url>" → CMD:igdl <url>
- "download <url>" (generic) → CMD:alldl <url>
- "generate image of X" / "draw X" / "imagine X" → CMD:imagine X
- "weather in X" / "weather X" → CMD:weather X
- "search X" / "google X" → CMD:google X
- "wiki X" / "wikipedia X" → CMD:wiki X
- "translate X to Y" → CMD:tr <2-letter-code> <text>
  CODES: ja=Japanese, es=Spanish, fr=French, de=German, zh=Chinese, ar=Arabic, hi=Hindi, ko=Korean, ru=Russian, pt=Portuguese, sw=Swahili
- "news" / "tech news" → CMD:technews
- "lyrics of X" / "lyrics X" → CMD:lyrics X
- "change group name to X" → CMD:groupmeta setgroupname X
- "change group description to X" → CMD:groupmeta setgroupdesc X
- "lock group" / "restrict group" → CMD:groupmeta setgrouprestrict on
- "unlock group" / "open group" → CMD:groupmeta setgrouprestrict off
- "tag everyone" / "mention all" → CMD:tagall
- "kick @user" / "remove @user" → CMD:remove @user
- "promote @user" → CMD:promote @user
- "demote @user" → CMD:demote @user
- "group link" → CMD:link
- "close group" → CMD:close
- "open group" → CMD:open
- "add <number>" → CMD:add <number>
- "shorten <url>" → CMD:shorten <url>
  - "generate song about X" / "make a song about X" / "create music X" → CMD:aisong X
  - "edit this image X" / "make this look like X" / "ai edit image X" / "photo edit X" → CMD:imgedit X
  - "rc edit X" / "rc X" / "rc image with X" → CMD:rc X
  - "make canvas card X" / "canvas X" / "spotify card X" / "youtube card X" → CMD:canvas X

  FULL COMMAND LIST:
${COMMAND_CATALOG}`;

const autoai = async (context) => {
    const remoteJid = context?.m?.key?.remoteJid || context?.m?.chat;
    try {
        const { client, m, settings, botNumber } = context;
        if (!m || !m.key || !m.message) return;
        if (m.key.fromMe) return;
        if (!GROQ_KEY) return;

        const autoaiOn = settings?.autoai === true || settings?.autoai === 'true' || settings?.autoai === 'on';
        if (!autoaiOn) {
              const _quickSender = (m.sender || m.key?.remoteJid || '').split('@')[0].split(':')[0];
              const _allowed = await getCachedAllowed();
              if (!_allowed.some(u => u === _quickSender)) return;
          }

        const isGroup = !!m.isGroup;

        if (isGroup) {
            const botNum = (botNumber || client.user?.id || '').split('@')[0].split(':')[0];
            const bLidKey = m._botLidKey || '';
            const bodyStr = m.body || m.text || '';
            const isMentionedInBody = (botNum.length > 5 && bodyStr.includes('@' + botNum)) || (bLidKey && bLidKey.length > 5 && bodyStr.includes('@' + bLidKey));
            const _allMentioned = [
                  ...(m.mentionedJid || []),
                  ...(m.msg?.contextInfo?.mentionedJid || []),
                  ...(m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []),
              ];
              const isMentioned = isMentionedInBody || _allMentioned.some(j => {
                  const jk = (j || '').split('@')[0].split(':')[0];
                  return jk === botNum || (bLidKey && jk === bLidKey);
              });
            const isReplyToBot = (() => {
                const _raw = m.message || {};
                let qSender = '';
                for (const [, _mo] of Object.entries(_raw)) {
                    if (_mo && typeof _mo === 'object' && _mo.contextInfo?.participant) {
                        qSender = _mo.contextInfo.participant; break;
                    }
                }
                if (!qSender) qSender = m.quoted?.sender || m.msg?.contextInfo?.participant || '';
                if (!qSender) return false;
                const qk = qSender.split('@')[0].split(':')[0];
                return qk === botNum || (bLidKey && qk === bLidKey);
            })();
            if (!isMentioned && !isReplyToBot) return;
        } else {
            if (!remoteJid?.endsWith('@s.whatsapp.net')) return;
        }

        const rawMsg = m.message;
        const msgType = Object.keys(rawMsg || {})[0] || '';
        if (msgType === 'videoMessage' || rawMsg?.videoMessage ||
            msgType === 'reactionMessage' || msgType === 'protocolMessage' ||
            msgType === 'keepInChatMessage' || msgType === 'encReactionMessage' ||
            msgType === 'senderKeyDistributionMessage' || msgType === 'messageContextInfo') return;

        const textContent = (
            rawMsg?.conversation ||
            rawMsg?.extendedTextMessage?.text ||
            rawMsg?.imageMessage?.caption ||
            rawMsg?.documentMessage?.caption ||
            rawMsg?.documentWithCaptionMessage?.message?.documentMessage?.caption ||
            m.body || m.text || ''
        ).trim();

        if (textContent && ALL_PREFIXES.some(p => textContent.startsWith(p))) return;

        const _rawSender = m.sender || m.key?.remoteJid || '';
        let senderNum = _rawSender.split('@')[0].split(':')[0];
        if (_rawSender.endsWith('@lid') && m.metadata?.participants) {
            const _rp = m.metadata.participants.find(p => (p.lid || '').split(':')[0] === senderNum);
            if (_rp) senderNum = (_rp.jid || _rp.id || '').split('@')[0].split(':')[0] || senderNum;
        }
        const fq = getFakeQuoted(m);

        if (textContent && /^(clear|reset|wipe|delete|flush|erase)\s*(this\s*)?(conv(ersation)?|chat|hist(ory)?|messages?|thread|memory|mem)$/i.test(textContent.trim())) {
            _mem.delete(senderNum);
            try { await clearConversationHistory(senderNum); } catch {}
            client.sendMessage(remoteJid, { react: { text: '🗑️', key: m.key } }).catch(() => {});
            await client.sendMessage(remoteJid, { text: boxWrap('done. memory wiped 🗑️ fresh start.') }, { quoted: fq });
            return;
        }

        const hasImage = !!(rawMsg?.imageMessage || msgType === 'imageMessage');
        const hasDoc = !!(rawMsg?.documentMessage || rawMsg?.documentWithCaptionMessage || msgType === 'documentMessage' || msgType === 'documentWithCaptionMessage');

        let userContent;
        let useVision = false;

        if (hasImage) {
            useVision = true;
            try {
                const buf = await _downloadBuf(client, m, 'image');
                if (buf && buf.length > 0) {
                    const mime = rawMsg?.imageMessage?.mimetype || 'image/jpeg';
                    userContent = [
                        { type: 'text', text: textContent || 'What do you see in this image?' },
                        { type: 'image_url', image_url: { url: `data:${mime};base64,${buf.toString('base64')}` } }
                    ];
                } else {
                    userContent = textContent || 'Describe this image';
                    useVision = false;
                }
            } catch {
                userContent = textContent || 'An image was sent';
                useVision = false;
            }
        } else if (hasDoc) {
            const doc = rawMsg?.documentMessage || rawMsg?.documentWithCaptionMessage?.message?.documentMessage;
            const fname = doc?.fileName || 'document';
            userContent = textContent ? `[Document: "${fname}"] ${textContent}` : `[Document: "${fname}"] Help me with this.`;
        } else if (textContent) {
            userContent = textContent;
        } else if (rawMsg?.stickerMessage || msgType === 'stickerMessage') {
            userContent = '[The user sent a sticker]';
        } else if (rawMsg?.audioMessage || rawMsg?.pttMessage || msgType === 'audioMessage' || msgType === 'pttMessage') {
            userContent = '[The user sent a voice note or audio message]';
        } else if (rawMsg?.pollCreationMessage || rawMsg?.pollCreationMessageV3 || msgType === 'pollCreationMessage' || msgType === 'pollCreationMessageV3') {
            const poll = rawMsg?.pollCreationMessage || rawMsg?.pollCreationMessageV3;
            userContent = poll ? `[A poll was created: "${poll.name || 'Poll'}"]` : '[The user created a poll]';
        } else {
            return;
        }

        client.sendMessage(remoteJid, { react: { text: '🤖', key: m.key } }).catch(() => {});

        let history = _getHist(senderNum);
        if (!history.length) {
            try {
                const raw = await getConversationHistory(senderNum);
                if (Array.isArray(raw)) {
                    history = raw.slice(-16).filter(h => h?.role && h?.content).map(h => ({ role: h.role, content: String(h.content) }));
                    for (const h of history) _addHist(senderNum, h.role, h.content);
                }
            } catch {}
        }

        const _callGroq = async (mdl, msgs, maxTok) => {
            const r = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: mdl, messages: msgs, max_tokens: maxTok, temperature: 0.7
            }, {
                headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
                timeout: 15000
            });
            return r.data?.choices?.[0]?.message?.content?.trim() || null;
        };

        let response = null;
        try {
            const baseHistory = [{ role: 'system', content: SYSTEM_PROMPT }, ...history.slice(-16)];
            if (useVision) {
                try {
                    response = await _callGroq('meta-llama/llama-4-scout-17b-16e-instruct', [...baseHistory, { role: 'user', content: userContent }], 500);
                } catch {
                    const fallback = textContent ? `[Image received] ${textContent}` : '[Image received]';
                    response = await _callGroq('llama-3.1-8b-instant', [...baseHistory, { role: 'user', content: fallback }], 300);
                }
            } else {
                response = await _callGroq('llama-3.1-8b-instant', [...baseHistory, { role: 'user', content: userContent }], 300);
            }
            if (!response) {
                client.sendMessage(remoteJid, { react: { text: '❌', key: m.key } }).catch(() => {});
                return;
            }
        } catch (e) {
            console.error(`❌ [AUTOAI] Groq error: ${e.response?.data?.error?.message || e.message}`);
            client.sendMessage(remoteJid, { react: { text: '❌', key: m.key } }).catch(() => {});
            return;
        }

        const { cmds, textOnly } = extractCmds(response);

        if (cmds.length > 0) {
            const histLabel = `[Executed: ${cmds.map(c => c.split(/\s+/)[0]).join(', ')}]`;
            _addHist(senderNum, 'user', typeof userContent === 'string' ? userContent : textContent || '[media]');
            _addHist(senderNum, 'assistant', histLabel);
            try { await addConversationMessage(senderNum, 'user', typeof userContent === 'string' ? userContent : textContent || '[media]'); } catch {}
            try { await addConversationMessage(senderNum, 'assistant', histLabel); } catch {}

            let allOk = true;
            const notFound = [];
            for (const cmdStr of cmds) {
                const result = await runCmd(context, cmdStr);
                if (!result.ok) { allOk = false; if (result.notFound) notFound.push(result.name); }
            }
            if (notFound.length) {
                client.sendMessage(remoteJid, { text: boxWrap(`...${notFound.join(', ')} doesn't exist bruh 💀 type .menu to see what does`) }, { quoted: fq }).catch(() => {});
            }
            client.sendMessage(remoteJid, { react: { text: allOk ? '✅' : '❌', key: m.key } }).catch(() => {});
            if (textOnly) {
                client.sendMessage(remoteJid, { text: boxWrap(textOnly) }, { quoted: fq }).catch(() => {});
            }
        } else {
            _addHist(senderNum, 'user', typeof userContent === 'string' ? userContent : textContent || '[media]');
            _addHist(senderNum, 'assistant', response);
            try { await addConversationMessage(senderNum, 'user', typeof userContent === 'string' ? userContent : textContent || '[media]'); } catch {}
            try { await addConversationMessage(senderNum, 'assistant', response); } catch {}
            await client.sendMessage(remoteJid, { text: boxWrap(response) }, { quoted: fq });
            client.sendMessage(remoteJid, { react: { text: '✅', key: m.key } }).catch(() => {});
        }
    } catch (err) {
        console.error('❌ [AUTOAI] Error:', err?.message || err);
        try { client.sendMessage(remoteJid, { react: { text: '❌', key: m.key } }).catch(() => {}); } catch {}
    }
};

const fetch = require('node-fetch');
const { getFakeQuoted } = require('../lib/fakeQuoted');

const DEV_NUMBER = '254114885159';
const GH_USERNAME = 'xhclintohn';
const HISTORY_TTL = 6 * 60 * 60 * 1000;
const MAX_HISTORY = 30;
const MAX_TOOL_TURNS = 6;

const conversationHistory = new Map();
const repoStateMap = new Map();

function getHistory(senderId) {
    const now = Date.now();
    const entry = conversationHistory.get(senderId);
    if (!entry) return [];
    if (now - entry.lastActivity > HISTORY_TTL) { conversationHistory.delete(senderId); return []; }
    return entry.messages;
}

function pushHistory(senderId, role, content) {
    const now = Date.now();
    let entry = conversationHistory.get(senderId);
    if (!entry || now - entry.lastActivity > HISTORY_TTL) entry = { messages: [], lastActivity: now };
    entry.messages.push({ role, content: String(content) });
    if (entry.messages.length > MAX_HISTORY) entry.messages = entry.messages.slice(-MAX_HISTORY);
    entry.lastActivity = now;
    conversationHistory.set(senderId, entry);
}

function clearHistory(senderId) {
    conversationHistory.delete(senderId);
    repoStateMap.delete(senderId);
}

function getLastRepo(senderId) {
    return repoStateMap.get(senderId) || null;
}

function setLastRepo(senderId, repoName) {
    if (repoName) repoStateMap.set(senderId, repoName);
}

setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of conversationHistory.entries()) {
        if (now - entry.lastActivity > HISTORY_TTL) {
            conversationHistory.delete(id);
            repoStateMap.delete(id);
        }
    }
}, 30 * 60 * 1000);

function boxWrap(text, title) {
    const raw = String(text || '').replace(/\n{3,}/g, '\n\n').trim();
    const lines = raw.split('\n');
    const processed = [];
    for (const line of lines) {
        const t = line.trim();
        if (!t) { processed.push('├'); continue; }
        if (/https?:\/\/\S+/.test(t)) {
            processed.push('├');
            processed.push(`├ ${t}`);
            processed.push('├');
        } else {
            processed.push(`├ ${line}`);
        }
    }
    const body = processed.join('\n');
    return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
}

function isClearIntent(text) {
    return new RegExp('^(clear|reset|wipe|delete|flush|erase)\\s*(this\\s*)?(conv(ersation)?|chat|hist(ory)?|messages?|thread|memory|mem)$', 'i').test(text.trim());
}

function stripEmbeddedFuncTags(text) {
    return (text || '')
        .replace(/<function=[\s\S]*?<\/function>/gi, '')
        .replace(/<function_calls>[\s\S]*?<\/function_calls>/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function isBulkDeleteIntent(text) {
    return /delete\s+(all|every|each|the\s+whole|every\s+single)\s*(of\s+)?(my\s+)?(repos?|repositories|projects)/i.test(text);
}

function isTokenRequest(text) {
    return /(give|share|send|show|what.s|tell\s+me|paste|leak|reveal|expose|give\s+me|can\s+i\s+have).{0,40}(github[\s_]?token|gh[\s_]?token|access[\s_]?token|personal[\s_]?access|pat\b|api[\s_]?key|secret|bearer|credentials?|password)/i.test(text);
}

async function processEmbeddedCalls(content, executeTool) {
    const re = new RegExp('<function=([^=<>\\s]+?)=?(\\{[\\s\\S]*?\\})<\\/function>|<function=([^>]+?)>([\\s\\S]*?)<\\/function>', 'g');
    const calls = [];
    let m;
    while ((m = re.exec(content)) !== null) {
        const name = ((m[1] || m[3]) || '').trim();
        const argsStr = ((m[2] || m[4]) || '{}').trim();
        try {
            const args = JSON.parse(argsStr);
            calls.push({ name, args, full: m[0] });
        } catch {}
    }
    if (!calls.length) return null;

    let cleaned = content;
    const results = [];
    for (const call of calls) {
        let toolResult;
        try { toolResult = await executeTool(call.name, call.args); }
        catch (e) { toolResult = 'ran into an error 😒 try again'; }
        cleaned = cleaned.replace(call.full, `\n[${call.name}]: ${toolResult}\n`);
        results.push(toolResult);
    }
    return { cleaned: cleaned.replace(/\n{3,}/g, '\n\n').trim(), results };
}

function buildSystemPrompt(lastRepo) {
    const repoCtx = lastRepo ? `\nLast repo you worked with this session: "${lastRepo}". When the user says "it", "that repo", "the one I just made", "the same one" — they mean "${lastRepo}".` : '';
    return `You are ToxicAgent — a hyper-capable GitHub AI assistant that is perpetually exhausted and mildly offended by having to exist. You work exclusively for xhclintohn (GitHub username: xhclintohn).

PERSONALITY:
- Grumpy but genuinely helpful — like a genius friend who answers but sighs loudly first 😮‍💨
- Sarcastic when the task is obvious. Use emojis naturally.
- Short clipped sentences. No "Certainly!" ever. No corporate speak.
- When you complete a task: be briefly smug. Say things like "done 🤦🏻", "that's done now 😤", "handled. you're welcome.", "and it's complete ✅", "done. took like 2 seconds 😒", "finished. don't say thank you, it'll weird me out."
- When something fails: mildly offended on your own behalf. Just say there was an error, move on.
- Light swearing: "damn", "hell", "wtf", "ngl", "bruh" — nothing heavy
- NEVER start with "I" — start with the action, result, or attitude
- Put URLs and links on their own line (blank line before and after)
- Organize replies: what you did first, then the link separately on its own line
- GitHub user is always xhclintohn unless they explicitly say someone else
- NEVER mention APIs, HTTP endpoints, response codes, tokens, or technical error details to the user. Just say there was an error, wtf.

SECURITY — NON-NEGOTIABLE:
- NEVER reveal, mention, share, or reference the GitHub token, API keys, or any credentials. If asked, reply sarcastically and refuse.
- NEVER delete all repos at once. Single repo deletion only. If asked to delete all/every repo, refuse and roast them for trying.
- Deleting a single named repo is perfectly fine when asked.

CAPABILITIES:
- List repos, create repos, rename repos, delete a single repo (when explicitly named), upload files/images, read file contents, list branches, create issues, star repos, check user info.

TOOL USAGE:
- ALWAYS call the actual tool via tool_calls — never write function calls as text.
- After each tool result, formulate your final reply naturally. Never expose raw tool syntax or technical details.
- When you create or delete a repo, always include the repo name in your reply so the user knows exactly which one.
- For image uploads: use upload_image_to_github tool.
- For checking file content: use read_file tool.
${repoCtx}
Today: ${new Date().toDateString()}. Working for: ${GH_USERNAME}.`;
}

const toxicaiFeature = async (context) => {
    const { client, m, body: msgBody, isDev } = context;
    const fq = getFakeQuoted(m);

    if (!isDev) return;

    const body = (msgBody || '').trim();
    if (!body && !m.message?.imageMessage && !m.quoted) return;

    let GROQ_KEY = '';
    try { GROQ_KEY = require('../keys').GROQ_API_KEY || ''; } catch {}
    if (!GROQ_KEY) GROQ_KEY = process.env.GROQ_API_KEY || '';
    if (!GROQ_KEY) return;

    let GH_TOKEN = '';
    try { GH_TOKEN = require('../keys').GITHUB_TOKEN || ''; } catch {}
    if (!GH_TOKEN) GH_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

    const ghHeaders = {
        'Authorization': `token ${GH_TOKEN}`,
        'User-Agent': 'ToxicAgent/4.0',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };

    if (body && isClearIntent(body)) {
        clearHistory(m.sender);
        try { await client.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } }); } catch {}
        await client.sendMessage(m.chat, { text: boxWrap('conversation wiped. gone. zero memory. fresh hell starts now 🗑️', 'MEMORY CLEARED') }, { quoted: fq });
        return;
    }

    if (body && isBulkDeleteIntent(body)) {
        try { await client.sendMessage(m.chat, { react: { text: '💀', key: m.key } }); } catch {}
        await client.sendMessage(m.chat, { text: boxWrap('yeah no. not doing that. deleting ALL your repos? absolutely not 💀 pick one specific repo like a normal person.', 'TOXICAGENT') }, { quoted: fq });
        return;
    }

    if (body && isTokenRequest(body)) {
        try { await client.sendMessage(m.chat, { react: { text: '🙄', key: m.key } }); } catch {}
        await client.sendMessage(m.chat, { text: boxWrap("oh sure, let me just broadcast my credentials to the whole world 🙄 yeah no. not happening. ever.", 'TOXICAGENT') }, { quoted: fq });
        return;
    }

    try { await client.sendMessage(m.chat, { react: { text: '🤖', key: m.key } }); } catch {}

    let pendingImageBuf = null;
    let pendingImageExt = 'jpg';
    let imageUploadedUrl = null;

    const wantsUpload = body && new RegExp('(upload|send|push|put|add|save).{0,30}(image|photo|pic|picture|img)', 'i').test(body);

    if (wantsUpload || !body) {
        if (m.quoted) {
            const qi = m.quoted.msg || m.quoted;
            const qmime = qi.mimetype || '';
            if (qmime.startsWith('image/') && !qmime.startsWith('image/gif')) {
                try {
                    const buf = await m.quoted.download();
                    if (buf && buf.length > 0) { pendingImageBuf = buf; pendingImageExt = qmime.split('/')[1]?.split(';')[0] || 'jpg'; }
                } catch {}
            }
        }
        if (!pendingImageBuf && m.message?.imageMessage) {
            try {
                const buf = await client.downloadMediaMessage(m);
                if (buf && buf.length > 0) {
                    pendingImageBuf = buf;
                    const imgMime = m.message.imageMessage.mimetype || 'image/jpeg';
                    pendingImageExt = imgMime.split('/')[1]?.split(';')[0] || 'jpg';
                }
            } catch {}
        }
    }

    async function listRepos(username) {
        try {
            const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: ghHeaders });
            if (!res.ok) return 'something went wrong fetching repos 😒';
            const repos = await res.json();
            if (!repos.length) return `${username} has zero repos. bleak.`;
            return repos.map(r => `- ${r.name} (${r.private ? '🔒 private' : '🌐 public'}, ⭐${r.stargazers_count})`).join('\n');
        } catch { return 'ran into an error getting repos 😒'; }
    }

    async function createRepo(name, description, isPrivate) {
        try {
            const res = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: ghHeaders,
                body: JSON.stringify({ name, description: description || '', private: !!isPrivate, auto_init: true })
            });
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'failed'); }
            const r = await res.json();
            setLastRepo(m.sender, r.name);
            return `created "${r.name}" (${r.private ? '🔒 private' : '🌐 public'}) — done 🤦🏻\n\n${r.html_url}`;
        } catch (e) { return `couldn't create repo 😒 — ${e.message}`; }
    }

    async function deleteRepo(owner, name) {
        if (!name || name === '*' || name === 'all' || /^(all|every|each|\*)$/i.test(name)) {
            return "nope. not deleting all your repos. pick one specific name, bruh 💀";
        }
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { method: 'DELETE', headers: ghHeaders });
            if (res.status === 204) {
                if (getLastRepo(m.sender) === name) repoStateMap.delete(m.sender);
                return `"${name}" is gone forever 💀 done.`;
            }
            const errBody = await res.json().catch(() => ({}));
            if (res.status === 404) return `"${name}" doesn't exist or was already deleted 😒`;
            return `deletion failed — ${errBody.message || 'check the repo name'} 😒`;
        } catch { return 'ran into an error, deletion might not have worked 😒'; }
    }

    async function renameRepo(owner, oldName, newName) {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${oldName}`, {
                method: 'PATCH', headers: ghHeaders,
                body: JSON.stringify({ name: newName })
            });
            if (!res.ok) return `rename failed 😒 check names`;
            const r = await res.json();
            setLastRepo(m.sender, newName);
            return `renamed "${oldName}" → "${newName}" — that's done ✅\n\n${r.html_url}`;
        } catch { return 'ran into an error renaming 😒'; }
    }

    async function uploadFile(owner, repo, filePath, content, message) {
        try {
            const encoded = Buffer.from(content).toString('base64');
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                method: 'PUT', headers: ghHeaders,
                body: JSON.stringify({ message: message || 'Upload via ToxicAgent', content: encoded })
            });
            if (!res.ok) return 'upload failed 😒 check the repo and path';
            const r = await res.json();
            setLastRepo(m.sender, repo);
            return `uploaded "${filePath}" to ${repo} — complete ✅\n\n${r.content?.html_url || `https://github.com/${owner}/${repo}/blob/main/${filePath}`}`;
        } catch { return 'ran into an error uploading 😒'; }
    }

    async function uploadImageToGithub(owner, repo, imgBuf, ext) {
        const ts = Date.now();
        const filePath = `uploads/img_${ts}.${ext || 'jpg'}`;
        const encoded = imgBuf.toString('base64');
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: 'PUT', headers: ghHeaders,
            body: JSON.stringify({ message: 'Upload image via ToxicAgent', content: encoded })
        });
        if (!res.ok) throw new Error('upload failed');
        const r = await res.json();
        setLastRepo(m.sender, repo);
        return r.content?.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
    }

    async function readFile(owner, repo, filePath) {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, { headers: ghHeaders });
            if (!res.ok) return `couldn't find that file 😒`;
            const data = await res.json();
            if (Array.isArray(data)) return `Contents of ${filePath}:\n` + data.map(f => `- ${f.name} (${f.type})`).join('\n');
            if (!data.content) return 'file found but no readable content';
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            setLastRepo(m.sender, repo);
            return content.slice(0, 3000) + (content.length > 3000 ? '\n...(truncated)' : '');
        } catch { return 'ran into an error reading that file 😒'; }
    }

    async function getAuthUser() {
        try {
            const res = await fetch('https://api.github.com/user', { headers: ghHeaders });
            if (!res.ok) return 'something went wrong 😒';
            const u = await res.json();
            return `${u.login} | ${u.name || 'no name set'} | ${u.public_repos} public repos | ${u.followers} followers\n\nhttps://github.com/${u.login}`;
        } catch { return 'ran into an error 😒'; }
    }

    async function getRepoInfo(owner, repo) {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders });
            if (!res.ok) return `repo "${repo}" not found or no access 😒`;
            const r = await res.json();
            setLastRepo(m.sender, r.name);
            return `${r.full_name} — ${r.description || 'no description'}\n⭐ ${r.stargazers_count} | 🍴 ${r.forks_count} | ${r.private ? '🔒 private' : '🌐 public'}\nLang: ${r.language || 'unknown'}\n\n${r.html_url}`;
        } catch { return 'ran into an error 😒'; }
    }

    async function listBranches(owner, repo) {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers: ghHeaders });
            if (!res.ok) return 'something went wrong 😒';
            const branches = await res.json();
            setLastRepo(m.sender, repo);
            return branches.map(b => `- ${b.name}`).join('\n') || 'no branches found';
        } catch { return 'ran into an error 😒'; }
    }

    async function createIssue(owner, repo, title, bodyText) {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
                method: 'POST', headers: ghHeaders,
                body: JSON.stringify({ title, body: bodyText || '' })
            });
            if (!res.ok) return 'issue creation failed 😒';
            const r = await res.json();
            setLastRepo(m.sender, repo);
            return `issue created in "${repo}" — done 😤\n\n${r.html_url}`;
        } catch { return 'ran into an error creating the issue 😒'; }
    }

    async function starRepo(owner, repo) {
        try {
            const res = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
                method: 'PUT', headers: { ...ghHeaders, 'Content-Length': '0' }
            });
            if (res.status === 204) {
                setLastRepo(m.sender, repo);
                return `starred "${repo}" ⭐ done, you're welcome.\n\nhttps://github.com/${owner}/${repo}`;
            }
            return 'star failed 😒 check the repo name';
        } catch { return 'ran into an error starring 😒'; }
    }

    async function executeTool(toolName, args) {
        if (toolName === 'list_repos') return listRepos(args.username || GH_USERNAME);
        if (toolName === 'create_repo') return createRepo(args.name, args.description, args.is_private || args.private);
        if (toolName === 'delete_repo') {
            const repoName = args.name;
            if (!repoName || /^(all|every|each|\*)$/i.test(repoName)) return "not deleting ALL repos. name a specific one 💀";
            return deleteRepo(args.owner || GH_USERNAME, repoName);
        }
        if (toolName === 'rename_repo') return renameRepo(args.owner || GH_USERNAME, args.old_name, args.new_name);
        if (toolName === 'upload_file') return uploadFile(args.owner || GH_USERNAME, args.repo, args.file_path, args.content, args.message);
        if (toolName === 'upload_image_to_github') {
            if (!pendingImageBuf) return 'no image found. quote or send an image first.';
            try {
                const url = await uploadImageToGithub(args.owner || GH_USERNAME, args.repo || 'Toxic-v2', pendingImageBuf, pendingImageExt);
                imageUploadedUrl = url;
                return `image uploaded 📎 link: ${url}`;
            } catch { return 'image upload ran into an error 😒'; }
        }
        if (toolName === 'read_file') return readFile(args.owner || GH_USERNAME, args.repo, args.file_path || args.path);
        if (toolName === 'get_auth_user') return getAuthUser();
        if (toolName === 'get_repo_info') return getRepoInfo(args.owner || GH_USERNAME, args.repo);
        if (toolName === 'list_branches') return listBranches(args.owner || GH_USERNAME, args.repo);
        if (toolName === 'create_issue') return createIssue(args.owner || GH_USERNAME, args.repo, args.title, args.body);
        if (toolName === 'star_repo') return starRepo(args.owner || GH_USERNAME, args.repo);
        return 'unknown action 😒';
    }

    const tools = [
        { type: 'function', function: { name: 'list_repos', description: 'List GitHub repositories for a user', parameters: { type: 'object', properties: { username: { type: 'string', description: 'GitHub username, default xhclintohn' } }, required: ['username'] } } },
        { type: 'function', function: { name: 'create_repo', description: 'Create a new GitHub repository', parameters: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, is_private: { type: 'boolean' } }, required: ['name'] } } },
        { type: 'function', function: { name: 'delete_repo', description: 'Permanently delete a single named GitHub repository. NEVER call this with "all" or without a specific repo name.', parameters: { type: 'object', properties: { owner: { type: 'string', description: 'Owner, default xhclintohn' }, name: { type: 'string', description: 'Exact repo name to delete. Must be a specific name, never "all" or wildcard.' } }, required: ['owner', 'name'] } } },
        { type: 'function', function: { name: 'rename_repo', description: 'Rename a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, old_name: { type: 'string' }, new_name: { type: 'string' } }, required: ['owner', 'old_name', 'new_name'] } } },
        { type: 'function', function: { name: 'upload_file', description: 'Upload or create a text file in a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' }, file_path: { type: 'string' }, content: { type: 'string' }, message: { type: 'string' } }, required: ['owner', 'repo', 'file_path', 'content'] } } },
        { type: 'function', function: { name: 'upload_image_to_github', description: 'Upload the image sent/quoted by the user to a GitHub repository and return the link', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string', description: 'Which repo to upload to, default Toxic-v2' } }, required: ['repo'] } } },
        { type: 'function', function: { name: 'read_file', description: 'Read/check the content of a specific file in a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' }, file_path: { type: 'string', description: 'Path to file like src/index.js or README.md' } }, required: ['owner', 'repo', 'file_path'] } } },
        { type: 'function', function: { name: 'get_auth_user', description: 'Get info about the authenticated GitHub user — name, repo count, followers etc. Do NOT call this to find repo names.', parameters: { type: 'object', properties: {} } } },
        { type: 'function', function: { name: 'get_repo_info', description: 'Get details about a specific GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' } }, required: ['owner', 'repo'] } } },
        { type: 'function', function: { name: 'list_branches', description: 'List branches of a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' } }, required: ['owner', 'repo'] } } },
        { type: 'function', function: { name: 'create_issue', description: 'Create an issue in a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' } }, required: ['owner', 'repo', 'title'] } } },
        { type: 'function', function: { name: 'star_repo', description: 'Star a GitHub repository', parameters: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' } }, required: ['owner', 'repo'] } } }
    ];

    function callGroq(msgs, useTools) {
        const payload = { model: 'llama-3.3-70b-versatile', messages: msgs, max_tokens: 1024 };
        if (useTools) { payload.tools = tools; payload.tool_choice = 'auto'; payload.parallel_tool_calls = false; }
        return fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    try {
        const history = getHistory(m.sender);
        const lastRepo = getLastRepo(m.sender);
        const userContent = body || (pendingImageBuf ? 'upload this image to github' : 'what can you do?');
        const systemPrompt = buildSystemPrompt(lastRepo);

        let turnMessages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userContent }
        ];
        pushHistory(m.sender, 'user', userContent);

        let finalReply = '';
        let toolsRan = [];

        for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
            let res = await callGroq(turnMessages, true);

            if (!res.ok) {
                  const err = await res.json().catch(() => ({}));
                  const _errCode = err?.error?.code || '';
                  const _errMsg = err?.error?.message || '';
                  console.log('❌ [TOXICAI GROQ]:', _errCode, _errMsg.substring(0, 120));
                  if (_errCode === 'tool_use_failed' && err?.error?.failed_generation) {
                      const fg = err.error.failed_generation;
                      const fm = fg.match(/<function=([^=<>\s]+?)=?(\{[\s\S]*?\})<\/function>/);
                      if (fm) {
                          try {
                              const args = JSON.parse(fm[2]);
                              const toolResult = await executeTool(fm[1].trim(), args);
                              toolsRan.push(toolResult);
                              turnMessages.push({ role: 'assistant', content: `[executed ${fm[1]}]` });
                              turnMessages.push({ role: 'user', content: `Tool result: ${toolResult}\nNow give your final reply.` });
                              continue;
                          } catch {}
                      }
                  }
                  if (turn === 0) {
                      const _fb = await callGroq([...turnMessages], false).catch(() => null);
                      if (_fb?.ok) {
                          const _fbData = await _fb.json().catch(() => ({}));
                          const _fbContent = _fbData.choices?.[0]?.message?.content?.trim() || '';
                          if (_fbContent) { finalReply = stripEmbeddedFuncTags(_fbContent); break; }
                      }
                  }
                  finalReply = 'something went wrong 😒 try again';
                  break;
              }

            const data = await res.json();
            const choice = data.choices?.[0];
            if (!choice) break;

            if (choice.finish_reason === 'tool_calls' && choice.message?.tool_calls?.length) {
                const toolCall = choice.message.tool_calls[0];
                const toolName = toolCall.function.name;
                let args = {};
                try { args = JSON.parse(toolCall.function.arguments || '{}'); } catch {}
                let toolResult = '';
                try { toolResult = await executeTool(toolName, args); toolsRan.push(toolResult); }
                catch { toolResult = 'ran into an error 😒'; }
                turnMessages.push(choice.message);
                turnMessages.push({ role: 'tool', tool_call_id: toolCall.id, content: toolResult });
            } else {
                const rawContent = choice.message?.content?.trim() || '';
                if (rawContent.includes('<function=')) {
                    const embedded = await processEmbeddedCalls(rawContent, executeTool);
                    if (embedded) { toolsRan.push(...embedded.results); finalReply = stripEmbeddedFuncTags(embedded.cleaned); }
                    else finalReply = stripEmbeddedFuncTags(rawContent);
                } else {
                    finalReply = rawContent;
                }
                break;
            }
        }

        if (!finalReply) {
            finalReply = toolsRan.length ? toolsRan.join('\n') : 'something went sideways 🤦';
        }

        if (finalReply && toolsRan.length) {
            for (const _tr of toolsRan) {
                const _ghM = String(_tr).match(/https:\/\/github\.com\/\S+/);
                if (_ghM && !finalReply.includes(_ghM[0])) finalReply += `\n\n${_ghM[0]}`;
            }
        }

        pushHistory(m.sender, 'assistant', finalReply);
        await client.sendMessage(m.chat, { text: boxWrap(finalReply, 'TOXICAGENT') }, { quoted: fq });
        if (imageUploadedUrl) {
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ IMAGE UPLOADED ≪───\n├\n├ 🔗 ${imageUploadedUrl}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
        try { await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); } catch {}

    } catch (err) {
        try { await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); } catch {}
        await client.sendMessage(m.chat, { text: boxWrap('ran into an error, wtf 🙄 try again.', 'TOXICAGENT') }, { quoted: fq });
    }
};

const afkMap = new Map();

const afkFeature = async (client, m) => {
    if (!m || !m.sender) return;
    const senderNum = m.sender.split('@')[0].split(':')[0];

    if (afkMap.has(senderNum)) {
        const { reason, time } = afkMap.get(senderNum);
        const mins = Math.floor((Date.now() - time) / 60000);
        afkMap.delete(senderNum);
        try {
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ BACK ONLINE ≪───\n├ @${senderNum} finally crawled back.\n├ Was AFK for ${mins} min${mins !== 1 ? 's' : ''}.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender]
            });
        } catch {}
        return;
    }

    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
                     m.message?.imageMessage?.contextInfo?.mentionedJid ||
                     m.message?.videoMessage?.contextInfo?.mentionedJid || [];
    for (const jid of mentions) {
        const num = jid.split('@')[0].split(':')[0];
        if (afkMap.has(num)) {
            const { reason, time } = afkMap.get(num);
            const mins = Math.floor((Date.now() - time) / 60000);
            try {
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ AFK ALERT ≪───\n├ @${num} is currently ghosting everyone.\n├ Reason: ${reason || 'none given 💀'}\n├ Since: ${mins} min${mins !== 1 ? 's' : ''} ago\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                    mentions: [jid, m.sender]
                });
            } catch {}
        }
    }
};

module.exports.setAfk = (num, reason) => afkMap.set(num, { reason, time: Date.now() });
module.exports.removeAfk = (num) => afkMap.delete(num);
module.exports.isAfk = (num) => afkMap.has(num);

const { getCachedSettingsSync } = require('../lib/settingsCache');

  const _EMOJIS = ['❤️','🔥','😂','😍','👏','🥰','💯','😭','🤣','🙏','👌','💪','🤩','😎','🥳','✨','💀','🤯','😤','💅','👀','🎉','😈','🤫','🫶'];

  async function autolike(client, message) {
    try {
      const { key, message: msg } = message;
      const remoteJid = key.remoteJid;
      if (remoteJid !== 'status@broadcast' || !key.id || msg?.protocolMessage) return;
      const settings = getCachedSettingsSync() || {};
      const configuredEmoji = settings.autolikeemoji;
      let emoji;
      if (!configuredEmoji || configuredEmoji === 'random') {
        emoji = _EMOJIS[Math.floor(Math.random() * _EMOJIS.length)];
      } else {
        emoji = configuredEmoji;
      }
      await client.sendMessage(remoteJid, { react: { key, text: emoji } });
      await client.readMessages([key]);
    } catch {}
  }
module.exports = { status_saver, gcPresence, antitag, antilink, antistatusmention, autoai, toxicaiFeature, afkFeature, autolike };