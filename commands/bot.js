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

        // Quick reply buttons
        await sock.sendMessage(jid, {
            text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo! You actually bothered to check the bot? 🙄\n│❒ ${botname} is active 24/7, unlike your brain cells. 🧠⚡\n│❒ Stop wasting my time and pick something useful below.\n◈━━━━━━━━━━━━━━━━◈\n\n> Powered by ${botname}`,
            buttons: [
                { buttonId: `${prefix}menu`, buttonText: { displayText: '📱 Menu' }, type: 1 },
                { buttonId: `${prefix}settings`, buttonText: { displayText: '⚙ Settings' }, type: 1 },
                { buttonId: `${prefix}ping`, buttonText: { displayText: '🏓 Ping' }, type: 1 },
                { buttonId: `${prefix}update`, buttonText: { displayText: '🔄 Update' }, type: 1 }
            ],
            viewOnce: true
        }, { quoted: m });
    },
};