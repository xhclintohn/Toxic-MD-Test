const { getWarnCount, addWarn, resetWarn, getGroupSettings } = require('../../src/database');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = {
    name: 'warn',
    alias: ['warns', 'warnlist'],
    description: 'Warn a group member',
    run: async (context) => {
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
    }
};
