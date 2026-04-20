// Cmds/Utils.js — 15 commands
  'use strict';

  const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const { getFakeQuoted } = require('../lib/fakeQuoted');
const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const QRCode = require('qrcode');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fsPromises = require('fs').promises;
const os = require('os');
const FormData = require('form-data');
const { queue } = require('async');
dreaded({
  pattern: "base64",
  alias: ["tobase64","b64encode","encode64"],
  desc: "Encodes text to Base64. Reply to text or provide it after the command.",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        let input = (text || '').trim();
        if (!input && m.quoted) {
            input = (
                m.quoted.text || m.quoted.body ||
                m.quoted.message?.conversation ||
                m.quoted.message?.extendedTextMessage?.text || ''
            ).trim();
        }

        if (!input) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ Bᴀsᴇ64 Eɴᴄᴏᴅᴇ ≪───\n├ \n├ You gave me nothing. Brilliant.\n├ Usage: .base64 Hello World\n├        .tobase64 [reply to text]\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const encoded = Buffer.from(input, 'utf8').toString('base64');
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        const resultText = `╭───(    TOXIC-MD    )───\n├───≫ Bᴀsᴇ64 Eɴᴄᴏᴅᴇ ≪───\n├ \n├ 📥 Input:\n├ ${input.slice(0, 80)}${input.length > 80 ? '...' : ''}\n├ \n├ 📤 Encoded:\n├ \n${encoded}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                interactiveMessage: {
                    body: { text: resultText },
                    footer: { text: '' },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Encoded', copy_code: encoded })
                        }],
                        messageParamsJson: ''
                    }
                }
            }), { quoted: fq, userJid: client.user.id });
            await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        } catch {
            await m.reply(resultText);
        }
    });

// ── base64decode
dreaded({
  pattern: "base64decode",
  alias: ["unbase64","debase64","frombase64","decode64","b64decode"],
  desc: "Decodes Base64 text back to plain text. Reply to a message or provide base64 after the command.",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        let input = (text || '').trim();
        if (!input && m.quoted) {
            input = (
                m.quoted.text || m.quoted.body ||
                m.quoted.message?.conversation ||
                m.quoted.message?.extendedTextMessage?.text || ''
            ).trim();
        }

        if (!input) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ Bᴀsᴇ64 Dᴇᴄᴏᴅᴇ ≪───\n├ \n├ You gave me nothing. Classic.\n├ Usage: .unbase64 SGVsbG8gV29ybGQ=\n├        .debase64 [reply to base64]\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        let decoded = '';
        try {
            const buf = Buffer.from(input.replace(/\s/g, ''), 'base64');
            decoded = buf.toString('utf8');
            if (!decoded || !decoded.trim()) throw new Error('empty result');
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ Bᴀsᴇ64 Dᴇᴄᴏᴅᴇ ≪───\n├ \n├ That\'s not valid Base64.\n├ Learn what Base64 is first.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        const resultText = `╭───(    TOXIC-MD    )───\n├───≫ Bᴀsᴇ64 Dᴇᴄᴏᴅᴇ ≪───\n├ \n├ 📥 Input (Base64):\n├ ${input.slice(0, 60)}${input.length > 60 ? '...' : ''}\n├ \n├ 📤 Decoded:\n├ \n${decoded}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                interactiveMessage: {
                    body: { text: resultText },
                    footer: { text: '' },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Decoded', copy_code: decoded })
                        }],
                        messageParamsJson: ''
                    }
                }
            }), { quoted: fq, userJid: client.user.id });
            await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        } catch {
            await m.reply(resultText);
        }
    });

