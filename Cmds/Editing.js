// Cmds/Editing.js — 27 commands
  'use strict';

  const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs').promises;
const path = require('path');
const { getFakeQuoted } = require('../lib/fakeQuoted');
const { uploadToUrl } = require('../lib/toUrl');
  const { makeCanvas } = require('../lib/toxicApi');
  const { getSettings } = require('../Database/config');

  const CANVAS_TYPES = [
      'spotify', 'youtube', 'google', 'tiktok', 'duckduckgo', 'brave', 'applemusic',
      'soundcloud', 'pinterest', 'playstore', 'happymod', 'apkpure', 'unsplash',
      'wallpaper', 'wattpad', 'weather', 'sticker', 'lyrics', 'shazam', 'web', 'image',
  ];
let canvacord = null; try { canvacord = require("canvacord"); } catch {}
  const { makePhotoEdit } = require('../lib/toxicApi');
const { exec } = require('child_process');
const { tmpdir } = require('os');
  const { makeRC } = require('../lib/toxicApi');
const { uploadTempUrl } = require('../lib/toUrl');
const { queue } = require('async');

const commandQueue = queue(async (task, callback) => {
    try {
        await task.run(task.context);
    } catch (error) {
        console.error(`Sticker error: ${error.message}`);
    }
    callback();
}, 1);
const FormData = require('form-data');

async function uploadImage(buffer) {
    const tempFilePath = path.join(__dirname, `temp_${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, buffer);

    const form = new FormData();
    form.append('files[]', fs.createReadStream(tempFilePath));

    try {
        const response = await axios.post('https://qu.ax/upload.php', form, {
            headers: form.getHeaders(),
        });

        const link = response.data.files[0].url;
        if (!link) throw new Error('No URL returned');

        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return { url: link };
    } catch (error) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        throw error;
    }
}

async function uploadToCatbox(buffer) {
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: 'image.png' });


    if (!response.data || !response.data.includes('catbox')) {
        throw new Error('UPLOAD FAILED');
    }

    return response.data;
}


const fetch = require("node-fetch");

function emojiToTwemojiUrl(emoji) {
    const codepoints = [...emoji]
        .map(c => c.codePointAt(0).toString(16).toLowerCase())
        .filter(cp => cp !== 'fe0f');
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codepoints.join('-')}.png`;
}
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')




  // ── brat
dreaded({
  pattern: "brat",
  alias: ["bratsticker","brattext"],
  desc: "Makes brat stickers for your attention-seeking ass",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, prefix, packname, author } = context;
        const fq = getFakeQuoted(m);

        const text = m.body.replace(new RegExp(`^${prefix}(brat|bratsticker|brattext)\\s*`, 'i'), '').trim();

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ BRAT ≪───\n├ \n├ What am i, a mind reader?\n├ @' + m.sender.split('@')[0] + '! you forgot the text, genius.\n├ Example: ' + prefix + 'brat i\'m a dumbass\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧', { mentions: [m.sender] });
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const apiUrl = `https://api.nexray.web.id/maker/brat?text=${encodeURIComponent(text)}`;
            
            const imageResponse = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/webp,image/png,image/*,*/*',
                    'Referer': 'https://api.nexray.web.id/',
                    'Origin': 'https://api.nexray.web.id'
                }
            });

            if (!imageResponse.data || imageResponse.data.length < 1000) {
                throw new Error('API returned empty image');
            }

            const tempFile = path.join(__dirname, `temp-brat-${Date.now()}.png`);
            await fs.writeFile(tempFile, imageResponse.data);

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
            console.error('Brat command error:', error);

            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = 'your brat text failed. shocking.';

            if (error.message.includes('status')) {
                errorMessage = 'API died from cringe. Try again when your text is less stupid.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Your internet is as weak as your personality.';
            } else if (error.message.includes('empty')) {
                errorMessage = 'API returned empty image. Your text was too cringe even for the API.';
            } else {
                errorMessage = 'Failed to process. Try again later.';
            }

            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Brat text generation failed.\n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── canvas
dreaded({
  pattern: "canvas",
  alias: ["canvascard","spotifycard","youtubecard","tiktokcard"],
  desc: "Generate themed canvas cards from an image",
  category: "Editing",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const args = (m.text || '').replace(/^S+s*/, '').trim();

          const typesList = CANVAS_TYPES.map(t => `├ • ${t}`).join('\n');
          const usageMsg = `╭───(    TOXIC-MD    )───\n├───≫ Cᴀɴᴠᴀs Cᴀʀᴅ ≪───\n├ \n├ Reply to an image to use this.\n├ \n├ *Usage:*\n├ ${prefix}canvas Title | type | text | watermark\n├ \n├ *Example:*\n├ ${prefix}canvas Blinding Lights | spotify | The Weeknd | TOXIC-MD\n├ ${prefix}canvas My Video | youtube | Subscribe Now | BOT\n├ \n├ *Available Types (${CANVAS_TYPES.length}):*\n${typesList}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          if (!quoted || !/image/.test(mime)) {
              return client.sendMessage(m.chat, { text: usageMsg }, { quoted: fq });
          }

          const parts = args.split('|').map(s => s.trim());
          const title = parts[0] || 'Unknown Title';
          const rawType = (parts[1] || 'spotify').toLowerCase();
          const type = CANVAS_TYPES.includes(rawType) ? rawType : 'spotify';
          const text = parts[2] || '';
          const watermark = parts[3] || 'TOXIC-MD';

          if (parts[1] && !CANVAS_TYPES.includes(rawType)) {
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Invalid type: *${parts[1]}*\n├ \n├ Valid types:\n${typesList}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const cardBuf = await makeCanvas(imgUrl, title, type, text, watermark);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              await client.sendMessage(m.chat, {
                  image: cardBuf,
                  caption: `╭───(    TOXIC-MD    )───\n├───≫ Cᴀɴᴠᴀs Cᴀʀᴅ ≪───\n├ \n├ *Type:* ${type}\n├ *Title:* ${title}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              await client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Canvas generation failed. Try again later.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }
      });

