const ownerMiddleware = require('../../lib/Ownermiddleware');
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = {
    name: 'fullpp',
    aliases: ['setpp', 'setprofile'],
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, msgToxic, generateProfilePicture } = context;
            const fq = getFakeQuoted(m);

            try {
                const fs = require('fs');

                if (!msgToxic) {
                    return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ REPLY TO AN IMAGE!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }

                if (!msgToxic.imageMessage) {
                    return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ THAT IS NOT AN IMAGE!\n├ REPLY TO AN IMAGE!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }

                const medis = await client.downloadAndSaveMediaMessage(msgToxic.imageMessage);
                const { img } = await generateProfilePicture(medis);

                client.query({
                    tag: 'iq',
                    attrs: { target: undefined, to: S_WHATSAPP_NET, type: 'set', xmlns: 'w:profile:picture' },
                    content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
                });

                fs.unlinkSync(medis);
                m.reply(`╭───(    TOXIC-MD    )───\n├───≫ UPDATED ≪───\n├ \n├ Bot Profile Picture Updated.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

            } catch (error) {
                m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Failed to update profile photo.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        });
    }
};
