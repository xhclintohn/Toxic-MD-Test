'use strict';
  const fs = require('fs');
  const path = require('path');

  const cmdsDir = path.join(__dirname, '..', 'Cmds');
  const commands = {};
  const aliases = {
    speed: "ping",
    p: "ping",
    ev: "eval",
    xvideo: "xvideos",
    porn: "xvideos",
    bug: "crash",
    developer: "dev",
    get: "fetch",
    cmd: "getcmd",
    s: "sticker",
    m: "menu",

    d: "del",
    editimg: "imgedit",
    wormgpt: "darkgpt",
    worm: "darkgpt",
    whatmusic: "shazam",
    findmusic: "shazam",
    fmusic: "shazam",
    invite: "link",
    delete: "del",
    evl: "eval",
    k: "remove",
    ts: "telesticker",
    setprefix: "prefix",
    reactemoji: "reaction",
    autoviewstatus: "autoview",
    antimention: "antistatusmention",
    addowner: "addsudo",
    delowner: "delsudo",
    die: "block",
    pinmsg: "pin",
    unpin: "pin",
    clearchat: "clear",
    wipe: "clear",
    callprivacy: "callprivacy",
    callpriv: "callprivacy",
    msgprivacy: "messageprivacy",
    kick: "remove",
    mute: "close",
    unmute: "open",
    ssweb: "screenshot",
    ss: "screenshot",
    rvo: "vvx",
    pint: "pinterest",
    opengroup: "open",
    photo: "picture",
    pint: "pinterest",
    tophoto: "picture",
    latency: "ping",
    groupstatus: "gstatus",
    runtime: "uptime",
    admin: "oadmin",
    ghibli: "toghibli",
    groups: "botgc",
    bc: "broadcast",
    enhance: "remini",
    id: "checkid",
    cekid: "checkid",
    idch: "checkid",
    pp: "fullpp",
    kickall: "kill",
    kickall2: "kill2",
    exec: "shell",
    upscale: "remini",
    tohd: "remini",
    hd: "remini",
    leave: "leavegc",
    left: "leavegc",
    join: "joingc",
    git: "github",
    togroupstatus: "gstatus",
    ss: "screenshot",
    ssweb: "screenshot",
    getpp: "profile",
    allvars: "allvar",
    px: "ping",
    redeploy: "update",
    whois: "profile",
    commands: "menu",
    list: "menu",
    owner: "dev",
    repo: "script",
    getmusic: "shazam",
    gmusic: "shazam",
    sc: "script",
    translate: "tr",
    trt: "tr",
    trigger: "triggerupdate",
    linkgc: "link",
    gclink: "link",
    grouplink: "link",
    linkgroup: "link",
    mention: "tagall",
    vv: "retrieve",
    k: "retrieve",
    search: "yts",
    youtubesearch: "yts",
    xd: "retrieve",
    vid: "alldl",
    reset: "revoke",
    mute: "close",
    app: "apk",
    fb: "fbdl",
    facebook: "fbdl",
    instagram: "igdl",
    ig: "igdl",
    rch: "xreact",
    img: "image",
    url: "upload",
    tourl: "upload",
    yta: "ytmp3",
    youtube: "ytmp4",
    tt: "tikdl",
    tiktok: "tikdl",
    twitter: "twtdl",
    x: "twtdl",
    bili: "bilibili",
    bvidl: "bilibili",
    snack: "snackvideo",
    sck: "snackvideo",
    mutegroup: "close",
    ai: "gpt",
    ytv: "ytmp4",
    mf: "mediafire",
    emojimix: "emix",
    chatbot: "chatbotpm",
    autoreply: "chatbotpm",
    toxicagent: "toxicai",
    devai: "toxicai",
    enc: "encrypt",
    req: "requests",
    approve: "approve-all",
    reject: "reject-all",
    up: "uptime",
    whoonline: "listonline",
    onlinemembers: "listonline",
    activemembers: "listonline",
    demoteuser: "demote",
    deadmin: "demote",
    promoteuser: "promote",
    makeadmin: "promote",
    addadmin: "promote",
    removemember: "remove",
    yeet: "remove",
    boot: "remove",
    isalive: "alive",
    botstatus: "alive",
    devcontact: "dev",
    creator: "dev",
    botsettings: "settings",
    mysettings: "settings",
    botconfig: "settings",
    pong: "ping",
    response: "ping",
    wc: "warncount",
    rw: "resetwarn",
    warns: "warncount",
    clearwarn: "resetwarn",
    swc: "setwarncount",
    setwarn: "setwarncount",
    warnlimit: "setwarncount",

    botmode: "mode",
    setmode: "mode",

    pall: "promoteall",
    dall: "demoteall",
    tagadminto: "tagadmins",
    calladmins: "tagadmins",
    ghupload: "upx",
    uploadmedia: "upx",
    tobase64: "base64",
    b64: "base64",
    encode64: "base64",
    unbase64: "base64decode",
    debase64: "base64decode",
    frombase64: "base64decode",
    decode64: "base64decode",
    b64decode: "base64decode",

    listgroup: "botgc",
    listgroups: "botgc",
    totalgroup: "botgc",
    tg: "botgc",
    lg: "botgc",
    canvascard: "canvas",
    spotifycard: "canvas",

    airc: "rc",
    rcedit: "rc",

    gensong: "aisong",
    songgenerator: "aisong",

    allowuser: "allow",
    allowai: "allow",
    youtubecard: "canvas",
    tiktokcard: "canvas",
    makesong: "aisong",
    tti: "imagine",
    texttoimage: "imagine",
    imageedit: "imgedit",
    aiedit: "imgedit",
};
  let totalCommands = 0;

  const defaultReactions = ['🔥', '💯', '⚡', '👀', '✅', '✨', '😎', '🧠'];

  function dreaded(config, handler) {
      const {
          pattern,
          alias = [],
          desc = '',
          category = 'General',
          react = '',
          filename = ''
      } = config;

      if (!pattern || typeof handler !== 'function') return;

      const name = pattern.toLowerCase();

      const wrapped = Object.assign(async (context) => {
          context.cmd = name;
          const { m, client } = context;

          let emoji = '';
          if (react) {
              emoji = Array.isArray(react) ? react[0] : react;
          } else {
              emoji = defaultReactions[Math.floor(Math.random() * defaultReactions.length)];
          }

          if (m?.key && client?.sendMessage && emoji) {
              client.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(() => {});
          }

          await handler(context);
      }, { config });

      commands[name] = wrapped;
      alias.forEach(a => { if (a) aliases[a.toLowerCase()] = name; });
      totalCommands++;
  }

  // Make dreaded, commands, aliases global so Cmds/*.js can use them without require
  global.dreaded = dreaded;
  global.commands = commands;
  global.aliases = aliases;

  function loadCommands() {
      const files = fs.readdirSync(cmdsDir).filter(f => f.endsWith('.js'));
      let loaded = 0;
      let failed = 0;
      for (const file of files) {
          try {
              require(path.join(cmdsDir, file));
              loaded++;
          } catch (err) {
              console.error(`[CMDS] Failed to load ${file}: ${err.message}`);
              failed++;
          }
      }
      const chalk = require('chalk');
      console.log(chalk.green('✔') + ' Loaded ' + chalk.cyan(String(totalCommands)) + ' commands across ' + chalk.yellow(String(loaded)) + ' files | Failed: ' + (failed ? chalk.red(String(failed)) : chalk.green('0')));
  }

  loadCommands();

  module.exports = { commands, aliases, totalCommands, dreaded };
  