// ── emix
dreaded({
  pattern: "emix",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, botname, text } = context;
        const fq = getFakeQuoted(m);


const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

const axios = require("axios");
const { getFakeQuoted } = require('../lib/fakeQuoted');
if (!text) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ EMIX ≪───\n├ \n├ No emojis provided?\n├ Are you braindead?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')


  const emojis = text.split('+');

  if (emojis.length !== 2) {
    m.reply('╭───(    TOXIC-MD    )───\n├───≫ EMIX ≪───\n├ \n├ Specify the emojis and separate\n├ with \'+\', you dense fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    return;
  }

  const emoji1 = emojis[0].trim();
  const emoji2 = emojis[1].trim();

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
  try {
    const axios = require('axios');
    const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (response.data.status === true) {
    

      let stickerMess = new Sticker(response.data.result, {
        pack: botname,
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
      });
      const stickerBuffer2 = await stickerMess.toBuffer();
      await client.sendMessage(m.chat, { sticker: stickerBuffer2 }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } else {
      m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Unable to create emoji mix.\n├ Your emoji combo is trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ An error occurred while creating\n├ the emoji mix.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }


});

// ── hitler
dreaded({
  pattern: "hitler",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ HITLER ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.hitler(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.hitler(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── imgedit
dreaded({
  pattern: "imgedit",
  alias: ["photoedit","aiedit"],
  desc: "AI photo editor",
  category: "Editing",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!quoted || !/image/.test(mime)) {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.key } });
              return client.sendMessage(m.chat, {
                  text: `\u256d\u2500\u2500\u2500(    TOXIC-MD    )\u2500\u2500\u2500\n\u251c\u2500\u2500\u2500\u226b E\u0280\u0280o\u0280 \u226a\u2500\u2500\u2500\n\u251c \n\u251c Reply to an image with a prompt.\n\u251c Example: ${prefix}imgedit make it look like night\n\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2609\n> \u00a9\ud835\udcaf\ud835\udcce\ud835\udccc\ud835\udcc2\ud835\udcc3\ud835\udcc1 \ud835\udcb1\ud835\udcb5 \ud835\udcfd\ud835\udcf5_\ud835\udcec\ud835\udcf5\ud835\udcf2\ud835\udcf7\ud835\udcfc\ud835\udcf8\ud835\udcf7`
              }, { quoted: fq });
          }

          if (!prompt) {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.key } });
              return client.sendMessage(m.chat, {
                  text: `\u256d\u2500\u2500\u2500(    TOXIC-MD    )\u2500\u2500\u2500\n\u251c\u2500\u2500\u2500\u226b E\u0280\u0280o\u0280 \u226a\u2500\u2500\u2500\n\u251c \n\u251c Add a prompt you idiot.\n\u251c Example: ${prefix}imgedit make it look like night\n\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2609\n> \u00a9\ud835\udcaf\ud835\udcce\ud835\udccc\ud835\udcc2\ud835\udcc3\ud835\udcc1 \ud835\udcb1\ud835\udcb5 \ud835\udcfd\ud835\udcf5_\ud835\udcec\ud835\udcf5\ud835\udcf2\ud835\udcf7\ud835\udcfc\ud835\udcf8\ud835\udcf7`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '\u231b', key: m.key } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const resultUrl = await makePhotoEdit(imgUrl, prompt);

              await client.sendMessage(m.chat, { react: { text: '\u2705', key: m.key } });
              await client.sendMessage(m.chat, {
                  image: { url: resultUrl },
                  caption: `\u256d\u2500\u2500\u2500(    TOXIC-MD    )\u2500\u2500\u2500\n\u251c\u2500\u2500\u2500\u226b AI E\u1d05ɪ\u1d1b \u226a\u2500\u2500\u2500\n\u251c \n\u251c Prompt: ${prompt}\n\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2609\n> \u00a9\ud835\udcaf\ud835\udcce\ud835\udccc\ud835\udcc2\ud835\udcc3\ud835\udcc1 \ud835\udcb1\ud835\udcb5 \ud835\udcfd\ud835\udcf5_\ud835\udcec\ud835\udcf5\ud835\udcf2\ud835\udcf7\ud835\udcfc\ud835\udcf8\ud835\udcf7`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.key } });
              await client.sendMessage(m.chat, {
                  text: `\u256d\u2500\u2500\u2500(    TOXIC-MD    )\u2500\u2500\u2500\n\u251c\u2500\u2500\u2500\u226b F\u1d00ɪ\u029f\u1d07\u1d05 \u226a\u2500\u2500\u2500\n\u251c \n\u251c AI edit failed. Try again.\n\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2609\n> \u00a9\ud835\udcaf\ud835\udcce\ud835\udccc\ud835\udcc2\ud835\udcc3\ud835\udcc1 \ud835\udcb1\ud835\udcb5 \ud835\udcfd\ud835\udcf5_\ud835\udcec\ud835\udcf5\ud835\udcf2\ud835\udcf7\ud835\udcfc\ud835\udcf8\ud835\udcf7`
              }, { quoted: fq });
          }
      });

