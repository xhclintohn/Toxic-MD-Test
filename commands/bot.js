export default {
    name: 'bot',

    async execute(sock, m) {
        const jid = m.key.remoteJid;
        const prefix = '.';
        const botname = 'MyBot';

        await sock.sendMessage(jid, {
            react: { text: '🤖', key: m.key }
        });

        await sock.sendMessage(jid, {
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
        }, { quoted: m });
    },
};