// Cmds/Settings.js — 33 commands
  'use strict';

  const ownerMiddleware = require('../lib/Ownermiddleware');
  const { getSudoUsers, addSudoUser } = require('../Database/config');
  const { getFakeQuoted } = require('../lib/fakeQuoted');
const { getSettings, getAllowedUsers, addAllowedUser, removeAllowedUser } = require('../Database/config');

function cleanNumber(raw) {
    return (raw || '').replace(/[\s+\-().]/g, '').trim();
}
const { updateSetting } = require('../Database/config');
const { getGroupSettings, updateGroupSetting } = require('../Database/config');
const { banUser, getBannedUsers } = require('../Database/config');
const { removeSudoUser } = require('../Database/config');

const formatStylishReply = (message) => {
    return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
};
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

const MODES = {
    public:  { emoji: '🌐', label: 'PUBLIC',  desc: 'Everyone can use commands, anywhere.' },
    private: { emoji: '🔒', label: 'PRIVATE', desc: 'Only you (the owner) can use commands.' },
    group:   { emoji: '👥', label: 'GROUP',   desc: 'Commands work in groups only. DMs ignored.' },
    inbox:   { emoji: '📩', label: 'INBOX',   desc: 'Commands work in DMs only. Groups ignored.' },
};

const CRANKY = {
    public:  "Fine. Everyone gets access. Don't complain when they break everything.",
    private: "Private mode. Nobody touches my commands but you. Finally some peace.",
    group:   "Group mode. DMs are off. If you want something, say it in a group like everyone else.",
    inbox:   "Inbox mode. Groups ignored. Slide into my DMs and we can talk.",
};
const { botname } = require('../Env/settings');

const DEV_NUMBER = '254114885159';
const { unbanUser } = require('../Database/config');

  // ── addsudo