// ── iqc
dreaded({
  pattern: "iqc",
  alias: ["iphonechat","fakechat","chatmock"],
  desc: "Generates a fake iPhone chat screenshot",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        let text = m.body.replace(new RegExp(`^${prefix}(iqc|iphonechat|fakechat|chatmock)\\s*`, 'i'), '').trim();

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ IQC ≪───\n├ \n├ What am i, a mind reader?\n├ @' + m.sender.split('@')[0] + '! you forgot the text, genius.\n├ Example: ' + prefix + 'iqc Hello Clinton\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧', { mentions: [m.sender] });
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const apiUrl = `https://api.deline.web.id/maker/iqc?text=${encodeURIComponent(text)}&chatTime=${encodeURIComponent(currentTime)}&statusBarTime=${encodeURIComponent(currentTime)}`;
            
            const imageResponse = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
                    'Accept': 'image/webp,image/png,image/*,*/*',
                    'Referer': 'https://api.deline.web.id/'
                }
            });

            if (!imageResponse.data || imageResponse.data.length < 1000) {
                throw new Error('API returned empty image');
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(m.chat, {
                image: imageResponse.data,
                caption: `╭───(    TOXIC-MD    )───\n├───≫ IPHONE CHAT ≪───\n├ \n├ There's your fake chat screenshot.\n├ Now you can pretend someone actually\n├ talks to you.\n├ \n├ Text: "${text}"\n├ Time: ${currentTime}\n├ \n├ _Don't use this to catfish people,\n├ you weirdo._\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });

        } catch (error) {
            console.error('IQC command error:', error);

            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = 'your fake chat failed. shocking.';

            if (error.message.includes('status')) {
                errorMessage = 'API died from cringe. Try again when your text is less stupid.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Your internet is as weak as your personality.';
            } else if (error.message.includes('empty')) {
                errorMessage = 'API returned empty image. Your text was too cringe even for the API.';
            } else {
                errorMessage = 'Failed to process. Try again later.';
            }

            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ iPhone chat generation failed.\n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── logogen
dreaded({
  pattern: "logogen",
  category: "Editing",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);

  if (!text) {
    return m.reply('╭───(    TOXIC-MD    )───\n├───≫ LOGO GEN ≪───\n├ \n├ Enter title, idea, and slogan.\n├ Format: _logogen Title|Idea|Slogan_\n├ \n├ Example: _logogen ToxicTech|AI-Powered\n├ Services|Innovation Meets Simplicity_\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    return m.reply('╭───(    TOXIC-MD    )───\n├───≫ LOGO GEN ≪───\n├ \n├ Incorrect format, are you illiterate?\n├ Use: _logogen Title|Idea|Slogan_\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
  }

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
  try {
    const payload = {
      ai_icon: [333276, 333279],
      height: 300,
      idea,
      industry_index: "N",
      industry_index_id: "",
      pagesize: 4,
      session_id: "",
      slogan,
      title,
      whiteEdge: 80,
      width: 400,
    };

    const { data } = await axios.post("https://www.sologo.ai/v1/api/logo/logo_generate", payload);

    if (!data.data.logoList || data.data.logoList.length === 0) {
      return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to generate logo.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }

    for (const logo of data.data.logoList) {
      await client.sendMessage(m.chat, {
        image: { url: logo.logo_thumb },
        caption: `╭───(    TOXIC-MD    )───\n├───≫ LOGO ≪───\n├ \n├ Generated Logo for "${title}"\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }
  } catch (err) {
    console.error("Logo generation error:", err);
    await m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ An error occurred while creating\n├ the logo. Pathetic.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
  }
});

