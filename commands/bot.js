import { generateWAMessageFromContent } from 'toxic-baileys'; // Your fork, not upstream

export default {
    name: 'bot',

    async execute(sock, m) {
        const jid = m.key.remoteJid;
        const prefix = '.'; // Change this to your actual prefix

        // React to the message
        await sock.sendMessage(jid, {
            react: { text: '🤖', key: m.key }
        });

        const botname = 'MyBot'; // Replace with your actual bot name

        const msg = generateWAMessageFromContent(
            jid,
            {
                interactiveMessage: {
                    body: {
                        text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo! You actually bothered to check the bot? 🙄\n│❒ ${botname} is active 24/7, unlike your brain cells. 🧠⚡\n│❒ Stop wasting my time and pick something useful below.\n◈━━━━━━━━━━━━━━━━◈`
                    },
                    footer: { text: `> Powered by ${botname}` },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: '𝐖𝐇𝐀𝐓 𝐃𝐎 𝐘𝐎𝐔 𝐖𝐀𝐍𝐓?',
                                    sections: [
                                        {
                                            rows: [
                                                { title: '📱 Menu', description: 'Get all commands', id: `${prefix}menu` },
                                                { title: '⚙ Settings', description: 'Bot settings', id: `${prefix}settings` },
                                                { title: '🏓 Ping', description: 'Check bot speed', id: `${prefix}ping` },
                                                { title: '🔄 Update', description: 'Check for updates', id: `${prefix}update` },
                                            ],
                                        },
                                    ],
                                }),
                            },
                        ],
                    },
                },
            },
            {
                quoted: m,
                userJid: sock.user.id // ✅ Fix #1 - required
            }
        );

        // ✅ Fix #3 - null guard
        if (msg.message) {
            await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
        }
    },
};