const ownerMiddleware = require('../../lib/Ownermiddleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

const toBlockJid = (jid) => {
    if (!jid) return null;
    const user = jid.split('@')[0].split(':')[0].replace(/\D/g, '');
    if (!user) return null;
    return user + '@s.whatsapp.net';
};

module.exports = async (context) => {
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
};
