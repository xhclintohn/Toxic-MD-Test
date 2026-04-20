const middleware = require('../../lib/middleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

const normalizeJid = (jid) => {
    if (!jid) return '';
    return jid.split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

module.exports = {
    name: 'tagadmins',
    aliases: ['tagadminto', 'pingjidmins', 'calladmins'],
    description: 'Mentions all admins in the group',
    run: async (context) => {
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
    }
};
