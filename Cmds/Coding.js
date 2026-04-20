// Cmds/Coding.js — 9 commands
  'use strict';

  const axios = require('axios');
const { getFakeQuoted } = require('../lib/fakeQuoted');

  // ── carbon
dreaded({
  pattern: "carbon",
  category: "Coding",
  filename: __filename
}, async (context) => {
  const { client, m, text, botname } = context;
  const fq = getFakeQuoted(m);

const fetch = require('node-fetch');
const { getFakeQuoted } = require('../lib/fakeQuoted');

  let cap = `╭───(    TOXIC-MD    )───\n├───≫ CARBON ≪───\n├ \n├ Converted By ${botname}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) return m.reply('╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ API failed to fetch a valid response.\n├ Try again later, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

      let per = await response.buffer();

      await client.sendMessage(m.chat, { image: per, caption: cap }, { quoted: fq });
    } catch (error) {
      m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ERROR ≪───\n├ \n├ An error occured, you broke it.\n├ ${error}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)
    }
  } else {
    m.reply('╭───(    TOXIC-MD    )───\n├───≫ CARBON ≪───\n├ \n├ Quote a code message, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
  }
});

// ── cw
dreaded({
  pattern: "cw",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { client, m, text, prefix } = context;
    const fq = getFakeQuoted(m);

    if (!text) {
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Wᴇʙ2Zɪᴩ ≪───\n├ \n├ Downloads entire websites as ZIP files\n├ Example: ${prefix}web2zip https://example.com\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        let url = text.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const apiUrl = `https://api.nexray.web.id/tools/webtozip?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 60000
        });

        if (!response.data || !response.data.status || !response.data.result) {
            throw new Error('API returned empty response. Web2Zip service is probably sleeping.');
        }

        const result = response.data.result;
        
        if (result.error && result.error.text !== '-') {
            throw new Error(`Service error: ${result.error.text}`);
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        const caption = `╭───(    TOXIC-MD    )───\n├───≫ Wᴇʙsɪᴛᴇ Zɪᴩ ≪───\n├ \n├ *URL:* ${result.url}\n├ *Files Copied:* ${result.copiedFilesAmount}\n├ *Download Link:*\n├ ${result.downloadUrl}\n├\n├ Click the link above to download the ZIP\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, { text: caption }, { quoted: fq });

    } catch (error) {
        console.error("Web2Zip error:", error.response?.status, error.message);

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        let errorMessage = "Failed to create website ZIP. The internet hates you today.";

        if (error.response?.status === 400) {
            errorMessage = "Invalid URL. Even the API knows your link is garbage.";
        } else if (error.response?.status === 404) {
            errorMessage = "Website not found. Did you type it with your eyes closed?";
        } else if (error.response?.status === 429) {
            errorMessage = "Rate limit exceeded. Stop spamming, nobody wants that many ZIPs.";
        } else if (error.message.includes("timeout")) {
            errorMessage = "Website took too long to respond. Probably as slow as your brain.";
        } else if (error.message.includes("ENOTFOUND")) {
            errorMessage = "Can't reach the website. Is it even real?";
        }

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Fᴀɪʟᴇᴅ ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── encrypt
dreaded({
  pattern: "encrypt",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);

    const Obf = require("javascript-obfuscator");

    
    if (m.quoted && m.quoted.text) {
        const forq = m.quoted.text;

       
        const obfuscationResult = Obf.obfuscate(forq, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        console.log("Successfully encrypted the code");
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ENCRYPTED ≪───\n├ \n├ ${obfuscationResult.getObfuscatedCode()}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    } else {
        m.reply('╭───(    TOXIC-MD    )───\n├───≫ ENCRYPT ≪───\n├ \n├ Tag a valid JavaScript code to encrypt!\n├ Stop wasting my time.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }
});

// ── run-c++
dreaded({
  pattern: "run-c++",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);

const {c, cpp, node, python, java} = require('compile-run');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await cpp.runSource(code);
    console.log(result);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ C++ OUTPUT ≪───\n├ \n├ ${result.stdout || 'No output'}\n${result.stderr ? '├ stderr: ' + result.stderr + '\n' : ''}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  } catch (err) {
    console.log(err);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ C++ ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
}

runCode();

} else { 

m.reply('╭───(    TOXIC-MD    )───\n├───≫ C++ COMPILER ≪───\n├ \n├ Quote a valid and short C++ code\n├ to compile, you absolute walnut.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}

});

// ── run-c
dreaded({
  pattern: "run-c",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);

const {c, cpp, node, python, java} = require('compile-run');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await c.runSource(code);
    console.log(result);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ C OUTPUT ≪───\n├ \n├ ${result.stdout || 'No output'}\n${result.stderr ? '├ stderr: ' + result.stderr + '\n' : ''}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  } catch (err) {
    console.log(err);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ C ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
}

runCode();

} else { 

m.reply('╭───(    TOXIC-MD    )───\n├───≫ C COMPILER ≪───\n├ \n├ Quote a valid and short C code\n├ to compile, you absolute walnut.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}

});

// ── run-java
dreaded({
  pattern: "run-java",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);

const {c, cpp, node, python, java} = require('compile-run');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await java.runSource(code);
    console.log(result);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JAVA OUTPUT ≪───\n├ \n├ ${result.stdout || 'No output'}\n${result.stderr ? '├ stderr: ' + result.stderr + '\n' : ''}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  } catch (err) {
    console.log(err);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JAVA ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
}

runCode();

} else { 

m.reply('╭───(    TOXIC-MD    )───\n├───≫ JAVA COMPILER ≪───\n├ \n├ Quote a valid and short Java code\n├ to compile, you absolute walnut.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}

});

// ── run-js
dreaded({
  pattern: "run-js",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m, text } = context;
    const fq = getFakeQuoted(m);
    const { node } = require('compile-run');

    let code = text;

    if (m.quoted && m.quoted.text) {
        code = m.quoted.text;
    }

    if (!code) {
        return m.reply('╭───(    TOXIC-MD    )───\n├───≫ JS COMPILER ≪───\n├ \n├ Provide JavaScript code or quote one.\n├ Example: .runjs console.log("hello")\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }

    try {
        let result = await node.runSource(code);
        console.log(result);
        
        let output = result.stdout || 'No output';
        let error = result.stderr ? `├ stderr: ${result.stderr}\n` : '';
        
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JS OUTPUT ≪───\n├ \n├ ${output}\n${error}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        
    } catch (err) {
        console.log(err);
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JS ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── run-py
dreaded({
  pattern: "run-py",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);

const {c, cpp, node, python, java} = require('compile-run');
const { getFakeQuoted } = require('../lib/fakeQuoted');

    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await python.runSource(code);
    console.log(result);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PYTHON OUTPUT ≪───\n├ \n├ ${result.stdout || 'No output'}\n${result.stderr ? '├ stderr: ' + result.stderr + '\n' : ''}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  } catch (err) {
    console.log(err);
    m.reply(`╭───(    TOXIC-MD    )───\n├───≫ PYTHON ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
}