dreaded({
  pattern: "addsudo",
  category: "Settings",
  filename: __filename
}, async (context) => {
      await ownerMiddleware(context, async () => {
          const { client, m, args, participants } = context;
          const fq = getFakeQuoted(m);

          let numberToAdd;

          if (m.quoted) {
              let targetSender = m.quoted.sender || '';
              if (targetSender.endsWith('@lid')) {
                  const lidKey = targetSender.split('@')[0].split(':')[0];
                  const found = (participants || []).find(p => {
                      const pLid = (p.lid || '').split('@')[0].split(':')[0];
                      return pLid === lidKey;
                  });
                  if (found) targetSender = found.jid || found.id || targetSender;
              }
              numberToAdd = targetSender.split('@')[0].split(':')[0];
          } else if (m.mentionedJid && m.mentionedJid.length > 0) {
              numberToAdd = m.mentionedJid[0].split('@')[0].split(':')[0];
          } else {
              numberToAdd = (args[0] || '').replace(/[^0-9]/g, '');
          }

          if (!numberToAdd || !/^\d+$/.test(numberToAdd)) {
              return client.sendMessage(m.chat, {
                  text:
                      `╭───(    TOXIC-MD    )───\n` +
                      `├───≫ ADD SUDO ≪───\n` +
                      `├ \n` +
                      `├ Pathetic attempt, moron!\n` +
                      `├ Give me a valid number or quote a user, fool!\n` +
                      `╰──────────────────☉\n` +
                      `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          const sudoUsers = await getSudoUsers();
          if (sudoUsers.includes(numberToAdd)) {
              return client.sendMessage(m.chat, {
                  text:
                      `╭───(    TOXIC-MD    )───\n` +
                      `├───≫ ADD SUDO ≪───\n` +
                      `├ \n` +
                      `├ Already a sudo user, you clueless twit!\n` +
                      `├ ${numberToAdd} is already in the elite ranks.\n` +
                      `╰──────────────────☉\n` +
                      `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          await addSudoUser(numberToAdd);
          await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
          return client.sendMessage(m.chat, {
              text:
                  `╭───(    TOXIC-MD    )───\n` +
                  `├───≫ ADD SUDO ≪───\n` +
                  `├ \n` +
                  `├ Bow down!\n` +
                  `├ ${numberToAdd} is now a Sudo King!\n` +
                  `╰──────────────────☉\n` +
                  `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
      });
  });

// ── allow
dreaded({
  pattern: "allow",
  alias: ["allowuser","allowai"],
  desc: "Allow specific numbers to use autoai when autoai is off",
  category: "Settings",
  filename: __filename
}, async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, args, prefix } = context;
            const fq = getFakeQuoted(m);

            const fmt = (title, lines) => {
                const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
                return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            };

            try {
                const settings = await getSettings();
                const autoaiOn = settings?.autoai === true || settings?.autoai === 'true' || settings?.autoai === 'on';

                if (autoaiOn) {
                    return client.sendMessage(m.chat, {
                        text: fmt('ALLOW', [
                            'AutoAI is ON — replies to everyone.',
                            'Turn it off first to manage allowed list.',
                            `Use: ${prefix}autoai off`
                        ])
                    }, { quoted: fq });
                }

                const sub = (args[0] || '').toLowerCase();

                if (sub === 'list') {
                    const list = await getAllowedUsers();
                    if (!list.length) {
                        return client.sendMessage(m.chat, {
                            text: fmt('ALLOW LIST', 'No one allowed. AutoAI is off for everyone 💀')
                        }, { quoted: fq });
                    }
                    return client.sendMessage(m.chat, {
                        text: fmt('ALLOW LIST', [`Total: ${list.length}`, ...list.map((n, i) => `${i + 1}. ${n}`)])
                    }, { quoted: fq });
                }

                if (sub === 'remove' || sub === 'del' || sub === 'delete') {
                    const raw = args.slice(1).join('');
                    const num = cleanNumber(raw);
                    if (!num || num.length < 6) {
                        return client.sendMessage(m.chat, {
                            text: fmt('ALLOW', [`Provide a valid number.`, `Example: ${prefix}allow remove 254712345678`])
                        }, { quoted: fq });
                    }
                    await removeAllowedUser(num);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                    return client.sendMessage(m.chat, {
                        text: fmt('ALLOW', [`Removed: ${num}`, 'AutoAI will no longer respond to them.'])
                    }, { quoted: fq });
                }

                const rawNum = (sub === 'add' ? args.slice(1).join('') : args.join('')).trim();
                const num = cleanNumber(rawNum);

                if (!num || num.length < 6) {
                    const list = await getAllowedUsers();
                    return client.sendMessage(m.chat, {
                        text: fmt('ALLOW', [
                            `Status: AutoAI OFF`,
                            `Allowed users: ${list.length}`,
                            '',
                            `Add: ${prefix}allow 254712345678`,
                            `Remove: ${prefix}allow remove 254712345678`,
                            `List: ${prefix}allow list`
                        ])
                    }, { quoted: fq });
                }

                await addAllowedUser(num);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                return client.sendMessage(m.chat, {
                    text: fmt('ALLOW', [`Added: ${num}`, 'AutoAI will respond to them even while off.'])
                }, { quoted: fq });

            } catch {
                client.sendMessage(m.chat, {
                    text: fmt('ALLOW', 'something broke. try again.')
                }, { quoted: fq });
            }
        });
    });

// ── anticall
dreaded({
  pattern: "anticall",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTICALL", "Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();
      const isEnabled = settings.anticall === true;

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (isEnabled === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("ANTICALL", `Yo, genius! Anticall is already ${value.toUpperCase()}! Stop wasting my time, moron.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('anticall', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTICALL", `Anticall ${value.toUpperCase()}! Callers will get wrecked!`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}anticall on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}anticall off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply("ANTICALL", `Anticall Status: ${isEnabled ? 'ON' : 'OFF'}. Pick a vibe, noob!`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("ANTICALL", "Shit broke, couldn't update anticall. Database or something's fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── antidelete
dreaded({
  pattern: "antidelete",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTIDELETE", "Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.antidelete === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("ANTIDELETE", `Antidelete's already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('antidelete', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTIDELETE", `Antidelete ${value.toUpperCase()} activated! ${action ? 'No one\'s erasing shit on my watch, king!' : 'Deletions are free to slide, you\'re not worth catching.'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}antidelete on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}antidelete off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply("ANTIDELETE", `Antidelete's ${settings.antidelete ? 'ON' : 'OFF'}, dumbass. Pick a vibe, noob!`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("ANTIDELETE", "Shit broke, couldn't mess with antidelete. Database or something's fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── antidemote
dreaded({
  pattern: "antidemote",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    if (!jid.endsWith('@g.us')) {
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", "Epic fail, loser!\n├ This command is for groups only, moron!") }, { quoted: fq });
    }

    const settings = await getSettings();
    const prefix = settings.prefix;

    let groupSettings = await getGroupSettings(jid);
    let isEnabled = groupSettings?.antidemote === true;

    if (value === 'on' || value === 'off') {
      const action = value === 'on';

      if (isEnabled === action) {
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", `Antidemote is already ${value.toUpperCase()}, you brainless fool!\n├ Quit wasting my time!`) }, { quoted: fq });
      }

      await updateGroupSetting(jid, 'antidemote', action ? 'true' : 'false');
      await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", `Antidemote ${value.toUpperCase()}!\n├ Demotions are under my watch, king!`) }, { quoted: fq });
    }

    const buttons = [
      { buttonId: `${prefix}antidemote on`, buttonText: { displayText: "ON" }, type: 1 },
      { buttonId: `${prefix}antidemote off`, buttonText: { displayText: "OFF" }, type: 1 },
    ];

    await client.sendMessage(m.chat, {
      text: formatStylishReply("ANTIDEMOTE", `Antidemote's ${isEnabled ? 'ON' : 'OFF'} right now. Pick one, fool!`),
      buttons,
      headerType: 1,
      viewOnce: true,
    }, { quoted: fq });
  });
});

// ── antiedit
dreaded({
  pattern: "antiedit",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTIEDIT", "Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.antiedit === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("ANTIEDIT", `Antiedit's already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('antiedit', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTIEDIT", `Antiedit ${value.toUpperCase()} activated! ${action ? 'Every sneaky edit gets caught now. No hiding.' : 'Edits fly under the radar. Your loss.'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}antiedit on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}antiedit off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply("ANTIEDIT", `Antiedit's ${settings.antiedit ? 'ON' : 'OFF'}. Pick your poison.`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("ANTIEDIT", "Shit broke, couldn't mess with antiedit. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── antiforeign
dreaded({
  pattern: "antiforeign",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    if (!jid.endsWith('@g.us')) {
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", "Yo, dumbass, this command's for groups only. Get lost.") }, { quoted: fq });
    }

    try {
      const settings = await getSettings();
      if (!settings) {
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", "Database is fucked, no settings found. Fix it, loser.") }, { quoted: fq });
      }

      let groupSettings = await getGroupSettings(jid);
      if (!groupSettings) {
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", "No group settings found. Database's acting up, try again.") }, { quoted: fq });
      }

      let isEnabled = groupSettings?.antiforeign === true;

      const Myself = await client.decodeJid(client.user.id);
      const groupMetadata = await client.groupMetadata(m.chat);
      const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const isBotAdmin = userAdmins.includes(Myself);

      if (value === 'on' || value === 'off') {
        if (!isBotAdmin) {
          return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", "Make me an admin first, you clown. Can't touch antiforeign without juice.") }, { quoted: fq });
        }

        const action = value === 'on';

        if (isEnabled === action) {
          return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", `Antiforeign's already ${value.toUpperCase()}, genius. Stop wasting my time.`) }, { quoted: fq });
        }

        await updateGroupSetting(jid, 'antiforeign', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", `Antiforeign's now ${value.toUpperCase()}. Foreigners better watch out or get yeeted!`) }, { quoted: fq });
      }

      const buttons = [
        { buttonId: `${prefix}antiforeign on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}antiforeign off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(m.chat, {
        text: formatStylishReply("ANTIFOREIGN", `Antiforeign's ${isEnabled ? 'ON' : 'OFF'} in this group, dipshit. Pick a vibe!`),
        buttons,
        headerType: 1,
        viewOnce: true,
      }, { quoted: fq });
    } catch (error) {
      console.error('[Antiforeign] Error in command:', error);
      await client.sendMessage(m.chat, { text: formatStylishReply("ANTIFOREIGN", "Shit broke, couldn't mess with antiforeign. Database or something's fucked. Try later.") }, { quoted: fq });
    }
  });
});

// ── antipromote
dreaded({
  pattern: "antipromote",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    if (!jid.endsWith('@g.us')) {
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", "Nice try, idiot!\n├ This command is for groups only, you moron!") }, { quoted: fq });
    }

    const settings = await getSettings();
    const prefix = settings.prefix;

    let groupSettings = await getGroupSettings(jid);
    let isEnabled = groupSettings?.antipromote === true;

    if (value === 'on' || value === 'off') {
      const action = value === 'on';

      if (isEnabled === action) {
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", `Antipromote is already ${value.toUpperCase()}, you clueless moron!\n├ Stop spamming my commands!`) }, { quoted: fq });
      }

      await updateGroupSetting(jid, 'antipromote', action ? 'true' : 'false');
      await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", `Antipromote ${value.toUpperCase()}!\n├ Promotions are under my control, king!`) }, { quoted: fq });
    }

    const buttons = [
      { buttonId: `${prefix}antipromote on`, buttonText: { displayText: "ON" }, type: 1 },
      { buttonId: `${prefix}antipromote off`, buttonText: { displayText: "OFF" }, type: 1 },
    ];

    await client.sendMessage(m.chat, {
      text: formatStylishReply("ANTIPROMOTE", `Antipromote's ${isEnabled ? 'ON' : 'OFF'} right now. Pick one, fool!`),
      buttons,
      headerType: 1,
      viewOnce: true,
    }, { quoted: fq });
  });
});

// ── antitag
dreaded({
  pattern: "antitag",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        const formatStylishReply = (title, message) => {
            return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
        };

        if (!jid.endsWith('@g.us')) {
            return await client.sendMessage(m.chat, { text: formatStylishReply("ANTITAG", "This command can only be used in groups, fool!") }, { quoted: fq });
        }

        let groupSettings = await getGroupSettings(jid);
        let isEnabled = groupSettings?.antitag === true;

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await client.sendMessage(m.chat, { text: formatStylishReply("ANTITAG", "I need admin privileges to enable Antitag, you clown!") }, { quoted: fq });
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (isEnabled === action) {
                return await client.sendMessage(m.chat, { text: formatStylishReply("ANTITAG", `Antitag is already ${value.toUpperCase()}, genius!`) }, { quoted: fq });
            }

            await updateGroupSetting(jid, 'antitag', action ? 'true' : 'false');
            await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
            return await client.sendMessage(m.chat, { text: formatStylishReply("ANTITAG", `Antitag has been turned ${value.toUpperCase()} for this group.`) }, { quoted: fq });
        }

        const buttons = [
            { buttonId: `${prefix}antitag on`, buttonText: { displayText: "ON" }, type: 1 },
            { buttonId: `${prefix}antitag off`, buttonText: { displayText: "OFF" }, type: 1 },
        ];

        await client.sendMessage(m.chat, {
            text: formatStylishReply("ANTITAG", `Antitag's ${isEnabled ? 'ON' : 'OFF'} right now. Pick one, peasant!`),
            buttons,
            headerType: 1,
            viewOnce: true,
        }, { quoted: fq });
    });
});

// ── autoai
dreaded({
  pattern: "autoai",
  alias: ["groqai","aibot","autogpt"],
  desc: "Toggle Auto AI replies — responds to all DMs and when mentioned or replied to in groups",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, args, prefix } = context;
      const fq = getFakeQuoted(m);

      const fmt = (title, lines) => {
        const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
        return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
      };

      try {
        const settings = await getSettings();
        const value = (args[0] || '').toLowerCase();

        if (value === 'on' || value === 'off') {
          const newState = value === 'on';
          if (settings.autoai === newState) {
            return client.sendMessage(m.chat, { text: fmt('AUTO AI', `already ${value.toUpperCase()} 🙄 stop pressing buttons`) }, { quoted: fq });
          }
          await updateSetting('autoai', newState);
          await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
          return client.sendMessage(m.chat, {
            text: fmt('AUTO AI', newState
              ? ['Status: ✅ ON', 'Replies to all DMs + @mentions in groups.', 'God help them 😒']
              : ['Status: ❌ OFF', 'Silent mode. Finally.'])
          }, { quoted: fq });
        }

        const isOn = settings.autoai === true || settings.autoai === 'true';
        return client.sendMessage(m.chat, {
          text: fmt('AUTO AI', [
            `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
            `DMs: replies to every message`,
            `Groups: replies when @mentioned or when its message is replied to`,
            '',
            `Toggle: ${prefix}autoai on  /  ${prefix}autoai off`
          ])
        }, { quoted: fq });

      } catch {
        client.sendMessage(m.chat, { text: fmt('AUTO AI', 'something broke. try again.') }, { quoted: fq });
      }
    });
  });

// ── autobio
dreaded({
  pattern: "autobio",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("AUTOBIO", "Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.autobio === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("AUTOBIO", `Autobio's already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('autobio', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("AUTOBIO", `Autobio ${value.toUpperCase()} activated! ${action ? 'Bot\'s flexing status updates every 10 seconds, bow down!' : 'No more status flexing, you\'re not worth it.'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}autobio on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}autobio off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply("AUTOBIO", `Autobio's ${settings.autobio ? 'ON' : 'OFF'}, dumbass. Pick a vibe, noob!`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("AUTOBIO", "Shit broke, couldn't mess with autobio. Database or something's fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── autolike
dreaded({
  pattern: "autolike",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);

    try {
      const settings = await getSettings();
      const prefix = settings.prefix || '.';
      const value = args[0]?.toLowerCase();

      if (value === 'on' || value === 'off') {
        const newValue = value === 'on';

        if (settings.autolike === newValue) {
          await m.reply(
            `╭───(    TOXIC-MD    )───\n` +
            `├───≫ AUTOLIKE ≪───\n` +
            `├ \n` +
            `├ Autolike is already ${value.toUpperCase()}, you brain-dead fool!\n` +
            `╰──────────────────☉\n` +
            `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          );
          return;
        }

        await updateSetting('autolike', newValue);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });

        await m.reply(
          `╭───(    TOXIC-MD    )───\n` +
          `├───≫ AUTOLIKE ≪───\n` +
          `├ \n` +
          `├ Autolike ${value.toUpperCase()}! ${value === 'on' ? 'Bot will now like statuses!' : 'Bot will ignore statuses like they ignore you.'}\n` +
          `╰──────────────────☉\n` +
          `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        );
        return;
      }

    
      const isAutolikeOn = settings.autolike === true;
      const currentEmoji = settings.autolikeemoji || 'random';
      
      const statusText = isAutolikeOn ? 
                        `ON (${currentEmoji === 'random' ? 'Random emojis' : currentEmoji + ' emoji'})` : 
                        'OFF';

      await client.sendMessage(m.chat, {
        interactiveMessage: {
          header: `╭───(    TOXIC-MD    )───\n├───≫ AUTOLIKE ≪───\n├ \n├ Current: ${statusText}\n├ \n├ Use "${prefix}autolike on" to turn ON\n├ Use "${prefix}autolike off" to turn OFF\n├ Use "${prefix}reaction <emoji>" to change emoji\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "TURN ON",
                id: `${prefix}autolike on`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "TURN OFF",
                id: `${prefix}autolike off`
              })
            }
          ]
        }
      }, { quoted: fq });

    } catch (error) {
      console.error('Autolike command error:', error);
      await m.reply(
        `╭───(    TOXIC-MD    )───\n` +
        `├───≫ AUTOLIKE ≪───\n` +
        `├ \n` +
        `├ Failed to update autolike. Database might be drunk.\n` +
        `╰──────────────────☉\n` +
        `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      );
    }
  });
});

// ── autoread
dreaded({
  pattern: "autoread",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("AUTOREAD", "Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.autoread === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("AUTOREAD", `Autoread message already ${value.toUpperCase()}, genius. Stop wasting my time.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('autoread', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("AUTOREAD", `Autoread ${value.toUpperCase()} activated! ${action ? 'Bot\'s reading every message like a creep.' : 'No more spying on your trash messages.'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}autoread on`, buttonText: { displayText: "ON" }, type: 1 },
        { buttonId: `${prefix}autoread off`, buttonText: { displayText: "OFF" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply("AUTOREAD", `Autoread's ${settings.autoread ? 'ON' : 'OFF'}, dumbass. Pick a vibe, noob!`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("AUTOREAD", "Shit broke, couldn't mess with autoread. Database or something's fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── autoview
dreaded({
  pattern: "autoview",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (title, message) => {
      return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n├ ${message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply('AUTOVIEW', 'Database is down, no settings found. Fix it, loser.') },
          { quoted: fq, ad: true }
        );
      }

      const value = args[0]?.toLowerCase();
      const validOptions = ['on', 'off'];

      if (validOptions.includes(value)) {
        const newState = value === 'on';
        if (settings.autoview === newState) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply('AUTOVIEW', `Autoview Status is already ${value.toUpperCase()}, you brainless fool! Stop wasting my time!`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('autoview', newState);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply('AUTOVIEW', `Autoview Status ${value.toUpperCase()}! ${newState ? 'I\'ll view every status like a king!' : 'I\'m done with your boring statuses.'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}autoview on`, buttonText: { displayText: 'ON' }, type: 1 },
        { buttonId: `${prefix}autoview off`, buttonText: { displayText: 'OFF' }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply('AUTOVIEW', `Autoview Status: ${settings.autoview ? 'ON (Watching all statuses)' : 'OFF (Ignoring statuses)'}\n├ Pick an option, noob!`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply('AUTOVIEW', 'Something broke, couldn\'t update Autoview. Database is probably drunk. Try later.') },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── ban
dreaded({
  pattern: "ban",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);

        let settings = await getSettings();
        if (!settings) {
            return await m.reply(
                `╭───(    TOXIC-MD    )───\n` +
                `├───≫ BAN ≪───\n` +
                `├ \n` +
                `├ Settings not found, you broke something.\n` +
                `╰──────────────────☉\n` +
                `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        const sudoUsers = await getSudoUsers();
        

        let numberToBan;

        if (m.quoted) {
            numberToBan = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToBan = m.mentionedJid[0];
        } else {
            numberToBan = args[0];
        }

        if (!numberToBan) {
            return await m.reply(
                `╭───(    TOXIC-MD    )───\n` +
                `├───≫ BAN ≪───\n` +
                `├ \n` +
                `├ Please provide a valid number or quote a user, moron.\n` +
                `╰──────────────────☉\n` +
                `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

      
        if (numberToBan.includes('@s.whatsapp.net')) {
            numberToBan = numberToBan.split('@')[0];
        }

        

        if (sudoUsers.includes(numberToBan)) {
            return await m.reply(
                `╭───(    TOXIC-MD    )───\n` +
                `├───≫ BAN ≪───\n` +
                `├ \n` +
                `├ You cannot ban a Sudo User, you absolute fool!\n` +
                `╰──────────────────☉\n` +
                `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        const bannedUsers = await getBannedUsers();

        if (bannedUsers.includes(numberToBan)) {
            return await m.reply(
                `╭───(    TOXIC-MD    )───\n` +
                `├───≫ BAN ≪───\n` +
                `├ \n` +
                `├ This user is already banned, genius.\n` +
                `╰──────────────────☉\n` +
                `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        await banUser(numberToBan);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        await m.reply(
            `╭───(    TOXIC-MD    )───\n` +
            `├───≫ BAN ≪───\n` +
            `├ \n` +
            `├ ${numberToBan} has been banned. Get wrecked!\n` +
            `╰──────────────────☉\n` +
            `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        );
    });
});

// ── banlist
dreaded({
  pattern: "banlist",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);

        const bannedUsers = await getBannedUsers();

        if (!bannedUsers || bannedUsers.length === 0) {
            return await m.reply(
                `╭───(    TOXIC-MD    )───\n` +
                `├───≫ BAN LIST ≪───\n` +
                `├ \n` +
                `├ There are no banned users at the moment.\n` +
                `╰──────────────────☉\n` +
                `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        const list = bannedUsers.map((num, index) => `├ ${index + 1}. ${num}`).join('\n');
        await m.reply(
            `╭───(    TOXIC-MD    )───\n` +
            `├───≫ BAN LIST ≪───\n` +
            `├ \n` +
            `${list}\n` +
            `╰──────────────────☉\n` +
            `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        );
    });
});

// ── chatbotpm
dreaded({
  pattern: "chatbotpm",
  alias: ["chatbot","autoreply"],
  desc: "Toggle Auto AI replies — responds to all DMs and when mentioned or replied to in groups",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, args, prefix } = context;
      const fq = getFakeQuoted(m);

      const fmt = (title, lines) => {
        const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
        return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
      };

      try {
        const settings = await getSettings();
        const value = (args[0] || '').toLowerCase();

        if (value === 'on' || value === 'off') {
          const newState = value === 'on';
          if (settings.autoai === newState) {
            return client.sendMessage(m.chat, { text: fmt('AUTO AI', `already ${value.toUpperCase()} 🙄 stop pressing buttons`) }, { quoted: fq });
          }
          await updateSetting('autoai', newState);
          await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
          return client.sendMessage(m.chat, {
            text: fmt('AUTO AI', newState
              ? ['Status: ✅ ON', 'Replies to all DMs + @mentions in groups.', 'God help them 😒']
              : ['Status: ❌ OFF', 'Silent mode. Finally.'])
          }, { quoted: fq });
        }

        const isOn = settings.autoai === true || settings.autoai === 'true';
        return client.sendMessage(m.chat, {
          text: fmt('AUTO AI', [
            `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
            `DMs: replies to every message`,
            `Groups: replies when @mentioned or when its message is replied to`,
            '',
            `Toggle: ${prefix}chatbotpm on  /  ${prefix}chatbotpm off`
          ])
        }, { quoted: fq });

      } catch {
        client.sendMessage(m.chat, { text: fmt('AUTO AI', 'something broke. try again.') }, { quoted: fq });
      }
    });
  });

// ── checksudo
dreaded({
  pattern: "checksudo",
  category: "Settings",
  filename: __filename
}, async (context) => {
  
    const { m } = context;
    const fq = getFakeQuoted(m);

    const sudoUsers = await getSudoUsers();

    if (!sudoUsers || sudoUsers.length === 0) {
      return await m.reply("╭───(    TOXIC-MD    )───\n├ No Sudo Users found. You're all alone.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }

    await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SUDO USERS ≪───\n├ \n${sudoUsers.map((jid) => `├ ${jid}`).join('\n')}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
 
});

// ── delsudo
dreaded({
  pattern: "delsudo",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);

        let numberToRemove;

        if (m.quoted) {
            numberToRemove = m.quoted.sender.split('@')[0];
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToRemove = m.mentionedJid[0].split('@')[0];
        } else {
            numberToRemove = args[0];
        }

        if (!numberToRemove || !/^\d+$/.test(numberToRemove)) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ Provide a valid number or quote a user, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        const settings = await getSettings();
        if (!settings) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ Settings not found. Something's seriously broken.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        const sudoUsers = await getSudoUsers();

        if (!sudoUsers.includes(numberToRemove)) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ This number isn't even a sudo user, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

      
        await removeSudoUser(numberToRemove);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ DELSUDO ≪───\n├ \n├ ${numberToRemove} removed from Sudo Users.\n├ Power revoked. Sucks to be them.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});

// ── events
dreaded({
  pattern: "events",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);
    const jid = m.chat;

    const formatStylishReply = (message) => {
      return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      if (!jid.endsWith('@g.us')) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Yo, dumbass! 😈 This command only works in groups, not your sad DMs. 🖕") },
          { quoted: fq, ad: true }
        );
      }

      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser. 💀") },
          { quoted: fq, ad: true }
        );
      }

      const value = args[0]?.toLowerCase();
      let groupSettings = await getGroupSettings(jid);
      console.log('Toxic-MD: Group settings for', jid, ':', groupSettings);
      let isEnabled = groupSettings?.events === true || groupSettings?.events === 'true';

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (isEnabled === action) {
          return await client.sendMessage(
            m.chat,
            {
              text: formatStylishReply(
                `Yo, genius! 😈 Events are already ${value.toUpperCase()} in this group! Stop wasting my time, moron. 🖕`
              ),
            },
            { quoted: fq, ad: true }
          );
        }

        await updateGroupSetting(jid, 'events', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          {
            text: formatStylishReply(
              `Events ${value.toUpperCase()}! 🔥 ${action ? 'Group events are live, let’s make some chaos! 💥' : 'Events off, you boring loser. 😴'}`
            ),
          },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}events on`, buttonText: { displayText: 'ON 🥶' }, type: 1 },
        { buttonId: `${prefix}events off`, buttonText: { displayText: 'OFF 😴' }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(
            `Events Status: ${isEnabled ? 'ON 🥶' : 'OFF 😴'}. Pick a vibe, noob! 😈`
          ),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      console.error('Toxic-MD: Error in events.js:', error.stack);
      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(
            `Shit broke, couldn’t update events. Database error: ${error.message}. Try later, moron. 💀`
          ),
        },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── gcpresence
dreaded({
  pattern: "gcpresence",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);
        const value = args[0]?.toLowerCase();
        const jid = m.chat;
        
        const settings = await getSettings();
        const prefix = settings.prefix || '.';
        
        let groupSettings = {};
        let isEnabled = false;
        
        if (jid.endsWith('@g.us')) {
            groupSettings = await getGroupSettings(jid);
            isEnabled = groupSettings.gcpresence === true;
        }
        
        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            
            if (isEnabled === action) {
                return await m.reply(formatStylishReply(`Already ${value.toUpperCase()}`));
            }
            
            if (jid.endsWith('@g.us')) {
                await updateGroupSetting(jid, 'gcpresence', action);
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                await m.reply(formatStylishReply(`Group: ${value.toUpperCase()}`));
            } else {
                await m.reply(formatStylishReply(`DMs: Always ON`));
            }
            
        } else {
            const status = jid.endsWith('@g.us') ? (isEnabled ? '✅ ON' : '❌ OFF') : '✅ ON (DMs)';
            
            await client.sendMessage(jid, {
                interactiveMessage: {
                    header: formatStylishReply(`GCPresence Settings\n\nStatus: ${status}\n\n• Group: Fake typing/recording\n• DMs: Always enabled`),
                    footer: "Tσxιƈ-ɱԃȥ",
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🟢 TURN ON",
                                id: `${prefix}gcpresence on`
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔴 TURN OFF",
                                id: `${prefix}gcpresence off`
                            })
                        }
                    ]
                }
            }, { quoted: fq });
        }
    });
});

// ── gcsettings
dreaded({
  pattern: "gcsettings",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);

        const jid = m.chat;
        console.log(`Received request for group: ${jid}`);

        if (!jid.endsWith('@g.us')) {
            console.log('The command was not issued in a group chat.');
            return await m.reply("╭───(    TOXIC-MD    )───\n├ This command is for groups only, you fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        console.log(`Fetching group settings for group: ${jid}`);
        let groupSettings = await getGroupSettings(jid);

        if (!groupSettings) {
            console.log(`No settings found for group: ${jid}`);
            return await m.reply("╭───(    TOXIC-MD    )───\n├ No group settings found. Configure something first!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        console.log(`Group settings for ${jid}: ${JSON.stringify(groupSettings)}`);

        let response = `╭───(    TOXIC-MD    )───\n├───≫ GROUP SETTINGS ≪───\n├ \n`;
        response += `├ Antilink: ${groupSettings.antilink ? 'ON' : 'OFF'}\n`;
        response += `├ Antidelete: ${groupSettings.antidelete ? 'ON' : 'OFF'}\n`;
        response += `├ Events: ${groupSettings.events ? 'ON' : 'OFF'}\n`;
        response += `├ Antitag: ${groupSettings.antitag ? 'ON' : 'OFF'}\n`;
        response += `├ GCPresence: ${groupSettings.gcpresence ? 'ON' : 'OFF'}\n`;
        response += `├ Antiforeign: ${groupSettings.antiforeign ? 'ON' : 'OFF'}\n`;
        response += `├ Antidemote: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n`;
        response += `├ Antipromote: ${groupSettings.antipromote ? 'ON' : 'OFF'}\n`;
        response += `├ Welcome: ${groupSettings.welcome ? 'ON' : 'OFF'}\n`;
        response += `├ Goodbye: ${groupSettings.goodbye ? 'ON' : 'OFF'}\n`;
        response += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await m.reply(response);
    });
});

// ── mode
dreaded({
  pattern: "mode",
  alias: ["botmode","setmode"],
  desc: "Control who can use the bot and where",
  category: "Settings",
  filename: __filename
}, async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, args, prefix } = context;
            const fq = getFakeQuoted(m);

            const fmt = (title, lines) => {
                const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
                return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            };

            const sendModeButtons = async (currentMode) => {
                const sections = [{
                    title: '⚙️ Select Bot Mode',
                    highlight_label: '',
                    rows: [
                        { header: '🌐 PUBLIC', title: `${currentMode === 'public' ? '▶ ' : ''}🌐 PUBLIC`, description: 'Everyone can use commands anywhere', id: `${prefix}mode public` },
                        { header: '🔒 PRIVATE', title: `${currentMode === 'private' ? '▶ ' : ''}🔒 PRIVATE`, description: 'Only owner can use commands', id: `${prefix}mode private` },
                        { header: '👥 GROUP', title: `${currentMode === 'group' ? '▶ ' : ''}👥 GROUP`, description: 'Groups only, DMs ignored', id: `${prefix}mode group` },
                        { header: '📩 INBOX', title: `${currentMode === 'inbox' ? '▶ ' : ''}📩 INBOX`, description: 'DMs only, groups ignored', id: `${prefix}mode inbox` },
                    ]
                }];

                try {
                    const interactiveMsg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                        interactiveMessage: {
                            body: { text: `Current: ${MODES[currentMode]?.emoji || '🌐'} ${(currentMode || 'public').toUpperCase()} — tap to switch` },
                            footer: { text: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' },
                            header: { hasMediaAttachment: false },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({ title: '⚙️ Choose Mode', sections })
                                    }
                                ],
                                messageParamsJson: ''
                            }
                        }
                    }), { quoted: fq, userJid: client.user.id });
                    await client.relayMessage(m.chat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
                } catch {
                    await client.sendMessage(m.chat, {
                        listMessage: {
                            title: 'BOT MODE',
                            description: `Current: ${(currentMode || 'public').toUpperCase()} — pick one to switch`,
                            buttonText: '⚙️ Choose Mode',
                            listType: 1,
                            sections: sections.map(s => ({ title: s.title, rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id })) })),
                            footer: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
                        },
                    }, { quoted: fq });
                }
            };

            try {
                const settings = await getSettings();
                const current = (settings.mode || 'public').toLowerCase();
                const input = (args[0] || '').toLowerCase();

                if (MODES[input]) {
                    if (current === input) {
                        await client.sendMessage(m.chat, {
                            text: fmt('BOT MODE', [
                                `${MODES[input].emoji} Already in ${MODES[input].label} mode.`,
                                `Nothing changed. Still the same.`,
                                `Pick a different one if you actually want to do something.`
                            ])
                        }, { quoted: fq });
                        return sendModeButtons(current);
                    }
                    await updateSetting('mode', input);
                    await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                    await client.sendMessage(m.chat, {
                        text: fmt('BOT MODE', [
                            `Switched to ${MODES[input].emoji} ${MODES[input].label}`,
                            ``,
                            CRANKY[input]
                        ])
                    }, { quoted: fq });
                    return sendModeButtons(input);
                }

                const modeInfo = MODES[current] || MODES.public;
                await client.sendMessage(m.chat, {
                    text: fmt('BOT MODE', [
                        `Active: ${modeInfo.emoji} ${modeInfo.label}`,
                        ``,
                        `PUBLIC  — Everyone can use commands everywhere`,
                        `PRIVATE — Only you can use commands`,
                        `GROUP   — Groups only, DMs ignored`,
                        `INBOX   — DMs only, groups ignored`
                    ])
                }, { quoted: fq });
                return sendModeButtons(current);

            } catch {
                client.sendMessage(m.chat, {
                    text: fmt('BOT MODE', 'Something broke. The database is sulking. Try again.')
                }, { quoted: fq });
            }
        });
    });

// ── multiprefix
dreaded({
  pattern: "multiprefix",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);

        const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            const settings = await getSettings();
            const isEnabled = settings.multiprefix === 'true' || settings.multiprefix === true;
            const value = args[0]?.toLowerCase();

            if (value === 'on' || value === 'all') {
                if (isEnabled) return await client.sendMessage(m.chat, { text: fmt('Multi-prefix is already ON, genius. 😒 All symbols already work.') }, { quoted: fq });
                await updateSetting('multiprefix', 'true');
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                return await client.sendMessage(m.chat, { text: fmt('🔥 Multi-prefix ON! Bot now responds to . ! # / $ ? + - * ~ @ % and even null prefix. Pure chaos. 😈') }, { quoted: fq });
            }

            if (value === 'off') {
                if (!isEnabled) return await client.sendMessage(m.chat, { text: fmt(`Multi-prefix already OFF, clown. 🙄 Single prefix: *${settings.prefix || '.'}*`) }, { quoted: fq });
                await updateSetting('multiprefix', 'false');
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                return await client.sendMessage(m.chat, { text: fmt(`🧊 Multi-prefix OFF. Back to single prefix: *${settings.prefix || '.'}*`) }, { quoted: fq });
            }

            await client.sendMessage(m.chat, {
                text: fmt(`Multi-Prefix: *${isEnabled ? 'ON 🔥 — all symbols active' : `OFF 🧊 — using: ${settings.prefix || '.'}`}*\n├ Usage: *${prefix}multiprefix on/off*\n├ When ON, bot accepts any prefix symbol or none at all.`),
                buttons: [
                    { buttonId: `${prefix}multiprefix on`, buttonText: { displayText: 'ON 🔥' }, type: 1 },
                    { buttonId: `${prefix}multiprefix off`, buttonText: { displayText: 'OFF 🧊' }, type: 1 },
                ],
                headerType: 1,
                viewOnce: true,
            }, { quoted: fq });
        } catch (err) {
            await client.sendMessage(m.chat, { text: fmt(`Exploded. 💀 Error: ${err.message}`) }, { quoted: fq });
        }
    });
});

// ── prefix
dreaded({
  pattern: "prefix",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    const newPrefix = args[0];

    const settings = await getSettings();

    if (newPrefix === 'null') {
      if (!settings.prefix) {
        return await m.reply(
          `╭───(    TOXIC-MD    )───\n` +
          `├ Already prefixless, you clueless twit! 😈\n` +
          `├ Stop wasting my time! 🖕\n` +
          `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        );
      }
      await updateSetting('prefix', '');
      await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
      await m.reply(
        `╭───(    TOXIC-MD    )───\n` +
        `├ Prefix obliterated! 🔥\n` +
        `├ I’m prefixless now, bow down! 😈\n` +
        `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      );
    } else if (newPrefix) {
      if (settings.prefix === newPrefix) {
        return await m.reply(
          `╭───(    TOXIC-MD    )───\n` +
          `├ Prefix is already ${newPrefix}, moron! 😈\n` +
          `├ Try something new, fool! 🥶\n` +
          `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        );
      }
      await updateSetting('prefix', newPrefix);
      await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
      await m.reply(
        `╭───(    TOXIC-MD    )───\n` +
        `├ New prefix set to ${newPrefix}! 🔥\n` +
        `├ Obey the new order, king! 😈\n` +
        `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      );
    } else {
      await m.reply(
        `╭───(    TOXIC-MD    )───\n` +
        `├ Current Prefix: ${settings.prefix || 'No prefix, peasant! 🥶'}\n` +
        `├ Use "${settings.prefix || '.'}prefix null" to go prefixless or "${settings.prefix || '.'}prefix <symbol>" to set one, noob!\n` +
        `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      );
    }
  });
});

// ── presence
dreaded({
  pattern: "presence",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (message) => {
      return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const validPresenceValues = ['online', 'offline', 'recording', 'typing'];
      const value = args.join(" ").toLowerCase();

      if (validPresenceValues.includes(value)) {
        if (settings.presence === value) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Presence is already ${value.toUpperCase()}, genius. Stop wasting my time.`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('presence', value);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Presence set to ${value.toUpperCase()}. Bot’s flexing that status now!`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}presence online`, buttonText: { displayText: "ONLINE 🟢" }, type: 1 },
        { buttonId: `${prefix}presence offline`, buttonText: { displayText: "OFFLINE ⚫" }, type: 1 },
        { buttonId: `${prefix}presence recording`, buttonText: { displayText: "RECORDING 🎙️" }, type: 1 },
        { buttonId: `${prefix}presence typing`, buttonText: { displayText: "TYPING ⌨️" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Presence is ${settings.presence ? settings.presence.toUpperCase() : 'NONE'}. Pick a vibe, fam! 🔥`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn’t update presence. Database or something’s fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── reaction
dreaded({
  pattern: "reaction",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);

    try {
      const settings = await getSettings();
      const prefix = settings.prefix || '.';
      const newEmoji = args[0];
      const currentEmoji = settings.autolikeemoji || 'random';

      if (newEmoji) {
        if (newEmoji === 'random') {
          if (currentEmoji === 'random') {
            await m.reply("╭───(    TOXIC-MD    )───\n├ Already using random emojis, you brain-dead fool!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
            return;
          }
          await updateSetting('autolikeemoji', 'random');
          await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
          await m.reply("╭───(    TOXIC-MD    )───\n├ Reaction emoji set to random! Happy now?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        } else {
          if (currentEmoji === newEmoji) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Already using ${newEmoji} emoji, moron!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            return;
          }
          await updateSetting('autolikeemoji', newEmoji);
          await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
          await m.reply(`╭───(    TOXIC-MD    )───\n├ Reaction emoji set to ${newEmoji}!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
        return;
      }

      const currentText = currentEmoji === 'random' ? 'Random emojis' : `${currentEmoji} emoji`;

      await client.sendMessage(m.chat, {
        interactiveMessage: {
          header: `╭───(    TOXIC-MD    )───\n├───≫ REACTION SETTINGS ≪───\n├ \n├ Current: ${currentText}\n├ \n├ Use "${prefix}reaction random" for random\n├ Use "${prefix}reaction <emoji>" for specific\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "RANDOM",
                id: `${prefix}reaction random`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "LOVE",
                id: `${prefix}reaction ❤️`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "FIRE",
                id: `${prefix}reaction 🔥`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "LAUGH",
                id: `${prefix}reaction 😂`
              })
            }
          ]
        }
      }, { quoted: fq });

    } catch (error) {
      console.error('Reaction command error:', error);
      await m.reply("╭───(    TOXIC-MD    )───\n├ Failed to update reaction settings. Something's broken.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
    }
  });
});

// ── settings
dreaded({
  pattern: "settings",
  alias: ["config","botsettings","mysettings","set"],
  desc: "Displays all bot settings with descriptions",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, prefix } = context;
      const fq = getFakeQuoted(m);
      const bName = botname || 'Toxic-MD';

      const settings = await getSettings();
      const sudoUsers = await getSudoUsers();
      const bannedUsers = await getBannedUsers();
      let groupCount = 0;
      try { groupCount = Object.keys(await client.groupFetchAllParticipating()).length; } catch (e) {}

      const fmt = (name, desc, status, cmd, example) => {
        return `├ *${name}*\n├   ${desc}\n├   Status: ${status}\n├   Change: ${cmd}\n├   Example: ${example}\n├\n`;
      };

      const message =
        `*${bName} Settings*\n\n` +
        `╭───(    TOXIC-MD    )───\n` +
        `├───≫ Bot Info ≪───\n` +
        `├ Bot Name: ${bName}\n` +
        `├ Sudo Users: ${sudoUsers.length}\n` +
        `├ Banned Users: ${bannedUsers.length}\n` +
        `├ Total Groups: ${groupCount}\n` +
        `├\n` +
        `├───≫ All Settings ≪───\n├\n` +
        fmt(
          'Auto-Like Status',
          'Automatically reacts to contacts status updates with an emoji.',
          settings.autolike ? '✅ ON' : '❌ OFF',
          `${prefix}autolike on/off`,
          `${prefix}autolike on`
        ) +
        fmt(
          'Auto-View Status',
          'Automatically views/opens contacts status stories so they see your view.',
          settings.autoview ? '✅ ON' : '❌ OFF',
          `${prefix}autoview on/off`,
          `${prefix}autoview off`
        ) +
        fmt(
          'Auto-Read Messages',
          'Automatically reads incoming messages and shows blue ticks to senders.',
          settings.autoread ? '✅ ON' : '❌ OFF',
          `${prefix}autoread on/off`,
          `${prefix}autoread on`
        ) +
        fmt(
          'Status Reaction Emoji',
          'Sets which emoji is used when auto-liking status updates.',
          settings.autolikeemoji || '❤️',
          `${prefix}reaction <emoji>`,
          `${prefix}reaction 🔥`
        ) +
        fmt(
          'Bot Prefix',
          'The character used before commands to trigger the bot.',
          settings.prefix || '.',
          `${prefix}prefix <symbol>`,
          `${prefix}prefix !`
        ) +
        fmt(
          'Auto-Bio Update',
          'Automatically updates your WhatsApp bio with bot uptime info.',
          settings.autobio ? '✅ ON' : '❌ OFF',
          `${prefix}autobio on/off`,
          `${prefix}autobio on`
        ) +
        fmt(
          'Anti-Call Protection',
          'Automatically rejects and blocks users who call the bot number.',
          settings.anticall ? '✅ ON' : '❌ OFF',
          `${prefix}anticall on/off`,
          `${prefix}anticall on`
        ) +
        fmt(
          'Chatbot Auto-Reply (PM)',
          'Enables AI chatbot that auto-replies to private messages.',
          settings.chatbotpm ? '✅ ON' : '❌ OFF',
          `${prefix}chatbotpm on/off`,
          `${prefix}chatbotpm on`
        ) +
        fmt(
          'Bot Mode',
          'Public = everyone can use. Private = only owner/sudo can use.',
          settings.mode || 'public',
          `${prefix}mode <public/private>`,
          `${prefix}mode private`
        ) +
        fmt(
          'Presence Display',
          'Controls what others see: online, typing, or recording.',
          settings.presence || 'online',
          `${prefix}presence <online/typing/recording>`,
          `${prefix}presence typing`
        ) +
        fmt(
          'Anti-Delete Recovery',
          'Recovers and forwards deleted messages to your DM.',
          settings.antidelete ? '✅ ON' : '❌ OFF',
          `${prefix}antidelete on/off`,
          `${prefix}antidelete on`
        ) +
        fmt(
          'Anti-Edit Tracker',
          'Catches edited messages and sends original + edited to your DM.',
          settings.antiedit ? '✅ ON' : '❌ OFF',
          `${prefix}antiedit on/off`,
          `${prefix}antiedit on`
        ) +
        fmt(
          'Sticker Pack Name',
          'Sets the pack name shown on stickers created by the bot.',
          settings.packname || 'Toxic-MD',
          `${prefix}stickerwm <name>`,
          `${prefix}stickerwm MyPack`
        ) +
        fmt(
          'Start Message',
          'Sends a welcome message when the bot connects successfully.',
          settings.startmessage ? '✅ ON' : '❌ OFF',
          `${prefix}startmessage on/off`,
          `${prefix}startmessage off`
        ) +
        fmt(
          'Multi-Prefix',
          'When ON, bot responds to any prefix symbol (. ! # / $ ? + - * ~) or no prefix at all.',
          settings.multiprefix === true || settings.multiprefix === 'true' ? '✅ ON' : '❌ OFF',
          `${prefix}multiprefix on/off`,
          `${prefix}multiprefix on`
        ) +
        fmt(
          'Auto AI',
          'Automatically replies to DMs and @mentions using an AI model.',
          settings.autoai === true || settings.autoai === 'true' ? '✅ ON' : '❌ OFF',
          `${prefix}autoai on/off`,
          `${prefix}autoai on`
        ) +
        fmt(
          'Stealth Mode',
          'Auto-deletes commands and bot replies 8 seconds after execution.',
          settings.stealth === true || settings.stealth === 'true' ? '✅ ON' : '❌ OFF',
          `${prefix}stealth on/off`,
          `${prefix}stealth on`
        ) +
        `├───≫ Tips ≪───\n` +
        `├ Only owner/sudo can change settings.\n` +
        `├ Settings save instantly to database.\n` +
        `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(m.chat, { text: message }, { quoted: fq });
    });
  });

// ── startmessage
dreaded({
  pattern: "startmessage",
  category: "Settings",
  filename: __filename
}, async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (message) => {
      return `╭───(    TOXIC-MD    )───\n├ ${message}\n╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser.") },
          { quoted: fq, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.startmessage === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Start message is already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time. 😈`) },
            { quoted: fq, ad: true }
          );
        }

        await updateSetting('startmessage', action);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Start message ${value.toUpperCase()} activated! 🔥 ${action ? 'Welcome messages will be sent on connection! 🎉' : 'No more annoying welcome messages, you antisocial prick! 🚫'}`) },
          { quoted: fq, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}startmessage on`, buttonText: { displayText: "ON 🎉" }, type: 1 },
        { buttonId: `${prefix}startmessage off`, buttonText: { displayText: "OFF 🚫" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Start message is ${settings.startmessage ? 'ON 🎉' : 'OFF 🚫'}, dumbass. Pick a vibe, noob! 😈`),
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: fq, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn't mess with start message. Database or something's fucked. Try later.") },
        { quoted: fq, ad: true }
      );
    }
  });
});

// ── stealth
dreaded({
  pattern: "stealth",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);

        const fmt = (msg) => `╭───(    TOXIC-MD    )───\n├ ${msg}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            const settings = await getSettings();
            const isEnabled = settings.stealth === 'true' || settings.stealth === true;
            const value = args[0]?.toLowerCase();

            if (value === 'on') {
                if (isEnabled) return await client.sendMessage(m.chat, { text: fmt('Stealth is already ON, dummy. 😒 Bot is already ghosting.') }, { quoted: fq });
                await updateSetting('stealth', 'true');
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                return await client.sendMessage(m.chat, { text: fmt('👻 Stealth ON! Commands and replies auto-delete after 8s. Ghost mode activated. 😈') }, { quoted: fq });
            }

            if (value === 'off') {
                if (!isEnabled) return await client.sendMessage(m.chat, { text: fmt('Stealth is already OFF, clown. 🙄 Nothing to disable.') }, { quoted: fq });
                await updateSetting('stealth', 'false');
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                return await client.sendMessage(m.chat, { text: fmt('💡 Stealth OFF. Replies stay visible now. Boring choice but alright.') }, { quoted: fq });
            }

            await client.sendMessage(m.chat, {
                text: fmt(`Stealth Mode: *${isEnabled ? 'ON 👻' : 'OFF 💡'}*\n├ Usage: *${prefix}stealth on/off*\n├ When ON, bot auto-deletes commands + replies after 8s.`),
                buttons: [
                    { buttonId: `${prefix}stealth on`, buttonText: { displayText: 'ON 👻' }, type: 1 },
                    { buttonId: `${prefix}stealth off`, buttonText: { displayText: 'OFF 💡' }, type: 1 },
                ],
                headerType: 1,
                viewOnce: true,
            }, { quoted: fq });
        } catch (err) {
            await client.sendMessage(m.chat, { text: fmt(`Crashed. 💀 Error: ${err.message}`) }, { quoted: fq });
        }
    });
});

// ── stickerwm
dreaded({
  pattern: "stickerwm",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);
        const newStickerWM = args.join(" ") || null;  

        let settings = await getSettings();

        if (!settings) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ Settings not found. Something's seriously broken.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        if (newStickerWM !== null) {
            if (newStickerWM === 'null') {
                if (!settings.packname) {
                    return await m.reply("╭───(    TOXIC-MD    )───\n├ Bot already has no sticker watermark, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
                }
                await updateSetting('packname', '');
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                await m.reply("╭───(    TOXIC-MD    )───\n├ Sticker watermark removed. Happy now?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
            } else {
                if (settings.packname === newStickerWM) {
                    return await m.reply(`╭───(    TOXIC-MD    )───\n├ Watermark already set to: ${newStickerWM}\n├ Stop wasting my time.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }
                await updateSetting('packname', newStickerWM);
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ STICKER WM ≪───\n├ \n├ Watermark updated to: ${newStickerWM}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        } else {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ STICKER WM ≪───\n├ \n├ Current watermark: ${settings.packname || 'None set'}\n├ \n├ Use '${settings.prefix}stickerwm null' to remove\n├ Use '${settings.prefix}stickerwm <text>' to set\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── toxicai
dreaded({
  pattern: "toxicai",
  alias: ["devai","toxicagent"],
  desc: "Toggle ToxicAgent GitHub AI (dev only)",
  category: "Settings",
  filename: __filename
}, async (context) => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);

        const senderNum = (m.sender || '').split('@')[0].split(':')[0];
        const fmt = (title, lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
            return `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
        };

        if (senderNum !== DEV_NUMBER) {
            return client.sendMessage(m.chat, {
                text: fmt('TOXICAGENT', ['Access denied.', 'Dev-only feature. Not your toy.'])
            }, { quoted: fq });
        }

        try {
            const settings = await getSettings();
            const value = (args[0] || '').toLowerCase();

            if (value === 'on' || value === 'off') {
                const newState = value === 'on';
                await updateSetting('toxicagent', newState);
                await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
                return client.sendMessage(m.chat, {
                    text: fmt('TOXICAGENT', newState
                        ? ['Status: ✅ ON', 'GitHub AI agent active. Just text me GitHub tasks.']
                        : ['Status: ❌ OFF', 'GitHub AI disabled.'])
                }, { quoted: fq });
            }

            const isOn = settings.toxicagent === true || settings.toxicagent === 'true';
            return client.sendMessage(m.chat, {
                text: fmt('TOXICAGENT', [
                    `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
                    'Handles: create/delete/rename repos, upload files,',
                    '         list branches, create issues, star repos',
                    '',
                    `Toggle: ${prefix}toxicai on  /  ${prefix}toxicai off`,
                    'Say "clear conversation" to reset memory'
                ])
            }, { quoted: fq });
        } catch {
            client.sendMessage(m.chat, { text: fmt('TOXICAGENT', 'something broke. try again.') }, { quoted: fq });
        }
    });

// ── unban
dreaded({
  pattern: "unban",
  category: "Settings",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);

        let numberToUnban;

        if (m.quoted) {
            numberToUnban = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToUnban = m.mentionedJid[0];
        } else {
            numberToUnban = args[0];
        }

        if (!numberToUnban) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ Provide a valid number or quote a user, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

       
        numberToUnban = numberToUnban.replace('@s.whatsapp.net', '').trim();

        const bannedUsers = await getBannedUsers();

        if (!bannedUsers.includes(numberToUnban)) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ This user wasn't even banned. What are you doing?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        await unbanUser(numberToUnban);
        await client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ UNBAN ≪───\n├ \n├ ${numberToUnban} has been unbanned.\n├ They better not mess up again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
});
  