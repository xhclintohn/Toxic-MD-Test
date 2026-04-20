// Cmds/Search.js — 10 commands
  'use strict';

  const { makeSong } = require('../lib/toxicApi');
const { getFakeQuoted } = require('../lib/fakeQuoted');
const { getSettings } = require('../Database/config');
const fetch = require('node-fetch');

function getHeaders() {
    return {
        'User-Agent': 'Toxic-MD-Bot/2.0',
        'Accept': 'application/vnd.github.v3+json'
    };
}

async function githubUserStalk(user) {
    const response = await fetch('https://api.github.com/users/' + user, { headers: getHeaders() });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    return response.json();
}

async function githubRepoSearch(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    return response.json();
}

async function githubCodeSearch(query) {
    const response = await fetch(`https://api.github.com/search/code?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    return response.json();
}

async function githubTrending() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await fetch(`https://api.github.com/search/repositories?q=created:>${weekAgo}&sort=stars&order=desc`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    return response.json();
}
  const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const axios = require('axios');
const cheerio = require('cheerio');

  // ── aisong
dreaded({
  pattern: "aisong",
  alias: ["gensong","songgenerator"],
  desc: "Generate a song using AI",
  category: "Search",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        const settings = await getSettings();
        const prefix = settings.prefix || '.';

        const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

        if (!prompt) {
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀoʀ ≪───\n├ \n├ Give me something to work with.\n├ Example: ${prefix}aisong a sad love song about rain\n╰──────────────────☉\n> ©𝒯𝓎𝓌𝓂𝓃𝓁 𝒱𝒵 𝓽𝓵_𝓬𝓵𝓲𝓷𝓼𝓸𝓷`
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const result = await makeSong(prompt);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            const audioUrl = typeof result === 'string' ? result
                : (result?.audio || result?.url || result?.song || result?.output || '');

            if (audioUrl && audioUrl.startsWith('http')) {
                await client.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: 'song.mp3'
                }, { quoted: fq });
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ AI Sᴏɴɢ ≪───\n├ \n├ Prompt: ${prompt}\n├ Generated successfully.\n╰──────────────────☉\n> ©𝒯𝓎𝓌𝓂𝓃𝓁 𝒱𝒵 𝓽𝓵_𝓬𝓵𝓲𝓷𝓼𝓸𝓷`
                }, { quoted: fq });
            } else {
                const display = typeof result === 'string' ? result : JSON.stringify(result);
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ AI Sᴏɴɢ ≪───\n├ \n├ Prompt: ${prompt}\n├ \n├ ${display}\n╰──────────────────☉\n> ©𝒯𝓎𝓌𝓂𝓃𝓁 𝒱𝒵 𝓽𝓵_𝓬𝓵𝓲𝓷𝓼𝓸𝓷`
                }, { quoted: fq });
            }
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Fᴀɪʟᴇᴅ ≪───\n├ \n├ Song generation failed. Try again.\n╰──────────────────☉\n> ©𝒯𝓎𝓌𝓂𝓃𝓁 𝒱𝒵 𝓽𝓵_𝓬𝓵𝓲𝓷𝓼𝓸𝓷`
            }, { quoted: fq });
        }
    });

