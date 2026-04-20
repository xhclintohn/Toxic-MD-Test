const ownerMiddleware = require('../../lib/Ownermiddleware');
const { getFakeQuoted } = require('../../lib/fakeQuoted');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        const fq = getFakeQuoted(m);

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            return m.reply('╭───(    TOXIC-MD    )───\n├ \n├ Cannot clear this type of chat.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }

        try {
            let lastMessages;
            if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
                lastMessages = store.chats[m.chat].slice(-1);
            }

            await client.chatModify({ delete: true, lastMessages }, m.chat);
            await m.reply('╭───(    TOXIC-MD    )───\n├───≥ CLEARED ≤───\n├ \n├ Chat cleared.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        } catch (err) {
            if (err?.message?.includes('myAppStateKey') || err?.output?.statusCode === 404) {
                return m.reply('╭───(    TOXIC-MD    )───\n├───≥ NOT READY ≤───\n├ \n├ App state not fully synced yet.\n├ Wait a minute then try again.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
            await m.reply('╭───(    TOXIC-MD    )───\n├───≥ ERROR ≤───\n├ \n├ Failed to clear chat.\n╰──────────────────☉\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
        }
    });
};
