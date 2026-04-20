const middleware = require('../../lib/middleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        await client.groupSettingUpdate(m.chat, 'not_announcement');
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ OPENED ≪───\n├ \n├ Group opened. Talk your trash.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
};