// ── github
dreaded({
  pattern: "github",
  category: "Search",
  filename: __filename
}, async (context) => {
    const { client, m, text, prefix, args, commandName } = context;
    const fq = getFakeQuoted(m);

    if (!text) {
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ GitHub Search ≪───\n├ Usage:\n├ ${prefix}github user <username>\n├ ${prefix}github repos <query>\n├ ${prefix}github trending\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    const subCommand = args[0]?.toLowerCase();
    const searchQuery = args.slice(1).join(' ');

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        if (subCommand === 'user' || subCommand === 'stalk') {
            if (!searchQuery) return m.reply('Give me a GitHub username to stalk.');
            const userData = await githubUserStalk(searchQuery);
            const bio = userData.bio || 'No bio';
            const location = userData.location || 'Unknown';
            const createdDate = new Date(userData.created_at).toLocaleDateString();
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(
                `╭───(    TOXIC-MD    )───\n├───≫ GitHub User ≪───\n├ Name: ${userData.name || userData.login}\n├ Username: @${userData.login}\n├ Bio: ${bio}\n├ Location: ${location}\n├ Repos: ${userData.public_repos}\n├ Followers: ${userData.followers}\n├ Following: ${userData.following}\n├ Joined: ${createdDate}\n├ URL: ${userData.html_url}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        } else if (subCommand === 'repos' || subCommand === 'search') {
            if (!searchQuery) return m.reply('Give me something to search, genius.');
            const repoData = await githubRepoSearch(searchQuery);
            if (!repoData.items || repoData.items.length === 0) return m.reply('No repositories found. Try a different query.');
            const top5 = repoData.items.slice(0, 5);
            const repoList = top5.map((repo, i) =>
                `├ ${i + 1}. ${repo.full_name}\n│  ⭐ ${repo.stargazers_count} | ${repo.language || 'Unknown'}\n│  ${repo.description ? repo.description.substring(0, 60) : 'No description'}`
            ).join('\n');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ GitHub Repos ≪───\n${repoList}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } else if (subCommand === 'trending') {
            const trendData = await githubTrending();
            if (!trendData.items || trendData.items.length === 0) return m.reply('No trending repos found.');
            const top5 = trendData.items.slice(0, 5);
            const trendList = top5.map((repo, i) =>
                `├ ${i + 1}. ${repo.full_name}\n│  ⭐ ${repo.stargazers_count} | ${repo.language || 'Unknown'}\n│  ${repo.description ? repo.description.substring(0, 60) : 'No description'}`
            ).join('\n');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ GitHub Trending ≪───\n${trendList}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } else {
            const userData = await githubUserStalk(text.trim());
            const bio = userData.bio || 'No bio';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(
                `╭───(    TOXIC-MD    )───\n├───≫ GitHub User ≪───\n├ Name: ${userData.name || userData.login}\n├ Username: @${userData.login}\n├ Bio: ${bio}\n├ Repos: ${userData.public_repos}\n├ Followers: ${userData.followers}\n├ URL: ${userData.html_url}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }
    } catch (error) {
        console.error('GitHub search error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        if (error.message.includes('404')) return m.reply('User/repo not found. Double-check the name.');
        if (error.message.includes('403')) return m.reply('GitHub rate limit hit. Try again in a minute.');
        await m.reply(`╭───(    TOXIC-MD    )───\n├ GitHub search failed.\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── google
dreaded({
  pattern: "google",
  category: "Search",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  const axios = require("axios");

  if (!text) {
    m.reply(
      "╭───(    TOXIC-MD    )───\n" +
      "├ ERROR\n" +
      "╭───(    TOXIC-MD    )───\n" +
      "│ 🚫 Please provide a search term!\n" +
      "├ Example: .google What is treason\n" +
      "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
    );
    return;
  }

  try {
    let { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`
    );

    if (data.items.length == 0) {
      m.reply(
        "╭───(    TOXIC-MD    )───\n" +
        "├ ERROR\n" +
        "╭───(    TOXIC-MD    )───\n" +
        "│ ❌ Unable to find any results\n" +
        "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
      );
      return;
    }

    let tex = "";
    tex += "╭───(    TOXIC-MD    )───\n";
    tex += "├ GOOGLE SEARCH\n";
    tex += "╭───(    TOXIC-MD    )───\n";
    tex += "│ 🔍 Search Term: " + text + "\n";
    tex += "╭───(    TOXIC-MD    )───\n";

    for (let i = 0; i < data.items.length; i++) {
      tex += "├ Result " + (i + 1) + "\n";
      tex += "│ 🪧 Title: " + data.items[i].title + "\n";
      tex += "│ 📝 Description: " + data.items[i].snippet + "\n";
      tex += "│ 🌐 Link: " + data.items[i].link + "\n";
      tex += "╭───(    TOXIC-MD    )───\n";
    }

    m.reply(tex);
  } catch (e) {
    m.reply(
      "╭───(    TOXIC-MD    )───\n" +
      "├ ERROR\n" +
      "╭───(    TOXIC-MD    )───\n" +
      "│ ❌ An error occurred: " + e.message + "\n" +
      "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
    );
  }
});

// ── lyrics
dreaded({
  pattern: "lyrics",
  category: "Search",
  filename: __filename
}, async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);

    if (!text) {
      return client.sendMessage(m.chat, {
        text: '╭───(    TOXIC-MD    )───\n├ Tell me a song name you dumbass!\n├ Example: .lyrics Alone ft ava max\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
      }, { quoted: fq });
    }

    try {
      const encodedText = encodeURIComponent(text);
      const apiUrl = `https://api.deline.web.id/tools/lyrics?title=${encodedText}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.status || !data.result || data.result.length === 0) {
        return client.sendMessage(m.chat, {
          text: `╭───(    TOXIC-MD    )───\n├ No lyrics found for "${text}". Maybe the song sucks.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
      }

      const song = data.result[0];
      if (!song.plainLyrics) {
        return client.sendMessage(m.chat, {
          text: '╭───(    TOXIC-MD    )───\n├ No plain lyrics for this one. Try another song, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
        }, { quoted: fq });
      }

      const cleanLyrics = song.plainLyrics;
      const songTitle = song.trackName || song.name || 'Unknown';
      const artistName = song.artistName || 'Unknown Artist';
      const bodyText = `╭───(    TOXIC-MD    )───\n├───≫ LYRICS ≪───\n├ \n├ ${songTitle} - ${artistName}\n├ \n${cleanLyrics}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
      const copyCode = `${songTitle} - ${artistName}\n\n${cleanLyrics}`.slice(0, 4096);

      try {
        const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
          interactiveMessage: {
            body: { text: bodyText },
            footer: { text: '' },
            nativeFlowMessage: {
              buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Lyrics', copy_code: copyCode }) }],
              messageParamsJson: ''
            }
          }
        }), { quoted: fq, userJid: client.user.id });
        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      } catch {
        await client.sendMessage(m.chat, { text: bodyText }, { quoted: fq });
      }
    } catch (error) {
      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ LYRICS ERROR ≪───\n├ \n├ Can't get lyrics for "${text}". Shit broke.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }
  });

// ── movie
dreaded({
  pattern: "movie",
  category: "Search",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  const axios = require("axios");

  if (!text) return m.reply("🚫 Please provide a movie name or TV show");

  try {
    let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${text}&plot=full`);
    let imdbt = "";

    imdbt += "╭───(    TOXIC-MD    )───\n";
    imdbt += "├ TOXIC-MD MOVIE SEARCH\n";
    imdbt += "╭───(    TOXIC-MD    )───\n";
    imdbt += "│ 🎬 Title       : " + fids.data.Title + "\n";
    imdbt += "│ 📅 Year        : " + fids.data.Year + "\n";
    imdbt += "│ ⭐ Rated       : " + fids.data.Rated + "\n";
    imdbt += "│ 📆 Released    : " + fids.data.Released + "\n";
    imdbt += "│ ⏳ Runtime     : " + fids.data.Runtime + "\n";
    imdbt += "│ 🌀 Genre       : " + fids.data.Genre + "\n";
    imdbt += "│ 👨‍💼 Director   : " + fids.data.Director + "\n";
    imdbt += "│ ✍️ Writer      : " + fids.data.Writer + "\n";
    imdbt += "│ 👥 Actors      : " + fids.data.Actors + "\n";
    imdbt += "│ 📜 Plot        : " + fids.data.Plot + "\n";
    imdbt += "│ 🌐 Language    : " + fids.data.Language + "\n";
    imdbt += "│ 🌍 Country     : " + fids.data.Country + "\n";
    imdbt += "│ 🏆 Awards      : " + fids.data.Awards + "\n";
    imdbt += "│ 💰 BoxOffice   : " + fids.data.BoxOffice + "\n";
    imdbt += "│ 🏭 Production  : " + fids.data.Production + "\n";
    imdbt += "│ 🌟 imdbRating  : " + fids.data.imdbRating + "\n";
    imdbt += "│ 🗳️ imdbVotes   : " + fids.data.imdbVotes + "\n";
    imdbt += "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧";

    await client.sendMessage(
      m.chat,
      {
        image: {
          url: fids.data.Poster,
        },
        caption: imdbt,
      },
      { quoted: fq }
    );
  } catch (e) {
    m.reply("❌ I cannot find that movie\n\n" + e);
  }
});

