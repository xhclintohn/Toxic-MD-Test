// Cmds/Heroku.js — 5 commands
  'use strict';

  const ownerMiddleware = require('../lib/Ownermiddleware');
const axios = require("axios");
const { herokuAppName, getHerokuApiKey } = require("../Env/settings");
const { getFakeQuoted } = require('../lib/fakeQuoted');

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    const lk = key.toLowerCase();
    return SENSITIVE.some(s => lk.includes(s));
}



const { herokuAppName: HEROKU_APP_NAME } = require('../Env/settings');
const HEROKU_API_KEY = getHerokuApiKey();
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');


  // ── allvar
dreaded({
  pattern: "allvar",
  category: "Heroku",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });

            const configVars = response.data;
            if (!configVars || Object.keys(configVars).length === 0) {
                return await m.reply("╭───(    TOXIC-MD    )───\n├ No config vars found.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
            }

            let msg = "╭───(    TOXIC-MD    )───\n├───≫ HEROKU VARS ≪───\n├ \n";
            for (const [key, value] of Object.entries(configVars)) {
                msg += `├ ${key}: ${isSensitive(key) ? '**REDACTED**' : value}\n`;
            }
            msg += "╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧";

            await client.sendMessage(m.sender, { text: msg });
            await m.reply("╭───(    TOXIC-MD    )───\n├ Vars sent to your DM only. 🔒\n├ Sensitive keys are always redacted.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        } catch (error) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Failed to fetch config vars.\n├ ${error.response?.data || error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── getvar
dreaded({
  pattern: "getvar",
  category: "Heroku",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        if (!text) {
            return await m.reply(`╭───(    TOXIC-MD    )───\n├ Usage: ${prefix}getvar VAR_NAME\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const varName = text.trim().split(" ")[0];

        if (isSensitive(varName)) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ That variable is protected and cannot be retrieved. 🔒\n├ For your own security.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        if (m.isGroup) {
            return await m.reply("╭───(    TOXIC-MD    )───\n├ Use this command in your DM only, not in groups. 🔒\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });
            const varValue = response.data[varName];
            if (varValue !== undefined) {
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ GETVAR ≪───\n├ \n├ ${varName} = ${varValue}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            } else {
                await m.reply(`╭───(    TOXIC-MD    )───\n├ Var "${varName}" doesn't exist.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
        } catch (error) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Failed to fetch var.\n├ ${error.response?.data || error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
});

// ── setvar
dreaded({
  pattern: "setvar",
  category: "Heroku",
  filename: __filename
}, async (context) => {
    await ownerMiddleware(context, async () => {
        const herokuApiKey = getHerokuApiKey();
        const { client, m, text, Owner, prefix } = context;
        const fq = getFakeQuoted(m);

        if (!herokuAppName || !herokuApiKey) {
            await m.reply("╭───(    TOXIC-MD    )───\n├ Heroku app name or API key not set, you clown.\n├ Set HEROKU_APP_NAME and HEROKU_API_KEY first!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
            return;
        }

        if (!text) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SETVAR ≪───\n├ \n├ Provide a var and value, moron.\n├ Format: ${prefix}setvar VAR_NAME=VALUE\n├ Example: ${prefix}setvar MYCODE=254\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            return;
        }

        async function setHerokuConfigVar(varName, value) {
            try {
                const response = await axios.patch(
                    `https://api.heroku.com/apps/${herokuAppName}/config-vars`,
                    {
                        [varName]: value
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuApiKey}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );

                if (response.status === 200) {
                    await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ SETVAR ≪───\n├ \n├ ${varName} updated to "${value}"\n├ Wait 2min for bot to restart, be patient.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                } else {
                    await m.reply("╭───(    TOXIC-MD    )───\n├ Failed to update the config var. Try again, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧");
                }
            } catch (error) {
                const errorMessage = error.response?.data || error.message;
                await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ HEROKU ERROR ≪───\n├ \n├ Failed to set config var.\n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                console.error("Error updating config var:", errorMessage);
            }
        }

        const parts = text.split("=");
        if (parts.length !== 2) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├ Invalid format, you illiterate fool.\n├ Use: ${prefix}setvar VAR_NAME=VALUE\n├ Example: ${prefix}setvar MYCODE=254\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            return;
        }

        const varName = parts[0].trim();
        const value = parts[1].trim();

        await setHerokuConfigVar(varName, value);
    });
});

// ── triggerupdate
dreaded({
  pattern: "triggerupdate",
  category: "Heroku",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (message) => {
        return (
            `╭───(    TOXIC-MD    )───\n` +
            `├ ${message}\n` +
            `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\n` +
            `xD`
        );
    };

    await ownerMiddleware(context, async () => {
        await client.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

        try {
            if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
                return await client.sendMessage(
                    m.chat,
                    {
                        text: formatStylishReply(
                            "⚠️ Seriously? You forgot to set *HEROKU_API_KEY* or *HEROKU_APP_NAME*.\n" +
                            "Fix your setup before crying for updates. 🙄"
                        ),
                    },
                    { quoted: fq }
                );
            }

            await client.sendMessage(
                m.chat,
                {
                    text: formatStylishReply(
                        "🔄 Fine… triggering update.\n" +
                        "Don’t complain if the bot restarts in your face. 😒"
                    ),
                },
                { quoted: fq }
            );

            await axios.post(
                `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
                {
                    source_blob: {
                        url: "https://github.com/xhclintohn/Toxic-v2/tarball/main",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${HEROKU_API_KEY}`,
                        Accept: "application/vnd.heroku+json; version=3",
                        "Content-Type": "application/json",
                    },
                }
            );

            return await client.sendMessage(
                m.chat,
                {
                    text: formatStylishReply(
                        "🚀 Update triggered.\n" +
                        "Sit tight while Toxic-MD resurrects with fresh upgrades. 🔥"
                    ),
                },
                { quoted: fq }
            );

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;

            let msg;

            if (errorMessage.includes("API key")) {
                msg =
                    "❌ Your Heroku API key is trash.\n" +
                    "Fix *HEROKU_API_KEY* before crying here.";
            } else if (errorMessage.includes("not found")) {
                msg =
                    "❌ Heroku app not found.\n" +
                    "Are you sure *HEROKU_APP_NAME* is correct, genius?";
            } else {
                msg = `❌ Update failed:\n${errorMessage}\nTry again without panicking.`;
            }

            await client.sendMessage(
                m.chat,
                { text: formatStylishReply(msg) },
                { quoted: fq }
            );
        }
    });
});

