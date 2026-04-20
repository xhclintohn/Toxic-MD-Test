const ownerMiddleware = require('../../lib/Ownermiddleware'); 
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = async (context) => {
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
};
