const { getSettings } = require("../../src/database");
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = {
  name: 'addbutton',
  aliases: ['addbtn'],
  description: 'Adds a custom button to the menu',
  run: async (context) => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    try {
      if (args.length < 2) {
        await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ USAGE ≪───\n├ \n├ .addbutton <button_name> <command>\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
        return;
      }
      const buttonName = args[0];
      const command = args[1];
      await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ BUTTON ADDED ≪───\n├ \n├ Added button "${buttonName}"\n├ for command "${command}"\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
    } catch (error) {
      console.error(`AddButton error: ${error.stack}`);
      await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ Error adding custom button.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
    }
  }
};