// ── update
dreaded({
  pattern: "update",
  category: "Heroku",
  filename: __filename
}, async (context) => {
    const { client, m, prefix } = context;
    const fq = getFakeQuoted(m);

    const formatStylishReply = (message) => {
        return (
            `╭───(    TOXIC-MD    )───\n` +
            `├ ${message}\n` +
            `╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\n` +
            `Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ 😈`
        );
    };

    await ownerMiddleware(context, async () => {
        await client.sendMessage(m.chat, { react: { text: '🔂', key: m.key } });

        try {
            if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
                return await client.sendMessage(
                    m.chat,
                    {
                        text: formatStylishReply(
                            "⚠️ Seriously? You forgot to set *HEROKU_API_KEY* or *HEROKU_APP_NAME*.\n" +
                            "Fix your setup before crying for updates. 🙄"
                        ),
                    },
                    { quoted: fq }
                );
            }

            const githubRes = await axios.get(
                "https://api.github.com/repos/xhclintohn/Toxic-v2/commits/main"
            );

            const latestCommit = githubRes.data;
            const latestSha = latestCommit.sha;

            const herokuRes = await axios.get(
                `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
                {
                    headers: {
                        Authorization: `Bearer ${HEROKU_API_KEY}`,
                        Accept: "application/vnd.heroku+json; version=3",
                    },
                }
            );

            const lastBuild = herokuRes.data[0];
            const deployedSha = lastBuild?.source_blob?.url || "";
            const alreadyDeployed = deployedSha.includes(latestSha);

            if (alreadyDeployed) {
                // FIX: Menambahkan wrapper viewOnceMessage
                const msg = generateWAMessageFromContent(
                    m.chat,
                    {
                        viewOnceMessage: {
                            message: {
                                interactiveMessage: {
                                    body: {
                                        text: "Your bot is already on the latest version, genius."
                                    },
                                    footer: {
                                        text: "Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ"
                                    },
                                    nativeFlowMessage: {
                                        buttons: [
                                            {
                                                name: "single_select",
                                                buttonParamsJson: JSON.stringify({
                                                    title: "Want something else?",
                                                    sections: [
                                                        {
                                                            rows: [
                                                                { title: "📱 Menu", description: "Get command list", id: `${prefix}menu` },
                                                                { title: "⚙ Settings", description: "Bot settings", id: `${prefix}settings` },
                                                            ],
                                                        },
                                                    ],
                                                }),
                                            },
                                        ],
                                    },
                                }
                            }
                        }
                    },
                    { quoted: fq }
                );

                return await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            }

            // FIX: Menambahkan wrapper viewOnceMessage
            const msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: {
                                    text: `🆕 Update Available, Dumbass\n\nNew version found. You're still using outdated garbage.\n\n📌 *Commit:* ${latestCommit.commit.message}\n👤 *Author:* ${latestCommit.commit.author.name}\n🕒 *Date:* ${new Date(latestCommit.commit.author.date).toLocaleString()}\n\nTo update your worthless bot, tap the button below. if you're unable to tap the buttons type ${prefix}triggerupdate Don't ask me how to tap, you monkey. 🐒😂`
                                },
                                footer: {
                                    text: "Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ"
                                },
                                nativeFlowMessage: {
                                    buttons: [
                                        {
                                            name: "single_select",
                                            buttonParamsJson: JSON.stringify({
                                                title: "UPDATE OPTIONS",
                                                sections: [
                                                    {
                                                        title: "What do you want?",
                                                        rows: [
                                                            { title: "🚀 Trigger Update", description: "Update now", id: `${prefix}triggerupdate` },
                                                            { title: "📱 Menu", description: "Back to command list", id: `${prefix}menu` },
                                                        ],
                                                    },
                                                ],
                                            }),
                                        },
                                    ],
                                },
                            }
                        }
                    }
                },
                { quoted: fq }
            );

            await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;

            let msg;

            if (errorMessage.includes("API key")) {
                msg =
                    "❌ Your Heroku API key is trash.\n" +
                    "Fix *HEROKU_API_KEY* before crying here.";
            } else if (errorMessage.includes("not found")) {
                msg =
                    "❌ Heroku app not found.\n" +
                    "Are you sure *HEROKU_APP_NAME* is correct, genius?";
            } else {
                msg = `❌ Update failed:\n${errorMessage}\nTry again without panicking.`;
            }

            await client.sendMessage(
                m.chat,
                { text: formatStylishReply(msg) },
                { quoted: fq }
            );
        }
    });
});
  