// Cmds/Privacy.js — 8 commands
  'use strict';

  const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');

  // ── callprivacy
dreaded({
  pattern: "callprivacy",
  category: "Privacy",
  filename: __filename
}, async (context) => {
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
});

// ── groupadd
dreaded({
  pattern: "groupadd",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;
    const fq = getFakeQuoted(m);

if (!text) {
      m.reply("╭───(    TOXIC-MD    )───\n├ Provide a setting to update, you clueless fool.\n├ Example: groupadd all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      return;
    }


const availablepriv = ['all', 'contacts', 'contact_blacklist', 'none'];

if (!availablepriv.includes(text)) return m.reply(`╭───(    TOXIC-MD    )───\n├ Pick from: ${availablepriv.join('/')}\n├ It's not that hard.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

await client.updateGroupsAddPrivacy(text)
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ GROUP ADD ≪───\n├ \n├ Privacy updated to: *${text}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

})

});

// ── lastseen
dreaded({
  pattern: "lastseen",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');
    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;
    const fq = getFakeQuoted(m);

if (!text) {
      m.reply("╭───(    TOXIC-MD    )───\n├ Provide a setting to update, you clueless fool.\n├ Example: lastseen all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      return;
    }


const availablepriv = ['all', 'contacts', 'contact_blacklist', 'none'];

if (!availablepriv.includes(text)) return m.reply(`╭───(    TOXIC-MD    )───\n├ Pick from: ${availablepriv.join('/')}\n├ It's not that hard.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

await client.updateLastSeenPrivacy(text)
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ LAST SEEN ≪───\n├ \n├ Privacy updated to: *${text}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

})

});

// ── messageprivacy
dreaded({
  pattern: "messageprivacy",
  category: "Privacy",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

        const options = ['all', 'contacts', 'contact_blacklist', 'none'];

        if (!text || !options.includes(text.toLowerCase())) {
            return m.reply(`╭───(    TOXIC-MD    )───\n├───≥ MESSAGE PRIVACY ≤───\n├ \n├ Set who can message you.\n├ Options: ${options.join(' / ')}\n├ Example: .messageprivacy contacts\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        await client.updateMessagesPrivacy(text.toLowerCase());
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≥ MESSAGE PRIVACY ≤───\n├ \n├ Updated to: *${text.toLowerCase()}*\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});

// ── mypp
dreaded({
  pattern: "mypp",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');
    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;
    const fq = getFakeQuoted(m);

if (!text) {
      m.reply("╭───(    TOXIC-MD    )───\n├ Provide a setting to update, you clueless fool.\n├ Example: mypp all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      return;
    }


const availablepriv = ['all', 'contacts', 'contact_blacklist', 'none'];

if (!availablepriv.includes(text)) return m.reply(`╭───(    TOXIC-MD    )───\n├ Pick from: ${availablepriv.join('/')}\n├ It's not that hard.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

await client.updateProfilePicturePrivacy(text)
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PROFILE PIC ≪───\n├ \n├ Privacy updated to: *${text}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

})

});

// ── mystatus
dreaded({
  pattern: "mystatus",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;
    const fq = getFakeQuoted(m);

if (!text) {
      m.reply("╭───(    TOXIC-MD    )───\n├ Provide a setting to update, you clueless fool.\n├ Example: mystatus all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      return;
    }


const availablepriv = ['all', 'contacts', 'contact_blacklist', 'none'];

if (!availablepriv.includes(text)) return m.reply(`╭───(    TOXIC-MD    )───\n├ Pick from: ${availablepriv.join('/')}\n├ It's not that hard.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

await client.updateStatusPrivacy(text)
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ STATUS PRIVACY ≪───\n├ \n├ Privacy updated to: *${text}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

})

});

// ── online
dreaded({
  pattern: "online",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;
    const fq = getFakeQuoted(m);

if (!text) {
      m.reply("╭───(    TOXIC-MD    )───\n├ Provide a setting to update, you clueless fool.\n├ Example: online all\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
      return;
    }


const availablepriv = ['all', 'match_last_seen'];

if (!availablepriv.includes(text)) return m.reply(`╭───(    TOXIC-MD    )───\n├ Pick from: ${availablepriv.join('/')}\n├ It's not that hard.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

await client.updateOnlinePrivacy(text)
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ONLINE PRIVACY ≪───\n├ \n├ Privacy updated to: *${text}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

})

});

// ── privacy
dreaded({
  pattern: "privacy",
  category: "Privacy",
  filename: __filename
}, async (context) => {

const ownerMiddleware = require('../lib/Ownermiddleware');
const { getFakeQuoted } = require('../lib/fakeQuoted');
    await ownerMiddleware(context, async () => {

    const { client, m } = context;
    const fq = getFakeQuoted(m);

const Myself = await client.decodeJid(client.user.id);
    
    const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
        } = await client.fetchPrivacySettings(true);
        
        const fnn = `╭───(    TOXIC-MD    )───\n├───≫ PRIVACY SETTINGS ≪───\n├ \n├ Name: ${client.user.name}\n├ Online: ${online}\n├ Profile Picture: ${profile}\n├ Last Seen: ${last}\n├ Read Receipt: ${readreceipts}\n├ Group Add: ${groupadd}\n├ Status: ${status}\n├ Call Add: ${calladd}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;


const avatar = await client.profilePictureUrl(Myself, 'image').catch(_ => 'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg');

await client.sendMessage(m.chat, { image: { url: avatar}, caption: fnn}, { quoted: fq }) 


})

});
  