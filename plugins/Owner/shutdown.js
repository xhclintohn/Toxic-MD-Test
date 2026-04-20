const ownerMiddleware = require('../../lib/Ownermiddleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SHUTDOWN ≪───\n├ \n├ 💀 Toxic-MD going offline...\n├ Don't cry.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        setTimeout(() => process.exit(0), 2000);
    });
};