// ── bratvid
dreaded({
  pattern: "bratvid",
  alias: ["bratvideo","bratanimated"],
  desc: "Makes animated brat stickers for your attention-seeking ass",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, prefix, packname, author } = context;
        const fq = getFakeQuoted(m);

        const text = m.body.replace(new RegExp(`^${prefix}(bratvid|bratvideo|bratanimated)\\s*`, 'i'), '').trim();

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ BRAT VID ≪───\n├ \n├ What am i, a mind reader?\n├ @' + m.sender.split('@')[0] + '! you forgot the text, genius.\n├ Example: ' + prefix + 'bratvid i\'m a dumbass\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧', { mentions: [m.sender] });
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const apiUrl = `https://api.nexray.web.id/maker/bratvid?text=${encodeURIComponent(text)}`;
            
            const videoResponse = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!videoResponse.data || videoResponse.data.length < 1000) {
                throw new Error('API returned empty video');
            }

            const tempFile = path.join(__dirname, `temp-bratvid-${Date.now()}.mp4`);
            await fs.writeFile(tempFile, videoResponse.data);

            const sticker = new Sticker(tempFile, {
                pack: packname || 'p',
                author: author || '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧 [dev]',
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: 'transparent'
            });

            const stickerBuffer = await sticker.toBuffer();

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: fq });

            await fs.unlink(tempFile).catch(() => {});

        } catch (error) {
            console.error('Brat video command error:', error);

            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = 'your brat video failed. shocking.';

            if (error.message.includes('status')) {
                errorMessage = 'API died from cringe. Try again when your text is less stupid.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Your internet is as weak as your personality.';
            } else if (error.message.includes('empty')) {
                errorMessage = 'API returned empty video. Your text was too cringe even for the API.';
            } else {
                errorMessage = 'Failed to process. Try again later.';
            }

            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Brat video generation failed.\n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── catfact
dreaded({
  pattern: "catfact",
  category: "Utils",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
        const { data } = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
        const fact = data?.fact;
        if (!fact) throw new Error('no fact');
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ CAT FACT ≪───\n├ \n├ ${fact}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    } catch {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`╭───(    TOXIC-MD    )───\n├ API down. Even the cats went offline.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── fact
dreaded({
  pattern: "fact",
  category: "Utils",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
        const { data } = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
        const fact = data?.text;
        if (!fact) throw new Error('no fact');
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ RANDOM FACT ≪───\n├ \n├ ${fact}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    } catch {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`╭───(    TOXIC-MD    )───\n├ Couldn't fetch a fact. The universe said no.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── inspectweb
dreaded({
  pattern: "inspectweb",
  category: "Utils",
  filename: __filename
}, async (context) => {
    const { m, text } = context;
    const fq = getFakeQuoted(m);

    if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Provide a valid web link to inspect, dimwit.\n├ Bot will crawl HTML, CSS, JS, and media.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

    if (!/^https?:\/\//i.test(text)) {
        return m.reply("╭───(    TOXIC-MD    )───\n├ URL must start with http:// or https://, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }

    try {
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);

        const mediaFiles = [];
        $('img[src], video[src], audio[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                mediaFiles.push(src);
            }
        });

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            let href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ HTML CONTENT ≪───\n├ \n${html}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ CSS FILE ≪───\n├ \n${cssContent}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        } else {
            await m.reply("╭───(    TOXIC-MD    )───\n├ No external CSS files found.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JS FILE ≪───\n├ \n${jsContent}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        } else {
            await m.reply("╭───(    TOXIC-MD    )───\n├ No external JavaScript files found.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        if (mediaFiles.length > 0) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ MEDIA FILES ≪───\n├ \n${mediaFiles.map(f => `├ ${f}`).join('\n')}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } else {
            await m.reply("╭───(    TOXIC-MD    )───\n├ No media files found. Empty site, empty soul.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

    } catch (error) {
        console.error(error);
        return m.reply("╭───(    TOXIC-MD    )───\n├ Error fetching website content. Site's probably trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }
});

// ── npm
dreaded({
  pattern: "npm",
  alias: ["npminfo","npmpackage","npmlookup"],
  desc: "Look up an npm package",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const pkg = (text || '').trim();
        if (!pkg) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ NPM ≪───\n├\n├ Usage: .npm express\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, { timeout: 8000 });
            const d = res.data;
            const latest = d['dist-tags']?.latest || '?';
            const desc = d.description || 'No description';
            const author = (typeof d.author === 'object' ? d.author?.name : d.author) || 'Unknown';
            const license = d.license || '?';
            const homepage = d.homepage || d.repository?.url || d['repository']?.url || '?';
            const weekly = d.downloads?.weekly || '?';
            const created = d.time?.created ? new Date(d.time.created).toLocaleDateString() : '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ NPM: ${d.name} ≪───\n├\n├ 📦 Version: ${latest}\n├ 📝 Desc: ${desc}\n├ 👤 Author: ${author}\n├ 📄 License: ${license}\n├ 📅 Created: ${created}\n├ 🔗 ${homepage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ NPM ≪───\n├\n├ Package "${pkg}" not found. Made it up?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
        }
    });

// ── password
dreaded({
  pattern: "password",
  alias: ["genpass","passgen","strongpass"],
  desc: "Generate a strong random password",
  category: "Utils",
  filename: __filename
}, async (context) => {
          const { client, m, text } = context;
          const fq = getFakeQuoted(m);
          const len = Math.min(Math.max(parseInt(text || '16') || 16, 8), 64);
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
          let pass = '';
          for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
          const resultText = `╭───(    TOXIC-MD    )───\n├───≫ Pᴀssᴡᴏʀᴅ Gᴇɴ ≪───\n├\n├ 🔐 Length: ${len} chars\n├\n├ ${pass}\n├\n├ Save it. I won't regenerate it for you.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
          try {
              const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                  interactiveMessage: {
                      body: { text: resultText },
                      footer: { text: '' },
                      nativeFlowMessage: {
                          buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Password', copy_code: pass }) }],
                          messageParamsJson: ''
                      }
                  }
              }), { quoted: fq, userJid: client.user.id });
              await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
          } catch {
              await client.sendMessage(m.chat, { text: resultText }, { quoted: fq });
          }
      });

// ── qr
dreaded({
  pattern: "qr",
  desc: "Generate a QR code from text or link",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ QR CODE ≪───\n├ \n├ Usage: ${prefix}qr <text or link>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const dataUrl = await QRCode.toDataURL(text.slice(0, 2000), { scale: 8, errorCorrectionLevel: 'H' });
            const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
            const imgBuffer = Buffer.from(base64, 'base64');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, {
                image: imgBuffer,
                caption: `╭───(    TOXIC-MD    )───\n├───≫ QR CODE ≪───\n├ Scan with any QR reader.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply('Failed to generate QR code.');
        }
    });

// ── screenshot
dreaded({
  pattern: "screenshot",
  category: "Utils",
  filename: __filename
}, async (context) => {

const { client, m, text, botname } = context;
const fq = getFakeQuoted(m);



try {
let cap = `╭───(    TOXIC-MD    )───\n├───≫ SCREENSHOT ≪───\n├ \n├ Screenshot by ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`

if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Provide a website link to screenshot, moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧")

const image = `https://image.thum.io/get/fullpage/${text}`

await client.sendMessage(m.chat, { image: { url: image }, caption: cap}, { quoted: fq });


} catch (error) {

m.reply("╭───(    TOXIC-MD    )───\n├ Screenshot failed. Probably your garbage link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧")

}

});

// ── shorten
dreaded({
  pattern: "shorten",
  alias: ["shorturl","tinyurl","shrinkurl"],
  desc: "Shorten a URL",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const url = (text || '').trim();
        if (!url || !url.startsWith('http')) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪───\n├\n├ Give me a valid URL to shorten.\n├ Usage: .shorten https://example.com/very/long/url\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 8000 });
            const short = res.data;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪───\n├\n├ 🔗 Original: ${url.slice(0,60)}${url.length>60?'...':''}\n├ ✅ Shortened: ${short}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪───\n├\n├ Couldn\'t shorten that. It stays long.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── stt
dreaded({
  pattern: "stt",
  alias: ["speechtotext","transcribe","voicetotext"],
  desc: "Transcribes voice notes and audio messages to text",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        let GROQ_API_KEY = '';
        try { GROQ_API_KEY = require('../keys').GROQ_API_KEY || ''; } catch {}
        if (!GROQ_API_KEY) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STT ≪───\n├ \n├ GROQ_API_KEY not set in keys.js\n├ Add it to enable transcription.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');

        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const directAudio = m.message?.audioMessage;
        const quotedAudio = quoted?.audioMessage;
        const audioMsg = directAudio || quotedAudio;

        if (!audioMsg) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STT ≪───\n├ \n├ Reply to a voice note or audio message,\n├ you muppet. I\'m not magic — I can\'t\n├ transcribe thin air.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        await client.sendMessage(m.chat, { react: { text: '👂', key: m.key } });

        const tmpFile = path.join(os.tmpdir(), `stt_${Date.now()}.ogg`);

        try {
            const stream = await downloadContentFromMessage(audioMsg, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            await fsPromises.writeFile(tmpFile, buffer);

            const form = new FormData();
            form.append('file', fs.createReadStream(tmpFile), { filename: 'audio.ogg', contentType: 'audio/ogg' });
            form.append('model', 'whisper-large-v3');
            form.append('response_format', 'json');

            const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
            });

            const transcribed = response.data?.text?.trim();

            if (!transcribed) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STT ≪───\n├ \n├ I listened to that rubbish and got\n├ absolutely nothing. Either you mumbled\n├ or you sent silence. Both are equally\n├ useless.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ STT ≪───\n├ \n├ 👂 *Transcription:*\n├ \n├ ${transcribed}\n├ \n├ _You're welcome. Now learn to type\n├ next time._\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        } catch (error) {
            console.error('STT error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ STT ≪───\n├ \n├ Transcription crashed. Whisper took one\n├ listen and gave up — honestly can't\n├ blame it.\n├ \n├ Error: ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } finally {
            fsPromises.unlink(tmpFile).catch(() => {});
        }
    });

// ── telesticker
dreaded({
  pattern: "telesticker",
  category: "Utils",
  filename: __filename
}, async (context) => {
    const { client, m, text, prefix, packname, author } = context;
    const fq = getFakeQuoted(m);

    try {
        if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Tᴇʟᴇɢʀᴀᴍ Sᴛɪᴄᴋᴇʀ ≪───\n├ \n├ Give me a Telegram sticker pack name or link!\n├ \n├ Example: ${prefix}telesticker itzel39\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        let packName = text;
        let apiUrl;

        if (text.includes("t.me/addstickers/")) {
            const match = text.match(/t\.me\/addstickers\/([a-zA-Z0-9_]+)/);
            if (match) packName = match[1];
            apiUrl = text;
        } else {
            apiUrl = `https://t.me/addstickers/${packName}`;
        }

        const encodedUrl = encodeURIComponent(apiUrl);
        const apiEndpoint = `https://api.nexray.web.id/tools/telegram-sticker?url=${encodedUrl}`;

        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();

        if (!data?.status || !data?.result?.sticker || data.result.sticker.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Tᴇʟᴇɢʀᴀᴍ Sᴛɪᴄᴋᴇʀ ≪───\n├ \n├ That sticker pack doesn't exist or\n├ your internet is worse than your face.\n├ \n├ Pack: ${packName}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const stickers = data.result.sticker;
        const packTitle = data.result.title || packName;

        await client.sendMessage(m.chat, { react: { text: '🔃', key: m.key } });

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Tᴇʟᴇɢʀᴀᴍ Sᴛɪᴄᴋᴇʀ ≪───\n├ \n├ Pack: ${packTitle}\n├ Total: ${stickers.length} stickers\n├ Converting to WhatsApp stickers...\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        let sentCount = 0;
        let failedCount = 0;
        let tgsSkipped = 0;

        const stickerQueue = queue(async (task, callback) => {
            try { await task(); } catch (error) { console.error(`Queue error: ${error.message}`); }
            callback();
        }, 1);

        for (let i = 0; i < stickers.length; i++) {
            stickerQueue.push(async () => {
                try {
                    const sticker = stickers[i];
                    const stickerUrl = sticker.url;

                    if (stickerUrl.endsWith('.tgs')) { tgsSkipped++; return; }

                    const isVideo = stickerUrl.endsWith('.webm');
                    const ext = isVideo ? 'webm' : 'webp';
                    const tempFile = path.join('/tmp', `telesticker-${Date.now()}-${i}.${ext}`);

                    const stickerResponse = await fetch(stickerUrl);
                    if (!stickerResponse.ok) throw new Error(`Download failed: ${stickerResponse.status}`);

                    const stickerBuffer = Buffer.from(await stickerResponse.arrayBuffer());
                    await fs.writeFile(tempFile, stickerBuffer);

                    const waSticker = new Sticker(tempFile, {
                        pack: packname || 'Telegram Sticker',
                        author: author || '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
                        type: isVideo ? StickerTypes.CROPPED : StickerTypes.FULL,
                        categories: ['🎨', '🎭'],
                        quality: 50,
                        background: 'transparent',
                        emojis: sticker.emoji ? [sticker.emoji] : ['🤔']
                    });

                    const stickerBufferFinal = await waSticker.toBuffer();
                    await client.sendMessage(m.chat, { sticker: stickerBufferFinal }, { quoted: fq });
                    sentCount++;

                    await fs.unlink(tempFile).catch(() => {});

                    if ((i + 1) % 3 === 0) await new Promise(r => setTimeout(r, 1000));

                } catch { failedCount++; }
            });
        }

        await stickerQueue.drain();

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        let extraNote = tgsSkipped > 0 ? `\n├ Skipped ${tgsSkipped} .tgs (not supported)` : '';

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Tᴇʟᴇɢʀᴀᴍ Sᴛɪᴄᴋᴇʀ ≪───\n├ \n├ Success: ${sentCount} stickers\n├ Failed: ${failedCount} stickers${extraNote}\n├ Pack: ${packTitle}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

    } catch (error) {
        console.error("Telegram sticker error:", error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Something broke!\n├ Either the API is dead or\n├ your sticker pack name is trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞ᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── shorten
dreaded({
  pattern: "shorten",
  alias: ["shortlink","tinyurl","short"],
  desc: "Shorten URLs with TinyURL",
  category: "Utils",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        const formatStylishReply = (message) => {
            return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
        };

        if (!text) {
            return client.sendMessage(m.chat, {
                text: formatStylishReply("You forgot the URL, genius. 🤦🏻\nExample: .shorten https://github.com/xhclintohn/Toxic-MD")
            }, { quoted: fq });
        }

        let url = text.trim();
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const encodedUrl = encodeURIComponent(url);
            const apiUrl = `https://api.nekolabs.web.id/tools/shortlink/tinyurl?url=${encodedUrl}`;

            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });

            if (!response.data?.success || !response.data?.result) {
                throw new Error('API returned invalid response');
            }

            const shortUrl = response.data.result;
            const responseTime = response.data.responseTime || 'N/A';

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(m.chat, {
                interactiveMessage: {
                    header: `✅ URL SHORTENED SUCCESSFULLY`,
                    title: `Original URL:\n${url}\n\nShortened URL:\n${shortUrl}\n\nResponse Time: ${responseTime}`,
                    buttons: [
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📋 Copy Short URL",
                                id: "copy_shorturl",
                                copy_code: shortUrl
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🌐 Open in Browser",
                                id: "open_url",
                                copy_code: shortUrl
                            })
                        }
                    ]
                }
            }, { quoted: fq });

        } catch (error) {
            console.error('Shorten error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = "Failed to shorten URL, your link is probably trash. ";
            
            if (error.response?.status === 400) {
                errorMessage += "Invalid URL format. 🔗";
            } else if (error.response?.status === 429) {
                errorMessage += "Rate limit exceeded. Try again later. ⏳";
            } else if (error.message.includes('timeout')) {
                errorMessage += "API timeout, your link is too heavy. ⏱️";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage += "Can't reach API server. 🌐";
            } else if (error.message.includes('Invalid response')) {
                errorMessage += "API returned garbage. 🗑️";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await client.sendMessage(m.chat, {
                text: formatStylishReply(errorMessage)
            }, { quoted: fq });
        }
    });

// ── wa-channel
dreaded({
  pattern: "wa-channel",
  alias: ["channel","channelstalk"],
  category: "Utils",
  filename: __filename
}, async ({ client, m, text }) => {
      try {
          if (!text) return m.reply('╭───(    TOXIC-MD    )───\n├ Provide a WhatsApp channel link or ID.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
          const channelId = text.trim().replace(/https?:\/\/whatsapp\.com\/channel\//i, '');
          await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ WA CHANNEL ≪───\n├ \n├ Channel ID: ${channelId}\n├ Link: https://whatsapp.com/channel/${channelId}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      } catch (err) {
          console.error('wa-channel error:', err);
          await m.reply('╭───(    TOXIC-MD    )───\n├ Failed to process channel info.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      }
  });
  