// ── negro
dreaded({
  pattern: "negro",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, mime, m, text, botname } = context;
    const fq = getFakeQuoted(m);

    if (m.quoted && /image/.test(mime)) {
        const buffer = await m.quoted.download();
        const base64Image = buffer.toString('base64');

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const response = await axios.post("https://negro.consulting/api/process-image", {
                filter: "hitam",
                imageData: "data:image/png;base64," + base64Image
            });

            const resultBuffer = Buffer.from(
                response.data.processedImageUrl.replace("data:image/png;base64,", ""),
                "base64"
            );

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(m.chat, {
                image: resultBuffer,
                caption: `╭───(    TOXIC-MD    )───\n├───≫ NEGRO FILTER ≪───\n├ \n├ Done! Your image now has the\n├ *black* filter applied.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch (error) {
            console.error('Error while processing image:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Image processing failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }
    } else {
        await m.reply('╭───(    TOXIC-MD    )───\n├───≫ NEGRO ≪───\n├ \n├ Quote an image and type *negro*\n├ to apply the black filter, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }
});

// ── toimg
dreaded({
  pattern: "toimg",
  alias: ["toimage","stickertoimg","sticker"],
  desc: "Converts stickers to images",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        let mediaPath = null;
        let outPath = null;
        
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            
            if (!m.quoted) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ Are you illiterate? QUOTE A STICKER.\n├ The command is not a suggestion.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ That is not a sticker. Do you need\n├ glasses? That is clearly not a .webp file.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            mediaPath = await m.quoted.download();
            if (!mediaPath) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download the sticker.\n├ Your phone is probably as useless\n├ as you are.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            const tempFile = path.join(tmpdir(), `sticker_${Date.now()}.webp`);
            outPath = path.join(tmpdir(), `sticker_${Date.now()}.png`);
            
            fs.writeFileSync(tempFile, mediaPath);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempFile} ${outPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const imageBuffer = fs.readFileSync(outPath);
            
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            
            await client.sendMessage(m.chat, { 
                image: imageBuffer, 
                caption: '╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ Your sticker is now an image.\n├ A miraculous achievement.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' 
            }, { quoted: fq });
            
            await client.sendMessage(m.chat, { 
                document: imageBuffer, 
                mimetype: 'image/png', 
                fileName: `sticker_${Date.now()}.png`, 
                caption: '╭───(    TOXIC-MD    )───\n├───≫ PNG FILE ≪───\n├ \n├ PNG version. Slightly less terrible.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' 
            }, { quoted: fq });
            
            try {
                fs.unlinkSync(tempFile);
                fs.unlinkSync(outPath);
            } catch (e) {}
            
        } catch (err) {
            console.error('ToImg error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            
            let userMessage = 'The conversion failed. Shocking.';
            if (err.message.includes('timeout')) userMessage = 'Took too long. Your sticker is probably as bloated as your ego.';
            if (err.message.includes('Network Error')) userMessage = 'Network error. Is your router powered by hopes and dreams?';
            
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ ${userMessage}\n├ Error: ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            
            try {
                if (mediaPath) fs.unlinkSync(mediaPath);
                if (outPath) fs.unlinkSync(outPath);
            } catch (e) {}
        }
    });

// ── rc
dreaded({
  pattern: "rc",
  alias: ["airc","rcedit"],
  desc: "AI image edit using RC model",
  category: "Editing",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!quoted || !/image/.test(mime)) {
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Reply to an image with a prompt.\n├ Example: ${prefix}rc make it look like night\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          if (!prompt) {
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Tell me what to do with the image.\n├ Example: ${prefix}rc make it look like night\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const resultUrl = await makeRC(imgUrl, prompt);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              await client.sendMessage(m.chat, {
                  image: { url: resultUrl },
                  caption: `╭───(    TOXIC-MD    )───\n├───≫ RC Eᴅɪᴛ ≪───\n├ \n├ Prompt: ${prompt}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              await client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ RC edit failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }
      });

// ── removebg
dreaded({
  pattern: "removebg",
  alias: ["nobg","rmbg","transparent"],
  desc: "Removes background from images using AI",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, mime } = context;
        const fq = getFakeQuoted(m);
        
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const quoted = m.quoted ? m.quoted : m;
        const quotedMime = quoted.mimetype || mime || '';
        
        if (!/image/.test(quotedMime)) {
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ REMOVE BG ≪───\n├ \n├ Do you have eyes? That's clearly\n├ not an image. Quote an actual image\n├ file, you incompetent fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender]
            }, { quoted: fq });
        }

        try {
            const media = await quoted.download();
            if (!media) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return client.sendMessage(m.chat, {
                    text: '╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download the image.\n├ Your device is probably as defective\n├ as your judgment.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
                }, { quoted: fq });
            }

            if (media.length > 10 * 1024 * 1024) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return client.sendMessage(m.chat, {
                    text: '╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Image exceeds 10MB limit.\n├ Do you think I have infinite storage?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
                }, { quoted: fq });
            }

            const imageUrl = await uploadTempUrl(media, 'png');
            const encodedUrl = encodeURIComponent(imageUrl);
            const removeBgApiUrl = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodedUrl}`;
            
            const response = await axios.get(removeBgApiUrl, {
                headers: { 
                    'accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 60000
            });

            if (!response.data.status || !response.data.result) {
                throw new Error('The AI failed to process your image. Probably too complex for its intelligence.');
            }

            const transparentImageUrl = response.data.result;
            const transparentResponse = await axios.get(transparentImageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            const transparentImage = Buffer.from(transparentResponse.data);

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                { 
                    image: transparentImage, 
                    caption: '╭───(    TOXIC-MD    )───\n├───≫ REMOVE BG ≪───\n├ \n├ Background successfully removed.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
                },
                { quoted: fq }
            );

            if (transparentResponse.headers['content-type']?.includes('png')) {
                await client.sendMessage(
                    m.chat,
                    {
                        document: transparentImage,
                        mimetype: 'image/png',
                        fileName: `transparent_bg_${Date.now()}.png`,
                        caption: '╭───(    TOXIC-MD    )───\n├───≫ PNG FILE ≪───\n├ \n├ PNG version for higher quality.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
                    },
                    { quoted: fq }
                );
            }

        } catch (err) {
            console.error('RemoveBG error:', err);
            
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = 'An unexpected error occurred';
            
            if (err.message.includes('timeout')) {
                errorMessage = 'Processing took too long. Your image might be too complex or the server is busy.';
            } else if (err.message.includes('Network Error')) {
                errorMessage = 'Network connection failed. Check your internet, you digital neanderthal.';
            } else if (err.message.includes('Upload process failed')) {
                errorMessage = 'Failed to upload image for processing.';
            } else if (err.message.includes('AI failed to process')) {
                errorMessage = 'The AI could not process this image. Try something less abstract.';
            } else if (err.message.includes('ENOTFOUND')) {
                errorMessage = 'Cannot connect to the background removal service.';
            } else {
                errorMessage = 'Service failed. Try again later.';
            }

            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Background removal failed.\n├ Error: ${errorMessage}\n├ \n├ Suggestions:\n├ Use clear, high-contrast images\n├ Ensure subject has defined edges\n├ Try a simpler composition\n├ Check your internet connection\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── rip
dreaded({
  pattern: "rip",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ RIP ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.rip(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.rip(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── shit
dreaded({
  pattern: "shit",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ SHIT ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.shit(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.shit(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── sticker
dreaded({
  pattern: "sticker",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, m, packname, author } = context;
    const fq = getFakeQuoted(m);

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    commandQueue.push({
        context,
        run: async ({ client, m }) => {
            try {
                let mediaMessage = null;

                if (m.message && (m.message.imageMessage || m.message.videoMessage)) {
                    mediaMessage = m.message.imageMessage || m.message.videoMessage;
                } else if (m.quoted && m.quoted.message) {
                    mediaMessage = m.quoted.message.imageMessage || 
                                  m.quoted.message.videoMessage ||
                                  m.quoted.message.stickerMessage;
                } else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                    const quotedMsg = m.message.extendedTextMessage.contextInfo.quotedMessage;
                    mediaMessage = quotedMsg.imageMessage || quotedMsg.videoMessage || quotedMsg.stickerMessage;
                }

                if (!mediaMessage) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STICKER ≪───\n├ \n├ Where\'s the fvcking image or\n├ short video, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                }

                const isVideo = !!mediaMessage.videoMessage;
                if (isVideo && mediaMessage.videoMessage.seconds > 30) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STICKER ≪───\n├ \n├ Videos must be 30 seconds or shorter.\n├ Learn to read, moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                }

                let mediaToDownload = null;
                if (m.message && (m.message.imageMessage || m.message.videoMessage)) {
                    mediaToDownload = m;
                } else if (m.quoted) {
                    mediaToDownload = m.quoted;
                } else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                    mediaToDownload = {
                        message: m.message.extendedTextMessage.contextInfo.quotedMessage,
                        key: m.key
                    };
                }

                if (!mediaToDownload) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply('╭───(    TOXIC-MD    )───\n├───≫ STICKER ≪───\n├ \n├ Couldn\'t find media to download.\n├ You\'re hopeless.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                }

                const tempFile = path.join(__dirname, `temp-sticker-${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`);
                const mediaPath = await client.downloadAndSaveMediaMessage(mediaToDownload, tempFile.replace(path.extname(tempFile), ''));

                const sticker = new Sticker(mediaPath, {
                    pack: packname || 'p',
                    author: author || '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧 [dev]',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: '12345',
                    quality: 50,
                    background: 'transparent'
                });

                const buffer = await sticker.toBuffer();

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                await client.sendMessage(m.chat, { sticker: buffer }, { quoted: fq });

                await fs.unlink(mediaPath).catch(() => {});
                if (mediaPath !== tempFile) await fs.unlink(tempFile).catch(() => {});

            } catch (error) {
                console.error(`Sticker error: ${error.message}`);
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                await m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error while creating sticker.\n├ Try again, you failure.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
        }
    });
});

// ── take
dreaded({
  pattern: "take",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, m, pushname } = context;
    const fq = getFakeQuoted(m);

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    try {
        let mediaMsg = null;

        if (m.message?.imageMessage) {
            mediaMsg = m.message.imageMessage;
        } else if (m.message?.videoMessage) {
            mediaMsg = m.message.videoMessage;
        } else if (m.message?.stickerMessage) {
            mediaMsg = m.message.stickerMessage;
        } else if (m.quoted?.message?.imageMessage) {
            mediaMsg = m.quoted.message.imageMessage;
        } else if (m.quoted?.message?.videoMessage) {
            mediaMsg = m.quoted.message.videoMessage;
        } else if (m.quoted?.message?.stickerMessage) {
            mediaMsg = m.quoted.message.stickerMessage;
        } else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
            mediaMsg = m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
        } else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage) {
            mediaMsg = m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
        } else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
            mediaMsg = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
        }

        if (!mediaMsg) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≥ TAKE ≤───\n├ \n├ Quote or send an image, short video,\n├ or sticker to steal the watermark.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const mime = mediaMsg.mimetype || '';

        if (!/image|video|webp/.test(mime)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≥ TAKE ≤───\n├ \n├ That\'s not an image, video or sticker.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const videoSeconds = mediaMsg.seconds || 0;
        if (/video/.test(mime) && videoSeconds > 30) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('╭───(    TOXIC-MD    )───\n├───≥ TAKE ≤───\n├ \n├ Videos must be 30 seconds or shorter.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const buffer = await client.downloadMediaMessage(mediaMsg);

        if (!buffer || buffer.length === 0) {
            throw new Error('Failed to download media');
        }

        const ext = /webp/.test(mime) ? 'webp' : /video/.test(mime) ? 'mp4' : 'jpg';
        const tempFile = path.join(__dirname, `temp-take-${Date.now()}.${ext}`);
        await fs.writeFile(tempFile, buffer);

        const stickerResult = new Sticker(tempFile, {
            pack: pushname || 'ᅠᅠᅠᅠ',
            author: pushname || '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: 'transparent'
        });

        const stickerBuffer = await stickerResult.toBuffer();
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: fq });

        await fs.unlink(tempFile).catch(() => {});

    } catch (error) {
        console.error('WatermarkSticker error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Error while creating sticker.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }
});

// ── toanime
dreaded({
  pattern: "toanime",
  alias: ["anime","toon","cartoon"],
  desc: "Convert a replied image to anime style",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        const quoted = m.message?.imageMessage ? m : m.quoted ? m.quoted : null;

        if (!quoted) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO ANIME ≪───\n├ \n├ Send or reply to an image!\n├ Example: Send image → .toanime\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        let quotedMime = '';
        if (quoted.mtype === 'imageMessage' && quoted.msg?.mimetype) {
            quotedMime = quoted.msg.mimetype;
        } else if (quoted.mimetype) {
            quotedMime = quoted.mimetype;
        } else if (quoted.msg?.mimetype) {
            quotedMime = quoted.msg.mimetype;
        }

        if (!quotedMime || !quotedMime.startsWith('image/')) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO ANIME ≪───\n├ \n├ The replied message is *not an image*!\n├ Please send or reply to a *photo*.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const media = await quoted.download();
            if (!media || media.length === 0) throw new Error('Failed to download');

            if (media.length > 10 * 1024 * 1024) {
                return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO ANIME ≪───\n├ \n├ Image too large! Max 10MB.\n├ Compress it, you hoarder.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }

            const { url: imageUrl } = await uploadImage(media);

            const apiResponse = await axios.get('https://fgsi.koyeb.app/api/ai/image/toAnime', {
                params: {
                    apikey: 'fgsiapi-2dcdfa06-6d',
                    url: imageUrl
                },
                responseType: 'arraybuffer',
                timeout: 90000
            });

            const animeBuffer = Buffer.from(apiResponse.data);

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(m.chat, {
                image: animeBuffer,
                caption: `╭───(    TOXIC-MD    )───\n├───≫ ANIME TRANSFORMATION ≪───\n├ \n├ ANIME TRANSFORMATION COMPLETE!\n├ Look at this weeb result.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                mentions: [m.sender]
            }, { quoted: fq });

        } catch (err) {
            console.error('ToAnime Error:', err.message);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            const errorMsg = err.response
                ? `API Error: ${err.response.status}`
                : err.message.includes('timeout') ? 'API timed out.' : 'Failed. Try again later.';

            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ ${errorMsg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── tobugil
dreaded({
  pattern: "tobugil",
  alias: ["bugil","nudeedit","nude"],
  desc: "Apply tobugil filter to images",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        if (!m.quoted) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ TOBUGIL ≪───\n├ \n├ Quote an image, you blind moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }

        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || "";

        if (!mime.startsWith("image/")) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ TOBUGIL ≪───\n├ \n├ That\'s not an image, you\n├ illiterate fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const mediaBuffer = await q.download();
            const uploadedURL = await uploadToCatbox(mediaBuffer);
            
            const encodedImageUrl = encodeURIComponent(uploadedURL);
            const apiUrl = `https://api.baguss.xyz/api/edits/tobugil?image=${encodedImageUrl}`;

            const response = await axios.get(apiUrl, {
                timeout: 120000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            });

            if (!response.data?.success || !response.data?.url) {
                throw new Error('API returned invalid response');
            }

            const resultUrl = response.data.url;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    image: { url: resultUrl },
                    caption: '╭───(    TOXIC-MD    )───\n├───≫ TOBUGIL ≪───\n├ \n├ Wkwk.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
                },
                { quoted: fq }
            );

        } catch (error) {
            console.error('Tobugil error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = "Failed to process image, API probably hates your ugly picture. ";
            
            if (error.message.includes('UPLOAD FAILED')) {
                errorMessage += "Catbox upload failed.";
            } else if (error.message.includes('timeout')) {
                errorMessage += "Processing took too long, your image is trash.";
            } else if (error.message.includes('Invalid response')) {
                errorMessage += "API returned garbage.";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Network issue, check your connection.";
            } else {
                errorMessage += "Try again later.";
            }

            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── tofigure
dreaded({
  pattern: "tofigure",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
        const quoted = m.quoted ? m.quoted : m;
        const quotedMime = quoted.mimetype || '';
        if (!/image/.test(quotedMime)) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO FIGURE ≪───\n├ \n├ That is not an image. Are your eyes\n├ broken? Quote a real image, you imbecile.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        const media = await quoted.download();
        if (!media) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download your worthless image.\n├ Try sending something that actually exists.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        if (media.length > 10 * 1024 * 1024) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Your image is too large. 10MB MAX,\n├ you digital hoarder.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        const imageUrl = await uploadToCatbox(media);
        const apiURL = `https://api.fikmydomainsz.xyz/imagecreator/tofigur?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiURL);
        if (!response.data || !response.data.status || !response.data.result) throw new Error('The API vomited nonsense back at me.');
        const resultUrl = response.data.result;
        const figureBuffer = (await axios.get(resultUrl, { responseType: 'arraybuffer' })).data;
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await client.sendMessage(m.chat, { image: Buffer.from(figureBuffer), caption: '╭───(    TOXIC-MD    )───\n├───≫ TO FIGURE ≪───\n├ \n├ Here. It is now a "figure".\n├ You are welcome.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
    } catch (err) {
        console.error('tofigur error:', err);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        let userMessage = 'It failed. What a surprise.';
        if (err.message.includes('timeout')) userMessage = 'Took too long. Your image is probably as heavy as your stupidity.';
        if (err.message.includes('Network Error')) userMessage = 'Network error. Are you on dial-up?';
        if (err.message.includes('Upload Refused')) userMessage = "Couldn't even upload your image. Pathetic.";
        if (err.message.includes('API vomited')) userMessage = 'The art service rejected your image. It has standards.';
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ ${userMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── toghibli
dreaded({
  pattern: "toghibli",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, mime, m } = context;
    const fq = getFakeQuoted(m);

    const quoted = m.quoted ? m.quoted : m;
    const quotedMime = quoted.mimetype || mime || '';

    if (!/image/.test(quotedMime)) {
        return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO GHIBLI ≪───\n├ \n├ Please reply to or send an image\n├ with this command, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }

    await m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO GHIBLI ≪───\n├ \n├ Creating your Ghibli-style artwork...\n├ Please wait.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');

    try {
        const media = await quoted.download();
        if (!media) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download the image.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        if (media.length > 10 * 1024 * 1024) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ The image is too large (max 10MB).\n├ Compress it, you hoarder.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const { url: imageUrl } = await uploadImage(media);

        const response = await axios.get('https://fgsi.koyeb.app/api/ai/image/toGhibli', {
            params: {
                apikey: 'fgsiapi-2dcdfa06-6d',
                url: imageUrl,
            },
            responseType: 'arraybuffer',
        });

        const ghibliImage = Buffer.from(response.data);

        await client.sendMessage(
            m.chat,
            {
                image: ghibliImage,
                caption: '╭───(    TOXIC-MD    )───\n├───≫ GHIBLI STYLE ≪───\n├ \n├ Your image has been reimagined in\n├ *Studio Ghibli* style!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
            },
            { quoted: fq }
        );
    } catch (err) {
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error while generating Ghibli-style\n├ image generation failed.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── togif
dreaded({
  pattern: "togif",
  category: "Editing",
  filename: __filename
}, async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);

    try {
        if (!text) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ EMOJI ART ≪───\n├ \n├ Give me an emoji!\n├ Example: .togif 😂\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        const emojiMatch = text.match(/\p{Emoji}/u);
        if (!emojiMatch) {
            return m.reply('╭───(    TOXIC-MD    )───\n├───≫ EMOJI ART ≪───\n├ \n├ That\'s not an emoji. Give me a real one.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const emoji = emojiMatch[0];
        const imgUrl = emojiToTwemojiUrl(emoji);

        const res = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`Emoji not found in Twemoji set`);

        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await client.sendMessage(m.chat, {
            image: buffer,
            caption: `╭───(    TOXIC-MD    )───\n├───≫ EMOJI ART ≪───\n├ \n├ ${emoji}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });

    } catch (error) {
        console.error("togif command error:", error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to fetch emoji art:\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── toimg
dreaded({
  pattern: "toimg",
  alias: ["toimage","stickertoimg","sticker"],
  desc: "Converts stickers to images",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        let mediaPath = null;
        let outPath = null;
        
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            
            if (!m.quoted) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ Are you illiterate? QUOTE A STICKER.\n├ The command is not a suggestion.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ That is not a sticker. Do you need\n├ glasses? That is clearly not a .webp file.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            mediaPath = await m.quoted.download();
            if (!mediaPath) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download the sticker.\n├ Your phone is probably as useless\n├ as you are.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            
            const tempFile = path.join(tmpdir(), `sticker_${Date.now()}.webp`);
            outPath = path.join(tmpdir(), `sticker_${Date.now()}.png`);
            
            fs.writeFileSync(tempFile, mediaPath);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempFile} ${outPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const imageBuffer = fs.readFileSync(outPath);
            
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            
            await client.sendMessage(m.chat, { 
                image: imageBuffer, 
                caption: '╭───(    TOXIC-MD    )───\n├───≫ TO IMAGE ≪───\n├ \n├ Your sticker is now an image.\n├ A miraculous achievement.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' 
            }, { quoted: fq });
            
            await client.sendMessage(m.chat, { 
                document: imageBuffer, 
                mimetype: 'image/png', 
                fileName: `sticker_${Date.now()}.png`, 
                caption: '╭───(    TOXIC-MD    )───\n├───≫ PNG FILE ≪───\n├ \n├ PNG version. Slightly less terrible.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' 
            }, { quoted: fq });
            
            try {
                fs.unlinkSync(tempFile);
                fs.unlinkSync(outPath);
            } catch (e) {}
            
        } catch (err) {
            console.error('ToImg error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            
            let userMessage = 'The conversion failed. Shocking.';
            if (err.message.includes('timeout')) userMessage = 'Took too long. Your sticker is probably as bloated as your ego.';
            if (err.message.includes('Network Error')) userMessage = 'Network error. Is your router powered by hopes and dreams?';
            
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ ${userMessage}\n├ Error: ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            
            try {
                if (mediaPath) fs.unlinkSync(mediaPath);
                if (outPath) fs.unlinkSync(outPath);
            } catch (e) {}
        }
    });

// ── tomp4
dreaded({
  pattern: "tomp4",
  alias: ["tovideo","stickertomp4","sticker2video"],
  desc: "Converts stickers to MP4 videos",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, mime } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            if (!m.quoted) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO VIDEO ≪───\n├ \n├ The command requires a STICKER.\n├ Your empty reply suggests you\n├ cannot read.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO VIDEO ≪───\n├ \n├ That is a file, not a sticker.\n├ The .webp extension is a clue\n├ you seem to have missed.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            const statusMsg = await m.reply('╭───(    TOXIC-MD    )───\n├───≫ TO VIDEO ≪───\n├ \n├ Forcing your static sticker into\n├ a video. A pointless endeavor.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            const stickerBuffer = await m.quoted.download();
            if (!stickerBuffer) {
                await client.sendMessage(m.chat, { delete: statusMsg.key });
                return m.reply('╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ Failed to download. Your sticker is\n├ as inaccessible as common sense.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
            const stickerUrl = await uploadTempUrl(stickerBuffer, 'webp');
            const encodedUrl = encodeURIComponent(stickerUrl);
            const convertApiUrl = `https://api.elrayyxml.web.id/api/maker/convert?url=${encodedUrl}&format=MP4`;
            const response = await axios.get(convertApiUrl, { headers: { 'accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, timeout: 30000 });
            if (!response.data.status || !response.data.result) throw new Error('The converter deemed your sticker unworthy.');
            const videoUrl = response.data.result;
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 20000 });
            const videoBuffer = Buffer.from(videoResponse.data);
            await client.sendMessage(m.chat, { delete: statusMsg.key });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, { video: videoBuffer, caption: '╭───(    TOXIC-MD    )───\n├───≫ TO VIDEO ≪───\n├ \n├ Behold, your motionless "video".\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
            await client.sendMessage(m.chat, { document: videoBuffer, mimetype: 'video/mp4', fileName: `sticker_${Date.now()}.mp4`, caption: '╭───(    TOXIC-MD    )───\n├───≫ MP4 FILE ≪───\n├ \n├ Document version. Marginally\n├ more useful.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        } catch (err) {
            console.error('ToMP4 error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            let userMessage = 'The conversion failed utterly. What did you expect?';
            if (err.message.includes('timeout')) userMessage = 'The process timed out. Your sticker is likely more complex than your thoughts.';
            if (err.message.includes('Network Error')) userMessage = 'A network error. Are you connected to the void?';
            if (err.message.includes('upload') || err.message.includes('Upload')) userMessage = "Upload failed on all services. Try again later.";
            if (err.message.includes('converter deemed')) userMessage = 'The conversion API refused to process this. Try a simpler sticker.';
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ FAILED ≪───\n├ \n├ ${userMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── trash
dreaded({
  pattern: "trash",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ TRASH ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.trash(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.trash(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });

} catch (e) {

m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── trigger
dreaded({
  pattern: "trigger",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ TRIGGER ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.trigger(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.trigger(ppuser);
        } 

        let sticker = new Sticker(result, {
            pack: `dreaded`,
            author:"" ,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
        const stikk = await sticker.toBuffer()
       await client.sendMessage(m.chat, {sticker: stikk}, { quoted: fq })


        

} catch (e) {

m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── tts
dreaded({
  pattern: "tts",
  category: "Editing",
  filename: __filename
}, async (context) => {

  const { client, m, text } = context;
  const fq = getFakeQuoted(m);

  const googleTTS = require('google-tts-api');

  if (!text) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ TTS ≪───\n├ \n├ Where is the text for conversion?\n├ Can\'t you read instructions?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  try {
    const url = googleTTS.getAudioUrl(text, {
      lang: 'hi-IN',
      slow: false,
      host: 'https://translate.google.com',
    });

    await client.sendMessage(m.chat, { audio: { url:url},mimetype:'audio/mp4', ptt: true }, { quoted: fq });
    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('╭───(    TOXIC-MD    )───\n├───≫ TTS ERROR ≪───\n├ \n├ TTS failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
  }

  });

// ── wanted
dreaded({
  pattern: "wanted",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ WANTED ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.wanted(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.wanted(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });

// ── wasted
dreaded({
  pattern: "wasted",
  category: "Editing",
  filename: __filename
}, async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);

let cap = `╭───(    TOXIC-MD    )───\n├───≫ WASTED ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.wasted(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.wasted(ppuser);
        } 


        let sticker = new Sticker(result, {
            pack: `Triggred`,
            author:"" ,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
        const stikk = await sticker.toBuffer()
       await client.sendMessage(m.chat, {sticker: stikk}, { quoted: fq })
       await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Something wrong occured.\n├ Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}
    });
  