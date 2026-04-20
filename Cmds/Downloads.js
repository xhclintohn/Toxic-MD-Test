// Cmds/Downloads.js — 26 commands
  'use strict';

  const fetch = require('node-fetch');
const { getFakeQuoted } = require('../lib/fakeQuoted');
  const NEXRAY = 'https://api.nexray.web.id/downloader';

  function extractYtId(url) {
      const m = url.match(new RegExp('(?:youtu\\.be/|youtube\\.com/(?:watch\\?v=|shorts/|embed/|v/))([A-Za-z0-9_-]{11})'));
      return m ? m[1] : null;
  }
  const NEXRAY = 'https://api.nexray.web.id/downloader/bilibili?url=';
const axios = require('axios');
  const NEXRAY = 'https://api.nexray.web.id/downloader/facebook?url=';
const fetch = require("node-fetch");
  const NEXRAY = 'https://api.nexray.web.id/downloader/v2/instagram?url=';

  const GCSE_KEY = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
  const GCSE_CX  = 'baf9bdb0c631236e5';
const acrcloud = require("acrcloud");
  const NEXRAY = 'https://api.nexray.web.id/downloader/snackvideo?url=';
  const NEXRAY = 'https://api.nexray.web.id/downloader/soundcloud?url=';
  const NEXRAY = 'https://api.nexray.web.id/downloader/threads?url=';
  const NEXRAY = 'https://api.nexray.web.id/downloader/tiktok?url=';
  const NEXRAY = 'https://api.nexray.web.id/downloader/twitter?url=';
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
  const { uploadToUrl } = require('../lib/toUrl');
const yts = require("yt-search");
  const NEXRAY_MP3 = 'https://api.nexray.web.id/downloader/ytmp3?url=';
  const NEXRAY_MP4 = 'https://api.nexray.web.id/downloader/ytmp4?url=';

  function extractYtId(url) {
      const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([A-Za-z0-9_-]{11})/);
      return m ? m[1] : null;
  }
  const NEXRAY_MP3 = 'https://api.nexray.web.id/downloader/ytmp3?url=';

  function extractYtId(url) {
      const m = url.match(new RegExp('(?:youtu\\.be/|youtube\\.com/(?:watch\\?v=|shorts/|embed/|v/))([A-Za-z0-9_-]{11})'));
      return m ? m[1] : null;
  }
  const NEXRAY_MP4 = 'https://api.nexray.web.id/downloader/ytmp4?url=';

  function extractYtId(url) {
      const m = url.match(new RegExp('(?:youtu\\.be/|youtube\\.com/(?:watch\\?v=|shorts/|embed/|v/))([A-Za-z0-9_-]{11})'));
      return m ? m[1] : null;
  }

  function fmtDuration(secs) {
      const s = parseInt(secs) || 0;
      return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }

  // ── alldl