// ── npm
dreaded({
  pattern: "npm",
  alias: ["npmsearch","npmjs"],
  desc: "Search for NPM packages",
  category: "Search",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        try {
            const query = (text || '').trim();
            if (!query) return m.reply("╭───(    TOXIC-MD    )───\n├ Give me a package name, you useless human.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const data = await response.json();

            const objects = data?.objects || [];
            if (objects.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply(`╭───(    TOXIC-MD    )───\n├ No packages found for "${query}".\n├ Your search skills are as bad as your life choices.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            let resultText = "╭───(    TOXIC-MD    )───\n├───≫ NPM SEARCH ≪───\n├ \n";

            objects.forEach((obj, index) => {
                const pkg = obj.package;
                resultText += `├ ${index + 1}. ${pkg.name} v${pkg.version}\n`;
                if (pkg.description) resultText += `├   ${pkg.description.slice(0, 60)}\n`;
                resultText += `├   npmjs.com/package/${pkg.name}\n├ \n`;
            });

            if (data.total > 5) {
                resultText += `├ ...and ${data.total - 5} more results\n`;
            }

            resultText += "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧";

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await m.reply(resultText);

        } catch (error) {
            console.error('NPM search error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ NPM ERROR ≪───\n├ \n├ NPM search failed. ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── song
dreaded({
  pattern: "song",
  category: "Search",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  const yts = require("yt-search");

  const formatStylishReply = (message) => {
    return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
  };

  if (!text) {
    return m.reply(formatStylishReply("Yo, dumbass, give me a song name! 🎵 Don’t waste my time."));
  }

  if (text.length > 100) {
    return m.reply(formatStylishReply("What’s this essay, loser? Keep the song name short, max 100 chars."));
  }

  const { videos } = await yts(text);
  if (!videos || videos.length === 0) {
    return m.reply(formatStylishReply("No songs found, you got shit taste. 😕 Try something else."));
  }

  const song = videos[0];
  const title = song.title;
  const artist = song.author?.name || "Unknown Artist";
  const views = song.views?.toLocaleString() || "Unknown";
  const duration = song.duration?.toString() || "Unknown";
  const uploaded = song.ago || "Unknown";
  const thumbnail = song.thumbnail || "";
  const videoUrl = song.url;

  const response = `╭───(    TOXIC-MD    )───\n` +
                  `├ *${title}* found for @${m.sender.split('@')[0].split(':')[0]}! 🎶\n` +
                  `│🎤 *Artist*: ${artist}\n` +
                  `│👀 *Views*: ${views}\n` +
                  `│⏱ *Duration*: ${duration}\n` +
                  `│📅 *Uploaded*: ${uploaded}\n` +
                  (thumbnail ? `│🖼 *Thumbnail*: ${thumbnail}\n` : '') +
                  `│🔗 *Video*: ${videoUrl}\n` +
                  `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\n` +
                  `Powered by Toxic-MD`;

  await m.reply(formatStylishReply(response));
});

// ── sticker
dreaded({
  pattern: "sticker",
  alias: ["s","stick"],
  desc: "Fetches GIF stickers from Tenor with your search term",
  category: "Search",
  filename: __filename
}, async (context) => {
    const { client, m, text, botname } = context;
    const fq = getFakeQuoted(m);
    const axios = require('axios');
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');

    if (!botname) {
      console.error(`Botname not set, you useless fuck.`);
      return m.reply(`╭───(    TOXIC-MD    )───\nBot’s toast, no botname found! Yell at the dev, you legend.\nCheck https://github.com/xhclintohn/Toxic-MD\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    try {
      // Validate m.sender
      if (!m.sender || typeof m.sender !== 'string' || !m.sender.includes('@s.whatsapp.net')) {
        console.error(`Invalid m.sender: ${JSON.stringify(m.sender)}`);
        return m.reply(`╭───(    TOXIC-MD    )───\nCan’t read your number, you beast! Try again.\nCheck https://github.com/xhclintohn/Toxic-MD\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      const userNumber = m.sender.split('@')[0];

      // Check for search term
      if (!text) {
        return m.reply(`╭───(    TOXIC-MD    )───\nGimme a search term, @${userNumber}! Don’t choke, you legend. 🖼️\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [m.sender] });
      }

      // Notify in groups
      if (m.isGroup) {
        await m.reply(`╭───(    TOXIC-MD    )───\nSpamming groups? I got you in DMs, @${userNumber}! 📥🔥\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [m.sender] });
      }

      const tenorApiKey = 'AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c';

      // Fetch GIFs
      const gifResponse = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`
      );

      const results = gifResponse.data.results;
      if (!results || results.length === 0) {
        return m.reply(`╭───(    TOXIC-MD    )───\nNo stickers found for "${text}", @${userNumber}! Try something else, you slacker. 😈\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [m.sender] });
      }

      // Send up to 8 stickers
      for (let i = 0; i < Math.min(8, results.length); i++) {
        const gifUrl = results[i].media_formats.gif.url;

        const stickerMess = new Sticker(gifUrl, {
          pack: botname,
          author: '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
          type: StickerTypes.FULL,
          categories: ['🤩', '🎉'],
          id: `12345-${i}`,
          quality: 60,
          background: 'transparent'
        });

        const stickerBuffer = await stickerMess.toBuffer();
        await client.sendMessage(m.sender, { sticker: stickerBuffer }, { quoted: fq });
      }

    } catch (error) {
      console.error(`Sticker command fucked up: ${error.stack}`);
      await m.reply(`╭───(    TOXIC-MD    )───\nSticker fetch failed, @${userNumber}! Something’s busted, try again. 😈\nCheck https://github.com/xhclintohn/Toxic-MD\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [m.sender] });
    }
  });


async function fetchWallpapers(query) {
  const searchUrl = `https://www.uhdpaper.com/search?q=${encodeURIComponent(query)}&by-date=true`;

  const { data } = await axios.get(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
    },
    timeout: 30000
  });

  const $ = cheerio.load(data);
  const results = [];

  $('.post-outer').each((_, el) => {
    const title = $(el).find('h2').text().trim() || null;
    const resolution = $(el).find('b').text().trim() || null;
    let image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
    if (image && image.startsWith('//')) image = 'https:' + image;
    const description = $(el).find('p').text().trim() || null;
    const link = $(el).find('a').attr('href');
    if (image) {
      results.push({ title, resolution, image, description, source: 'uhdpaper.com', link: link ? 'https://www.uhdpaper.com' + link : null });
    }
  });

  return results;
}

// ── wallpaper
dreaded({
  pattern: "wallpaper",
  category: "Search",
  filename: __filename
}, async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);

  if (!text) {
    return m.reply("╭───(    TOXIC-MD    )───\n├ You forgot the query, dumbass.\n├ Try: .wallpaper anime girl, 5\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
  }

  let query, count;
  if (text.includes(',')) {
    const [q, c] = text.split(',');
    query = q.trim();
    count = parseInt(c.trim()) || 5;
  } else {
    query = text.trim();
    count = 5;
  }

  if (count > 20) count = 20;

  try {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    const results = await fetchWallpapers(query);

    if (results.length === 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply(`╭───(    TOXIC-MD    )───\n├ No wallpapers found for "${query}". Your taste sucks.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    const toSend = results.slice(0, count);

    for (let i = 0; i < toSend.length; i++) {
      const wp = toSend[i];
      const caption = `╭───(    TOXIC-MD    )───\n├───≫ WALLPAPER ${i + 1}/${toSend.length} ≪───\n├ \n` +
                      `├ Title: ${wp.title || 'Untitled'}\n` +
                      `├ Resolution: ${wp.resolution || 'Unknown'}\n` +
                      `├ Desc: ${wp.description || 'No description'}\n` +
                      `├ Link: ${wp.link || 'N/A'}\n` +
                      `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(m.chat, {
        image: { url: wp.image },
        caption,
      }, { quoted: fq });

      if (i < toSend.length - 1) await new Promise(res => setTimeout(res, 1500));
    }

    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('Wallpaper error:', err);
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ WALLPAPER ERROR ≪───\n├ \n├ Failed to fetch wallpapers. Site's probably dead.\n├ ${err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
});


// ── wiki
dreaded({
  pattern: "wiki",
  category: "Search",
  filename: __filename
}, async (context) => {

const { client, m, text } = context;
const fq = getFakeQuoted(m);



const wiki = require('wikipedia');

        try {
            if (!text) return m.reply("╭───(    TOXIC-MD    )───\n├ Provide a term to search, you lazy fool.\n├ E.g: What is JavaScript!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧")
            const con = await wiki.summary(text);
            const texa = `╭───(    TOXIC-MD    )───\n├───≫ WIKIPEDIA ≪───\n├ \n├ Title: ${con.title}\n├ Desc: ${con.description}\n├ \n├ Summary: ${con.extract}\n├ \n├ URL: ${con.content_urls.mobile.page}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            m.reply(texa)
        } catch (err) {
            console.log(err)
            return m.reply("╭───(    TOXIC-MD    )───\n├ Got 404. Couldn't find anything, try harder.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧")
        }
    });
  