runCode();

} else { 

m.reply('╭───(    TOXIC-MD    )───\n├───≫ PYTHON COMPILER ≪───\n├ \n├ Quote a valid and short Python code\n├ to compile, you absolute walnut.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')

}

});

// ── runjs
dreaded({
  pattern: "runjs",
  category: "Coding",
  filename: __filename
}, async (context) => {
    const { m, text } = context;
    const fq = getFakeQuoted(m);
    const { node } = require('compile-run');

    let code = text;

    if (m.quoted && m.quoted.text) {
        code = m.quoted.text;
    }

    if (!code) {
        return m.reply('╭───(    TOXIC-MD    )───\n├───≫ JS COMPILER ≪───\n├ \n├ Provide JavaScript code or quote one.\n├ Example: .runjs console.log("hello")\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
    }

    try {
        let result = await node.runSource(code);
        console.log(result);
        
        let output = result.stdout || 'No output';
        let error = result.stderr ? `├ stderr: ${result.stderr}\n` : '';
        
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JS OUTPUT ≪───\n├ \n├ ${output}\n${error}╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        
    } catch (err) {
        console.log(err);
        m.reply(`╭───(    TOXIC-MD    )───\n├───≫ JS ERROR ≪───\n├ \n├ ${err.stderr || err.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});
  