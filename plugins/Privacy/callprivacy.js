const ownerMiddleware = require('../../lib/Ownermiddleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        const options = ['all', 'known', 'none'];

        if (!text || !options.includes(text.toLowerCase())) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≥ CALL PRIVACY ≤───\n├ \n├ Set who can call you.\n├ Options: ${options.join(' / ')}\n├ Example: .callprivacy none\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        await client.updateCallPrivacy(text.toLowerCase());
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≥ CALL PRIVACY ≤───\n├ \n├ Updated to: *${text.toLowerCase()}*\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
};
