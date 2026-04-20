const ownerMiddleware = require('../../lib/Ownermiddleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

const BLOCKED_PATTERNS = [
    /process\.env/,
    /config\/settings/,
    /require\s*\(\s*['"].*settings['"]/
];

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        try {
            const trimmedText = text.trim();
            if (!trimmedText) return m.reply(`╭───(    TOXIC-MD    )───\n├ \n├ No command provided for eval!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            for (const pattern of BLOCKED_PATTERNS) {
                if (pattern.test(trimmedText)) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ BLOCKED ≪───\n├ \n├ That eval is blocked for security.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
            let evaled = await eval(trimmedText);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (evaled && evaled !== 'undefined' && evaled !== 'null') await m.reply(evaled);
        } catch (err) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ EVAL ERROR ≪───\n├ \n├ ${String(err)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
};