dreaded({
  pattern: "alldl",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply('╭───(    TOXIC-MD    )───\n├ Supports: YouTube, TikTok, Instagram, Twitter/X, Facebook\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      const url = text.trim();
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const isYT = /youtube\.com|youtu\.be/.test(url);
          const isTT = /tiktok\.com/.test(url);
          const isIG = /instagram\.com/.test(url);
          const isTW = /twitter\.com|x\.com|t\.co/.test(url);
          const isFB = /facebook\.com|fb\.watch/.test(url);

          let sendBuf = null, sendAsVideo = true, caption = '';

          if (isYT) {
              const id = extractYtId(url);
              if (!id) throw new Error('Invalid YouTube URL');
              const r = await fetch(`${NEXRAY}/ytmp4?url=${encodeURIComponent('https://youtube.com/watch?v='+id)}&resolusi=720`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 90000 });
              const d = await r.json();
              if (!d.status || !d.result?.url) throw new Error('YouTube API failed');
              await client.sendMessage(m.chat, {
                  video: { url: d.result.url },
                  mimetype: 'video/mp4',
                  caption: `╭───(    TOXIC-MD    )───\n├ 🎬 ${d.result.title || 'YouTube Video'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
              return await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

          } else if (isTT) {
              const r = await fetch(`${NEXRAY}/tiktok?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
              const d = await r.json();
              if (!d.status || !d.result?.data) throw new Error('TikTok API failed');
              const dlRes = await fetch(d.result.data, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
              sendBuf = Buffer.from(await dlRes.arrayBuffer());
              caption = `╭───(    TOXIC-MD    )───\n├ 🎵 ${d.result.title || 'TikTok Video'}\n├ 👤 ${d.result.author?.nickname || ''}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          } else if (isIG) {
              const r = await fetch(`${NEXRAY}/v2/instagram?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
              const d = await r.json();
              if (!d.status || !d.result?.media?.length) throw new Error('Instagram API failed');
              const first = d.result.media[0];
              const dlRes = await fetch(first.url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.instagram.com/' }, timeout: 35000 });
              sendBuf = Buffer.from(await dlRes.arrayBuffer());
              sendAsVideo = first.type === 'mp4';
              caption = `╭───(    TOXIC-MD    )───\n├ 📷 ${d.result.title || 'Instagram Post'}\n├ 👤 @${d.result.username || ''}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          } else if (isTW) {
              const r = await fetch(`${NEXRAY}/twitter?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
              const d = await r.json();
              if (!d.status || !d.result?.download_url?.length) throw new Error('Twitter API failed');
              const best = d.result.download_url.find(u => u.type === 'mp4') || d.result.download_url[0];
              const dlRes = await fetch(best.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
              sendBuf = Buffer.from(await dlRes.arrayBuffer());
              caption = `╭───(    TOXIC-MD    )───\n├ 🐦 ${(d.result.title || 'X/Twitter Video').slice(0,80)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          } else if (isFB) {
              const r = await fetch(`${NEXRAY}/facebook?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
              const d = await r.json();
              if (!d.status || !d.result) throw new Error('Facebook API failed');
              const videoUrl = d.result.video_hd || d.result.video_sd;
              if (!videoUrl) throw new Error('No FB video URL');
              const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
              sendBuf = Buffer.from(await dlRes.arrayBuffer());
              caption = `╭───(    TOXIC-MD    )───\n├ 📘 ${d.result.title || 'Facebook Video'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          } else {
              throw new Error('Unsupported link. Use YouTube, TikTok, Instagram, Twitter/X, or Facebook.');
          }

          if (sendBuf) {
              await client.sendMessage(m.chat, sendAsVideo
                  ? { video: sendBuf, caption, mimetype: 'video/mp4', gifPlayback: false }
                  : { image: sendBuf, caption }
              , { quoted: fq });
          }
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── apk
dreaded({
  pattern: "apk",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m, text, fetchJson } = context;
    const fq = getFakeQuoted(m);

    try {
        if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Provide an app name, you brainless creature!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

        await client.sendMessage(m.chat, { react: { text: "⌛", key: m.key } });

        const data = await fetchJson(`https://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(text)}`);

        if (!data?.datalist?.list?.length) {
            await client.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            return m.reply("╭───(    TOXIC-MD    )───\n├ App not found!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        const app = data.datalist.list[0];
        const apkUrl = app.file?.path;

        if (!apkUrl) {
            await client.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            return m.reply("╭───(    TOXIC-MD    )───\n├ APK download link not available!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        await client.sendMessage(
            m.chat,
            {
                document: { url: apkUrl },
                fileName: `${app.name}.apk`,
                mimetype: "application/vnd.android.package-archive"
            },
            { quoted: fq }
        );

        await client.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        m.reply("╭───(    TOXIC-MD    )───\n├───≫ APK ERROR ≪───\n├ \n├ APK download failed, not my problem.\n├ " + error + "\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }
});

// ── bilibili
dreaded({
  pattern: "bilibili",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}bilibili https://www.bilibili.com/video/BVxxxxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('bilibili.com') && !text.includes('b23.tv')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a Bilibili link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('Bilibili API failed');
          const res = d.result;
          const videoUrl = res.url || res.video || res.download;
          if (!videoUrl) throw new Error('No download URL found');
          await client.sendMessage(m.chat, {
              video: { url: videoUrl },
              mimetype: 'video/mp4',
              caption: `╭───(    TOXIC-MD    )───\n├───≫ Bilibili DL ≪───\n├ 🎬 ${res.title || 'Bilibili Video'}\n├ 👤 ${res.author || res.owner || 'N/A'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── capcut
dreaded({
  pattern: "capcut",
  desc: "Download CapCut videos",
  category: "Downloads",
  filename: __filename
}, async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ CAPCUT DL ≪───\n├ \n├ Usage: ${prefix}capcut <url>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        if (!text.match(/capcut\.com/i)) return m.reply('That doesn\'t look like a CapCut link.');
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const { data } = await axios.get(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(text)}`, { timeout: 15000 });
            if (!data?.data?.play) throw new Error('no data');
            const result = data.data;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, {
                video: { url: result.play },
                caption: `╭───(    TOXIC-MD    )───\n├───≫ CAPCUT VIDEO ≪───\n├ Title: ${result.title || 'Unknown'}\n├ Author: ${result.author || 'Unknown'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply('╭───(    TOXIC-MD    )───\n├ Failed to download. Check the link and try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }
    });

// ── fbdl
dreaded({
  pattern: "fbdl",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}fbdl https://fb.watch/xxxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('facebook.com') && !text.includes('fb.watch')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a Facebook link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, video_hd, video_sd } = d.result;
          const videoUrl = video_hd || video_sd;
          if (!videoUrl) throw new Error('No video URL found');
          const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          await client.sendMessage(m.chat, {
              video: buf, mimetype: 'video/mp4',
              caption: `╭───(    TOXIC-MD    )───\n├───≫ Facebook DL ≪───\n├ ${title || 'Facebook Video'}\n├ Quality: ${video_hd ? 'HD' : 'SD'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── gitclone
dreaded({
  pattern: "gitclone",
  category: "Downloads",
  filename: __filename
}, async (context) => {

  const { client, m, text } = context;
  const fq = getFakeQuoted(m);

  if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Where's the link, you forgetful moron?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)
  if (!text.includes('github.com')) return m.reply(`╭───(    TOXIC-MD    )───\n├ Is that even a GitHub repo link?! Think again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  try {
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      let [, user3, repo] = text.match(regex1) || []
      repo = repo.replace(/.git$/, '')
      let url = `https://api.github.com/repos/${user3}/${repo}/zipball`
      let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
      await client.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: fq })
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      m.reply("╭───(    TOXIC-MD    )───\n├ Git clone failed. Skill issue.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧")
  }

  });

// ── hentai
dreaded({
  pattern: "hentai",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m, text, botname } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (message) => {
        return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`API failed with status ${response.status}`);
                }
                return response;
            } catch (error) {
                if (attempt === retries || error.type !== "request-timeout") {
                    throw error;
                }
                console.error(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    if (!text) {
        return m.reply(formatStylishReply("Yo, drop a search query, fam! 🔍 Ex: .hentai hinata"));
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
    try {
        // Step 1: Search using thehentai-search API
        const encodedQuery = encodeURIComponent(text);
        const searchResponse = await fetchWithRetry(
            `https://api.privatezia.biz.id/api/anime/thehentai-search?query=${encodedQuery}`,
            { headers: { Accept: "application/json" }, timeout: 15000 }
        );

        const searchData = await searchResponse.json();

        // Validate search response
        if (!searchData || !searchData.status || !searchData.data || !searchData.data.posts || searchData.data.posts.length === 0) {
            return m.reply(formatStylishReply("No results found for your query, fam! 😢 Try a different search term."));
        }

        // Get the first result's URL
        const firstResult = searchData.data.posts[0];
        const contentUrl = firstResult.url;
        const title = firstResult.title || "No title available";
        const thumbnail = firstResult.imgSrc || null;
        const views = firstResult.views || "Unknown";
        const date = firstResult.date || "Unknown";

        // Step 2: Fetch gallery using thehentai-download API
        const encodedContentUrl = encodeURIComponent(contentUrl);
        const downloadResponse = await fetchWithRetry(
            `https://api.privatezia.biz.id/api/anime/thehentai-download?url=${encodedContentUrl}`,
            { headers: { Accept: "application/json" }, timeout: 15000 }
        );

        const downloadData = await downloadResponse.json();

        // Validate download response
        if (!downloadData || !downloadData.status || !downloadData.data || !downloadData.data.gallery || downloadData.data.gallery.length === 0) {
            return m.reply(formatStylishReply("Couldn’t fetch the gallery for this content, fam! 😢 Try again later."));
        }

        const gallery = downloadData.data.gallery;
        const description = downloadData.data.description || "No description available";

        // Send gallery images
        for (const image of gallery) {
            await client.sendMessage(
                m.chat,
                {
                    image: { url: image.imgSrc },
                    caption: formatStylishReply(
                        `🎨 Hentai Content\n\n📌 *Title:* ${title}\n📝 *Description:* ${description}\n👀 *Views:* ${views}\n📅 *Date:* ${date}\n🖼️ *Image:* ${image.alt}`
                    ),
                },
                { quoted: fq }
            );
        }

    } catch (e) {
        console.error("Hentai fetch error:", e);
        m.reply(formatStylishReply('Something went wrong. Check your query and try again! 😎'));
    }
});

// ── igdl
dreaded({
  pattern: "igdl",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply('╭───(    TOXIC-MD    )───\n├ Give me an Instagram link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      if (!text.includes('instagram.com')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not an Instagram link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, likes, comment, username, media } = d.result;
          if (!media || !media.length) throw new Error('No media found');
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          for (const item of media.slice(0, 5)) {
              try {
                  const dlRes = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.instagram.com/' }, timeout: 35000 });
                  if (!dlRes.ok) continue;
                  const buf = Buffer.from(await dlRes.arrayBuffer());
                  const cap = `╭───(    TOXIC-MD    )───\n├───≫ Instagram DL ≪───\n├ ${title || 'Instagram Post'}\n├ 👤 @${username || 'unknown'}\n├ ❤️ ${likes ? likes.toLocaleString() : 'N/A'} likes | 💬 ${comment ? comment.toLocaleString() : 'N/A'} comments\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
                  if (item.type === 'mp4') {
                      await client.sendMessage(m.chat, { video: buf, caption: cap, mimetype: 'video/mp4' }, { quoted: fq });
                  } else {
                      await client.sendMessage(m.chat, { image: buf, caption: cap }, { quoted: fq });
                  }
              } catch {}
          }
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── image
dreaded({
  pattern: "image",
  alias: ["img","pic","searchimage"],
  desc: "Search and send images",
  category: "Downloads",
  filename: __filename
}, async (context) => {
          const { client, m, prefix } = context;
          const fq = getFakeQuoted(m);

          const query = m.body.replace(new RegExp(`^${prefix}(image|img|pic|searchimage)\\s*`, 'i'), '').trim();
          if (!query) {
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├ Give me something to search, genius.\n├ Example: ${prefix}img cats\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          try {
              await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

              const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
                  params: { q: query, key: GCSE_KEY, cx: GCSE_CX, searchType: 'image', num: 5, safe: 'off' },
                  timeout: 15000
              });

              if (!data.items || data.items.length === 0) {
                  await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                  return client.sendMessage(m.chat, {
                      text: `╭───(    TOXIC-MD    )───\n├ No images found for "${query}".\n├ Your search is terrible.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                  }, { quoted: fq });
              }

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

              for (let i = 0; i < data.items.length; i++) {
                  const item = data.items[i];
                  try {
                      await client.sendMessage(m.chat, {
                          image: { url: item.link },
                          caption: `╭───(    TOXIC-MD    )───\n├───≫ IMAGE ${i + 1}/${data.items.length} ≪───\n├ \n├ ${(item.title || query).slice(0, 80)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                      }, { quoted: fq });
                      if (i < data.items.length - 1) await new Promise(r => setTimeout(r, 1200));
                  } catch (imgErr) {
                      console.warn(`Image ${i + 1} skipped: ${imgErr.message}`);
                  }
              }

          } catch (error) {
              console.error('Image search error:', error.message);
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              await client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├ Image search failed. Try again later.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }
      });

// ── mediafire
dreaded({
  pattern: "mediafire",
  category: "Downloads",
  filename: __filename
}, async (context) => {

const { client, m, text, botname  } = context;
const fq = getFakeQuoted(m);

const axios = require('axios');
const cheerio = require('cheerio');
const { getFakeQuoted } = require('../lib/fakeQuoted');

async function MediaFire(url, options) {
  try {
    let mime;
    options = options ? options : {};
    const res = await axios.get(url, options);
    const $ = cheerio.load(res.data);
    const hasil = [];
    const link = $('a#downloadButton').attr('href');
    const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '');
    const seplit = link.split('/');
    const nama = seplit[5];
    mime = nama.split('.');
    mime = mime[1];
    hasil.push({ nama, mime, size, link });
    return hasil;
  } catch (err) {
    return err;
  }
}

if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Provide a MediaFire link, you lazy bum!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

if (!text.includes('mediafire.com')) {
        return m.reply("╭───(    TOXIC-MD    )───\n├ That doesn't look like a MediaFire link, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }


await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

try {

        const fileInfo = await MediaFire(text);



if (!fileInfo || !fileInfo.length) {
    return m.reply("╭───(    TOXIC-MD    )───\n├ File no longer exists on MediaFire. Too slow!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
}






        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        await client.sendMessage(
            m.chat,
            {
                document: {
                    url: fileInfo[0].link,
                },
                fileName: fileInfo[0].nama,
                mimetype: fileInfo[0].mime,
                caption: `╭───(    TOXIC-MD    )───\n├───≫ MEDIAFIRE DL ≪───\n├ \n├ File: ${fileInfo[0].nama}\n├ Downloaded by ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, 
            },
            { quoted: fq }


   );

} catch (error) {

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ MEDIAFIRE ERROR ≪───\n├ \n├ Download failed, not my fault.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

});

// ── pinterest
dreaded({
  pattern: "pinterest",
  alias: ["pin","pinterestimg"],
  desc: "Fetches Pinterest images for your basic needs",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
      const query = m.text.trim();
      if (!query) return m.reply("╭───(    TOXIC-MD    )───\n├ Give me a search term, you visually impaired fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      const apiUrl = `https://mkzstyleee.vercel.app/search/pinterest?q=${encodeURIComponent(query)}&apikey=FREE-OKBCJB3N-Q9TC`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.status || !data.result || data.result.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply(`╭───(    TOXIC-MD    )───\n├ No Pinterest images for "${query}".\n├ Your search is as pointless as you are.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      const images = data.result.filter(img => img !== null).slice(0, 5);
      
      if (images.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply(`╭───(    TOXIC-MD    )───\n├ No valid images found.\n├ Even Pinterest rejected your taste.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      for (const [i, imageUrl] of images.entries()) {
        try {
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const caption = i === 0 
            ? `╭───(    TOXIC-MD    )───\n├───≫ PINTEREST ≪───\n├ \n├ Query: ${query}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            : `├ Image ${i+1} of ${images.length}`;

          await client.sendMessage(m.chat, {
            image: buffer,
            caption: caption
          }, { quoted: i === 0 ? m : null });

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (imgError) {
          console.error(`Failed to fetch image ${i}:`, imgError.message);
        }
      }

    } catch (error) {
      console.error('Pinterest error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PINTEREST ERROR ≪───\n├ \n├ Search failed. Your taste is probably trash anyway.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  });

// ── play
dreaded({
  pattern: "play",
  alias: ["ply","playy","pl"],
  desc: "Downloads songs from YouTube and sends audio",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);

    try {
      const query = text ? text.trim() : '';

      if (!query) {
        return m.reply(`╭───(    TOXIC-MD    )───\n├ You forgot to type something, genius.\n├ Give me a song name OR a YouTube link.\n├ Example: .play harlem shake\n├ Or: .play https://youtu.be/dQw4w9WgXcQ\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      const isYoutubeLink = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?[a-zA-Z0-9_-]{11})/gi.test(query);

      let audioUrl, filename, thumbnail, sourceUrl;

      if (isYoutubeLink) {
        const response = await fetch(`https://api.sidycoders.xyz/api/ytdl?url=${encodeURIComponent(query)}&format=mp3&apikey=memberdycoders`);
        const data = await response.json();

        if (!data.status || !data.cdn) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          return m.reply(`╭───(    TOXIC-MD    )───\n├ Can't download that YouTube link.\n├ Your link is probably broken or private.\n├ Even I have limits, unlike your stupidity.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        audioUrl = data.cdn;
        filename = data.title || "Unknown YouTube Song";
        thumbnail = "";
        sourceUrl = query;
      } else {
        if (query.length > 100) {
          return m.reply("╭───(    TOXIC-MD    )───\n├ Song title longer than my patience. 100 chars MAX!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        const response = await fetch(`https://apiziaul.vercel.app/api/downloader/ytplaymp3?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data.status || !data.result?.downloadUrl) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          return m.reply(`╭───(    TOXIC-MD    )───\n├ No song found for "${query}".\n├ Your music taste is as bad as your search skills.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        audioUrl = data.result.downloadUrl;
        filename = data.result.title || "Unknown Song";
        thumbnail = data.result.thumbnail || "";
        sourceUrl = data.result.videoUrl || "";
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: thumbnail ? {
          externalAdReply: {
            title: filename.substring(0, 30),
            body: "Toxic-MD",
            thumbnailUrl: thumbnail,
            sourceUrl: sourceUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        } : undefined,
      }, { quoted: fq });

      await client.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
        caption: `╭───(    TOXIC-MD    )───\n├───≫ PLAY ≪───\n├ \n├ ${filename}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });

    } catch (error) {
      console.error('Play error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PLAY ERROR ≪───\n├ \n├ Play failed. The universe rejects your music taste.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  });

// ── shazam
dreaded({
  pattern: "shazam",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
        const acr = new acrcloud({
            host: 'identify-ap-southeast-1.acrcloud.com',
            access_key: '26afd4eec96b0f5e5ab16a7e6e05ab37',
            access_secret: 'wXOZIqdMNZmaHJP1YDWVyeQLg579uK2CfY6hWMN8'
        });

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        if (!m.quoted) return m.reply("╭───(    TOXIC-MD    )───\n├ Quote an audio/video message, you deaf imbecile.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

        const p = m.quoted ? m.quoted : m;
        const buffer = await p.download();

        const { status, metadata } = await acr.identify(buffer);
        if (status.code !== 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("╭───(    TOXIC-MD    )───\n├ Song not recognized.\n├ Your audio is as indecipherable as your life choices.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        const { title, artists, album, genres, release_date } = metadata.music[0];
        let txt = `╭───(    TOXIC-MD    )───\n├───≫ SHAZAM ≪───\n├ \n`;
        txt += `├ Title: ${title}\n`;
        if (artists) txt += `├ Artists: ${artists.map(v => v.name).join(', ')}\n`;
        if (album) txt += `├ Album: ${album.name}\n`;
        if (genres) txt += `├ Genres: ${genres.map(v => v.name).join(', ')}\n`;
        if (release_date) txt += `├ Release: ${release_date}\n`;
        txt += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await m.reply(txt);

    } catch (error) {
        console.error('Music recognition error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SHAZAM ERROR ≪───\n├ \n├ Music recognition failed. Your audio is garbage.\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── snackvideo
dreaded({
  pattern: "snackvideo",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}snackvideo https://sck.io/xxxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('sck.io') && !text.includes('snackvideo.com')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a SnackVideo link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('SnackVideo API failed');
          const res = d.result;
          const videoUrl = res.url || res.video || res.download;
          if (!videoUrl) throw new Error('No download URL found');
          const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 35000 });
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          await client.sendMessage(m.chat, {
              video: buf, mimetype: 'video/mp4',
              caption: `╭───(    TOXIC-MD    )───\n├───≫ SnackVideo DL ≪───\n├ 🎬 ${res.title || 'SnackVideo'}\n├ 👤 ${res.author || res.username || 'N/A'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── soundcloud
dreaded({
  pattern: "soundcloud",
  category: "Downloads",
  filename: __filename
}, async (context) => {
          const { client, m, text, prefix } = context;
          const fq = getFakeQuoted(m);
          if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}soundcloud https://soundcloud.com/user/track\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          if (!text.includes('soundcloud.com')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a SoundCloud link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
          try {
              const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 });
              const d = await r.json();
              if (!d.status || !d.result) throw new Error('SoundCloud API failed');
              const { title, thumbnail, audio } = d.result;
              const audioUrl = audio || d.result.url || d.result.download;
              if (!audioUrl) throw new Error('No audio URL returned');
              if (thumbnail) {
                  await client.sendMessage(m.chat, { image: { url: thumbnail }, caption: `🎵 ${title || 'SoundCloud Track'}` }, { quoted: fq });
              }
              const dlRes = await fetch(audioUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 35000 });
              const buf = Buffer.from(await dlRes.arrayBuffer());
              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              await client.sendMessage(m.chat, {
                  audio: buf, mimetype: 'audio/mpeg', ptt: false,
                  fileName: `${title || 'soundcloud-track'}.mp3`
              }, { quoted: fq });
          } catch (e) {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          }
      });

// ── spotify
dreaded({
  pattern: "spotify",
  alias: ["spotifydl","spoti","spt"],
  desc: "Downloads songs from Spotify",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
      const query = m.text.trim();
      if (!query) return m.reply("╭───(    TOXIC-MD    )───\n├ Give me a song name, you tone-deaf cretin.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

      if (query.length > 100) return m.reply("╭───(    TOXIC-MD    )───\n├ Song title longer than my patience. 100 chars MAX!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      const response = await fetch(`https://api.ootaizumi.web.id/downloader/spotifyplay?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!data.status || !data.result?.download) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply(`╭───(    TOXIC-MD    )───\n├ No song found for "${query}".\n├ Your music taste is as bad as your search skills.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      const song = data.result;
      const audioUrl = song.download;
      const filename = song.title || "Unknown Song";
      const artist = song.artists || "Unknown Artist";

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: filename.substring(0, 30),
            body: artist.substring(0, 30),
            thumbnailUrl: song.image || "",
            sourceUrl: song.external_url || "",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      }, { quoted: fq });

      await client.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
        caption: `╭───(    TOXIC-MD    )───\n├───≫ SPOTIFY ≪───\n├ \n├ ${filename} - ${artist}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });

    } catch (error) {
      console.error('Spotify error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SPOTIFY ERROR ≪───\n├ \n├ Download failed. Universe rejects your music taste.\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  });

// ── threads
dreaded({
  pattern: "threads",
  category: "Downloads",
  filename: __filename
}, async (context) => {
          const { client, m, text, prefix } = context;
          const fq = getFakeQuoted(m);
          if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}threads https://www.threads.net/@user/post/xxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          if (!text.includes('threads.net')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a Threads link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
          try {
              const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
              const d = await r.json();
              if (!d.status || !d.result) throw new Error('Could not fetch Threads media');
              const res = d.result;
              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              if (res.video) {
                  await client.sendMessage(m.chat, {
                      video: { url: res.video },
                      caption: `╭───(    TOXIC-MD    )───\n├───≫ Threads Video ≪───\n├ ${res.author || ''}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                      mimetype: 'video/mp4'
                  }, { quoted: fq });
              } else if (res.image) {
                  const imgs = Array.isArray(res.image) ? res.image : [res.image];
                  for (const img of imgs.slice(0, 5)) {
                      await client.sendMessage(m.chat, {
                          image: { url: img },
                          caption: `╭───(    TOXIC-MD    )───\n├───≫ Threads Image ≪───\n├ ${res.author || ''}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                      }, { quoted: fq });
                  }
              } else throw new Error('No media found in this Threads post');
          } catch (e) {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
          }
      });

// ── tikaudio
dreaded({
  pattern: "tikaudio",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}tikaudio https://vt.tiktok.com/xxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('tiktok.com')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a TikTok link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, music_info } = d.result;
          if (!music_info?.url) throw new Error('No audio URL found');
          const dlRes = await fetch(music_info.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 35000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          await client.sendMessage(m.chat, {
              audio: buf,
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${music_info.title || title || 'tiktok-audio'}.mp3`
          }, { quoted: fq });
          await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ TikTok Audio ≪───\n├ 🎵 ${music_info.title || title || 'N/A'}\n├ 👤 ${music_info.author || 'N/A'}\n├ ⏱ ${music_info.duration || 'N/A'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── tikdl
dreaded({
  pattern: "tikdl",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}tiktok https://vt.tiktok.com/xxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('tiktok.com')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a TikTok link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, duration, data: videoUrl, cover, stats, author } = d.result;
          if (!videoUrl) throw new Error('No video URL returned');
          const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          const views = stats?.views || 'N/A';
          const likes = stats?.likes || 'N/A';
          const cap = `╭───(    TOXIC-MD    )───\n├───≫ TikTok DL ≪───\n├ ${title || 'TikTok Video'}\n├ 👤 ${author?.nickname || 'Unknown'}\n├ ⏱ ${duration || 'N/A'}\n├ 👁 ${views} views | ❤️ ${likes} likes\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
          await client.sendMessage(m.chat, { video: buf, caption: cap, mimetype: 'video/mp4', gifPlayback: false }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── twtdl
dreaded({
  pattern: "twtdl",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}twitter https://x.com/user/status/xxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      if (!text.includes('twitter.com') && !text.includes('x.com') && !text.includes('t.co')) return m.reply('╭───(    TOXIC-MD    )───\n├ That\'s not a Twitter/X link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, duration, download_url } = d.result;
          const best = (download_url || []).find(u => u.type === 'mp4') || (download_url || [])[0];
          if (!best?.url) throw new Error('No video found in this tweet');
          const dlRes = await fetch(best.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          await client.sendMessage(m.chat, {
              video: buf, mimetype: 'video/mp4',
              caption: `╭───(    TOXIC-MD    )───\n├───≫ Twitter/X Video ≪───\n├ ${(title || '').slice(0, 80)}\n├ Duration: ${duration || 'N/A'}\n├ Quality: ${best.resolusi || 'HD'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── upload
dreaded({
  pattern: "upload",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);

      try {
          const q = m.quoted ? m.quoted : m;
          const mime = (q.msg || q).mimetype || '';

          if (!mime) return m.reply("╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Quote or send a media file to upload.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

          const mediaBuffer = await q.download();

          if (mediaBuffer.length > 256 * 1024 * 1024) {
              return m.reply("╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ File too large! Max 256MB.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

          const ext = mime.split('/')[1] || 'bin';
          const link = await uploadToUrl(mediaBuffer, ext);
          const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

          const resultText =
              `╭───(    TOXIC-MD    )───\n` +
              `├───≫ Uᴘʟᴏᴀᴅ Dᴏɴᴇ ≪───\n` +
              `├ \n` +
              `├ 🔗 *Link:* ${link}\n` +
              `├ 📁 *Size:* ${fileSizeMB} MB\n` +
              `╰──────────────────☉\n` +
              `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

          try {
              const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                  interactiveMessage: {
                      body: { text: resultText },
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
              await m.reply(resultText);
          }

      } catch (err) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Uᴘʟᴏᴀᴅ Eʀʀᴏʀ ≪───\n├ \n├ Upload failed, try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── video
dreaded({
  pattern: "video",
  category: "Downloads",
  filename: __filename
}, async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);

    if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Give me a video name, it's not rocket science.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    if (text.length > 100) return m.reply("╭───(    TOXIC-MD    )───\n├ Title longer than your attention span. Under 100 chars!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
        const searchQuery = `${text} official`;
        const searchResult = await yts(searchQuery);
        const video = searchResult.videos[0];
        if (!video) return m.reply(`╭───(    TOXIC-MD    )───\n├ Nothing found for "${text}". Your taste doesn't exist.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        const encodedUrl = encodeURIComponent(video.url);
        const response = await fetch(`https://api.ootaizumi.web.id/downloader/youtube?url=${encodedUrl}&format=720`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept": "application/json" } });
        const data = await response.json();
        if (!data.status || !data.result || !data.result.download) throw new Error('API returned no valid video data.');
        const title = data.result.title || "Untitled";
        const videoUrl = data.result.download;
        const thumbnailUrl = data.result.thumbnail;
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await client.sendMessage(m.chat, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "Powered by Toxic-MD",
                    thumbnailUrl,
                    sourceUrl: video.url,
                    mediaType: 2,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: fq });
    } catch (error) {
        console.error(`Video error:`, error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        let userMessage = 'Download failed. The universe despises your video choice.';
        if (error.message.includes('API returned')) userMessage = 'The video service rejected the request.';
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ VIDEO ERROR ≪───\n├ \n├ ${userMessage}\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── yt
dreaded({
  pattern: "yt",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix, args } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}yt https://youtu.be/xxxx [mp3/mp4]\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      const parts = text.trim().split(/\s+/);
      const ytUrl = parts[0];
      const format = (parts[1] || 'mp3').toLowerCase();
      const id = extractYtId(ytUrl);
      if (!id) return m.reply('╭───(    TOXIC-MD    )───\n├ Invalid YouTube link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const fullUrl = `https://youtube.com/watch?v=${id}`;
          if (format === 'mp4') {
              await m.reply('⏳ Fetching video (720p)... May take up to 60s.');
              const r = await fetch(NEXRAY_MP4 + encodeURIComponent(fullUrl) + '&resolusi=720', { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 90000 });
              const d = await r.json();
              if (!d.status || !d.result?.url) throw new Error('Video API failed');
              await client.sendMessage(m.chat, {
                  video: { url: d.result.url }, mimetype: 'video/mp4',
                  caption: `╭───(    TOXIC-MD    )───\n├ 🎬 ${d.result.title || 'YouTube Video'}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          } else {
              const r = await fetch(NEXRAY_MP3 + encodeURIComponent(fullUrl), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });
              const d = await r.json();
              if (!d.status || !d.result?.url) throw new Error('Audio API failed');
              const { title, quality, url: audioUrl } = d.result;
              const dlRes = await fetch(audioUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
              const buf = Buffer.from(await dlRes.arrayBuffer());
              await client.sendMessage(m.chat, {
                  audio: buf, mimetype: 'audio/mpeg', ptt: false,
                  fileName: `${title || 'yt-audio'}.mp3`
              }, { quoted: fq });
          }
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── ytmp3
dreaded({
  pattern: "ytmp3",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}ytmp3 https://youtu.be/xxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      const ytUrl = text.trim();
      const id = extractYtId(ytUrl);
      if (!id) return m.reply('╭───(    TOXIC-MD    )───\n├ Invalid YouTube link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      try {
          const fullUrl = `https://youtube.com/watch?v=${id}`;
          const r = await fetch(NEXRAY_MP3 + encodeURIComponent(fullUrl), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });
          const d = await r.json();
          if (!d.status || !d.result?.url) throw new Error('API failed or no audio URL');
          const { title, quality, url: audioUrl } = d.result;
          const dlRes = await fetch(audioUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          await client.sendMessage(m.chat, {
              audio: buf,
              mimetype: 'audio/mpeg',
              ptt: false,
              fileName: `${title || 'youtube-audio'}.mp3`
          }, { quoted: fq });
          await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ YouTube MP3 ≪───\n├ 🎵 ${title || 'Unknown'}\n├ 🔊 Quality: ${quality || '320'}kbps\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── ytmp4
dreaded({
  pattern: "ytmp4",
  category: "Downloads",
  filename: __filename
}, async (context) => {
      const { client, m, text, prefix, args } = context;
      const fq = getFakeQuoted(m);
      if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├ Example: ${prefix}ytmp4 https://youtu.be/xxxx [720/1080]\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      const parts = text.trim().split(/\s+/);
      const urlPart = parts[0];
      const quality = parts[1] && /^(360|480|720|1080)$/.test(parts[1]) ? parts[1] : '720';
      const id = extractYtId(urlPart);
      if (!id) return m.reply('╭───(    TOXIC-MD    )───\n├ Invalid YouTube link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
      await m.reply(`╭───(    TOXIC-MD    )───\n├ Processing ${quality}p... This may take up to 60s.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      try {
          const fullUrl = `https://youtube.com/watch?v=${id}`;
          const apiUrl = NEXRAY_MP4 + encodeURIComponent(fullUrl) + `&resolusi=${quality}`;
          const r = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 90000 });
          const d = await r.json();
          if (!d.status || !d.result?.url) throw new Error('API failed or no video URL');
          const { title, thumbnail, duration, url: videoUrl } = d.result;
          await client.sendMessage(m.chat, {
              video: { url: videoUrl },
              mimetype: 'video/mp4',
              caption: `╭───(    TOXIC-MD    )───\n├───≫ YouTube MP4 ≪───\n├ 🎬 ${title || 'Unknown'}\n├ ⏱ ${fmtDuration(duration)}\n├ 📺 Quality: ${quality}p\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          m.reply(`╭───(    TOXIC-MD    )───\n├ Failed: ${e.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }
  });

// ── yts
dreaded({
  pattern: "yts",
  category: "Downloads",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);

  const formatStylishReply = (message) => {
    return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\nPσɯҽɾԃ Ⴆყ Tσxιƈ-ɱԃȥ`;
  };

  if (!text) {
    return client.sendMessage(
      m.chat,
      { text: formatStylishReply("Yo, drop a search term, fam! 🔍 Ex: .yts Alan Walker Alone") },
      { quoted: fq, ad: true }
    );
  }

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
  try {
    const searchResult = await yts(text);

    if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
      return client.sendMessage(
        m.chat,
        { text: formatStylishReply("Bruh, no YouTube results found! 😕 Try another search.") },
        { quoted: fq, ad: true }
      );
    }

    // Take first 5 results
    const videos = searchResult.videos.slice(0, 5);

    let replyText = `🔎 *YouTube Search Results for:* ${text}\n\n`;

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      replyText += `╭───(    TOXIC-MD    )───\n`;
      replyText += `🎬 *Title:* ${v.title}\n`;
      replyText += `📎 *Link:* ${v.url}\n`;
      replyText += `👤 *Author:* ${v.author.name} (${v.author.url})\n`;
      replyText += `👁 *Views:* ${v.views.toLocaleString()}\n`;
      replyText += `⏳ *Duration:* ${v.timestamp}\n`;
      replyText += `📅 *Uploaded:* ${v.ago}\n`;
      replyText += `\n`;
    }

    replyText += `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\nPσɯҽɾԃ Ⴆყ Tσxιƈ-ɱԃȥ`;

    await client.sendMessage(
      m.chat,
      { text: replyText },
      { quoted: fq, ad: true }
    );

    // Optionally send thumbnail of the first result
    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    await client.sendMessage(
      m.chat,
      {
        image: { url: videos[0].thumbnail },
        caption: formatStylishReply(`🎬 First result: *${videos[0].title}*\n📎 ${videos[0].url}`),
      },
      { quoted: fq }
    );

  } catch (error) {
    await client.sendMessage(
      m.chat,
      { text: formatStylishReply(`Error: ${error.message}`) },
      { quoted: fq, ad: true }
    );
  }
});
  