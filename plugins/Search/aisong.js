const { makeSong } = require('../../lib/toxicApi');
const { getFakeQuoted } = require('../../lib/fakeQuoted');
const { getSettings } = require('../../src/database');

module.exports = {
    name: 'aisong',
    aliases: ['gensong', 'songgenerator'],
    description: 'Generate a song using AI',
    category: 'Search',
    run: async (context) => {
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
    }
};