// Cmds/General.js — 60 commands
  'use strict';

  const { DateTime } = require('luxon');
const fs = require('fs');
const { getSettings } = require('../Database/config');
const { getFakeQuoted } = require('../lib/fakeQuoted');
const axios = require('axios');
const path = require('path');
const { botname } = require('../Env/settings');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { default: makeWASocket } = require('@whiskeysockets/baileys');

const ALLOWED = /^[0-9+\-*/.()%^ ]+$/;
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

const EFFECT_CMDS = [
    'glossysilver','glitchtext','advancedglow','neonglitch','gradienttext','glowingtext',
    'luxurygold','multicolored','galaxytext','makingneon','writetext','underwater',
    'pixelglitch','summerbeach','papercut','cloudtext','gradientlogo','galaxylogo',
    'colorfulneon','greenneon','1917text','texteffect','lighteffect','bearlogo',
    'typography','hackerneon','blackpinklogo','blackpinkstyle','erasertext','cartoonstyle'
];
const fancyStyles = {
  0: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ค","b":"๖","c":"¢","d":"໓","e":"ē","f":"f","g":"ງ","h":"h","i":"i","j":"ว","k":"k","l":"l","m":"๓","n":"ຖ","o":"໐","p":"p","q":"๑","r":"r","s":"Ş","t":"t","u":"น","v":"ง","w":"ຟ","x":"x","y":"ฯ","z":"ຊ","A":"ค","B":"๖","C":"¢","D":"໓","E":"ē","F":"f","G":"ງ","H":"h","I":"i","J":"ว","K":"k","L":"l","M":"๓","N":"ຖ","O":"໐","P":"p","Q":"๑","R":"r","S":"Ş","T":"t","U":"น","V":"ง","W":"ຟ","X":"x","Y":"ฯ","Z":"ຊ" },
  1: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ą","b":"ც","c":"ƈ","d":"ɖ","e":"ɛ","f":"ʄ","g":"ɠ","h":"ɧ","i":"ı","j":"ʝ","k":"ƙ","l":"Ɩ","m":"ɱ","n":"ŋ","o":"ơ","p":"℘","q":"զ","r":"ཞ","s":"ʂ","t":"ɬ","u":"ų","v":"۷","w":"ῳ","x":"ҳ","y":"ყ","z":"ʑ","A":"ą","B":"ც","C":"ƈ","D":"ɖ","E":"ɛ","F":"ʄ","G":"ɠ","H":"ɧ","I":"ı","J":"ʝ","K":"ƙ","L":"Ɩ","M":"ɱ","N":"ŋ","O":"ơ","P":"℘","Q":"զ","R":"ཞ","S":"ʂ","T":"ɬ","U":"ų","V":"۷","W":"ῳ","X":"ҳ","Y":"ყ","Z":"ʑ" },
  2: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ﾑ","b":"乃","c":"ᄃ","d":"り","e":"乇","f":"ｷ","g":"ム","h":"ん","i":"ﾉ","j":"ﾌ","k":"ズ","l":"ﾚ","m":"ﾶ","n":"刀","o":"の","p":"ｱ","q":"ゐ","r":"尺","s":"丂","t":"ｲ","u":"ひ","v":"√","w":"W","x":"ﾒ","y":"ﾘ","z":"乙","A":"ﾑ","B":"乃","C":"ᄃ","D":"り","E":"乇","F":"ｷ","G":"ム","H":"ん","I":"ﾉ","J":"ﾌ","K":"ズ","L":"ﾚ","M":"ﾶ","N":"刀","O":"の","P":"ｱ","Q":"ゐ","R":"尺","S":"丂","T":"ｲ","U":"ひ","V":"√","W":"W","X":"ﾒ","Y":"ﾘ","Z":"乙" },
  3: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"卂","b":"乃","c":"匚","d":"ᗪ","e":"乇","f":"千","g":"Ꮆ","h":"卄","i":"丨","j":"ﾌ","k":"Ҝ","l":"ㄥ","m":"爪","n":"几","o":"ㄖ","p":"卩","q":"Ɋ","r":"尺","s":"丂","t":"ㄒ","u":"ㄩ","v":"ᐯ","w":"山","x":"乂","y":"ㄚ","z":"乙","A":"卂","B":"乃","C":"匚","D":"ᗪ","E":"乇","F":"千","G":"Ꮆ","H":"卄","I":"丨","J":"ﾌ","K":"Ҝ","L":"ㄥ","M":"爪","N":"几","O":"ㄖ","P":"卩","Q":"Ɋ","R":"尺","S":"丂","T":"ㄒ","U":"ㄩ","V":"ᐯ","W":"山","X":"乂","Y":"ㄚ","Z":"乙" },
  4: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"🄰","b":"🄱","c":"🄲","d":"🄳","e":"🄴","f":"🄵","g":"🄶","h":"🄷","i":"🄸","j":"🄹","k":"🄺","l":"🄻","m":"🄼","n":"🄽","o":"🄾","p":"🄿","q":"🅀","r":"🅁","s":"🅂","t":"🅃","u":"🅄","v":"🅅","w":"🅆","x":"🅇","y":"🅈","z":"🅉","A":"🄰","B":"🄱","C":"🄲","D":"🄳","E":"🄴","F":"🄵","G":"🄶","H":"🄷","I":"🄸","J":"🄹","K":"🄺","L":"🄻","M":"🄼","N":"🄽","O":"🄾","P":"🄿","Q":"🅀","R":"🅁","S":"🅂","T":"🅃","U":"🅄","V":"🅅","W":"🅆","X":"🅇","Y":"🅈","Z":"🅉" },
  5: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"Ꮧ","b":"Ᏸ","c":"ፈ","d":"Ꮄ","e":"Ꮛ","f":"Ꭶ","g":"Ꮆ","h":"Ꮒ","i":"Ꭵ","j":"Ꮰ","k":"Ꮶ","l":"Ꮭ","m":"Ꮇ","n":"Ꮑ","o":"Ꭷ","p":"Ꭾ","q":"Ꭴ","r":"Ꮢ","s":"Ꮥ","t":"Ꮦ","u":"Ꮼ","v":"Ꮙ","w":"Ꮗ","x":"ጀ","y":"Ꭹ","z":"ፚ","A":"Ꮧ","B":"Ᏸ","C":"ፈ","D":"Ꮄ","E":"Ꮛ","F":"Ꭶ","G":"Ꮆ","H":"Ꮒ","I":"Ꭵ","J":"Ꮰ","K":"Ꮶ","L":"Ꮭ","M":"Ꮇ","N":"Ꮑ","O":"Ꭷ","P":"Ꭾ","Q":"Ꭴ","R":"Ꮢ","S":"Ꮥ","T":"Ꮦ","U":"Ꮼ","V":"Ꮙ","W":"Ꮗ","X":"ጀ","Y":"Ꭹ","Z":"ፚ" },
  6: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ᗩ","b":"ᗷ","c":"ᑕ","d":"ᗪ","e":"E","f":"ᖴ","g":"G","h":"ᕼ","i":"I","j":"ᒍ","k":"K","l":"ᒪ","m":"ᗰ","n":"ᑎ","o":"O","p":"ᑭ","q":"ᑫ","r":"ᖇ","s":"ᔕ","t":"T","u":"ᑌ","v":"ᐯ","w":"ᗯ","x":"᙭","y":"Y","z":"ᘔ","A":"ᗩ","B":"ᗷ","C":"ᑕ","D":"ᗪ","E":"E","F":"ᖴ","G":"G","H":"ᕼ","I":"I","J":"ᒍ","K":"K","L":"ᒪ","M":"ᗰ","N":"ᑎ","O":"O","P":"ᑭ","Q":"ᑫ","R":"ᖇ","S":"ᔕ","T":"T","U":"ᑌ","V":"ᐯ","W":"ᗯ","X":"᙭","Y":"Y","Z":"ᘔ" },
  7: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ǟ","b":"ɮ","c":"ƈ","d":"ɖ","e":"ɛ","f":"ʄ","g":"ɢ","h":"ɦ","i":"ɨ","j":"ʝ","k":"ӄ","l":"ʟ","m":"ʍ","n":"ռ","o":"օ","p":"ք","q":"զ","r":"ʀ","s":"ֆ","t":"ȶ","u":"ʊ","v":"ʋ","w":"ա","x":"Ӽ","y":"ʏ","z":"ʐ","A":"ǟ","B":"ɮ","C":"ƈ","D":"ɖ","E":"ɛ","F":"ʄ","G":"ɢ","H":"ɦ","I":"ɨ","J":"ʝ","K":"ӄ","L":"ʟ","M":"ʍ","N":"ռ","O":"օ","P":"ք","Q":"զ","R":"ʀ","S":"ֆ","T":"ȶ","U":"ʊ","V":"ʋ","W":"ա","X":"Ӽ","Y":"ʏ","Z":"ʐ" },
  8: {"0":"𝟶","1":"𝟷","2":"𝟸","3":"𝟹","4":"𝟺","5":"𝟻","6":"𝟼","7":"𝟽","8":"𝟾","9":"𝟿","a":"𝚊","b":"𝚋","c":"𝚌","d":"𝚍","e":"𝚎","f":"𝚏","g":"𝚐","h":"𝚑","i":"𝚒","j":"𝚓","k":"𝚔","l":"𝚕","m":"𝚖","n":"𝚗","o":"𝚘","p":"𝚙","q":"𝚚","r":"𝚛","s":"𝚜","t":"𝚝","u":"𝚞","v":"𝚟","w":"𝚠","x":"𝚡","y":"𝚢","z":"𝚣","A":"𝙰","B":"𝙱","C":"𝙲","D":"𝙳","E":"𝙴","F":"𝙵","G":"𝙶","H":"𝙷","I":"𝙸","J":"𝙹","K":"𝙺","L":"𝙻","M":"𝙼","N":"𝙽","O":"𝙾","P":"𝙿","Q":"𝚀","R":"𝚁","S":"𝚂","T":"𝚃","U":"𝚄","V":"𝚅","W":"𝚆","X":"𝚇","Y":"𝚈","Z":"𝚉" },
  9: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝙖","b":"𝙗","c":"𝙘","d":"𝙙","e":"𝙚","f":"𝙛","g":"𝙜","h":"𝙝","i":"𝙞","j":"𝙟","k":"𝙠","l":"𝙡","m":"𝙢","n":"𝙣","o":"𝙤","p":"𝙥","q":"𝙦","r":"𝙧","s":"𝙨","t":"𝙩","u":"𝙪","v":"𝙫","w":"𝙬","x":"𝙭","y":"𝙮","z":"𝙯","A":"𝘼","B":"𝘽","C":"𝘾","D":"𝘿","E":"𝙀","F":"𝙁","G":"𝙂","H":"𝙃","I":"𝙄","J":"𝙅","K":"𝙆","L":"𝙇","M":"𝙈","N":"𝙉","O":"𝙊","P":"𝙋","Q":"𝙌","R":"𝙍","S":"𝙎","T":"𝙏","U":"𝙐","V":"𝙑","W":"𝙒","X":"𝙓","Y":"𝙔","Z":"𝙕" },
  10: {"0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗","a":"𝐚","b":"𝐛","c":"𝐜","d":"𝐝","e":"𝐞","f":"𝐟","g":"𝐠","h":"𝐡","i":"𝐢","j":"𝐣","k":"𝐤","l":"𝐥","m":"𝐦","n":"𝐧","o":"𝐨","p":"𝐩","q":"𝐪","r":"𝐫","s":"𝐬","t":"𝐭","u":"𝐮","v":"𝐯","w":"𝐰","x":"𝐱","y":"𝐲","z":"𝐳","A":"𝐀","B":"𝐁","C":"𝐂","D":"𝐃","E":"𝐄","F":"𝐅","G":"𝐆","H":"𝐇","I":"𝐈","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝐌","N":"𝐍","O":"𝐎","P":"𝐏","Q":"𝐐","R":"𝐑","S":"𝐒","T":"𝐓","U":"𝐔","V":"𝐕","W":"𝐖","X":"𝐗","Y":"𝐘","Z":"𝐙" },
  11: {"0":"𝟬","1":"𝟭","2":"𝟮","3":"𝟯","4":"𝟰","5":"𝟱","6":"𝟲","7":"𝟳","8":"𝟴","9":"𝟵","a":"𝗮","b":"𝗯","c":"𝗰","d":"𝗱","e":"𝗲","f":"𝗳","g":"𝗴","h":"𝗵","i":"𝗶","j":"𝗷","k":"𝗸","l":"𝗹","m":"𝗺","n":"𝗻","o":"𝗼","p":"𝗽","q":"𝗾","r":"𝗿","s":"𝘀","t":"𝘁","u":"𝘂","v":"𝘃","w":"𝘄","x":"𝘅","y":"𝘆","z":"𝘇","A":"𝗔","B":"𝗕","C":"𝗖","D":"𝗗","E":"𝗘","F":"𝗙","G":"𝗚","H":"𝗛","I":"𝗜","J":"𝗝","K":"𝗞","L":"𝗟","M":"𝗠","N":"𝗡","O":"𝗢","P":"𝗣","Q":"𝗤","R":"𝗥","S":"𝗦","T":"𝗧","U":"𝗨","V":"𝗩","W":"𝗪","X":"𝗫","Y":"𝗬","Z":"𝗭" },
  12: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝘢","b":"𝘣","c":"𝘤","d":"𝘥","e":"𝘦","f":"𝘧","g":"𝘨","h":"𝘩","i":"𝘪","j":"𝘫","k":"𝘬","l":"𝘭","m":"𝘮","n":"𝘯","o":"𝘰","p":"𝘱","q":"𝘲","r":"𝘳","s":"𝘴","t":"𝘵","u":"𝘶","v":"𝘷","w":"𝘸","x":"𝘹","y":"𝘺","z":"𝘻","A":"𝘈","B":"𝘉","C":"𝘊","D":"𝘋","E":"𝘌","F":"𝘍","G":"𝘎","H":"𝘏","I":"𝘐","J":"𝘑","K":"𝘒","L":"𝘓","M":"𝘔","N":"𝘕","O":"𝘖","P":"𝘗","Q":"𝘘","R":"𝘙","S":"𝘚","T":"𝘛","U":"𝘜","V":"𝘝","W":"𝘞","X":"𝘟","Y":"𝘠","Z":"𝘡" },
  13: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"α","b":"Ⴆ","c":"ƈ","d":"ԃ","e":"ҽ","f":"ϝ","g":"ɠ","h":"ԋ","i":"ι","j":"ʝ","k":"ƙ","l":"ʅ","m":"ɱ","n":"ɳ","o":"σ","p":"ρ","q":"ϙ","r":"ɾ","s":"ʂ","t":"ƚ","u":"υ","v":"ʋ","w":"ɯ","x":"x","y":"ყ","z":"ȥ","A":"A","B":"B","C":"C","D":"D","E":"E","F":"F","G":"G","H":"H","I":"I","J":"J","K":"K","L":"L","M":"M","N":"N","O":"O","P":"P","Q":"Q","R":"R","S":"S","T":"T","U":"U","V":"V","W":"W","X":"X","Y":"Y","Z":"Z" },
  14: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"₳","b":"฿","c":"₵","d":"Đ","e":"Ɇ","f":"₣","g":"₲","h":"Ⱨ","i":"ł","j":"J","k":"₭","l":"Ⱡ","m":"₥","n":"₦","o":"Ø","p":"₱","q":"Q","r":"Ɽ","s":"₴","t":"₮","u":"Ʉ","v":"V","w":"₩","x":"Ӿ","y":"Ɏ","z":"Ⱬ","A":"₳","B":"฿","C":"₵","D":"Đ","E":"Ɇ","F":"₣","G":"₲","H":"Ⱨ","I":"ł","J":"J","K":"₭","L":"Ⱡ","M":"₥","N":"₦","O":"Ø","P":"₱","Q":"Q","R":"Ɽ","S":"₴","T":"₮","U":"Ʉ","V":"V","W":"₩","X":"Ӿ","Y":"Ɏ","Z":"Ⱬ" },
  15: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"å","b":"ß","c":"¢","d":"Ð","e":"ê","f":"£","g":"g","h":"h","i":"ï","j":"j","k":"k","l":"l","m":"m","n":"ñ","o":"ð","p":"þ","q":"q","r":"r","s":"§","t":"†","u":"µ","v":"v","w":"w","x":"x","y":"¥","z":"z","A":"Ä","B":"ß","C":"Ç","D":"Ð","E":"È","F":"£","G":"G","H":"H","I":"Ì","J":"J","K":"K","L":"L","M":"M","N":"ñ","O":"Ö","P":"þ","Q":"Q","R":"R","S":"§","T":"†","U":"Ú","V":"V","W":"W","X":"×","Y":"¥","Z":"Z" },
  16: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"α","b":"в","c":"¢","d":"∂","e":"є","f":"ƒ","g":"g","h":"н","i":"ι","j":"נ","k":"к","l":"ℓ","m":"м","n":"η","o":"σ","p":"ρ","q":"q","r":"я","s":"ѕ","t":"т","u":"υ","v":"ν","w":"ω","x":"χ","y":"у","z":"z","A":"α","B":"в","C":"¢","D":"∂","E":"є","F":"ƒ","G":"g","H":"н","I":"ι","J":"נ","K":"к","L":"ℓ","M":"м","N":"η","O":"σ","P":"ρ","Q":"q","R":"я","S":"ѕ","T":"т","U":"υ","V":"ν","W":"ω","X":"χ","Y":"у","Z":"z" },
  17: {"0":"⊘","1":"𝟙","2":"ϩ","3":"Ӡ","4":"५","5":"Ƽ","6":"Ϭ","7":"7","8":"𝟠","9":"९","a":"ą","b":"ҍ","c":"ç","d":"ժ","e":"ҽ","f":"ƒ","g":"ց","h":"հ","i":"ì","j":"ʝ","k":"ҟ","l":"Ӏ","m":"ʍ","n":"ղ","o":"օ","p":"ք","q":"զ","r":"ɾ","s":"ʂ","t":"է","u":"մ","v":"ѵ","w":"ա","x":"×","y":"վ","z":"Հ","A":"Ⱥ","B":"β","C":"↻","D":"Ꭰ","E":"Ɛ","F":"Ƒ","G":"Ɠ","H":"Ƕ","I":"į","J":"ل","K":"Ҡ","L":"Ꝉ","M":"Ɱ","N":"ហ","O":"ට","P":"φ","Q":"Ҩ","R":"འ","S":"Ϛ","T":"Ͳ","U":"Ա","V":"Ỽ","W":"చ","X":"ჯ","Y":"Ӌ","Z":"ɀ" },
  18: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"Λ","b":"B","c":"ᄃ","d":"D","e":"Σ","f":"F","g":"G","h":"Ή","i":"I","j":"J","k":"K","l":"ᄂ","m":"M","n":"П","o":"Ө","p":"P","q":"Q","r":"Я","s":"Ƨ","t":"Ƭ","u":"Ц","v":"V","w":"Щ","x":"X","y":"Y","z":"Z","A":"Λ","B":"B","C":"ᄃ","D":"D","E":"Σ","F":"F","G":"G","H":"Ή","I":"I","J":"J","K":"K","L":"ᄂ","M":"M","N":"П","O":"Ө","P":"P","Q":"Q","R":"Я","S":"Ƨ","T":"Ƭ","U":"Ц","V":"V","W":"Щ","X":"X","Y":"Y","Z":"Z" },
  19: {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","a":"ₐ","b":"b","c":"c","d":"d","e":"ₑ","f":"f","g":"g","h":"ₕ","i":"ᵢ","j":"ⱼ","k":"ₖ","l":"ˡ","m":"ᵐ","n":"ⁿ","o":"ₒ","p":"ᵖ","q":"q","r":"ᵣ","s":"ₛ","t":"ₜ","u":"ᵤ","v":"ᵥ","w":"w","x":"ₓ","y":"y","z":"z","A":"ₐ","B":"B","C":"C","D":"D","E":"ₑ","F":"F","G":"G","H":"ₕ","I":"ᵢ","J":"ⱼ","K":"ₖ","L":"ˡ","M":"ᵐ","N":"ⁿ","O":"ₒ","P":"ᵖ","Q":"Q","R":"ᵣ","S":"ₛ","T":"ₜ","U":"ᵤ","V":"ᵥ","W":"W","X":"ₓ","Y":"Y","Z":"Z" },
  20: {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ","e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ","i":"ⁱ","j":"ʲ","k":"ᵏ","l":"ˡ","m":"ᵐ","n":"ⁿ","o":"ᵒ","p":"ᵖ","q":"q","r":"ʳ","s":"ˢ","t":"ᵗ","u":"ᵘ","v":"ᵛ","w":"ʷ","x":"ˣ","y":"ʸ","z":"ᶻ","A":"ᴬ","B":"ᴮ","C":"ᶜ","D":"ᴰ","E":"ᴱ","F":"ᶠ","G":"ᴳ","H":"ᴴ","I":"ᴵ","J":"ᴶ","K":"ᴷ","L":"ᴸ","M":"ᴹ","N":"ᴺ","O":"ᴼ","P":"ᴾ","Q":"Q","R":"ᴿ","S":"ˢ","T":"ᵀ","U":"ᵁ","V":"ⱽ","W":"ᵂ","X":"ˣ","Y":"ʸ","Z":"ᶻ" },
  21: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ค","b":"๒","c":"ς","d":"๔","e":"є","f":"Ŧ","g":"ﻮ","h":"ђ","i":"เ","j":"ן","k":"к","l":"ɭ","m":"๓","n":"ภ","o":"๏","p":"ק","q":"ợ","r":"г","s":"ร","t":"Շ","u":"ย","v":"ש","w":"ฬ","x":"א","y":"ץ","z":"չ","A":"ค","B":"๒","C":"ς","D":"๔","E":"є","F":"Ŧ","G":"ﻮ","H":"ђ","I":"เ","J":"ן","K":"к","L":"ɭ","M":"๓","N":"ภ","O":"๏","P":"ק","Q":"ợ","R":"г","S":"ร","T":"Շ","U":"ย","V":"ש","W":"ฬ","X":"א","Y":"ץ","Z":"չ" },
  22: {"0":"𝟘","1":"𝟙","2":"𝟚","3":"𝟛","4":"𝟜","5":"𝟝","6":"𝟞","7":"𝟟","8":"𝟠","9":"𝟡","a":"𝕒","b":"𝕓","c":"𝕔","d":"𝕕","e":"𝕖","f":"𝕗","g":"𝕘","h":"𝕙","i":"𝕚","j":"𝕛","k":"𝕜","l":"𝕝","m":"𝕞","n":"𝕟","o":"𝕠","p":"𝕡","q":"𝕢","r":"𝕣","s":"𝕤","t":"𝕥","u":"𝕦","v":"𝕧","w":"𝕨","x":"𝕩","y":"𝕪","z":"𝕫","A":"𝔸","B":"𝔹","C":"ℂ","D":"𝔻","E":"𝔼","F":"𝔽","G":"𝔾","H":"ℍ","I":"𝕀","J":"𝕁","K":"𝕂","L":"𝕃","M":"𝕄","N":"ℕ","O":"𝕆","P":"ℙ","Q":"ℚ","R":"ℝ","S":"𝕊","T":"𝕋","U":"𝕌","V":"𝕍","W":"𝕎","X":"𝕏","Y":"𝕐","Z":"ℤ" },
  23: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝖆","b":"𝖇","c":"𝖈","d":"𝖉","e":"𝖊","f":"𝖋","g":"𝖌","h":"𝖍","i":"𝖎","j":"𝖏","k":"𝖐","l":"𝖑","m":"𝖒","n":"𝖓","o":"𝖔","p":"𝖕","q":"𝖖","r":"𝖗","s":"𝖘","t":"𝖙","u":"𝖚","v":"𝖛","w":"𝖜","x":"𝖝","y":"𝖞","z":"𝖟","A":"𝕬","B":"𝕭","C":"𝕮","D":"𝕯","E":"𝕰","F":"𝕱","G":"𝕲","H":"𝕳","I":"𝕴","J":"𝕵","K":"𝕶","L":"𝕷","M":"𝕸","N":"𝕹","O":"𝕺","P":"𝕻","Q":"𝕼","R":"𝕽","S":"𝕾","T":"𝕿","U":"𝖀","V":"𝖁","W":"𝖂","X":"𝖃","Y":"𝖄","Z":"𝖅" },
  24: {"q":"🆀","w":"🆆","e":"🅴","r":"🆁","t":"🆃","y":"🆈","u":"🆄","i":"🅸","o":"🅾","p":"🅿","a":"🅰","s":"🆂","d":"🅳","f":"🅵","g":"🅶","h":"🅷","j":"🅹","k":"🅺","l":"🅻","z":"🆉","x":"🆇","c":"🅲","v":"🆅","b":"🅱","n":"🅽","m":"🅼"},
  25: {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"𝓪","b":"𝓫","c":"𝓬","d":"𝓭","e":"𝓮","f":"𝓯","g":"𝓰","h":"𝓱","i":"𝓲","j":"𝓳","k":"𝓴","l":"𝓵","m":"𝓶","n":"𝓷","o":"𝓸","p":"𝓹","q":"𝓺","r":"𝓻","s":"𝓼","t":"𝓽","u":"𝓾","v":"𝓿","w":"𝔀","x":"𝔁","y":"𝔂","z":"𝔃","A":"𝓐","B":"𝓑","C":"𝓒","D":"𝓓","E":"𝓔","F":"𝓕","G":"𝓖","H":"𝓗","I":"𝓘","J":"𝓙","K":"𝓚","L":"𝓛","M":"𝓜","N":"𝓝","O":"𝓞","P":"𝓟","Q":"𝓠","R":"𝓡","S":"𝓢","T":"𝓣","U":"𝓤","V":"𝓥","W":"𝓦","X":"𝓧","Y":"𝓨","Z":"𝓩" },
  26: {"a":"𝔞","b":"𝔟","c":"𝔠","d":"𝔡","e":"𝔢","f":"𝔣","g":"𝔤","h":"𝔥","i":"𝔦","j":"𝔧","k":"𝔨","l":"𝔩","m":"𝔪","n":"𝔫","o":"𝔬","p":"𝔭","q":"𝔮","r":"𝔯","s":"𝔰","t":"𝔱","u":"𝔲","v":"𝔳","w":"𝔴","x":"𝔵","y":"𝔶","z":"𝔷","A":"𝔄","B":"𝔅","C":"ℭ","D":"𝔇","E":"𝔈","F":"𝔉","G":"𝔊","H":"ℌ","I":"ℑ","J":"𝔍","K":"𝔎","L":"𝔏","M":"𝔐","N":"𝔑","O":"𝔒","P":"𝔓","Q":"𝔔","R":"ℜ","S":"𝔖","T":"𝔗","U":"𝔘","V":"𝔙","W":"𝔚","X":"𝔛","Y":"𝔜","Z":"ℨ" },
  27: {"`":"`","1":"１","2":"２","3":"３","4":"４","5":"５","6":"６","7":"７","8":"８","9":"９","0":"０","-":"－",":":"＝","~":"~","!":"！","@":"＠","#":"＃","$":"＄","%":"％","^":"^","&":"＆","*":"＊","(":"（",")":"）","_":"_","+":"＋","q":"ｑ","w":"ｗ","e":"ｅ","r":"ｒ","t":"ｔ","y":"ｙ","u":"ｕ","i":"ｉ","o":"ｏ","p":"ｐ","[":"[","]":"]","\\":"\\","Q":"Ｑ","W":"Ｗ","E":"Ｅ","R":"Ｒ","T":"Ｔ","Y":"Ｙ","U":"Ｕ","I":"Ｉ","O":"Ｏ","P":"Ｐ","{":"{","}":"}","|":"|","a":"ａ","s":"ｓ","d":"ｄ","f":"ｆ","g":"ｇ","h":"ｈ","j":"ｊ","k":"ｋ","l":"ｌ",";":"；","'":"＇","A":"Ａ","S":"Ｓ","D":"Ｄ","F":"Ｆ","G":"Ｇ","H":"Ｈ","J":"Ｊ","K":"Ｋ","L":"Ｌ",":":"：","\"":"\"","z":"ｚ","x":"ｘ","c":"ｃ","v":"ｖ","b":"ｂ","n":"ｎ","m":"ｍ",",":"，",".":"．","/":"／","Z":"Ｚ","X":"Ｘ","C":"Ｃ","V":"Ｖ","B":"Ｂ","N":"Ｎ","M":"Ｍ","<":"<",">":">","?":"？"},
  28: {"a":"ᴀ","b":"ʙ","c":"ᴄ","d":"ᴅ","e":"ᴇ","f":"ғ","g":"ɢ","h":"ʜ","i":"ɪ","j":"ᴊ","k":"ᴋ","l":"ʟ","m":"ᴍ","n":"ɴ","o":"ᴏ","p":"ᴘ","q":"ǫ","r":"ʀ","s":"s","t":"ᴛ","u":"ᴜ","v":"ᴠ","w":"ᴡ","x":"x","y":"ʏ","z":"ᴢ","A":"ᴀ","B":"ʙ","C":"ᴄ","D":"ᴅ","E":"ᴇ","F":"ғ","G":"ɢ","H":"ʜ","I":"ɪ","J":"ᴊ","K":"ᴋ","L":"ʟ","M":"ᴍ","N":"ɴ","O":"ᴏ","P":"ᴘ","Q":"ǫ","R":"ʀ","S":"s","T":"ᴛ","U":"ᴜ","V":"ᴠ","W":"ᴡ","X":"x","Y":"ʏ","Z":"ᴢ" },
  29: {"a":"𝒂","b":"𝒃","c":"𝒄","d":"𝒅","e":"𝒆","f":"𝒇","g":"𝒈","h":"𝒉","i":"𝒊","j":"𝒋","k":"𝒌","l":"𝒍","m":"𝒎","n":"𝒏","o":"𝒐","p":"𝒑","q":"𝒒","r":"𝒓","s":"𝒔","t":"𝒕","u":"𝒖","v":"𝒗","w":"𝒘","x":"𝒙","y":"𝒚","z":"𝒛","A":"𝐴","B":"𝐵","C":"𝐶","D":"𝐷","E":"𝐸","F":"𝐹","G":"𝐺","H":"𝐻","I":"𝐼","J":"𝐽","K":"𝐾","L":"𝐿","M":"𝑀","N":"𝑁","O":"𝑂","P":"𝑃","Q":"𝑄","R":"𝑅","S":"𝑆","T":"𝑇","U":"𝑈","V":"𝑉","W":"𝑊","X":"𝑋","Y":"𝑌","Z":"𝑍" },
  30: {"a":"𝛥","b":"𝐵","c":"𝐶","d":"𝐷","e":"𝛯","f":"𝐹","g":"𝐺","h":"𝛨","i":"𝛪","j":"𝐽","k":"𝛫","l":"𝐿","m":"𝛭","n":"𝛮","o":"𝛩","p":"𝛲","q":"𝑄","r":"𝑅","s":"𝑆","t":"𝑇","u":"𝑈","v":"𝛻","w":"𝑊","x":"𝛸","y":"𝑌","z":"𝛧","A":"𝛥","B":"𝐵","C":"𝐶","D":"𝐷","E":"𝛯","F":"𝐹","G":"𝐺","H":"𝛨","I":"𝛪","J":"𝐽","K":"𝛫","L":"𝐿","M":"𝛭","N":"𝛮","O":"𝛩","P":"𝛲","Q":"𝑄","R":"𝑅","S":"𝑆","T":"𝑇","U":"𝑈","V":"𝛻","W":"𝑊","X":"𝛸","Y":"𝑌","Z":"𝛧"},
  31: {"A":"𝚫","B":"𝚩","C":"𝐂","D":"𝐃","E":"𝚵","F":"𝐅","G":"𝐆","H":"𝚮","I":"𝚰","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝚳","N":"𝚴","O":"𝚯","P":"𝚸","Q":"𝐐","R":"𝚪","S":"𝐒","T":"𝚻","U":"𝐔","V":"𝛁","W":"𝐖","X":"𝚾","Y":"𝐘","Z":"𝚭","a":"𝚫","b":"𝚩","c":"𝐂","d":"𝐃","e":"𝚵","f":"𝐅","g":"𝐆","h":"𝚮","i":"𝚰","j":"𝐉","k":"𝐊","l":"𝐋","m":"𝚳","n":"𝚴","o":"𝚯","p":"𝚸","q":"𝐐","r":"𝚪","s":"𝐒","t":"𝚻","u":"𝐔","v":"𝛁","w":"𝐖","x":"𝚾","y":"𝐘","z":"𝚭"},
  32: {"A":"ꪖ","B":"᥇","C":"ᥴ","D":"ᦔ","E":"ꫀ","F":"ᠻ","G":"ᧁ","H":"ꫝ","I":"ﺃ","J":"꠹","K":"ᛕ","L":"ꪶ","M":"ꪑ","N":"ꪀ","O":"ꪮ","P":"ᜣ","Q":"ꪇ","R":"᥅","S":"ᦓ","T":"ꪻ","U":"ꪊ","V":"ꪜ","W":"᭙","X":"᥊","Y":"ꪗ","Z":"ɀ","a":"ꪖ","b":"᥇","c":"ᥴ","d":"ᦔ","e":"ꫀ","f":"ᠻ","g":"ᧁ","h":"ꫝ","i":"ﺃ","j":"꠹","k":"ᛕ","l":"ꪶ","m":"ꪑ","n":"ꪀ","o":"ꪮ","p":"ᜣ","q":"ꪇ","r":"᥅","s":"ᦓ","t":"ꪻ","u":"ꪊ","v":"ꪜ","w":"᭙","x":"᥊","y":"ꪗ","z":"ɀ"},
  33: {"a":"ꪖ","b":"᥇","c":"ᥴ","d":"ᦔ","e":"ꫀ","f":"ᠻ","g":"ᧁ","h":"ꫝ","i":"ﺃ","j":"꠹","k":"ᛕ","l":"ꪶ","m":"ꪑ","n":"ꪀ","o":"ꪮ","p":"ᜣ","q":"ꪇ","r":"᥅","s":"ᦓ","t":"ꪻ","u":"ꪊ","v":"ꪜ","w":"᭙","x":"᥊","y":"ꪗ","z":"ɀ","A":"ꪖ","B":"᥇","C":"ᥴ","D":"ᦔ","E":"ꫀ","F":"ᠻ","G":"ᧁ","H":"ꫝ","I":"ﺃ","J":"꠹","K":"ᛕ","L":"ꪶ","M":"ꪑ","N":"ꪀ","O":"ꪮ","P":"ᜣ","Q":"ꪇ","R":"᥅","S":"ᦓ","T":"ꪻ","U":"ꪊ","V":"ꪜ","W":"᭙","X":"᥊","Y":"ꪗ","Z":"ɀ"},
  34: {"a":"𝒶","b":"𝒷","c":"𝒸","d":"𝒹","e":"𝑒","f":"𝒻","g":"𝑔","h":"𝒽","i":"𝒾","j":"𝒿","k":"𝓀","l":"𝓁","m":"𝓂","n":"𝓃","o":"𝑜","p":"𝓅","q":"𝓆","r":"𝓇","s":"𝓈","t":"𝓉","u":"𝓊","v":"𝓋","w":"𝓌","x":"𝓍","y":"𝓎","z":"𝓏","A":"𝒜","B":"𝐵","C":"𝒞","D":"𝒟","E":"𝐸","F":"𝐹","G":"𝒢","H":"𝐻","I":"𝐼","J":"𝒥","K":"𝒦","L":"𝐿","M":"𝑀","N":"𝒩","O":"𝒪","P":"𝒫","Q":"𝒬","R":"𝑅","S":"𝒮","T":"𝒯","U":"𝒰","V":"𝒱","W":"𝒲","X":"𝒳","Y":"𝒴","Z":"𝒵","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  35: {"a":"ａ","b":"ｂ","c":"ｃ","d":"ｄ","e":"ｅ","f":"ｆ","g":"ｇ","h":"ｈ","i":"ｉ","j":"ｊ","k":"ｋ","l":"ｌ","m":"ｍ","n":"ｎ","o":"ｏ","p":"ｐ","q":"ｑ","r":"ｒ","s":"ｓ","t":"ｔ","u":"ｕ","v":"ｖ","w":"ｗ","x":"ｘ","y":"ｙ","z":"ｚ","A":"Ａ","B":"Ｂ","C":"Ｃ","D":"Ｄ","E":"Ｅ","F":"Ｆ","G":"Ｇ","H":"Ｈ","I":"Ｉ","J":"Ｊ","K":"Ｋ","L":"Ｌ","M":"Ｍ","N":"Ｎ","O":"Ｏ","P":"Ｐ","Q":"Ｑ","R":"Ｒ","S":"Ｓ","T":"Ｔ","U":"Ｕ","V":"Ｖ","W":"Ｗ","X":"Ｘ","Y":"Ｙ","Z":"Ｚ","0":"０","1":"１","2":"２","3":"３","4":"４","5":"５","6":"６","7":"７","8":"８","9":"９"},
  36: {"a":"ꋬ","b":"ꃳ","c":"ꉔ","d":"꒯","e":"ꏂ","f":"ꊰ","g":"ꍌ","h":"ꃅ","i":"꒐","j":"꒻","k":"ꀘ","l":"꒒","m":"ꁒ","n":"ꋊ","o":"ꄲ","p":"ꉣ","q":"ꋠ","r":"ꋪ","s":"ꌚ","t":"꓄","u":"꒤","v":"꒦","w":"ꅐ","x":"ꉧ","y":"ꌦ","z":"ꁴ","A":"ꋬ","B":"ꃳ","C":"ꉔ","D":"꒯","E":"ꏂ","F":"ꊰ","G":"ꍌ","H":"ꃅ","I":"꒐","J":"꒻","K":"ꀘ","L":"꒒","M":"ꁒ","N":"ꋊ","O":"ꄲ","P":"ꉣ","Q":"ꋠ","R":"ꋪ","S":"ꌚ","T":"꓄","U":"꒤","V":"꒦","W":"ꅐ","X":"ꉧ","Y":"ꌦ","Z":"ꁴ","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  37: {"a":"🇦","b":"🇧","c":"🇨","d":"🇩","e":"🇪","f":"🇫","g":"🇬","h":"🇭","i":"🇮","j":"🇯","k":"🇰","l":"🇱","m":"🇲","n":"🇳","o":"🇴","p":"🇵","q":"🇶","r":"🇷","s":"🇸","t":"🇹","u":"🇺","v":"🇻","w":"🇼","x":"🇽","y":"🇾","z":"🇿","A":"🇦","B":"🇧","C":"🇨","D":"🇩","E":"🇪","F":"🇫","G":"🇬","H":"🇭","I":"🇮","J":"🇯","K":"🇰","L":"🇱","M":"🇲","N":"🇳","O":"🇴","P":"🇵","Q":"🇶","R":"🇷","S":"🇸","T":"🇹","U":"🇺","V":"🇻","W":"🇼","X":"🇽","Y":"🇾","Z":"🇿","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  38: {"a":"ᗩ","b":"ᗷ","c":"ᑢ","d":"ᕲ","e":"ᗴ","f":"ᖴ","g":"ᘜ","h":"ᕼ","i":"ᓰ","j":"ᒚ","k":"ᖽ","l":"ᓬ","m":"ᘻ","n":"ᘉ","o":"ᓍ","p":"ᕵ","q":"ᕴ","r":"ᖇ","s":"ᔕ","t":"ᖶ","u":"ᑘ","v":"ᐯ","w":"ᘺ","x":"᙮","y":"ᖻ","z":"ᗱ","A":"ᗩ","B":"ᗷ","C":"ᑢ","D":"ᕲ","E":"ᗴ","F":"ᖴ","G":"ᘜ","H":"ᕼ","I":"ᓰ","J":"ᒚ","K":"ᖽ","L":"ᓬ","M":"ᘻ","N":"ᘉ","O":"ᓍ","P":"ᕵ","Q":"ᕴ","R":"ᖇ","S":"ᔕ","T":"ᖶ","U":"ᑘ","V":"ᐯ","W":"ᘺ","X":"᙮","Y":"ᖻ","Z":"ᗱ","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  39: {"a":"𝔞","b":"𝔟","c":"𝔠","d":"𝔡","e":"𝔢","f":"𝔣","g":"𝔤","h":"𝔥","i":"𝔦","j":"𝔧","k":"𝔨","l":"𝔩","m":"𝔪","n":"𝔫","o":"𝔬","p":"𝔭","q":"𝔮","r":"𝔯","s":"𝔰","t":"𝔱","u":"𝔲","v":"𝔳","w":"𝔴","x":"𝔵","y":"𝔶","z":"𝔷","A":"𝔄","B":"𝔅","C":"ℭ","D":"𝔇","E":"𝔈","F":"𝔉","G":"𝔊","H":"ℌ","I":"ℑ","J":"𝔍","K":"𝔎","L":"𝔏","M":"𝔐","N":"𝔑","O":"𝔒","P":"𝔓","Q":"𝔔","R":"ℜ","S":"𝔖","T":"𝔗","U":"𝔘","V":"𝔙","W":"𝔚","X":"𝔛","Y":"𝔜","Z":"ℨ","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  40: {"a":"ą","b":"ც","c":"ƈ","d":"ɖ","e":"ɛ","f":"ʄ","g":"ɠ","h":"ɧ","i":"ı","j":"ʝ","k":"ƙ","l":"Ɩ","m":"ɱ","n":"ŋ","o":"ơ","p":"℘","q":"զ","r":"ཞ","s":"ʂ","t":"ɬ","u":"ų","v":"۷","w":"ῳ","x":"ҳ","y":"ყ","z":"ʑ","A":"Ą","B":"Ცვ","C":"Ƈ","D":"Ɖ","E":"Ɛ","F":"ʄ","G":"Ɠ","H":"ɧ","I":"İ","J":"Ʝ","K":"Ƙ","L":"Ĺ","M":"Ɱ","N":"Ŋ","O":"Ơ","P":"Ƥ","Q":"Զ","R":"Ʀ","S":"Ʂ","T":"Ƭ","U":"Ų","V":"Ʋ","W":"Ŵ","X":"Ҳ","Y":"Ყ","Z":"ʑ","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  41: {"a":"Ⓐ","b":"Ⓑ","c":"Ⓒ","d":"Ⓓ","e":"Ⓔ","f":"Ⓕ","g":"Ⓖ","h":"Ⓗ","i":"Ⓘ","j":"Ⓙ","k":"Ⓚ","l":"Ⓛ","m":"Ⓜ","n":"Ⓝ","o":"Ⓞ","p":"Ⓟ","q":"Ⓠ","r":"Ⓡ","s":"Ⓢ","t":"Ⓣ","u":"Ⓤ","v":"Ⓥ","w":"Ⓦ","x":"Ⓧ","y":"Ⓨ","z":"Ⓩ","A":"Ⓐ","B":"Ⓑ","C":"Ⓒ","D":"Ⓓ","E":"Ⓔ","F":"Ⓕ","G":"Ⓖ","H":"Ⓗ","I":"Ⓘ","J":"Ⓙ","K":"Ⓚ","L":"Ⓛ","M":"Ⓜ","N":"Ⓝ","O":"Ⓞ","P":"Ⓟ","Q":"Ⓠ","R":"Ⓡ","S":"Ⓢ","T":"Ⓣ","U":"Ⓤ","V":"Ⓥ","W":"Ⓦ","X":"Ⓧ","Y":"Ⓨ","Z":"Ⓩ","0":"⓪","1":"①","2":"②","3":"③","4":"④","5":"⑤","6":"⑥","7":"⑦","8":"⑧","9":"⑨"},
  42: {"a":"𝘢","b":"𝘣","c":"𝘤","d":"𝘥","e":"𝘦","f":"𝘧","g":"𝘨","h":"𝘩","i":"𝘪","j":"𝘫","k":"𝘬","l":"𝘭","m":"𝘮","n":"𝘯","o":"𝘰","p":"𝘱","q":"𝘲","r":"𝘳","s":"𝘴","t":"𝘵","u":"𝘶","v":"𝘷","w":"𝘸","x":"𝘹","y":"𝘺","z":"𝘻","A":"𝘼","B":"𝘽","C":"𝘾","D":"𝘿","E":"𝙀","F":"𝙁","G":"𝙂","H":"𝙃","I":"𝙄","J":"𝙅","K":"𝙆","L":"𝙇","M":"𝙈","N":"𝙉","O":"𝙊","P":"𝙋","Q":"𝙌","R":"𝙍","S":"𝙎","T":"𝙏","U":"𝙐","V":"𝙑","W":"𝙒","X":"𝙓","Y":"𝙔","Z":"𝙕","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"},
  43: {"a":"₳","b":"฿","c":"₵","d":"Đ","e":"Ɇ","f":"₣","g":"₲","h":"Ⱨ","i":"ł","j":"J","k":"₭","l":"Ⱡ","m":"₥","n":"₦","o":"Ø","p":"₱","q":"Q","r":"Ɽ","s":"₴","t":"₮","u":"Ʉ","v":"V","w":"₩","x":"Ӿ","y":"Ɏ","z":"Ⱬ","A":"₳","B":"฿","C":"₵","D":"Đ","E":"Ɇ","F":"₣","G":"₲","H":"Ⱨ","I":"ł","J":"J","K":"₭","L":"Ⱡ","M":"₥","N":"₦","O":"Ø","P":"₱","Q":"Q","R":"Ɽ","S":"₴","T":"₮","U":"Ʉ","V":"V","W":"₩","X":"Ӿ","Y":"Ɏ","Z":"Ⱬ","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"}
};
function applyStyle(text, styleId) {
  const style = fancyStyles[styleId];
  if (!style) return null;
  return [...text].map(char => {
    const lowerChar = char.toLowerCase();
    return style[lowerChar] || style[char] || char;
  }).join('');
}

const totalStyles = Object.keys(fancyStyles).length;
const fetch = require('node-fetch');
  const { getSettings } = require('../lib/fastSettings');
const {
    default: Toxic_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');

function cleanNumber(input) {
    let num = input.replace(/[\s\-\(\)\+\.]/g, '');
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('00')) {
        num = num.slice(2);
    }
    return num;
}

function makeid(len = 6) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const { makePDF } = require('../lib/toxicApi');

function detectPlatform() {
    if (process.env.DYNO)                                          return 'Heroku 🟣';
    if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) return 'Railway 🚂';
    if (process.env.RENDER)                                        return 'Render 🔵';
    if (process.env.REPLIT_DEPLOYMENT || process.env.REPL_ID)     return 'Replit 🌀';
    if (process.env.FLY_APP_NAME)                                  return 'Fly.io 🪰';
    if (process.env.KOYEB_SERVICE_ID)                              return 'Koyeb ⚡';
    if (process.env.VERCEL)                                        return 'Vercel ▲';
    if (process.env.CYCLIC_APP_ID)                                 return 'Cyclic 🔁';
    if (process.env.K_SERVICE || process.env.FUNCTION_TARGET)      return 'Google Cloud ☁️';
    if (process.env.AWS_LAMBDA_FUNCTION_NAME)                      return 'AWS Lambda λ';
    const os = process.platform;
    if (os === 'linux')   return 'VPS/Linux 🖥️';
    if (os === 'darwin')  return 'macOS 🍎';
    if (os === 'win32')   return 'Windows 🪟';
    return `Local (${os}) 🖥️`;
}
const MORE = String.fromCharCode(8206);
const READ_MORE = MORE.repeat(4001);
const DEV_JID = '254114885159@s.whatsapp.net';
const { getAnime } = require('../lib/toxicApi');

const ROASTS = [
    "Your WiFi password is probably 'password123'. Clown behaviour.",
    "You're the reason shampoo bottles say 'lather, rinse, repeat' — because some people need extra instructions.",
    "I've seen better decisions made by a coin flip.",
    "You type with one finger. That explains everything.",
    "Your personality has the energy of a dead phone battery.",
    "Even Google can't find a reason to be impressed by you.",
    "You're the human equivalent of a loading screen that never ends.",
    "People slow clap for you sarcastically and you think it's real.",
    "You peaked at birth, and even that's debatable.",
    "Your common sense must be on airplane mode — permanently.",
    "You could get lost in a one-room apartment.",
    "Your brain cells have a restraining order against each other.",
    "You're about as useful as a screen door on a submarine.",
    "You think 'lol' is a proper response to everything. Tragic.",
    "You're the type to reply 'k' and think you're deep.",
    "If stupidity had a mascot, it'd call in sick and send you instead.",
    "You're giving main character energy in a deleted scene.",
    "Your confidence is impressive considering your track record.",
    "You're a walking 'could've been' story.",
    "Even autocorrect gave up on fixing your messages.",
];
const { randomUUID } = require('crypto');
const { translate } = require('@vitalets/google-translate-api');

  // ── nsfwmenu
dreaded({
  pattern: "nsfwmenu",
  alias: ["nsfwmenu"],
  desc: "Displays only the +18 menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ +18 MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/NSFW').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: `Toxic-MD WA bot`,
          body: `©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          thumbnail: pict,
          sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fq });
  });

// ── advice
dreaded({
  pattern: "advice",
  alias: ["tip","lifetip","suggest"],
  desc: "Get a random piece of life advice",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 8000 });
            const advice = res.data?.slip?.advice || 'Stop asking for advice and figure it out.';
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Aᴅᴠɪᴄᴇ ≪───\n├\n├ 💡 ${advice}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Aᴅᴠɪᴄᴇ ≪───\n├\n├ My advice? Try again later.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── aimenu
dreaded({
  pattern: "aimenu",
  alias: ["aimenu"],
  desc: "Displays only the AI menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ AI MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/AI').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── alay
dreaded({
  pattern: "alay",
  desc: "Convert text to alay/leet style",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const input = text || m.quoted?.text;
        if (!input) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ALAY TEXT ≪───\n├ \n├ Give me text to alay-ify, genius.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        const alay = input.split('').map(v => {
            const r = Math.random();
            const char = r > .5 ? v.toUpperCase() : v.toLowerCase();
            if (r > .6) {
                switch (v.toLowerCase()) {
                    case 'a': return '4';
                    case 'e': return '3';
                    case 'i': return '1';
                    case 'o': return '0';
                    case 's': return '5';
                    case 'g': return '9';
                    case 'b': return '8';
                    case 't': return '7';
                }
            }
            return char;
        }).join('');
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ ALAY TEXT ≪───\n├ \n├ ${alay}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });

// ── alive
dreaded({
  pattern: "alive",
  alias: ["bot","test","isalive","status"],
  desc: "Checks if the bot is alive and running",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, prefix, pict } = context;
    const fq = getFakeQuoted(m);
    const bName = botname || 'Toxic-MD';

    try {
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      const secs = Math.floor(uptime % 60);
      const uptimeStr = `${days}d ${hours}h ${mins}m ${secs}s`;

      const caption = `╭───(    TOXIC-MD    )───\n├───≫ I'ᴍ Aʟɪᴠᴇ ≪───\n├ \n├ @${m.sender.split('@')[0]}, I'm up and running.\n├ Been alive for ${uptimeStr}.\n├ Type *${prefix}menu* if you need\n├ help, which you probably do.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      if (pict && Buffer.isBuffer(pict)) {
        await client.sendMessage(m.chat, {
          image: pict,
          caption: caption,
          mentions: [m.sender]
        }, { quoted: fq });
      } else {
        await client.sendMessage(m.chat, {
          text: caption,
          mentions: [m.sender]
        }, { quoted: fq });
      }

      const possibleAudioPaths = [
        path.join(__dirname, '..', 'xh_clinton', 'test.mp3'),
        path.join(process.cwd(), 'xh_clinton', 'test.mp3'),
        path.join(__dirname, 'xh_clinton', 'test.mp3'),
      ];

      for (const audioPath of possibleAudioPaths) {
        try {
          if (fs.existsSync(audioPath)) {
            await client.sendMessage(m.chat, {
              audio: { url: audioPath },
              ptt: true,
              mimetype: 'audio/mpeg',
              fileName: 'toxic-alive.mp3'
            }, { quoted: fq });
            break;
          }
        } catch (err) {}
      }

    } catch (error) {
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Cʀᴀsʜᴇᴅ ≪───\n├ \n├ Something broke, @${m.sender.split('@')[0].split(':')[0]}.\n├ Error: ${error.message}\n├ Try again when I feel like it.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  });

// ── animemenu
dreaded({
  pattern: "animemenu",
  alias: ["animmenu","animelist"],
  desc: "Displays the Anime commands menu",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, pict, prefix } = context;
        const fq = getFakeQuoted(m);

        const toFancyFont = (text) => {
            const fonts = {
                'a':'𝙖','b':'𝙗','c':'𝙘','d':'𝙙','e':'𝙚','f':'𝙛','g':'𝙜','h':'𝙝','i':'𝙞','j':'𝙟','k':'𝙠','l':'𝙡','m':'𝙢',
                'n':'𝙣','o':'𝙤','p':'𝙥','q':'𝙦','r':'𝙧','s':'𝙨','t':'𝙩','u':'𝙪','v':'𝙫','w':'𝙬','x':'𝙭','y':'𝙮','z':'𝙯'
            };
            return text.toLowerCase().split('').map(c => fonts[c] || c).join('');
        };

        const animeDir = path.join(__dirname, '..', 'Anime');
        let commandFiles = [];
        try { commandFiles = fs.readdirSync(animeDir).filter(f => f.endsWith('.js')); } catch {}

        let menuText = `╭───(    TOXIC-MD    )───\n├───≫ ANIMEMENU ≪───\n├ \n`;
        for (const file of commandFiles) {
            menuText += `├ *${toFancyFont(file.replace('.js', ''))}*\n`;
        }
        menuText += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

                await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
    });

// ── start
dreaded({
  pattern: "start",
  alias: ["alive","online","toxic"],
  desc: "Check if bot is alive",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, mode, pict, botname, text, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

        const xhClintonPaths = [
            path.join(__dirname, 'xh_clinton'),
            path.join(process.cwd(), 'xh_clinton'),
            path.join(__dirname, '..', 'xh_clinton')
        ];

        let audioFolder = null;
        for (const folderPath of xhClintonPaths) {
            if (fs.existsSync(folderPath)) {
                audioFolder = folderPath;
                break;
            }
        }

        if (audioFolder) {
            const possibleFiles = [];
            for (let i = 1; i <= 10; i++) {
                const fileName = `menu${i}`;
                const audioExtensions = ['.mp3', '.m4a', '.ogg', '.opus', '.wav'];
                
                for (const ext of audioExtensions) {
                    const fullPath = path.join(audioFolder, fileName + ext);
                    if (fs.existsSync(fullPath)) {
                        possibleFiles.push(fullPath);
                    }
                }
            }

            if (possibleFiles.length > 0) {
                const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
                await client.sendMessage(
                    m.chat,
                    {
                        audio: { url: randomFile },
                        ptt: true,
                        mimetype: 'audio/mpeg',
                        fileName: 'toxic-start.mp3',
                    },
                    { quoted: fq }
                );
            }
        }

        const settings = await getSettings();  
        const effectivePrefix = settings.prefix || '.';

        const msg = generateWAMessageFromContent(  
            m.chat,  
            {  
                interactiveMessage: {  
                    body: { 
                        text: `╭───(    TOXIC-MD    )───\n├───≫ Sᴛᴀʀᴛ ≪───\n├ \n├ Yo @${m.sender.split('@')[0].split(':')[0]}! You actually bothered\n├ to check if I'm alive?\n├ ${botname} is active 24/7, unlike\n├ your brain cells.\n├ Stop wasting my time and pick\n├ something useful below.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` 
                    },  
                    nativeFlowMessage: {  
                        buttons: [  
                            {  
                                name: 'single_select',  
                                buttonParamsJson: JSON.stringify({  
                                    title: '𝐖𝐇𝐀𝐓 𝐃𝐎 𝐘𝐎𝐔 𝐖𝐀𝐍𝐓?',  
                                    sections: [  
                                        {  
                                            rows: [  
                                                { title: '📱 Menu', description: 'Get all commands', id: `${effectivePrefix}menu` },  
                                                { title: '⚙ Settings', description: 'Bot settings', id: `${effectivePrefix}settings` },  
                                                { title: '🏓 Ping', description: 'Check bot speed', id: `${effectivePrefix}ping` },  
                                                { title: '🔄 Update', description: 'Check for updates', id: `${effectivePrefix}update` },  
                                            ],  
                                        },  
                                    ],  
                                }),  
                            },  
                        ],  
                    },  
                },  
            },  
            { quoted: fq }  
        );  

        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    });

// ── buttonz
dreaded({
  pattern: "buttonz",
  alias: ["btn"],
  desc: "Displays a list selection menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Mᴇɴᴜ ≪───\n├ \n├ Choose an option from the list:\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
        footer: 'Toxic-MD Bot',
        sections: [
          {
            title: 'General Commands',
            rows: [
              { title: 'Help', rowId: '.help', description: 'Get bot commands' },
              { title: 'Ping', rowId: '.ping', description: 'Check bot speed' },
              { title: 'Info', rowId: '.info', description: 'View bot details' }
            ]
          },
          {
            title: 'Fun Commands',
            rows: [
              { title: 'Random Fact', rowId: '.fact', description: 'Get a fun fact' },
              { title: 'Joke', rowId: '.joke', description: 'Hear a joke' }
            ]
          }
        ],
        buttonText: 'Open Menu',
        headerType: 1,
        viewOnce: true
      }, { quoted: fq });

    } catch (error) {
      console.error(`Menu command error: ${error.stack}`);
    }
  });

// ── calc
dreaded({
  pattern: "calc",
  alias: ["calculate","math","solve"],
  desc: "Evaluate a mathematical expression",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const expr = (text || '').trim();
        if (!expr) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ Cᴀʟᴄᴜʟᴀᴛᴏʀ ≪───\n├\n├ Give me an expression. Usage: .calc 2+2\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        if (!ALLOWED.test(expr)) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ Cᴀʟᴄᴜʟᴀᴛᴏʀ ≪───\n├\n├ Only numbers and operators please. No tricks.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        try {
            // eslint-disable-next-line no-new-func
            const result = Function('"use strict"; return (' + expr + ')')();
            if (result === undefined || result === null || !isFinite(result)) throw new Error('invalid result');
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴀʟᴄᴜʟᴀᴛᴏʀ ≪───\n├\n├ 🔢 ${expr}\n├ = ${result}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch (e) {
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴀʟᴄᴜʟᴀᴛᴏʀ ≪───\n├\n├ That expression is broken. Fix your math.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── catfact
dreaded({
  pattern: "catfact",
  alias: ["catfacts","meowfact"],
  desc: "Get a random cat fact",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const res = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
            const f = res.data?.fact || 'Cats are superior. That\'s the only fact.';
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴀᴛ Fᴀᴄᴛ ≪───\n├\n├ 🐱 ${f}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Cᴀᴛ Fᴀᴄᴛ ≪───\n├\n├ Even the cats won\'t talk to me right now.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── checkid
dreaded({
  pattern: "checkid",
  alias: ["cekid","getid","id","idch"],
  desc: "Get the JID of a WhatsApp group or channel from its invite link",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        try {
            const text = m.body.trim();
            const linkMatch = text.match(/https?:\/\/(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s]+/i);
            const link = linkMatch ? linkMatch[0] : null;

            if (!link) {
                return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Where's the link?\n├ Example: ${prefix}checkid https://chat.whatsapp.com/xxxxx\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            let url;
            try {
                url = new URL(link);
            } catch {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ That's not a valid URL.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

            if (url.hostname === 'chat.whatsapp.com' && /^\/[A-Za-z0-9]{20,}$/.test(url.pathname)) {
                const code = url.pathname.replace(/^\/+/, '');
                const res = await client.groupGetInviteInfo(code);
                const id = res.id;

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                await client.sendMessage(m.chat, {
                    interactiveMessage: {
                        header: `╭───(    TOXIC-MD    )───\n├───≫ Gʀᴏᴜᴘ Aɴᴀʟʏsɪs ≪───\n├ \n├ *Link:* ${link}\n├ *Invite Code:* \`${code}\`\n├ *Group ID:* \`${id}\`\n╰──────────────────☉`,
                        footer: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Group ID', copy_code: id })
                        }]
                    }
                }, { quoted: fq });

            } else if (url.hostname === 'whatsapp.com' && url.pathname.startsWith('/channel/')) {
                const code = url.pathname.split('/channel/')[1]?.split('/')[0];
                if (!code) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Invalid channel link format.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }

                const res = await client.newsletterMetadata('invite', code, 'GUEST');
                const id = res.id;

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

                await client.sendMessage(m.chat, {
                    interactiveMessage: {
                        header: `╭───(    TOXIC-MD    )───\n├───≫ Cʜᴀɴɴᴇʟ Aɴᴀʟʏsɪs ≪───\n├ \n├ *Link:* ${link}\n├ *Channel Code:* \`${code}\`\n├ *Channel ID:* \`${id}\`\n╰──────────────────☉`,
                        footer: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
                        buttons: [{
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Channel ID', copy_code: id })
                        }]
                    }
                }, { quoted: fq });

            } else {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ That's not a WhatsApp group or channel link.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }

        } catch (error) {
            console.error('CheckID error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Cʀᴀsʜᴇᴅ ≪───\n├ \n├ Error: ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── coinflip
dreaded({
  pattern: "coinflip",
  alias: ["flip","coin","headstails"],
  desc: "Flip a coin",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        const result = Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails';
        return client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴏɪɴ Fʟɪᴘ ≪───\n├\n├ ${result}\n├\n├ There. Decision made.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
    });

// ── contacts.vcf
dreaded({
  pattern: "contacts.vcf",
  category: "General",
  filename: __filename
}, );

// ── country
dreaded({
  pattern: "country",
  alias: ["countryinfo","nation","flag"],
  desc: "Get information about a country",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const query = (text || '').trim();
        if (!query) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪───\n├\n├ Usage: .country Kenya\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=true`, { timeout: 8000 });
            const c = res.data?.[0];
            if (!c) throw new Error('not found');
            const name = c.name?.common || query;
            const official = c.name?.official || '';
            const capital = (c.capital || ['?'])[0];
            const region = c.region || '?';
            const sub = c.subregion || '';
            const pop = (c.population || 0).toLocaleString();
            const currencies = Object.values(c.currencies || {}).map(cu => `${cu.name} (${cu.symbol || '?'})`).join(', ') || '?';
            const langs = Object.values(c.languages || {}).join(', ') || '?';
            const flag = c.flag || '';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪───\n├\n├ ${flag} ${name}\n├ 📋 Official: ${official}\n├ 🏙️ Capital: ${capital}\n├ 🌍 Region: ${region}${sub ? ' / ' + sub : ''}\n├ 👥 Population: ${pop}\n├ 💰 Currency: ${currencies}\n├ 🗣️ Language(s): ${langs}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪───\n├\n├ Country not found. Did you make it up?\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── credits
dreaded({
  pattern: "credits",
  category: "General",
  filename: __filename
}, async (context) => {
  const { client, m, prefix, text } = context;
  const fq = getFakeQuoted(m);

  const toFancyFont = (text, isUpperCase = false) => {
    const fonts = {
      'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
      'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
      'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
    };
    return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
      .split('')
      .map(char => fonts[char] || char)
      .join('');
  };

  if (text) {
    return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Yo, @${m.sender.split('@')[0].split(':')[0]}, what's with the extra\n├ bullshit? Just say ${prefix}credits, you moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq, mentions: [m.sender] });
  }

  try {
    const replyText = `╭───(    TOXIC-MD    )───\n├───≫ Cʀᴇᴅɪᴛs ≪───\n├ \n├ All hail *𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧*, the badass who\n├ built this bot from the ground up.\n├ Nobody else gets credit—fuck 'em.\n├ This is my empire, and I run this\n├ shit solo.\n├ \n├ Bow down to *𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, {
      text: replyText,
      footer: `©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
      buttons: [
        { buttonId: `${prefix}dev`, buttonText: { displayText: `${toFancyFont('DEV')}` }, type: 1 }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: fq });
  } catch (error) {
    console.error('Error in credits command:', error);
    await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Shit went sideways, can't show credits.\n├ Try again later, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
  }
});

// ── del
dreaded({
  pattern: "del",
  alias: ["delete","d"],
  desc: "Deletes the replied-to or quoted message, you lazy fuck",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, botname } = context;
    const fq = getFakeQuoted(m);

    try {
      if (!m || !m.key) {
        return;
      }

      if (!m.quoted) {
        return;
      }

      const isGroup = m.chat?.endsWith('@g.us');
      const userNumber = m.sender.split('@')[0];
      
      const deleteKey = {
        remoteJid: m.chat,
        fromMe: m.quoted.fromMe || false,
        id: m.quoted.id,
        participant: m.quoted.fromMe ? undefined : m.quoted.sender
      };

      await client.sendMessage(m.chat, { delete: deleteKey });

    } catch (error) {
      console.error(`del command error:`, error);
    }
  });

// ── dev
dreaded({
  pattern: "dev",
  alias: ["developer","contact","owner","creator","devcontact"],
  desc: "Sends the developer contact as a vCard",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    const bName = botname || 'Toxic-MD';

    try {
      const devContact = {
        phoneNumber: '254114885159',
        fullName: 'xh_clinton | Toxic Dev',
        org: 'Toxic-MD Bot'
      };

      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${devContact.fullName}\nORG:${devContact.org};\nTEL;type=CELL;type=VOICE;waid=${devContact.phoneNumber}:+${devContact.phoneNumber}\nEND:VCARD`;

      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Cᴏɴᴛᴀᴄᴛ Cᴀʀᴅ ≪───\n├ \n├ Developer: ${devContact.fullName}\n├ Don't spam the dev or you'll\n├ regret your existence.\n├ Contact card sent below.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });

      await client.sendMessage(m.chat, {
        contacts: {
          displayName: devContact.fullName,
          contacts: [{ vcard }]
        }
      }, { quoted: fq });

    } catch (error) {
      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Fᴀɪʟᴇᴅ ≪───\n├ \n├ Couldn't send contact card.\n├ Error: ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }
  });

// ── dice
dreaded({
  pattern: "dice",
  alias: ["roll","rolldice","d6"],
  desc: "Roll one or more dice",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const count = Math.min(parseInt(text || '1') || 1, 10);
        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
        const total = rolls.reduce((a, b) => a + b, 0);
        const diceDisplay = rolls.map(r => ['⚀','⚁','⚂','⚃','⚄','⚅'][r-1]).join(' ');
        return client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ Dɪᴄᴇ Rᴏʟʟ ≪───\n├\n├ 🎲 ${diceDisplay}\n├ 🔢 Rolls: [${rolls.join(', ')}]\n├ ➕ Total: ${total}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
    });

// ── downloadmenu
dreaded({
  pattern: "downloadmenu",
  alias: ["dlmenu"],
  desc: "Displays only the Download/Media menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ DOWNLOAD MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Downloads').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── editingmenu
dreaded({
  pattern: "editingmenu",
  alias: ["editmenu"],
  desc: "Displays only the Editing menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ EDITING MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Editing').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── effectsmenu
dreaded({
  pattern: "effectsmenu",
  alias: ["effectlist","fxmenu","texteffects"],
  desc: "Displays all text effect commands",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, pict, prefix } = context;
        const fq = getFakeQuoted(m);

        const toFancyFont = (text) => {
            const fonts = {
                'a':'𝙖','b':'𝙗','c':'𝙘','d':'𝙙','e':'𝙚','f':'𝙛','g':'𝙜','h':'𝙝','i':'𝙞','j':'𝙟','k':'𝙠','l':'𝙡','m':'𝙢',
                'n':'𝙣','o':'𝙤','p':'𝙥','q':'𝙦','r':'𝙧','s':'𝙨','t':'𝙩','u':'𝙪','v':'𝙫','w':'𝙬','x':'𝙭','y':'𝙮','z':'𝙯',
                '1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0'
            };
            return text.toLowerCase().split('').map(c => fonts[c] || c).join('');
        };

        let menuText = `╭───(    TOXIC-MD    )───\n├───≫ EFFECTSMENU ≪───\n├ \n├ Use: ${prefix}<effect> YourText\n├ \n`;
        for (const cmd of EFFECT_CMDS) {
            menuText += `├ *${toFancyFont(cmd)}*\n`;
        }
        menuText += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: 'TOXIC-MD — Text Effects',
                    body: '30 text effects. Go make something ugly.',
                    mediaType: 1,
                    thumbnail: pict,
                    sourceUrl: 'https://github.com/xhclintohn/Toxic-MD',
                    showAdAttribution: false,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fq });
    });

// ── fact
dreaded({
  pattern: "fact",
  alias: ["funfact","randomfact","trivia"],
  desc: "Get a random interesting fact",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
            const factText = res.data?.text || 'No fact available.';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Rᴀɴᴅᴏᴍ Fᴀᴄᴛ ≪───\n├\n├ 🧠 ${factText}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├\n├ Facts took a vacation. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── fancy
dreaded({
  pattern: "fancy",
  alias: ["styles","fancytext"],
  desc: "Convert text into one of the fancy styles",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, text, prefix } = context;
    const fq = getFakeQuoted(m);

    if (!text) {
      const example = 'Toxic';
      let preview = `╭───(    TOXIC-MD    )───\n├───≫ Fᴀɴᴄʏ Tᴇxᴛ ≪───\n├\n├ Usage: ${prefix}fancy <number> <text>\n├ Example: ${prefix}fancy 1 Toxic-MD\n├\n├ Available styles (1-${totalStyles}):\n`;
      for (let i = 0; i < totalStyles; i++) {
        const styled = applyStyle(example, i);
        if (styled) preview += `├ ${i + 1}. ${styled}\n`;
      }
      preview += `╰──────────────────☉`;
      return client.sendMessage(m.chat, { text: preview }, { quoted: fq });
    }

    const args = text.trim().split(/\s+/);
    const styleNum = parseInt(args[0]);

    if (isNaN(styleNum) || styleNum < 1 || styleNum > totalStyles) {
      return client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├\n├ Invalid style number!\n├ Use 1-${totalStyles}\n├ Example: ${prefix}fancy 1 Toxic-MD\n╰──────────────────☉`
      }, { quoted: fq });
    }

    const inputText = args.slice(1).join(' ');
    if (!inputText) {
      return client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├\n├ No text provided!\n├ ${prefix}fancy ${styleNum} Your Text Here\n╰──────────────────☉`
      }, { quoted: fq });
    }

    try {
      const styledText = applyStyle(inputText, styleNum - 1);
      if (!styledText) throw new Error('Style application failed');

      const msg = generateWAMessageFromContent(
        m.chat,
        {
          interactiveMessage: {
            body: { text: styledText },
            footer: { text: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' },
            nativeFlowMessage: {
              buttons: [{
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Text', copy_code: styledText })
              }]
            }
          }
        },
        { quoted: fq }
      );
      await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (error) {
      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├\n├ Failed to apply fancy style.\n├ Try again or use a different number.\n╰──────────────────☉`
      }, { quoted: fq });
    }
  });

// ── fetch
dreaded({
  pattern: "fetch",
  alias: ["get","web"],
  desc: "Fetches and displays information from a URL",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, prefix, botname } = context;
    const fq = getFakeQuoted(m);

    const url = m.body.replace(new RegExp(`^${prefix}(fetch|get|url|web)\\s*`, 'i'), '').trim();

    if (!url) {
      return client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH ≪───\n├ \n├ You forgot the URL, genius.\n├ Usage: ${prefix}fetch https://example.com\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }

    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      targetUrl = 'https://' + url;
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();

        const responseData = {
          success: true,
          message: "JSON data fetched successfully",
          url: targetUrl,
          status: response.status,
          contentType: contentType,
          data: data,
          timestamp: new Date().toISOString()
        };

        if (JSON.stringify(responseData).length > 1500) {
          responseData.data = "[Data too large - sent as file]";
          
          await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: JSON (too large, sent as file)\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });

          await client.sendMessage(m.chat, {
            document: Buffer.from(JSON.stringify({
              success: true,
              message: "JSON data fetched successfully",
              url: targetUrl,
              status: response.status,
              contentType: contentType,
              data: data,
              timestamp: new Date().toISOString()
            }, null, 2)),
            mimetype: 'application/json',
            fileName: `fetch_result_${Date.now()}.json`
          }, { quoted: fq });
        } else {
          await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: JSON\n├ \n${JSON.stringify(responseData, null, 2)}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
        }

      } else if (contentType.includes('text/html')) {
        const html = await response.text();

        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title found';

        await client.sendMessage(m.chat, {
          text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: HTML\n├ Title: ${title}\n├ Length: ${html.length} chars\n├ Preview: ${html.replace(/<[^>]*>/g, '').substring(0, 200).trim()}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });

      } else if (contentType.includes('text/plain')) {
        const text = await response.text();

        if (text.length > 1500) {
          await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: Plain Text (too large, sent as file)\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });

          await client.sendMessage(m.chat, {
            document: Buffer.from(text),
            mimetype: 'text/plain',
            fileName: `fetch_result_${Date.now()}.txt`
          }, { quoted: fq });
        } else {
          await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: Plain Text\n├ Content:\n├ ${text}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
          }, { quoted: fq });
        }

      } else if (contentType.includes('image/')) {
        const imageBuffer = await response.buffer();

        await client.sendMessage(m.chat, {
          image: imageBuffer,
          caption: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: Image\n├ Size: ${(imageBuffer.length / 1024).toFixed(2)} KB\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });

      } else {
        const data = await response.text();

        await client.sendMessage(m.chat, {
          text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH RESULT ≪───\n├ \n├ URL: ${targetUrl}\n├ Status: ${response.status}\n├ Type: ${contentType}\n├ Length: ${data.length} chars\n├ Preview: ${data.length > 500 ? data.substring(0, 500) + "..." : data}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
      }

    } catch (error) {
      console.error('Fetch command error:', error);

      let errorMessage = error.message;
      if (error.name === 'TimeoutError') {
        errorMessage = 'Request timed out after 30 seconds, you impatient fool';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Could not resolve the URL. That domain doesn\'t exist, genius.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused. Server is dead, like your brain cells.';
      }

      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ FETCH FAILED ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }
  });

// ── fullmenu
dreaded({
  pattern: "fullmenu",
  alias: ["allmenu","commandslist"],
  desc: "Displays the full bot command menu by category",
  category: "General",
  filename: __filename
}, async (context) => {
      const { client, m, totalCommands, mode, pict, fakeQuoted } = context;
      const fq = getFakeQuoted(m);
      const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

      const settings = await getSettings();
      const effectivePrefix = settings.prefix || '';

      const categories = [
        { name: 'General', display: 'GEᑎEᖇᗩᒪMENU', emoji: '📜' },
        { name: 'Settings', display: 'SETTINGSMENU', emoji: '🛠️' },
        { name: 'Owner', display: 'OWNERMENU', emoji: '👑' },
        { name: 'Heroku', display: 'HEROKUMENU', emoji: '☁️' },
        { name: 'Privacy', display: 'PRIVACYMENU', emoji: '🔒' },
        { name: 'Groups', display: 'GROUPMENU', emoji: '👥' },
        { name: 'AI', display: 'AIMENU', emoji: '🧠' },
        { name: 'Downloads', display: 'DOWNLOADMENU', emoji: '🎬' },
        { name: 'Editing', display: 'EDITING', emoji: '✂️' },
        { name: 'Effects', display: 'EFFECTSMENU', emoji: '🎨' },
        { name: 'Anime', display: 'ANIMEMENU', emoji: '🎌' },
        { name: 'NSFW', display: '+18MENU', emoji: '🔞' },
        { name: 'Utils', display: 'UTILSMENU', emoji: '🔧' },
        { name: 'Reactions', display: 'REACTIONSMENU', emoji: '🎭' }
      ];

      const getGreeting = () => {
        const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
        if (currentHour >= 5 && currentHour < 12) return 'Good Morning';
        if (currentHour >= 12 && currentHour < 18) return 'Good Afternoon';
        if (currentHour >= 18 && currentHour < 22) return 'Good Evening';
        return 'Good Night';
      };

      const getCurrentTimeInNairobi = () => {
        return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
      };

      const toFancyFont = (text, isUpperCase = false) => {
        const fonts = {
          'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
          'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
          'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
          'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
        };
        return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
          .split('')
          .map(char => fonts[char] || char)
          .join('');
      };

      let menuText = `╭───(    TOXIC-MD    )───\n├───≫ Fᴜʟʟ Mᴇɴᴜ ≪───\n├ \n├ Greetings, @${m.sender.split('@')[0].split(':')[0]}\n├ \n├ Bot: ${botname}\n├ Total Commands: ${totalCommands}\n├ Time: ${getCurrentTimeInNairobi()}\n├ Prefix: ${effectivePrefix || 'None'}\n├ Mode: ${mode}\n├ Library: Baileys\n╰──────────────────☉\n\n`;

      for (const category of categories) {
        let commandFiles;
        try {
          commandFiles = fs.readdirSync(`./plugins/${category.name}`).filter(file => file.endsWith('.js') && file !== 'links.js');
        } catch (e) { continue; }

        if (commandFiles.length === 0 && category.name !== 'NSFW') continue;

        menuText += `╭───(    TOXIC-MD    )───\n├───≫ ${category.display} ≪───\n├ \n`;

        if (category.name === 'NSFW') {
          const plus18Commands = ['xvideo'];
          for (const cmd of plus18Commands) {
            menuText += `├ *${toFancyFont(cmd)}*\n`;
          }
        }

        for (const file of commandFiles) {
          try {
            const mod = require(path.join(process.cwd(), 'plugins', category.name, file));
            if (Array.isArray(mod)) {
              for (const cmd of mod) {
                if (cmd && cmd.name) {
                  menuText += `├ *${toFancyFont(cmd.name)}*\n`;
                }
              }
              continue;
            }
            if (mod && mod.name) {
              menuText += `├ *${toFancyFont(mod.name)}*\n`;
              continue;
            }
          } catch (e) {}
          const commandName = file.replace('.js', '');
          menuText += `├ *${toFancyFont(commandName)}*\n`;
        }

        menuText += `╰──────────────────☉\n\n`;
      }

      menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(m.chat, {
        text: menuText,
        contextInfo: { mentionedJid: [m.sender] }
      }, { quoted: fq });

      const sections = categories
        .filter(cat => {
          try { return fs.readdirSync(`./plugins/${cat.name}`).filter(f => f.endsWith('.js')).length > 0; } catch { return false; }
        })
        .map(cat => ({
          title: `${cat.emoji} ${cat.display}`,
          rows: [{ title: `${cat.emoji} ${cat.display}`, description: `View ${cat.name} commands`, id: `menu_${cat.name.toLowerCase()}` }]
        }));

      try {
        const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
        const interactiveMsg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
          interactiveMessage: {
            body: { text: '📖 Browse Categories' },
            footer: { text: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' },
            header: { hasMediaAttachment: false },
            nativeFlowMessage: {
              buttons: [
                { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '📖 Browse Categories', sections }) }
              ],
              messageParamsJson: ''
            }
          }
        }), { quoted: fq, userJid: client.user.id });
        await client.relayMessage(m.chat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
      } catch {
        await client.sendMessage(m.chat, {
          listMessage: {
            title: 'VIEW OPTIONS',
            description: 'Select a category to view its commands.',
            buttonText: '📖 Browse Commands',
            listType: 1,
            sections: sections.map(s => ({
              title: s.title,
              rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id }))
            })),
            footer: '©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
          },
        }, { quoted: fq });
      }
    });

// ── gaycheck
dreaded({
  pattern: "gaycheck",
  alias: ["gaymeter","gcheck","howgay"],
  desc: "Checks gay percentage with toxic, violent, and realistic roasts",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
    
      let targetUser = null;
      let targetNumber = null;

     
      console.log(`Message context: isGroup=${m.isGroup}, mentionedJid=${JSON.stringify(m.mentionedJid)}, quotedSender=${m.quoted?.sender || 'none'}`);

      if (m.isGroup && m.mentionedJid && m.mentionedJid.length > 0) {
        console.log(`Tagged JIDs: ${JSON.stringify(m.mentionedJid)}`);
        targetUser = m.mentionedJid[0];
      } else if (m.quoted && m.quoted.sender) {
        console.log(`Quoted sender: ${m.quoted.sender}`);
        targetUser = m.quoted.sender;
      } else {
        console.log(`No tags or quoted message, using sender: ${m.sender}`);
        targetUser = m.sender;
      }

      if (
        !targetUser ||
        typeof targetUser !== 'string' ||
        (!targetUser.includes('@s.whatsapp.net') && !targetUser.includes('@lid'))
      ) {
        console.error(`Invalid target user: ${JSON.stringify(targetUser)}`);
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Who the fuck am I torching?\n├ Tag someone or I'll roast your\n├ sorry ass to ashes!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      targetNumber = targetUser.split('@')[0];
      if (!targetNumber) {
        console.error(`Failed to extract target number from JID: ${targetUser}`);
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ This user's ID is fucked beyond\n├ repair. Try again, you brainless twit!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

    
      const checkingMsg = await client.sendMessage(
        m.chat,
        {
          text: `╭───(    TOXIC-MD    )───\n├───≫ Sᴄᴀɴɴɪɴɢ ≪───\n├ \n├ Cracking open @${targetNumber}'s soul\n├ for gay vibes...\n├ This is gonna hurt like hell,\n├ you weakling!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          mentions: [targetUser],
        },
        { quoted: fq }
      );

     
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

     
      const percentage = Math.floor(Math.random() * 101);

     
      let roast;
      let emoji;

      if (percentage === 0) {
        roast = "STRAIGHTER THAN A FUCKING RULER! You're so dull you make cardboard look spicy, you basic-ass rock!";
        emoji = "🚫🏳️‍🌈";
      } else if (percentage <= 2) {
        roast = "NOT A HINT OF GAY! You're so straight you'd get lost in a pride parade, you clueless troglodyte!";
        emoji = "📏";
      } else if (percentage <= 4) {
        roast = "ZERO SPARKS! You're straighter than a flatline, you boring-ass zombie!";
        emoji = "😴";
      } else if (percentage <= 6) {
        roast = "BARELY A PULSE! You're so straight you'd trip over a rainbow and sue it, you pathetic drone!";
        emoji = "🪨";
      } else if (percentage <= 8) {
        roast = "FAINT WHIFF OF CURIOUSITY! You've glanced at someone's ass once and panicked, you spineless worm!";
        emoji = "👀";
      } else if (percentage <= 10) {
        roast = "TINY FLICKER! You've thought 'nice jawline' and then cried about it, you repressed fuck!";
        emoji = "💡";
      } else if (percentage <= 12) {
        roast = "SLIGHT TREMOR! You've stared a bit too long at a bro's abs, you sneaky little shit!";
        emoji = "🤫";
      } else if (percentage <= 14) {
        roast = "MINOR VIBES DETECTED! You'd sob at a gay love story but swear it's allergies, you fake-ass fraud!";
        emoji = "😢";
      } else if (percentage <= 16) {
        roast = "GETTING SUSSY! You've had a 'what if I'm not straight' Google search, you anxious mess!";
        emoji = "🧐";
      } else if (percentage <= 18) {
        roast = "CAUGHT IN 4K! You're pretending it's just 'vibes,' but we all see through you, you lying prick!";
        emoji = "📸";
      } else if (percentage <= 20) {
        roast = "TEETERING ON THE EDGE! You're one rom-com away from a full identity crisis, you chaotic dumbass!";
        emoji = "🧭";
      } else if (percentage <= 22) {
        roast = "RAINBOW DUST SPOTTED! You've tried on someone's glitter and liked it, you sneaky bastard!";
        emoji = "✨";
      } else if (percentage <= 24) {
        roast = "HALFWAY TO FABULOUS! You're dipping toes in the gay pool but too scared to dive, you cowardly twink!";
        emoji = "🏊";
      } else if (percentage <= 26) {
        roast = "BI-CURIOUS CHAOS! You're one tequila shot from kissing your bestie, you reckless fuck!";
        emoji = "🍹";
      } else if (percentage <= 28) {
        roast = "GAYDAR PINGS! You're hoarding glitter and lying about it, you duplicitous sparkle gremlin!";
        emoji = "🚨";
      } else if (percentage <= 30) {
        roast = "VIBING HARD! You've got a secret Pinterest board for 'aesthetic' boys, you shady queer!";
        emoji = "📌";
      } else if (percentage <= 32) {
        roast = "RAINBOW TENDENCIES! You're pretending it's just 'fashion sense,' you delusional diva!";
        emoji = "🌈";
      } else if (percentage <= 34) {
        roast = "HALF A QUEER! You're so confused you're flipping coins to pick a team, you indecisive disaster!";
        emoji = "⚖️";
      } else if (percentage <= 36) {
        roast = "GAY VIBES RISING! You're one pride flag away from a full glow-up, you half-baked queen!";
        emoji = "🏳️‍🌈";
      } else if (percentage <= 38) {
        roast = "NOT EVEN TRYING TO HIDE IT! Your straight act is crumbling like your dignity, you pathetic poser!";
        emoji = "🎭";
      } else if (percentage <= 40) {
        roast = "SOLID RAINBOW ENERGY! You're out here winking at everyone, you shameless flirt!";
        emoji = "😉";
      } else if (percentage <= 42) {
        roast = "GAYDAR SCREAMING! You're vibing harder than a drag show finale, you fabulous menace!";
        emoji = "🔊";
      } else if (percentage <= 44) {
        roast = "YOU'RE NOT FOOLING US! Your closet's made of glass, you transparent twink!";
        emoji = "🪞";
      } else if (percentage <= 46) {
        roast = "RAINBOW IN TRAINING! You're practicing your strut for the parade, you wannabe icon!";
        emoji = "🚶‍♂️";
      } else if (percentage <= 48) {
        roast = "HALFWAY TO FABULOUS! You're one makeover away from slaying, you almost-there queen!";
        emoji = "💄";
      } else if (percentage <= 50) {
        roast = "PERFECTLY BALANCED MESS! You're 50/50 and causing chaos everywhere, you unhinged bisexual disaster!";
        emoji = "⚖️";
      } else if (percentage <= 52) {
        roast = "TIPPING INTO GAYNESS! You're leaning so hard you're about to fall into a rainbow, you clumsy fuck!";
        emoji = "🌈";
      } else if (percentage <= 54) {
        roast = "GAY VIBES CONFIRMED! You're out here stealing hearts and lying about it, you sneaky slut!";
        emoji = "💖";
      } else if (percentage <= 56) {
        roast = "FULL-ON PRIDE MODE! You're waving the flag but calling it a towel, you delusional diva!";
        emoji = "🏳️‍🌈";
      } else if (percentage <= 58) {
        roast = "GLITTER IN YOUR BLOOD! You're gayer than a unicorn's fever dream, you sparkling freak!";
        emoji = "🦄";
      } else if (percentage <= 60) {
        roast = "RAINBOW ROYALTY! You're ruling the queer scene with zero chill, you majestic bastard!";
        emoji = "👑";
      } else if (percentage <= 62) {
        roast = "FABULOUS AND UNHINGED! You're so gay you make rainbows look basic, you chaotic icon!";
        emoji = "🌈🔥";
      } else if (percentage <= 64) {
        roast = "GAY AS A DISCO BALL! You're shining so bright you're blinding us, you radiant slut!";
        emoji = "🪩";
      } else if (percentage <= 66) {
        roast = "PRIDE PARADE CAPTAIN! You're leading the charge with glitter cannons, you fearless queen!";
        emoji = "🎉";
      } else if (percentage <= 68) {
        roast = "GAY OVERDRIVE! You're so queer you're rewriting the laws of fabulousness, you untouchable legend!";
        emoji = "⚡";
      } else if (percentage <= 70) {
        roast = "RAINBOW WARRIOR! You're out here slaying with every step, you unstoppable diva!";
        emoji = "🗡️";
      } else if (percentage <= 72) {
        roast = "GAY ICON IN TRAINING! You're one wig away from stealing the spotlight, you rising star!";
        emoji = "🌟";
      } else if (percentage <= 74) {
        roast = "FABULOUSNESS OVERLOAD! You're gayer than a drag brunch on steroids, you iconic mess!";
        emoji = "🍾";
      } else if (percentage <= 76) {
        roast = "QUEER LEGEND VIBES! You're so gay you make the rainbow jealous, you radiant bastard!";
        emoji = "🏳️‍🌈🔥";
      } else if (percentage <= 78) {
        roast = "GAY GOD ENERGY! You're out here creating new shades of fabulous, you divine queer!";
        emoji = "✨";
      } else if (percentage <= 80) {
        roast = "RAINBOW SUPREME! You're so gay you're bending reality, you cosmic diva!";
        emoji = "🌌";
      } else if (percentage <= 82) {
        roast = "ULTIMATE QUEER VIBES! You're gayer than a pride float on fire, you unstoppable force!";
        emoji = "🔥🏳️‍🌈";
      } else if (percentage <= 84) {
        roast = "GAY TRANSCENDENCE! You're so queer you're rewriting the spectrum, you ethereal legend!";
        emoji = "🪐";
      } else if (percentage <= 86) {
        roast = "FABULOUS BEYOND MEASURE! You're a walking pride apocalypse, you radiant disaster!";
        emoji = "💥";
      } else if (percentage <= 88) {
        roast = "GAY SINGULARITY ACHIEVED! You're so queer you're collapsing the straight universe, you cosmic queen!";
        emoji = "🌠";
      } else if (percentage <= 90) {
        roast = "RAINBOW OVERLORD! You're ruling the gay multiverse with an iron glitter fist, you supreme diva!";
        emoji = "👑🌈";
      } else if (percentage <= 92) {
        roast = "GAY DEITY STATUS! You're so fabulous you're rewriting creation, you godly queer!";
        emoji = "🛐";
      } else if (percentage <= 94) {
        roast = "BEYOND FABULOUS! You're gayer than the concept of rainbows, you celestial icon!";
        emoji = "🌟🏳️‍🌈";
      } else if (percentage <= 96) {
        roast = "GAY APOCALYPSE TRIGGER! You're so queer you're ending straightness forever, you cataclysmic legend!";
        emoji = "🌈💥";
      } else if (percentage <= 98) {
        roast = "ULTIMATE QUEER TITAN! You're so gay you're rewriting reality itself, you universe-shattering diva!";
        emoji = "🪐🔥";
      } else {
        roast = "ABSOLUTE GAY COSMIC EMPEROR! You've transcended all known sexuality and invented new dimensions of fabulous, you unstoppable rainbow god!";
        emoji = "🌌👑💥";
      }

      let insult = "";
      if (percentage < 20) {
        insult = " Go choke on your boring life, you irrelevant speck of lint!";
      } else if (percentage > 80) {
        insult = " The universe bows to your fabulousness, you untouchable rainbow deity!";
      } else {
        const insults = [
          " You're a walking trash fire!",
          " Your life's a bigger flop than a dollar store wig!",
          " Even your shadow thinks you're a loser!",
          " You make roadkill look charismatic!",
          " Your personality's a certified dumpster dive!",
          " You're the human equivalent of expired milk!",
          " Your existence is a cosmic typo!",
          " You're so lame you make beige look exciting!",
          " Your vibe screams 'I cry in parking lots'!",
          " You're a discount knockoff of a real person!",
          " Your life's a bigger mess than a clown's makeup!",
          " You make bad decisions look like an art form!",
          " Your aura's giving 'I peaked at 12'!",
          " You're the reason people hate group chats!",
          " Your face is a war crime against aesthetics!",
          " You're so dull you make spreadsheets cry!",
          " Your entire vibe is a 404 error!",
          " You make elevator music sound thrilling!",
          " Your life's a bigger tragedy than a soap opera!",
          " You're the human equivalent of a wet sock!",
        ];
        insult = insults[Math.floor(Math.random() * insults.length)];
      }

      const resultMsg = `╭───(    TOXIC-MD    )───
├───≫ GAY METER ≪───
├ 
├ *TARGET:* @${targetNumber}
├ *GAY PERCENTAGE:* ${percentage}% ${emoji}
├ 
├ *VERDICT:* ${roast}${insult}
├ 
├ *DISCLAIMER:* This is 100% accurate
├ and scientific, you sensitive
├ snowflake! Cry about it!
╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(
        m.chat,
        {
          text: resultMsg,
          mentions: [targetUser],
        },
        { quoted: fq }
      );

      if (checkingMsg && checkingMsg.key) {
        try {
          await client.sendMessage(m.chat, {
            delete: checkingMsg.key,
          });
        } catch (deleteError) {
          console.error(`Failed to delete checking message: ${deleteError.stack}`);
        }
      }
    } catch (error) {
      console.error(`Gaycheck command detonated: ${error.stack}`);
      await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Cʀᴀsʜᴇᴅ ≪───\n├ \n├ This shit blew up harder than your\n├ ego! Can't check gay levels now,\n├ you doomed idiot!\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  });

// ── generalmenu
dreaded({
  pattern: "generalmenu",
  alias: ["genmenu"],
  desc: "Displays only the General menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ GENERAL MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/General').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── groupmenu
dreaded({
  pattern: "groupmenu",
  alias: ["grupmenu"],
  desc: "Displays only the Groups menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ GROUPS MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Groups').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── help
dreaded({
  pattern: "help",
  alias: ["h","usage","howto"],
  desc: "Shows help and usage for a specific command",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);

        const effectivePrefix = prefix || '.';

        const fmt = (title, body) =>
            `╭───(    TOXIC-MD    )───\n├───≫ ${title} ≪───\n├ \n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        if (!args || args.length === 0) {
            const pluginsDir = path.join(__dirname, '..');
            const categories = fs.readdirSync(pluginsDir).filter(f => fs.statSync(path.join(pluginsDir, f)).isDirectory());
            let allCommands = [];
            for (const cat of categories) {
                const files = fs.readdirSync(path.join(pluginsDir, cat)).filter(f => f.endsWith('.js'));
                for (const file of files) {
                    allCommands.push(file.replace('.js', ''));
                }
            }
            allCommands.sort();

            const body = allCommands.map(cmd => `├ *${effectivePrefix}${cmd}*`).join('\n');
            return await client.sendMessage(m.chat, {
                text: fmt('ALL COMMANDS', `├ Total: ${allCommands.length} commands\n├ Use *${effectivePrefix}help <command>* for usage\n├ \n${body}`)
            }, { quoted: fq });
        }

        const cmdName = args[0].toLowerCase().replace(/^\./, '');

        const helpData = {
            // ── Anime Commands ─────────────────────────────────────────────
            waifu: { usage: `${effectivePrefix}waifu`, desc: 'Get a random anime waifu image. Aliases: animegirl, waifupic' },
            neko: { usage: `${effectivePrefix}neko`, desc: 'Get a random neko (catgirl) image. Aliases: catgirl, nekopic' },
            husbando: { usage: `${effectivePrefix}husbando`, desc: 'Get a random husbando image. Aliases: animeguy, husbandopic' },
            maid: { usage: `${effectivePrefix}maid`, desc: 'Get a random anime maid image.' },
            uniform: { usage: `${effectivePrefix}uniform`, desc: 'Get a random anime uniform image.' },
            // ── Text Effects ────────────────────────────────────────────────
            glossysilver: { usage: `${effectivePrefix}glossysilver <text>`, desc: 'Generate glossy silver 3D text (max 50 chars).' },
            glitchtext: { usage: `${effectivePrefix}glitchtext <text>`, desc: 'Generate digital glitch text effect.' },
            advancedglow: { usage: `${effectivePrefix}advancedglow <text>`, desc: 'Generate advanced glowing text.' },
            neonglitch: { usage: `${effectivePrefix}neonglitch <text>`, desc: 'Generate neon glitch text effect.' },
            gradienttext: { usage: `${effectivePrefix}gradienttext <text>`, desc: 'Generate 3D gradient text.' },
            glowingtext: { usage: `${effectivePrefix}glowingtext <text>`, desc: 'Generate glowing text effect.' },
            luxurygold: { usage: `${effectivePrefix}luxurygold <text>`, desc: 'Generate luxury gold text.' },
            multicolored: { usage: `${effectivePrefix}multicolored <text>`, desc: 'Generate multicolored neon text.' },
            galaxytext: { usage: `${effectivePrefix}galaxytext <text>`, desc: 'Generate galaxy style text wallpaper.' },
            makingneon: { usage: `${effectivePrefix}makingneon <text>`, desc: 'Generate royal neon text.' },
            writetext: { usage: `${effectivePrefix}writetext <text>`, desc: 'Generate wet glass text effect.' },
            underwater: { usage: `${effectivePrefix}underwater <text>`, desc: 'Generate 3D underwater text.' },
            pixelglitch: { usage: `${effectivePrefix}pixelglitch <text>`, desc: 'Generate pixel glitch text.' },
            summerbeach: { usage: `${effectivePrefix}summerbeach <text>`, desc: 'Generate summer beach text.' },
            papercut: { usage: `${effectivePrefix}papercut <text>`, desc: 'Generate 3D paper cut text.' },
            cloudtext: { usage: `${effectivePrefix}cloudtext <text>`, desc: 'Generate text in clouds effect.' },
            gradientlogo: { usage: `${effectivePrefix}gradientlogo <text>`, desc: 'Generate 3D gradient logo.' },
            galaxylogo: { usage: `${effectivePrefix}galaxylogo <text>`, desc: 'Generate galaxy style logo.' },
            colorfulneon: { usage: `${effectivePrefix}colorfulneon <text>`, desc: 'Generate colorful neon text.' },
            greenneon: { usage: `${effectivePrefix}greenneon <text>`, desc: 'Generate green neon text.' },
            '1917text': { usage: `${effectivePrefix}1917text <text>`, desc: 'Generate 1917 war style text.' },
            texteffect: { usage: `${effectivePrefix}texteffect <text>`, desc: 'Generate 3D hologram text effect.' },
            lighteffect: { usage: `${effectivePrefix}lighteffect <text>`, desc: 'Generate green light effect text.' },
            bearlogo: { usage: `${effectivePrefix}bearlogo <text>`, desc: 'Generate a bear mascot logo.' },
            typography: { usage: `${effectivePrefix}typography <text>`, desc: 'Generate typography pavement text.' },
            hackerneon: { usage: `${effectivePrefix}hackerneon <text>`, desc: 'Generate hacker cyan neon text.' },
            blackpinklogo: { usage: `${effectivePrefix}blackpinklogo <text>`, desc: 'Generate Blackpink style logo.' },
            blackpinkstyle: { usage: `${effectivePrefix}blackpinkstyle <text>`, desc: 'Generate Blackpink style text.' },
            erasertext: { usage: `${effectivePrefix}erasertext <text>`, desc: 'Generate eraser deleting text effect.' },
            cartoonstyle: { usage: `${effectivePrefix}cartoonstyle <text>`, desc: 'Generate cartoon graffiti text.' },
            // ── AI Commands ─────────────────────────────────────────────────
            sora: { usage: `${effectivePrefix}sora <description>`, desc: 'Generate a cinematic AI image scene. Aliases: soraai, aifilm' },
            menu: { usage: `${effectivePrefix}menu`, desc: 'Shows the main interactive menu with all categories.' },
            fullmenu: { usage: `${effectivePrefix}fullmenu`, desc: 'Shows all commands listed by category.' },
            help: { usage: `${effectivePrefix}help [command]`, desc: 'Shows help/usage for all or a specific command.' },
            ping: { usage: `${effectivePrefix}ping`, desc: 'Check the bot response speed/latency.' },
            alive: { usage: `${effectivePrefix}alive`, desc: 'Check if the bot is online and running.' },
            uptime: { usage: `${effectivePrefix}uptime`, desc: 'Shows how long the bot has been running.' },
            settings: { usage: `${effectivePrefix}settings`, desc: 'View current bot settings.' },
            mode: { usage: `${effectivePrefix}mode <public|private|sudo>`, desc: 'Change the bot mode. Public = everyone, Private = owner only, Sudo = sudo users too.' },
            prefix: { usage: `${effectivePrefix}prefix <newprefix>`, desc: 'Change the command prefix.' },
            presence: { usage: `${effectivePrefix}presence <online|offline|typing|recording>`, desc: 'Set the bot presence status in private chats.' },
            autoread: { usage: `${effectivePrefix}autoread <on|off>`, desc: 'Auto read private messages.' },
            autoview: { usage: `${effectivePrefix}autoview <on|off>`, desc: 'Auto view status updates.' },
            autolike: { usage: `${effectivePrefix}autolike <on|off>`, desc: 'Auto like/react to status updates.' },
            autobio: { usage: `${effectivePrefix}autobio <on|off>`, desc: 'Auto update bio with current time.' },
            anticall: { usage: `${effectivePrefix}anticall <on|off>`, desc: 'Auto reject incoming calls and ban caller.' },
            antilink: { usage: `${effectivePrefix}antilink <delete|remove|off>`, desc: 'Per-group antilink. delete = warn & delete, remove = kick sender, off = disabled. Must be in a group.' },
            antitag: { usage: `${effectivePrefix}antitag <on|off>`, desc: 'Per-group antitag. Removes members who mass-tag others. Must be in a group.' },
            antistatusmention: { usage: `${effectivePrefix}antistatusmention <delete|remove|off>`, desc: 'Per-group anti status mention. delete = delete & warn, remove = kick, off = disabled. Must be in a group.' },
            antidelete: { usage: `${effectivePrefix}antidelete <on|off>`, desc: 'Forward deleted messages to your DM.' },
            antiedit: { usage: `${effectivePrefix}antiedit <on|off>`, desc: 'Forward original message when someone edits.' },
            antidemote: { usage: `${effectivePrefix}antidemote <on|off>`, desc: 'Per-group: re-promote admins if someone demotes them.' },
            antipromote: { usage: `${effectivePrefix}antipromote <on|off>`, desc: 'Per-group: prevent unauthorized promotions.' },
            antiforeign: { usage: `${effectivePrefix}antiforeign <on|off>`, desc: 'Remove non-local phone numbers from the group.' },
            autoai: { usage: `${effectivePrefix}autoai <on|off>`, desc: 'Enable AI auto-reply in DMs and when mentioned in groups. AI can also execute bot commands intelligently.' },
            chatbotpm: { usage: `${effectivePrefix}chatbotpm <on|off>`, desc: 'Enable AI chatbot in private messages (same as autoai).' },
            toxicai: { usage: `${effectivePrefix}toxicai <on|off>`, desc: 'Enable ToxicAgent (GitHub AI assistant) for the developer.' },
            gcpresence: { usage: `${effectivePrefix}gcpresence <on|off>`, desc: 'Set typing/recording presence in groups.' },
            events: { usage: `${effectivePrefix}events <on|off>`, desc: 'Toggle group join/leave event messages.' },
            stickerwm: { usage: `${effectivePrefix}stickerwm <packname>`, desc: 'Set custom sticker watermark/packname.' },
            ban: { usage: `${effectivePrefix}ban @user`, desc: 'Ban a user from using the bot.' },
            unban: { usage: `${effectivePrefix}unban @user`, desc: 'Unban a previously banned user.' },
            banlist: { usage: `${effectivePrefix}banlist`, desc: 'View all banned users.' },
            addsudo: { usage: `${effectivePrefix}addsudo @user`, desc: 'Add a sudo/trusted user.' },
            delsudo: { usage: `${effectivePrefix}delsudo @user`, desc: 'Remove a sudo user.' },
            checksudo: { usage: `${effectivePrefix}checksudo`, desc: 'List all sudo users.' },
            sticker: { usage: `${effectivePrefix}sticker`, desc: 'Convert image/video/gif to sticker. Reply to media.' },
            toimg: { usage: `${effectivePrefix}toimg`, desc: 'Convert sticker to image. Reply to sticker.' },
            tovid: { usage: `${effectivePrefix}tovid`, desc: 'Convert sticker/gif to video. Reply to media.' },
            togif: { usage: `${effectivePrefix}togif`, desc: 'Convert video to GIF.' },
            tts: { usage: `${effectivePrefix}tts <text>`, desc: 'Convert text to speech audio.' },
            tr: { usage: `${effectivePrefix}tr <lang> <text>`, desc: 'Translate text. Example: .tr es Hello World' },
            ytmp3: { usage: `${effectivePrefix}ytmp3 <url|title>`, desc: 'Download YouTube audio as MP3.' },
            ytmp4: { usage: `${effectivePrefix}ytmp4 <url|title>`, desc: 'Download YouTube video as MP4.' },
            yts: { usage: `${effectivePrefix}yts <query>`, desc: 'Search YouTube for videos.' },
            tikdl: { usage: `${effectivePrefix}tikdl <url>`, desc: 'Download TikTok video without watermark.' },
            tikaudio: { usage: `${effectivePrefix}tikaudio <url>`, desc: 'Download TikTok audio.' },
            igdl: { usage: `${effectivePrefix}igdl <url>`, desc: 'Download Instagram post/reel.' },
            fbdl: { usage: `${effectivePrefix}fbdl <url>`, desc: 'Download Facebook video.' },
            twtdl: { usage: `${effectivePrefix}twtdl <url>`, desc: 'Download Twitter/X video.' },
            spotify: { usage: `${effectivePrefix}spotify <song name>`, desc: 'Search and download Spotify track.' },
            alldl: { usage: `${effectivePrefix}alldl <url>`, desc: 'Universal media downloader.' },
            play: { usage: `${effectivePrefix}play <song name>`, desc: 'Search and play a song.' },
            song: { usage: `${effectivePrefix}song <title>`, desc: 'Download a song by title.' },
            image: { usage: `${effectivePrefix}image <query>`, desc: 'Search for images.' },
            video: { usage: `${effectivePrefix}video <query>`, desc: 'Search for videos.' },
            gpt: { usage: `${effectivePrefix}gpt <prompt>`, desc: 'Chat with GPT AI.' },
            gemini: { usage: `${effectivePrefix}gemini <prompt>`, desc: 'Chat with Google Gemini AI.' },
            groq: { usage: `${effectivePrefix}groq <prompt>`, desc: 'Chat with Groq AI (fast).' },
            darkgpt: { usage: `${effectivePrefix}darkgpt <prompt>`, desc: 'Chat with DarkGPT (no restrictions).' },
            imagine: { usage: `${effectivePrefix}imagine <prompt>`, desc: 'Generate AI images from text.' },
            sora: { usage: `${effectivePrefix}sora <prompt>`, desc: 'Generate AI video from text.' },
            remini: { usage: `${effectivePrefix}remini`, desc: 'Enhance/upscale an image. Reply to image.' },
            vision: { usage: `${effectivePrefix}vision <question>`, desc: 'Ask AI about an image. Reply to image with question.' },
            transcribe: { usage: `${effectivePrefix}transcribe`, desc: 'Transcribe audio to text. Reply to audio.' },
            tagall: { usage: `${effectivePrefix}tagall [message]`, desc: 'Tag all group members with optional message.' },
            hidetag: { usage: `${effectivePrefix}hidetag [message]`, desc: 'Tag all members silently (hidden mention).' },
            promote: { usage: `${effectivePrefix}promote @user`, desc: 'Make a group member admin.' },
            demote: { usage: `${effectivePrefix}demote @user`, desc: 'Remove admin from a group member.' },
            remove: { usage: `${effectivePrefix}remove @user`, desc: 'Remove/kick a member from the group.' },
            add: { usage: `${effectivePrefix}add <number>`, desc: 'Add a member to the group.' },
            open: { usage: `${effectivePrefix}open`, desc: 'Open the group to all members.' },
            close: { usage: `${effectivePrefix}close`, desc: 'Close the group (admins only).' },
            link: { usage: `${effectivePrefix}link`, desc: 'Get the group invite link.' },
            revoke: { usage: `${effectivePrefix}revoke`, desc: 'Reset the group invite link.' },
            groupmeta: { usage: `${effectivePrefix}groupmeta`, desc: 'Show group metadata/info.' },
            gpp: { usage: `${effectivePrefix}gpp`, desc: 'Get group profile picture.' },
            gstatus: { usage: `${effectivePrefix}gstatus <text>`, desc: 'Set group description.' },
            listonline: { usage: `${effectivePrefix}listonline`, desc: 'List online members in group.' },
            requests: { usage: `${effectivePrefix}requests`, desc: 'View pending join requests.' },
            'approve-all': { usage: `${effectivePrefix}approve-all`, desc: 'Approve all pending join requests.' },
            'reject-all': { usage: `${effectivePrefix}reject-all`, desc: 'Reject all pending join requests.' },
            foreigners: { usage: `${effectivePrefix}foreigners`, desc: 'List non-local phone numbers in group.' },
            xkill: { usage: `${effectivePrefix}xkill`, desc: 'Kick all non-admin members from the group.' },
            google: { usage: `${effectivePrefix}google <query>`, desc: 'Search Google.' },
            wiki: { usage: `${effectivePrefix}wiki <query>`, desc: 'Search Wikipedia.' },
            github: { usage: `${effectivePrefix}github <username>`, desc: 'Get GitHub user profile.' },
            lyrics: { usage: `${effectivePrefix}lyrics <song name>`, desc: 'Get song lyrics.' },
            movie: { usage: `${effectivePrefix}movie <title>`, desc: 'Get movie info.' },
            npm: { usage: `${effectivePrefix}npm <package>`, desc: 'Get NPM package info.' },
            wallpaper: { usage: `${effectivePrefix}wallpaper <query>`, desc: 'Search wallpapers.' },
            stickersearch: { usage: `${effectivePrefix}stickersearch <query>`, desc: 'Search sticker packs.' },
            weather: { usage: `${effectivePrefix}weather <city>`, desc: 'Get weather info for a city.' },
            dev: { usage: `${effectivePrefix}dev`, desc: 'Get developer contact info.' },
            support: { usage: `${effectivePrefix}support`, desc: 'Get support group link.' },
            script: { usage: `${effectivePrefix}script`, desc: 'Get the bot script/source code link.' },
            credits: { usage: `${effectivePrefix}credits`, desc: 'Show bot credits.' },
            pair: { usage: `${effectivePrefix}pair <number>`, desc: 'Pair bot with a WhatsApp number.' },
            update: { usage: `${effectivePrefix}update`, desc: 'Check for bot updates on Heroku.' },
            setvar: { usage: `${effectivePrefix}setvar <KEY> <VALUE>`, desc: 'Set a Heroku config var.' },
            getvar: { usage: `${effectivePrefix}getvar <KEY>`, desc: 'Get a Heroku config var.' },
            allvar: { usage: `${effectivePrefix}allvar`, desc: 'List all Heroku config vars.' },
            eval: { usage: `${effectivePrefix}eval <code>`, desc: 'Execute JavaScript code (owner only).' },
            shell: { usage: `${effectivePrefix}shell <command>`, desc: 'Execute shell commands (owner only).' },
            restart: { usage: `${effectivePrefix}restart`, desc: 'Restart the bot (owner only).' },
            broadcast: { usage: `${effectivePrefix}broadcast <message>`, desc: 'Broadcast a message to all chats.' },
            botgc: { usage: `${effectivePrefix}botgc`, desc: 'List all groups the bot is in.' },
            joingc: { usage: `${effectivePrefix}joingc <link>`, desc: 'Make bot join a group via invite link.' },
            leavegc: { usage: `${effectivePrefix}leavegc`, desc: 'Make bot leave the current group.' },
            block: { usage: `${effectivePrefix}block @user`, desc: 'Block a user.' },
            unblock: { usage: `${effectivePrefix}unblock @user`, desc: 'Unblock a user.' },
            profile: { usage: `${effectivePrefix}profile @user`, desc: 'View a user profile/info.' },
            screenshot: { usage: `${effectivePrefix}screenshot <url>`, desc: 'Take a screenshot of a website.' },
            shorten: { usage: `${effectivePrefix}shorten <url>`, desc: 'Shorten a long URL.' },
            tinyurl: { usage: `${effectivePrefix}tinyurl <url>`, desc: 'Shorten URL using TinyURL.' },
            checkid: { usage: `${effectivePrefix}checkid <group link|channel link>`, desc: 'Get the ID from a group or channel link.' },
            privacy: { usage: `${effectivePrefix}privacy <setting> <value>`, desc: 'Manage WhatsApp privacy settings.' },
            lastseen: { usage: `${effectivePrefix}lastseen <on|off>`, desc: 'Toggle last seen visibility.' },
            mypp: { usage: `${effectivePrefix}mypp`, desc: 'View your own profile picture.' },
            mystatus: { usage: `${effectivePrefix}mystatus <text>`, desc: 'Set your WhatsApp status/about.' },
            online: { usage: `${effectivePrefix}online <on|off>`, desc: 'Toggle online status.' },
            groupadd: { usage: `${effectivePrefix}groupadd <on|off>`, desc: 'Control who can add the bot to groups.' },
            del: { usage: `${effectivePrefix}del`, desc: 'Delete a message. Reply to the message to delete.' },
            retrieve: { usage: `${effectivePrefix}retrieve`, desc: 'Retrieve/reveal a view-once message.' },
            fetch: { usage: `${effectivePrefix}fetch <url>`, desc: 'Fetch data from a URL.' },
            upload: { usage: `${effectivePrefix}upload`, desc: 'Upload media to get a URL. Reply to media.' },
            mediafire: { usage: `${effectivePrefix}mediafire <url>`, desc: 'Download from Mediafire.' },
            apk: { usage: `${effectivePrefix}apk <app name>`, desc: 'Download an APK.' },
            gitclone: { usage: `${effectivePrefix}gitclone <url>`, desc: 'Clone a GitHub repository.' },
            pinterest: { usage: `${effectivePrefix}pinterest <query>`, desc: 'Search Pinterest images.' },
            shazam: { usage: `${effectivePrefix}shazam`, desc: 'Identify a song from audio. Reply to audio.' },
            carbon: { usage: `${effectivePrefix}carbon <code>`, desc: 'Generate a Carbon code image.' },
            encrypt: { usage: `${effectivePrefix}encrypt <text>`, desc: 'Encrypt text.' },
            'run-js': { usage: `${effectivePrefix}run-js <code>`, desc: 'Run JavaScript code.' },
            'run-py': { usage: `${effectivePrefix}run-py <code>`, desc: 'Run Python code.' },
            hentai: { usage: `${effectivePrefix}hentai`, desc: 'NSFW content (18+ groups only).' },
            xvideos: { usage: `${effectivePrefix}xvideos <query>`, desc: 'NSFW content search (18+ groups only).' },
            vvx: { usage: `${effectivePrefix}vvx`, desc: 'View view-once messages. Reply to view-once.' },
            hug: { usage: `${effectivePrefix}hug @user`, desc: 'Send a hug anime GIF to a user.' },
            kiss: { usage: `${effectivePrefix}kiss @user`, desc: 'Send a kiss anime GIF to a user.' },
            slap: { usage: `${effectivePrefix}slap @user`, desc: 'Send a slap anime GIF to a user.' },
            pat: { usage: `${effectivePrefix}pat @user`, desc: 'Send a pat anime GIF to a user.' },
            blush: { usage: `${effectivePrefix}blush`, desc: 'Send a blushing anime image.' },
            smug: { usage: `${effectivePrefix}smug`, desc: 'Send a smug anime image.' },
            shinobu: { usage: `${effectivePrefix}shinobu`, desc: 'Get a random Shinobu image.' },
            miko: { usage: `${effectivePrefix}miko`, desc: 'Get a random miko anime image.' },
            kitsune: { usage: `${effectivePrefix}kitsune`, desc: 'Get a random kitsune anime image.' },
            oppai: { usage: `${effectivePrefix}oppai`, desc: 'NSFW: random oppai image (18+ groups only).' },
            waifu: { usage: `${effectivePrefix}waifu`, desc: 'Get a random anime waifu image.' },
            neko: { usage: `${effectivePrefix}neko`, desc: 'Get a random neko (catgirl) image.' },
            husbando: { usage: `${effectivePrefix}husbando`, desc: 'Get a random husbando image.' },
            maid: { usage: `${effectivePrefix}maid`, desc: 'Get a random anime maid image.' },
            uniform: { usage: `${effectivePrefix}uniform`, desc: 'Get a random anime uniform image.' },
            advice: { usage: `${effectivePrefix}advice`, desc: 'Get a random piece of advice.' },
            catfact: { usage: `${effectivePrefix}catfact`, desc: 'Get a random cat fact.' },
            fact: { usage: `${effectivePrefix}fact`, desc: 'Get a random fact.' },
            quote: { usage: `${effectivePrefix}quote`, desc: 'Get a random inspirational quote.' },
            joke: { usage: `${effectivePrefix}joke`, desc: 'Get a random joke.' },
            coinflip: { usage: `${effectivePrefix}coinflip`, desc: 'Flip a coin — heads or tails.' },
            dice: { usage: `${effectivePrefix}dice`, desc: 'Roll a dice.' },
            calc: { usage: `${effectivePrefix}calc <expression>`, desc: 'Calculate a math expression. Example: .calc 2+2*5' },
            country: { usage: `${effectivePrefix}country <name>`, desc: 'Get info about a country.' },
            alay: { usage: `${effectivePrefix}alay <text>`, desc: 'Convert text to alay style.' },
            afk: { usage: `${effectivePrefix}afk [reason]`, desc: 'Set AFK status. Bot will auto-reply when someone mentions you.' },
            warn: { usage: `${effectivePrefix}warn @user`, desc: 'Warn a group member. Removes them on reaching warn limit.' },
            poll: { usage: `${effectivePrefix}poll <question|option1|option2>`, desc: 'Create a poll in the group.' },
            pin: { usage: `${effectivePrefix}pin`, desc: 'Pin a message. Reply to the message to pin.' },
            xkill: { usage: `${effectivePrefix}xkill`, desc: 'Kick all non-admin members from the group (owner only).' },
            foreigners: { usage: `${effectivePrefix}foreigners`, desc: 'List members with non-local phone numbers in group.' },
            gstatus: { usage: `${effectivePrefix}gstatus <text>`, desc: 'Set the group description/status.' },
            qr: { usage: `${effectivePrefix}qr <text>`, desc: 'Generate a QR code from text or URL.' },
            password: { usage: `${effectivePrefix}password <length>`, desc: 'Generate a random secure password.' },
            base64: { usage: `${effectivePrefix}base64 <text>`, desc: 'Encode text to Base64.' },
            stt: { usage: `${effectivePrefix}stt`, desc: 'Speech to text. Reply to a voice note to transcribe it.' },
            telesticker: { usage: `${effectivePrefix}telesticker`, desc: 'Download a Telegram sticker pack.' },
            bilibili: { usage: `${effectivePrefix}bilibili <url>`, desc: 'Download video from Bilibili.' },
            capcut: { usage: `${effectivePrefix}capcut <url>`, desc: 'Download a CapCut template video.' },
            snackvideo: { usage: `${effectivePrefix}snackvideo <url>`, desc: 'Download from Snack Video.' },
            soundcloud: { usage: `${effectivePrefix}soundcloud <query>`, desc: 'Search and download from SoundCloud.' },
            threads: { usage: `${effectivePrefix}threads <url>`, desc: 'Download Threads (Meta) video/image.' },
            video: { usage: `${effectivePrefix}video <query>`, desc: 'Search and send a YouTube video.' },
            yt: { usage: `${effectivePrefix}yt <query>`, desc: 'YouTube search. Alias for yts.' },
            reaction: { usage: `${effectivePrefix}reaction <on|off>`, desc: 'Toggle auto reactions to messages.' },
            multiprefix: { usage: `${effectivePrefix}multiprefix <on|off>`, desc: 'Enable multiple command prefixes (., !, #, /, etc).' },
            startmessage: { usage: `${effectivePrefix}startmessage <on|off>`, desc: 'Toggle the bot greeting message on start.' },
            stealth: { usage: `${effectivePrefix}stealth <on|off>`, desc: 'Stealth mode — bot only responds to owner, hides from everyone else.' },
            toanime: { usage: `${effectivePrefix}toanime`, desc: 'Convert an image to anime art style. Reply to image.' },
            aicode: { usage: `${effectivePrefix}aicode <lang> <prompt>`, desc: 'Generate code using AI. Example: .aicode python fibonacci' },
            codegen: { usage: `${effectivePrefix}codegen <description>`, desc: 'Generate code from a description using AI.' },
            darkgpt: { usage: `${effectivePrefix}darkgpt <prompt>`, desc: 'Uncensored AI chat (DarkGPT). Use responsibly.' },
            sora: { usage: `${effectivePrefix}sora <description>`, desc: 'Generate an AI scene/image from a cinematic description.' },
            logogen: { usage: `${effectivePrefix}logogen <title|idea|slogan>`, desc: 'Generate a logo image using AI.' },
            rip: { usage: `${effectivePrefix}rip`, desc: 'Generate a RIP/tombstone image. Reply to a user or image.' },
            trigger: { usage: `${effectivePrefix}trigger`, desc: 'Generate a "TRIGGERED" meme. Reply to image.' },
            trash: { usage: `${effectivePrefix}trash`, desc: 'Put someone in the trash. Reply to image or user.' },
            wanted: { usage: `${effectivePrefix}wanted`, desc: 'Generate a wanted poster. Reply to image.' },
            wasted: { usage: `${effectivePrefix}wasted`, desc: 'Generate a GTA wasted screen. Reply to image.' },
            emix: { usage: `${effectivePrefix}emix <emoji>`, desc: 'Mix two emojis together.' },
            removebg: { usage: `${effectivePrefix}removebg`, desc: 'Remove background from an image. Reply to image.' },
            brat: { usage: `${effectivePrefix}brat <text>`, desc: 'Generate a brat-style text image.' },
            bratvid: { usage: `${effectivePrefix}bratvid <text>`, desc: 'Generate a brat-style text video.' },
            inspectweb: { usage: `${effectivePrefix}inspectweb <url>`, desc: 'Inspect/analyze a website URL.' },
            broadcast: { usage: `${effectivePrefix}broadcast <message>`, desc: 'Broadcast a message to all chats (owner only).' },
            autolikeemoji: { usage: `${effectivePrefix}autolikeemoji <emoji|random>`, desc: 'Set the emoji used for auto-liking statuses.' },
            requests: { usage: `${effectivePrefix}requests`, desc: 'View pending join requests in the group.' },
            'approve-all': { usage: `${effectivePrefix}approve-all`, desc: 'Approve all pending join requests.' },
            'reject-all': { usage: `${effectivePrefix}reject-all`, desc: 'Reject all pending join requests.' },
              canvas: { usage: `${effectivePrefix}canvas Title | type | text | watermark`, desc: 'Generate a themed canvas card from a replied image. Types: spotify, youtube, google, tiktok, duckduckgo, brave, applemusic, soundcloud, pinterest, playstore, happymod, apkpure, unsplash, wallpaper, wattpad, weather, sticker, lyrics, shazam, web, image. Aliases: canvascard, spotifycard, youtubecard, tiktokcard' },
              canvascard: { usage: `${effectivePrefix}canvas Title | type | text | watermark`, desc: 'Alias for canvas — themed canvas card generator.' },
              spotifycard: { usage: `${effectivePrefix}canvas Title | spotify | text | watermark`, desc: 'Alias for canvas with spotify type.' },
              remini: { usage: `${effectivePrefix}remini`, desc: 'Enhance and upscale a replied image using AI. Reply to an image. Aliases: hd, enhance, upscale' },
              hd: { usage: `${effectivePrefix}hd`, desc: 'Alias for remini — AI image enhancement.' },
              enhance: { usage: `${effectivePrefix}enhance`, desc: 'Alias for remini — AI image enhancement.' },
              upscale: { usage: `${effectivePrefix}upscale`, desc: 'Alias for remini — AI image upscaling.' },
              imgedit: { usage: `${effectivePrefix}imgedit <prompt>`, desc: 'AI-edit a replied image using a text prompt. E.g: .imgedit make it look like anime. Aliases: imageedit, aiedit, editimg' },
              imageedit: { usage: `${effectivePrefix}imgedit <prompt>`, desc: 'Alias for imgedit — AI image editing via prompt.' },
              aiedit: { usage: `${effectivePrefix}aiedit <prompt>`, desc: 'Alias for imgedit — AI image editing.' },
              rc: { usage: `${effectivePrefix}rc <prompt>`, desc: 'Generate an AI image from a text prompt. E.g: .rc a futuristic city at night. Aliases: imagine, texttoimage, tti' },
              imagine: { usage: `${effectivePrefix}imagine <prompt>`, desc: 'Alias for rc — AI image generation.' },
              tti: { usage: `${effectivePrefix}tti <prompt>`, desc: 'Alias for rc — text-to-image.' },
              aisong: { usage: `${effectivePrefix}aisong <description>`, desc: 'Generate an AI-created song from a description. E.g: .aisong a sad lofi song about loneliness. Aliases: gensong, makesong' },
              gensong: { usage: `${effectivePrefix}gensong <description>`, desc: 'Alias for aisong — AI song generation.' },
              makesong: { usage: `${effectivePrefix}makesong <description>`, desc: 'Alias for aisong — AI song generator.' },
              allow: { usage: `${effectivePrefix}allow add|remove|list [@user]`, desc: 'Owner only. Manage the bot whitelist. Sub-commands: add @user — add to whitelist, remove @user — remove, list — show all allowed users.' },
        };

        if (helpData[cmdName]) {
            const info = helpData[cmdName];
            const body = `├ 📌 *Command:* ${cmdName}\n├ 📖 *Usage:* ${info.usage}\n├ ℹ️ *Description:*\n├ ${info.desc}`;
            return await client.sendMessage(m.chat, { text: fmt(`HELP: ${cmdName.toUpperCase()}`, body) }, { quoted: fq });
        }

        const pluginsDir = path.join(__dirname, '..');
        const categories = fs.readdirSync(pluginsDir).filter(f => fs.statSync(path.join(pluginsDir, f)).isDirectory());
        let found = false;
        for (const cat of categories) {
            const files = fs.readdirSync(path.join(pluginsDir, cat)).filter(f => f.endsWith('.js'));
            if (files.includes(cmdName + '.js')) {
                found = true;
                const body = `├ 📌 *Command:* ${cmdName}\n├ 📁 *Category:* ${cat}\n├ 📖 *Usage:* ${effectivePrefix}${cmdName}\n├ ℹ️ No detailed help available for this command yet.`;
                return await client.sendMessage(m.chat, { text: fmt(`HELP: ${cmdName.toUpperCase()}`, body) }, { quoted: fq });
            }
        }

        if (!found) {
            await client.sendMessage(m.chat, {
                text: fmt('HELP', `├ ❌ Command "*${cmdName}*" not found.\n├ Use *${effectivePrefix}help* to list all commands.`)
            }, { quoted: fq });
        }
    });

// ── herokumenu
dreaded({
  pattern: "herokumenu",
  alias: ["heroku"],
  desc: "Displays only the Heroku menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ HEROKU MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Heroku').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: `Toxic-MD WA bot`,
          body: `©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          thumbnail: pict,
          sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fq });
  });

// ── joke
dreaded({
  pattern: "joke",
  alias: ["jokes","lol","funny"],
  desc: "Get a random joke",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const res = await axios.get('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist&type=twopart', { timeout: 8000 });
            const j = res.data;
            const setup = j.setup || '';
            const delivery = j.delivery || '';
            if (!setup) throw new Error('no joke');
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Jᴏᴋᴇ ≪───\n├\n├ 😐 ${setup}\n├\n├ 😂 ${delivery}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Jᴏᴋᴇ ≪───\n├\n├ Your life is the joke, I\'m too tired to think of another one.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── logomenu
dreaded({
  pattern: "logomenu",
  alias: ["effectsmenu","effectslist","logolist"],
  desc: "Displays all available logo & effects commands",
  category: "General",
  filename: __filename
}, async (context) => {
      const { client, m, fakeQuoted } = context;
      const fq = getFakeQuoted(m);

      const settings = await getSettings();
      const effectivePrefix = settings.prefix || '';

      const toFancyFont = (text) => {
        const fonts = {
          'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
          'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
          'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
          'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
        };
        return text.toLowerCase().split('').map(c => fonts[c] || c).join('');
      };

      let effectCommands = [];
      try {
        const effectsMod = require('./Effects');
        const list = Array.isArray(effectsMod) ? effectsMod : [];
        for (const cmd of list) {
          if (cmd && cmd.name) effectCommands.push(cmd.name);
        }
      } catch (e) {}

      let menuText = `╭───(    TOXIC-MD    )───\n├───≫ EFFECTS & LOGO MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ Total: ${effectCommands.length} effects\n├ \n`;

      for (const name of effectCommands) {
        menuText += `├ *${toFancyFont(name)}*\n`;
      }

      menuText += `╰──────────────────☉\n`;
      menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
    });

// ── menu
dreaded({
  pattern: "menu",
  alias: ["commands","list"],
  desc: "Displays the Toxic-MD command menu",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, mode, pict, botname, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

        const bodyText = m.body || '';
        const cleanText = bodyText.trimStart().slice(prefix.length).trimStart();
        const firstWord = cleanText.split(' ')[0].toLowerCase();

        if (cleanText !== '' && !['menu', 'commands', 'list'].includes(firstWord)) {
            const commandName = cleanText.split(' ')[0];
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Yo ${m.pushName}, what's with the\n├ extra bullshit after "${commandName}"?\n├ Just type *${prefix}menu* properly, moron.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }

        const menuText =
            `╭───(    TOXIC-MD    )───\n` +
            `├───≫ Mᴇɴᴜ ≪───\n` +
            `├ \n` +
            `Hoi  @${m.sender.split('@')[0].split(':')[0]}\n` +
            `├ \n` +
            `├ Bot: TOXIC-MD\n` +
            `├ Prefix: ${prefix}\n` +
            `├ Mode: ${mode}\n` +
            `├ \n` +
            `├ Select a button below.\n` +
            `╰──────────────────☉\n` +
            `> xD`;

        const sections = [
            {
                title: '⌜ 𝘾𝙤𝙧𝙚 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨 ⌟',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐅𝐮𝐥𝐥𝐌𝐞𝐧𝐮', description: 'Display all commands', id: `${prefix}fullmenu` },
                    { title: '𝐃𝐞𝐯', description: "Send developer contact", id: `${prefix}dev` },
                    { title: '𝐑𝐞𝐩𝐨𝐫𝐭', description: 'Report a bug to dev', id: `${prefix}report` },
                ],
            },
            {
                title: 'ℹ 𝙄𝙣𝙛𝙤 𝘽𝙤𝙩',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐏𝐢𝐧𝐠', description: 'Check bot speed', id: `${prefix}ping` },
                    { title: '𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬', description: 'Show bot settings', id: `${prefix}settings` },
                    { title: '𝐌𝐨𝐝𝐞', description: 'Toggle bot mode', id: `${prefix}mode` },
                ],
            },
            {
                title: '📜 𝘾𝙖𝙩𝙚𝙜𝙤𝙧𝙮 𝙈𝙚𝙣𝙪𝙨',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐆𝐞𝐧𝐞𝐫𝐚𝐥𝐌𝐞𝐧𝐮', description: 'General commands', id: `${prefix}generalmenu` },
                    { title: '𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬𝐌𝐞𝐧𝐮', description: 'Bot settings commands', id: `${prefix}settingsmenu` },
                    { title: '𝐎𝐰𝐧𝐞𝐫𝐌𝐞𝐧𝐮', description: 'Owner only commands', id: `${prefix}ownermenu` },
                    { title: '𝐆𝐫𝐨𝐮𝐩𝐌𝐞𝐧𝐮', description: 'Group management', id: `${prefix}groupmenu` },
                    { title: '𝐀𝐈𝐌𝐞𝐧𝐮', description: 'AI & chat commands', id: `${prefix}aimenu` },
                    { title: '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐌𝐞𝐧𝐮', description: 'Media downloaders', id: `${prefix}downloadmenu` },
                    { title: '𝐄𝐝𝐢𝐭𝐢𝐧𝐠𝐌𝐞𝐧𝐮', description: 'Media editing tools', id: `${prefix}editingmenu` },
                    { title: '𝐄𝐟𝐟𝐞𝐜𝐭𝐬𝐌𝐞𝐧𝐮', description: 'Text effect commands', id: `${prefix}effectsmenu` },
                    { title: '𝐀𝐧𝐢𝐦𝐞𝐌𝐞𝐧𝐮', description: 'Anime image commands', id: `${prefix}animemenu` },
                    { title: '𝐔𝐭𝐢𝐥𝐬𝐌𝐞𝐧𝐮', description: 'Utility commands', id: `${prefix}utilsmenu` },
                    { title: '𝐑𝐞𝐚𝐜𝐭𝐢𝐨𝐧𝐬𝐌𝐞𝐧𝐮', description: 'Reaction commands', id: `${prefix}reactionsmenu` },
                    { title: '𝐏𝐫𝐢𝐯𝐚𝐜𝐲𝐌𝐞𝐧𝐮', description: 'Privacy commands', id: `${prefix}privacymenu` },
                ],
            },
        ];

        try {
            const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                interactiveMessage: {
                    body: { text: menuText },
                    footer: { text: `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` },
                    header: { hasMediaAttachment: false },
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            title: `${botname}`,
                            body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                            mediaType: 1,
                            thumbnail: pict,
                            mediaUrl: '',
                            sourceUrl: 'https://github.com/xhclintohn/Toxic-MD',
                            showAdAttribution: false,
                            renderLargerThumbnail: true,
                        }
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'GitHub Repo',
                                    url: 'https://github.com/xhclintohn/Toxic-MD',
                                    merchant_url: 'https://github.com/xhclintohn/Toxic-MD'
                                })
                            },
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: '𝐕𝐈𝐄𝐖☇ 𝐎𝐏𝐓𝐈𝐎𝐍𝐒 ☑',
                                    sections
                                })
                            }
                        ],
                        messageParamsJson: JSON.stringify({
                            limited_time_offer: {
                                text: 'Toxic-MD',
                                url: 'https://github.com/xhclintohn/Toxic-MD',
                                copy_code: 'TOXIC',
                                expiration_time: Date.now() * 1000,
                            },
                            bottom_sheet: {
                                in_thread_buttons_limit: 2,
                                divider_indices: [1, 2],
                                list_title: 'Select Command',
                                button_title: 'Toxic-MD',
                            },
                        })
                    }
                }
            }), { quoted: fq, userJid: client.user.id });
            await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        } catch {
            await client.sendMessage(m.chat, {
                image: pict,
                caption: menuText,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: `${botname}`,
                        body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                        mediaType: 1,
                        thumbnail: pict,
                        mediaUrl: '',
                        sourceUrl: 'https://github.com/xhclintohn/Toxic-MD',
                        showAdAttribution: false,
                        renderLargerThumbnail: true,
                    }
                }
            }, { quoted: fq });
            await client.sendMessage(m.chat, {
                listMessage: {
                    title: '𝐕𝐈𝐄𝐖☇ 𝐎𝐏𝐓𝐈𝐎𝐍𝐒 ☑',
                    description: 'Select a category to view its commands.',
                    buttonText: '📖 Browse Commands',
                    listType: 1,
                    sections: sections.map(s => ({
                        title: s.title,
                        rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id }))
                    })),
                    footer: `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                },
            }, { quoted: fq });
        }

        const xhClintonPaths = [
            path.join(__dirname, 'xh_clinton'),
            path.join(process.cwd(), 'xh_clinton'),
            path.join(__dirname, '..', 'xh_clinton')
        ];
        let audioFolder = null;
        for (const folderPath of xhClintonPaths) {
            if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
        }
        if (!audioFolder) return;
        const menuFiles = ['menu1.mp3', 'menu2.mp3', 'menu3.mp3', 'menu4.mp3'];
        const possibleFiles = menuFiles.map(f => path.join(audioFolder, f)).filter(f => fs.existsSync(f));
        if (possibleFiles.length === 0) return;
        const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            const audioBuffer = fs.readFileSync(randomFile);
            await client.sendMessage(m.chat, { audio: audioBuffer, ptt: true, mimetype: 'audio/mpeg', fileName: 'toxic-menu.m4a' }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'toxic-menu.m4a' }, { quoted: fq });
        }
    });

// ── npmdl
dreaded({
  pattern: "npmdl",
  alias: ["npmdownload","npminstall"],
  desc: "Download NPM package as .tgz file",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);

        try {
            let query = m.text.trim();
            if (!query) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Provide a package name,\n├ you incompetent fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            if (query.startsWith('@') && !query.includes('/')) {
                const searchRes = await fetch(`https://yaemiko-narukami.vercel.app/search/npm?text=${encodeURIComponent(query)}`);
                const searchData = await searchRes.json();
                
                const list = searchData?.result || searchData?.results || searchData?.data || [];
                if (!Array.isArray(list) || list.length === 0) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ No packages found in scope *${query}*\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }
                
                query = list[0]?.name || list[0]?.package?.name || query;
            }

            const npmRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(query)}`);
            const data = await npmRes.json();
            
            const latest = data["dist-tags"]?.latest;
            if (!latest) throw new Error('No latest version found');
            
            const tarball = data.versions?.[latest]?.dist?.tarball;
            if (!tarball) throw new Error('No download link found');

            const fileRes = await fetch(tarball);
            const fileBuffer = await fileRes.arrayBuffer();
            
            const fileName = `${query.replace(/\//g, '-')}-${latest}.tgz`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            
            await client.sendMessage(m.chat, {
                document: Buffer.from(fileBuffer),
                fileName: fileName,
                mimetype: 'application/gzip',
                caption: `╭───(    TOXIC-MD    )───\n├───≫ NPM ≪───\n├ \n├ ${query} v${latest}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });

        } catch (error) {
            console.error('NPM download error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Download failed.\n├ Error: ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── ownermenu
dreaded({
  pattern: "ownermenu",
  alias: ["ownercmds"],
  desc: "Displays only the Owner menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ OWNER MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Owner').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── pair
dreaded({
  pattern: "pair",
  alias: ["getcode","paircode","pairingcode","connect"],
  desc: "Generates a pairing code for WhatsApp multi-device linking",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);

        try {
            if (!text) {
                return await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ Pᴀɪʀɪɴɢ ≪───\n├ \n├ Oi genius, give me a number\n├ to pair with. You think I can\n├ read your mind?\n├ \n├ Usage: *${prefix}pair <number>*\n├ Example: *${prefix}pair 254712345678*\n├ Example: *${prefix}pair +1 234 567 8901*\n├ \n├ Spaces, dashes, plus signs...\n├ I'll clean that mess up for you.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                }, { quoted: fq });
            }

            const number = cleanNumber(text);

            if (number.length < 6 || number.length > 15) {
                return await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ Iɴᴠᴀʟɪᴅ Nᴜᴍʙᴇʀ ≪───\n├ \n├ That number is garbage.\n├ Cleaned: ${number}\n├ Need 6-15 digits with country code.\n├ Try again with a real number.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                }, { quoted: fq });
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Pᴀɪʀɪɴɢ ≪───\n├ \n├ Generating code for: ${number}\n├ Hold on, this takes a sec...\n├ Don't spam the command, idiot.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });

            const sessionId = makeid(8);
            let tempPath;
            try {
                const basePath = path.join(__dirname, '..', '..', 'features', 'toxicmd', 'temp');
                if (fs.existsSync(basePath) && !fs.statSync(basePath).isDirectory()) {
                    fs.unlinkSync(basePath);
                }
                const toxicmdPath = path.join(__dirname, '..', '..', 'features', 'toxicmd');
                if (fs.existsSync(toxicmdPath) && !fs.statSync(toxicmdPath).isDirectory()) {
                    fs.unlinkSync(toxicmdPath);
                }
                tempPath = path.join(basePath, sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            } catch (dirErr) {
                tempPath = path.join('/tmp', 'toxic-pair-' + sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            }

            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(tempPath);

            const pairSocket = Toxic_Tech({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: ["Ubuntu", "Chrome", "20.0.04"],
                syncFullHistory: false,
                generateHighQualityLinkPreview: true,
                shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
                getMessage: async () => undefined,
                markOnlineOnConnect: true,
                connectTimeoutMs: 120000,
                keepAliveIntervalMs: 30000,
                defaultQueryTimeoutMs: 60000,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                retryRequestDelayMs: 10000
            });

            pairSocket.ev.on('creds.update', saveCreds);

            await delay(3000);
            const code = await pairSocket.requestPairingCode(number);

            if (!code) throw new Error("Pairing code generation failed. The number might not be on WhatsApp.");

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;

            try {
                const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

                const ctaMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `╭───(    TOXIC-MD    )───\n├───≫ Pᴀɪʀɪɴɢ Cᴏᴅᴇ ≪───\n├ \n├ Number: ${number}\n├ Code: *${formattedCode}*\n├ \n├ Copy the code and paste it\n├ in your WhatsApp linked\n├ devices section.\n├ \n├ The code expires quickly so\n├ move your slow ass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'Toxic-MD Pairing System'
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: 'cta_copy',
                                            buttonParamsJson: JSON.stringify({
                                                display_text: '📋 Copy Pairing Code',
                                                id: 'copy_code',
                                                copy_code: formattedCode
                                            })
                                        }
                                    ]
                                })
                            })
                        }
                    }
                }, { quoted: fq });

                await client.relayMessage(m.chat, ctaMsg.message, { messageId: ctaMsg.key.id });

            } catch (btnErr) {
                await client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ Pᴀɪʀɪɴɢ Cᴏᴅᴇ ≪───\n├ \n├ Number: ${number}\n├ Code: *${formattedCode}*\n├ \n├ Copy the code above and paste\n├ it in your WhatsApp linked\n├ devices section. Hurry up,\n├ it expires quick.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                }, { quoted: fq });
            }

            setTimeout(async () => {
                try {
                    await pairSocket.ws.close();
                } catch (e) {}
                setTimeout(() => {
                    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
                }, 5000);
            }, 10000);

        } catch (error) {
            console.error("Error in pair command:", error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Pᴀɪʀɪɴɢ Fᴀɪʟᴇᴅ ≪───\n├ \n├ Couldn't generate the code.\n├ ${error.message || 'Unknown error'}\n├ \n├ Make sure the number is valid\n├ and actually on WhatsApp.\n├ Then try again, if you can\n├ manage that.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── pdf
dreaded({
  pattern: "pdf",
  alias: ["topdf","createpdf","makepdf"],
  desc: "Create a PDF from text",
  category: "General",
  filename: __filename
}, async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const query = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!query) {
              return client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Give me some text to convert.\n├ Example: ${prefix}pdf Hello world this is my document\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

          try {
              const pdfBuf = await makePDF(query);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              await client.sendMessage(m.chat, {
                  document: pdfBuf,
                  mimetype: 'application/pdf',
                  fileName: `document_${Date.now()}.pdf`,
                  caption: `╭───(    TOXIC-MD    )───\n├───≫ PDF Cʀᴇᴀᴛᴇᴅ ≪───\n├ \n├ Here's your document.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
              await client.sendMessage(m.chat, {
                  text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ PDF creation failed. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞᠊ʀᴇᴅ 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
              }, { quoted: fq });
          }
      });

// ── ping
dreaded({
  pattern: "ping",
  alias: ["p","speed","latency","response","pong"],
  desc: "Checks the bot response time and server status",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, toxicspeed } = context;
        const fq = getFakeQuoted(m);
        const bName = botname || 'Toxic-MD';
        try {
            await client.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

            const startTime = Date.now();
            const latency = Date.now() - startTime;
            const responseSpeed = (toxicspeed || 0.0094).toFixed(4);

            const formatUptime = (seconds) => {
                const d = Math.floor(seconds / 86400);
                const h = Math.floor((seconds % 86400) / 3600);
                const min = Math.floor((seconds % 3600) / 60);
                const s = Math.floor(seconds % 60);
                return [d && `${d}d`, h && `${h}h`, min && `${min}m`, s && `${s}s`].filter(Boolean).join(' ') || '0s';
            };

            const mem = process.memoryUsage();
            const usedMB = (mem.rss / 1024 / 1024).toFixed(2);
            const totalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
            const platform = detectPlatform();

            const text = `╭───(    TOXIC-MD    )───\n├───≫ Pɪɴɢ ≪───\n├ \n├ 𝐋𝐚𝐭𝐞𝐧𝐜𝐲 : ${responseSpeed}ms\n├ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐓𝐢𝐦𝐞 : ${new Date().toLocaleString()}\n├ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatUptime(process.uptime())}\n├ 𝐌𝐞𝐦𝐨𝐫𝐲 : ${usedMB}/${totalMB} MB\n├ 𝐍𝐨𝐝𝐞𝐉𝐒 : ${process.version}\n├ 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦 : ${platform}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

            await client.sendMessage(m.chat, { text }, { quoted: fq });
        } catch (error) {
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Pɪɴɢ Fᴀɪʟᴇᴅ ≪───\n├ \n├ The ping command crashed.\n├ Much like your life choices.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── privacymenu
dreaded({
  pattern: "privacymenu",
  alias: ["privmenu"],
  desc: "Displays only the Privacy menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ PRIVACY MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Privacy').filter(file => file.endsWith('/js'));
    for (const file of commandFiles) {
      const commandName = file.replace('/js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: `Toxic-MD WA bot`,
          body: `©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          thumbnail: pict,
          sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fq });
  });

// ── profile
dreaded({
  pattern: "profile",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, text, pict } = context;
    const fq = getFakeQuoted(m);

    try {
        let targetUser = m.sender;
        let displayName = null;

        if (m.quoted) {
            targetUser = m.quoted.sender;
        } else if (text) {
            if (text.includes('@')) {
                const mentionedJid = m.mentionedJid && m.mentionedJid[0];
                if (mentionedJid) {
                    targetUser = mentionedJid;
                }
            } else {
                const cleanedNumber = text.replace(/\s+/g, '').replace(/[^\d+]/g, '');
                
                if (/^\+?\d{10,15}$/.test(cleanedNumber)) {
                    let formattedNumber = cleanedNumber;
                    if (formattedNumber.startsWith('+')) {
                        formattedNumber = formattedNumber.substring(1);
                    }
                    if (!formattedNumber.endsWith('@s.whatsapp.net')) {
                        targetUser = formattedNumber.includes('@') ? 
                            formattedNumber : 
                            `${formattedNumber}@s.whatsapp.net`;
                    }
                }
            }
        }

        try {
            const profileName = await client.getName(targetUser);
            displayName = profileName || targetUser.split('@')[0];
        } catch {
            displayName = targetUser.split('@')[0];
        }

        let ppUrl = pict;
        try {
            ppUrl = await client.profilePictureUrl(targetUser, 'image');
        } catch {
            ppUrl = pict;
        }

        await client.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: `╭───(    TOXIC-MD    )───\n├───≫ Pʀᴏꜰɪʟᴇ ≪───\n├ \n├ ${displayName}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: targetUser !== m.sender ? [targetUser] : []
        }, { quoted: fq });

    } catch (error) {
        console.error('Profile error:', error);
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Failed to fetch profile.\n├ The user probably blocked you or\n├ their privacy settings are stricter\n├ than your intelligence.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── profilegc
dreaded({
  pattern: "profilegc",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    function convertTimestamp(timestamp) {
        const d = new Date(timestamp * 1000);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
            date: d.getDate(),
            month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d),
            year: d.getFullYear(),
            day: daysOfWeek[d.getUTCDay()],
            time: `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')}`
        }
    }

    if (!m.isGroup) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ This command is meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

    let info = await client.groupMetadata(m.chat);
    let ts = await convertTimestamp(info.creation);

    try {
        var pp = await client.profilePictureUrl(m.chat, 'image');
    } catch {
        var pp = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
    }

    const membersCount = info.participants.filter(p => !p.admin).length;
    const adminsCount = info.participants.filter(p => p.admin).length;
    const owner = info.owner || info.participants.find(p => p.admin === 'superadmin')?.id;

    const caption = `╭───(    TOXIC-MD    )───
├───≫ Gʀᴏᴜᴘ Iɴꜰᴏ ≪───
├ 
├ Name : *${info.subject}*
├ ID : *${info.id}*
├ Owner : ${owner ? '@' + owner.split('@')[0] : 'Unknown'}
├ 
├ Created :
├ ${ts.day}, ${ts.date} ${ts.month} ${ts.year}
├ ${ts.time} UTC
├ 
├ Participants :
├ Total : *${info.size}*
├ Members : *${membersCount}*
├ Admins : *${adminsCount}*
├ 
├ Settings :
├ Messages : ${info.announce ? 'Admins Only' : 'Everyone'}
├ Edit Info : ${info.restrict ? 'Admins Only' : 'Everyone'}
├ Add Members : ${info.memberAddMode ? 'Everyone' : 'Admins Only'}
╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: caption
    }, { quoted: fq });
});

// ── quote
dreaded({
  pattern: "quote",
  alias: ["inspire","motivation","qotd"],
  desc: "Get a random motivational quote",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            const res = await axios.get('https://zenquotes.io/api/random', { timeout: 8000 });
            const q = res.data?.[0];
            if (!q) throw new Error('empty');
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Qᴜᴏᴛᴇ ≪───\n├\n├ ❝ ${q.q} ❞\n├\n├ — ${q.a}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Qᴜᴏᴛᴇ ≪───\n├\n├ No quotes today. Universe is offline.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── random-anime
dreaded({
  pattern: "random-anime",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);

const axios = require("axios");
const { getFakeQuoted } = require('../lib/fakeQuoted');

  const link = "https://api.jikan.moe/v4/random/anime";

  try {
    const response = await axios.get(link);
    const data = response.data.data;

    const title = data.title;
    const synopsis = data.synopsis;
    const imageUrl = data.images.jpg.image_url;
    const episodes = data.episodes;
    const status = data.status;

    const message = `╭───(    TOXIC-MD    )───
├───≫ Rᴀɴᴅᴏᴍ Aɴɪᴍᴇ ≪───
├ 
├ Title: ${title}
├ Episodes: ${episodes}
├ Status: ${status}
├ Synopsis: ${synopsis}
├ URL: ${data.url}
╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: message }, { quoted: fq });
  } catch (error) {
   m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ An error occurred fetching anime.\n├ Try again, weeb.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

});

// ── reactionsmenu
dreaded({
  pattern: "reactionsmenu",
  alias: ["reactmenu","reactionlist"],
  desc: "Displays the reactions commands menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return text.toLowerCase().split('').map(c => fonts[c] || c).join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ REACTIONS MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    const commandFiles = fs.readdirSync('./plugins/Reactions').filter(f => f.endsWith('.js') && f !== 'links.js');
    for (const file of commandFiles) {
      menuText += `├ *${toFancyFont(file.replace('.js', ''))}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── readmore
dreaded({
  pattern: "readmore",
  desc: "Hide text behind a read more button",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        if (!text) return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ READ MORE ≪───\n├ \n├ Usage: ${prefix}readmore visible text|hidden text\n├ The text after | will be hidden.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        const parts = text.split('|');
        const visible = parts[0] || '';
        const hidden = parts[1] || '';
        await client.sendMessage(m.chat, { text: visible + READ_MORE + hidden }, { quoted: fq });
    });

// ── report
dreaded({
  pattern: "report",
  alias: ["bug","feedback"],
  desc: "Report a bug or issue directly to the developer",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);

        const box = (lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
            return `╭───(    TOXIC-MD    )───\n├───≫ Rᴇᴘᴏʀᴛ ≪───\n├\n${body}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
        };

        const reportText = text || (m.quoted ? (m.quoted.text || m.quoted.body || '') : '');

        if (!reportText || !reportText.trim()) {
            return client.sendMessage(m.chat, {
                text: box([
                    `Usage: *${prefix}report <your message>*`,
                    `Or reply to a message and type *${prefix}report*`,
                    ``,
                    `Example: *${prefix}report play cmd not working*`
                ])
            }, { quoted: fq });
        }

        const senderNum = m.sender.replace(/@s\.whatsapp\.net$/, '').split(':')[0];
        const chatType = m.isGroup ? `Group: ${m.chat}` : 'DM';
        const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });

        const devMsg = `╭───(    TOXIC-MD    )───\n├───≫ 🐛 Bᴜɢ Rᴇᴘᴏʀᴛ ≪───\n├\n├ From: @${senderNum}\n├ Name: ${m.pushName || 'Unknown'}\n├ Chat: ${chatType}\n├ Time: ${now}\n├\n├ Report:\n├ ${reportText.split('\n').join('\n├ ')}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            await client.sendMessage(DEV_JID, {
                text: devMsg,
                mentions: [m.sender]
            });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, {
                text: box([
                    `Your report has been sent to the developer.`,
                    ``,
                    `*Report:* ${reportText.slice(0, 120)}${reportText.length > 120 ? '...' : ''}`,
                    ``,
                    `The dev will look into it. Thanks for reporting.`
                ])
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await client.sendMessage(m.chat, {
                text: box([`Failed to send report. Try again later.`])
            }, { quoted: fq });
        }
    });

// ── roast
dreaded({
  pattern: "roast",
  alias: ["insult","savage","toxicroast","flame"],
  desc: "Roast someone (or yourself) with a savage line",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);
        const mentioned = m.mentionedJid?.length ? m.mentionedJid[0]
            : m.quoted?.sender ? m.quoted.sender
            : m.sender;
        const target = `@${mentioned.split('@')[0].split(':')[0]}`;
        const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];

        await client.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });
        await client.sendMessage(m.chat, {
            text: `╭───(    TOXIC-MD    )───\n├───≫ Rᴏᴀsᴛ ≪───\n├ \n├ 🎯 Target: ${target}\n├ \n├ ${roast}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [mentioned]
        }, { quoted: fq });
    });

// ── script
dreaded({
  pattern: "script",
  category: "General",
  filename: __filename
}, async (context) => {
const { client, m, text, botname, prefix = '' } = context;
const fq = getFakeQuoted(m);

const toFancyFont = (text, isUpperCase = false) => {
const fonts = {
'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
};
return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
.split('')
.map(char => fonts[char] || char)
.join('');
};

try {
const repoUrl = 'https://api.github.com/repos/xhclintohn/Toxic-MD';
const response = await fetch(repoUrl);
const repoData = await response.json();

if (!response.ok) {  
  throw new Error('Failed to fetch repository data');  
}  

const repoInfo = {  
  stars: repoData.stargazers_count,  
  forks: repoData.forks_count,  
  lastUpdate: repoData.updated_at,  
  owner: repoData.owner.login,  
  createdAt: repoData.created_at,  
  htmlUrl: repoData.html_url  
};  

const createdDate = new Date(repoInfo.createdAt).toLocaleDateString('en-GB');  
const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString('en-GB');  

const replyText = `╭───(    TOXIC-MD    )───
├───≫ Repository ≪───
├ 
├ Link:
├ https://github.com/xhclintohn/Toxic-MD
├ 
├ Stars : ${repoInfo.stars}
├ Forks : ${repoInfo.forks}
├ Created : ${createdDate}
├ Last Update : ${lastUpdateDate}
├ Owner : ${repoInfo.owner}
╰──────────────────☉
> xD`;

await client.sendMessage(m.chat, {  
  text: replyText,  
  footer: '',  
  buttons: [  
    { buttonId: `${prefix}dev`, buttonText: { displayText: `${toFancyFont('DEVELOPER')}` }, type: 1 }  
  ],  
  headerType: 1,  
  viewOnce: true,  
  contextInfo: {  
    externalAdReply: {  
      showAdAttribution: false,  
      title: `${botname}`,  
      body: `Don't fuck this up.`,  
      sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,  
      mediaType: 1,  
      renderLargerThumbnail: true  
    }  
  }  
}, { quoted: fq });

} catch (error) {
console.error('Error in repo command:', error);
await client.sendMessage(m.chat, { 
    text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Couldn't fetch repo data\n├ ${error.message}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
}, { quoted: fq });
}
});

// ── settingsmenu
dreaded({
  pattern: "settingsmenu",
  alias: ["setmenu"],
  desc: "Displays only the Settings menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ SETTINGS MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Settings').filter(file => file.endsWith('/js'));
    for (const file of commandFiles) {
      const commandName = file.replace('/js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;

    await client.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: `Toxic-MD WA bot`,
          body: `©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          thumbnail: pict,
          sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fq });
  });

// ── support
dreaded({
  pattern: "support",
  category: "General",
  filename: __filename
}, async (context) => {
  const { client, m } = context;
  const fq = getFakeQuoted(m);

  const message = `╭───(    TOXIC-MD    )───
├───≫ Sᴜᴘᴘᴏʀᴛ Lɪɴᴋs ≪───
├ 
├ *Owner*
├ https:
├ 
├ *Channel Link*
├ https:
├ 
├ *Group*
├ https:
╰──────────────────☉
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

  try {
    await client.sendMessage(
      m.chat,
      { text: message },
      { quoted: fq }
    );
  } catch (error) {
    console.error("Support command error:", error);
    await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Failed to send support links.\n├ Try again, you impatient fool.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }
});

// ── technews
dreaded({
  pattern: "technews",
  alias: ["techupdates","latestnews"],
  desc: "Get latest tech news headlines",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get('https://techcrunch.com/wp-json/wp/v2/posts?per_page=5&_fields=title,link,date', { timeout: 10000 });
            const articles = res.data || [];
            if (!articles.length) throw new Error('No articles');
            const headlines = articles.map((a, i) =>
                `├ [${i+1}] ${(a.title?.rendered||'').replace(/&amp;/g,'&').replace(/&#8217;/g,"'").replace(/&#8216;/g,"'")}\n├     🔗 ${a.link||''}`
            ).join('\n├\n');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴄʜ Nᴇᴡs ≪───\n├\n${headlines}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴄʜ Nᴇᴡs ≪───\n├\n├ Tech world went offline. How ironic.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });

// ── tempinbox
dreaded({
  pattern: "tempinbox",
  alias: ["checkinbox","tempmailinbox","tempcheck"],
  desc: "Check your temporary email inbox",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        const args = m.body?.split(" ") || [];
        const sessionId = args[1];

        if (!sessionId) {
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴍᴘ Iɴʙᴏx ≪───\n├ \n├ Yo, where's the session ID?\n├ You created the temp mail, right?\n├ Usage: ${prefix}tempinbox YOUR_SESSION_ID\n├ Example: ${prefix}tempinbox U2Vzc2lvbjoc5LI1OhFHh4tv21skV965\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const response = await axios.get(`https://api.nekolabs.web.id/tools/tempmail/v3/inbox?id=${sessionId}`, {
                timeout: 30000
            });

            if (!response.data.success) {
                throw new Error('Invalid session ID or inbox expired');
            }

            const { totalEmails, emails } = response.data.result;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            if (totalEmails === 0) {
                return client.sendMessage(m.chat, {
                    text: `╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴍᴘ Iɴʙᴏx ≪───\n├ \n├ Inbox is empty, genius.\n├ No emails yet.\n├ Use your temp email somewhere\n├ and check back.\n├ Total Emails: 0\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                }, { quoted: fq });
            }

            let inboxText = `╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴍᴘ Iɴʙᴏx ≪───\n├ \n├ Inbox: ${totalEmails} email${totalEmails > 1 ? 's' : ''} found\n`;

            emails.forEach((email, index) => {
                inboxText += `├ \n├ Email ${index + 1}:\n├ From: ${email.from || 'Unknown'}\n├ Subject: ${email.subject || 'No Subject'}\n`;
                
                if (email.text && email.text.trim()) {
                    const cleanText = email.text.replace(/\r\n/g, '\n').trim();
                    inboxText += `├ Content: ${cleanText.substring(0, 50)}${cleanText.length > 50 ? '...' : ''}\n`;
                }
                
                if (email.downloadUrl) {
                    inboxText += `├ Attachment URL available\n`;
                }
            });

            inboxText += `╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

            if (inboxText.length > 4000) {
                const firstPart = inboxText.substring(0, 4000);
                const secondPart = inboxText.substring(4000);

                await client.sendMessage(m.chat, { text: firstPart }, { quoted: fq });
                await client.sendMessage(m.chat, { text: secondPart });
            } else {
                await client.sendMessage(m.chat, { text: inboxText }, { quoted: fq });
            }

        } catch (error) {
            console.error('TempInbox error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = `Failed to check inbox, your session ID is probably trash. `;
            if (error.message.includes('Invalid session') || error.message.includes('404') || error.message.includes('Not Found')) {
                errorMessage += "Session expired or invalid. Create a new email.";
            } else if (error.message.includes('timeout')) {
                errorMessage += "API timeout. Try again.";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Network issue. Check your connection.";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── tempmail
dreaded({
  pattern: "tempmail",
  alias: ["tempemail","tempinbox","tempmailcreate"],
  desc: "Create temporary email for disposable inbox",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const response = await axios.get('https://api.nekolabs.web.id/tools/tempmail/v3/create', {
                timeout: 30000
            });

            if (!response.data.success || !response.data.result) {
                throw new Error('Failed to create temporary email');
            }

            const { email, sessionId, expiresAt } = response.data.result;
            const expires = new Date(expiresAt).toLocaleString();

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    interactiveMessage: {
                        header: `╭───(    TOXIC-MD    )───\n├───≫ Tᴇᴍᴘ Mᴀɪʟ ≪───\n├ \n├ TEMPORARY EMAIL CREATED!\n├ \n├ YOUR EMAIL:\n├ ${email}\n├ \n├ SESSION ID:\n├ ${sessionId}\n├ \n├ EXPIRES: ${expires}\n├ \n├ HOW TO CHECK INBOX:\n├ ${prefix}tempinbox ${sessionId}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy Session ID",
                                    id: "copy_session",
                                    copy_code: sessionId
                                })
                            },
                            {
                                name: "cta_copy", 
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📧 Copy Email",
                                    id: "copy_email",
                                    copy_code: email
                                })
                            }
                        ]
                    }
                },
                { quoted: fq }
            );

        } catch (error) {
            console.error('TempMail error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = `Failed to create temporary email, you impatient creature. `;
            if (error.message.includes('timeout')) {
                errorMessage += "API took too long, try again later.";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Check your internet connection, dummy.";
            } else if (error.message.includes('Failed to create')) {
                errorMessage += "Email service is down, try later.";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── tesq
dreaded({
  pattern: "tesq",
  desc: "Send a fake Meta AI styled message with code block",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text, sendJson } = context;
        const fq = getFakeQuoted(m);
        const msgText = text || 'HACKED BY TOXIC-MD 💀';
        const intro = `*TOXIC-MD AI*\nHere's what I found:\n\n`;
        const unifiedData = Buffer.from(JSON.stringify({
            response_id: randomUUID(),
            sections: [
                {
                    view_model: {
                        primitive: {
                            text: intro,
                            __typename: 'GenAIMarkdownTextUXPrimitive'
                        },
                        __typename: 'GenAISingleLayoutViewModel'
                    }
                },
                {
                    view_model: {
                        primitive: {
                            language: 'javascript',
                            code_blocks: [
                                { content: 'console.log(', type: 'DEFAULT' },
                                { content: `"${msgText}"`, type: 'STR' },
                                { content: ');', type: 'DEFAULT' }
                            ],
                            __typename: 'GenAICodeUXPrimitive'
                        },
                        __typename: 'GenAISingleLayoutViewModel'
                    }
                }
            ]
        })).toString('base64');

        const msgContent = {
            messageContextInfo: {
                botMetadata: {
                    modelMetadata: {},
                    progressIndicatorMetadata: {},
                    imagineMetadata: {},
                    memoryMetadata: {},
                    richResponseSourcesMetadata: {},
                    botAgeCollectionMetadata: {},
                    unifiedResponseMutation: {}
                }
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 'AI_RICH_RESPONSE_TYPE_STANDARD',
                        submessages: [
                            {
                                messageType: 'AI_RICH_RESPONSE_TEXT',
                                messageText: intro
                            },
                            {
                                messageType: 'AI_RICH_RESPONSE_CODE',
                                codeMetadata: {
                                    codeLanguage: 'javascript',
                                    codeBlocks: [
                                        { highlightType: 'AI_RICH_RESPONSE_CODE_HIGHLIGHT_DEFAULT', codeContent: 'console.log(' },
                                        { highlightType: 'AI_RICH_RESPONSE_CODE_HIGHLIGHT_STRING', codeContent: `"${msgText}"` },
                                        { highlightType: 'AI_RICH_RESPONSE_CODE_HIGHLIGHT_DEFAULT', codeContent: ');' }
                                    ]
                                }
                            }
                        ],
                        unifiedResponse: { data: unifiedData },
                        contextInfo: {
                            forwardingScore: 743,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
                            pairedMediaType: 'NOT_PAIRED_MEDIA',
                            forwardOrigin: 'META_AI',
                            botMessageSharingInfo: {
                                botEntryPointOrigin: 'FAVICON',
                                forwardScore: 743
                            }
                        }
                    }
                }
            }
        };

        try {
            await sendJson(client, m.chat, msgContent, { quoted: fq });
        } catch (err) {
            console.error('tesq error:', err?.message);
            await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ TOXIC AI ≪───\n├ \n├ ${msgText}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });

// ── test
dreaded({
  pattern: "test",
  alias: ["tst","testcmd"],
  desc: "Sends a test voice note to check if you\\",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, botname, text } = context;
    const fq = getFakeQuoted(m);

    if (text) {
      return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Yo, @${m.sender.split('@')[0].split(':')[0]}, what's this extra\n├ garbage? Just say .test, you clown.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq, mentions: [m.sender] });
    }

    try {
      const possibleAudioPaths = [
        path.join(__dirname, 'xh_clinton', 'test.mp3'),
        path.join(process.cwd(), 'xh_clinton', 'test.mp3'),
        path.join(__dirname, '..', 'xh_clinton', 'test.mp3'),
      ];

      let audioPath = null;
      for (const possiblePath of possibleAudioPaths) {
        if (fs.existsSync(possiblePath)) {
          audioPath = possiblePath;
          break;
        }
      }

      if (audioPath) {
        console.log(`✅ Found audio file at: ${audioPath}`);
        await client.sendMessage(m.chat, {
          audio: { url: audioPath },
          ptt: true,
          mimetype: 'audio/mpeg',
          fileName: 'test.mp3'
        }, { quoted: fq });
      } else {
        console.error('❌ Audio file not found at any of the following paths:', possibleAudioPaths);
        await client.sendMessage(m.chat, {
          text: `╭───(    TOXIC-MD    )───\n├───≫ Fᴀɪʟᴇᴅ ≪───\n├ \n├ Shit, couldn't find test.mp3 in\n├ xh_clinton/. Fix your files, you slacker.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
        }, { quoted: fq });
      }
    } catch (error) {
      console.error('Error in test command:', error);
      await client.sendMessage(m.chat, {
        text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Yo, something fucked up the test\n├ audio. Try again later, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
      }, { quoted: fq });
    }
  });

// ── translate
dreaded({
  pattern: "translate",
  alias: ["tr","trans"],
  desc: "Translates text to different languages",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);

        const fullText = m.body.replace(new RegExp(`^[^a-zA-Z]*(translate|tr|trans)\\s*`, 'i'), '').trim();

        if (!fullText && !m.quoted?.text) {
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Tʀᴀɴsʟᴀᴛᴇ ≪───\n├ \n├ Usage:\n├ ${prefix}tr ja Hello\n├ ${prefix}tr es How are you?\n├ Or reply to msg: ${prefix}tr en\n├ \n├ Codes: ja es fr de zh ar hi sw ko ru\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }

        let lang, text;

        if (m.quoted?.text) {
            lang = fullText || 'en';
            text = m.quoted.text;
        } else {
            const parts = fullText.split(' ');
            if (parts.length >= 2 && parts[0].length <= 3 && /^[a-z]{2,3}$/.test(parts[0])) {
                lang = parts[0];
                text = parts.slice(1).join(' ');
            } else {
                lang = 'en';
                text = fullText;
            }
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const result = await translate(text, { to: lang });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Tʀᴀɴsʟᴀᴛɪᴏɴ ≪───\n├ \n├ ${result.text}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            let errorMessage = 'Translation failed. Try again.';
            if (error.message && error.message.includes('Invalid target language')) {
                errorMessage = `Invalid language code "${lang}". Use: ja, es, fr, de, zh, ar, hi, ko, ru, etc.`;
            }
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ ${errorMessage}\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        }
    });

// ── uptime
dreaded({
  pattern: "uptime",
  category: "General",
  filename: __filename
}, async (context) => {
  const { client, m, text, botname } = context;
  const fq = getFakeQuoted(m);

  if (text) {
    return client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ What's with the extra crap, @${m.sender.split('@')[0].split(':')[0]}?\n├ Just say !uptime, dumbass.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq, mentions: [m.sender] });
  }

  try {
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      const daysDisplay = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '';
      const hoursDisplay = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : '';
      const minutesDisplay = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '';
      const secsDisplay = secs > 0 ? `${secs} ${secs === 1 ? 'second' : 'seconds'}` : '';

      return (daysDisplay + hoursDisplay + minutesDisplay + secsDisplay).replace(/,\s*$/, '');
    };

    const uptimeText = formatUptime(process.uptime());
    const replyText = `╭───(    TOXIC-MD    )───\n├───≫ Uᴘᴛɪᴍᴇ ≪───\n├ \n├ *${botname} Uptime, Bitches*\n├ \n├ I've been awake for *${uptimeText}*,\n├ running shit like a boss.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

    await client.sendMessage(m.chat, { text: replyText }, { quoted: fq });
  } catch (error) {
    console.error('Error in uptime command:', error);
    await client.sendMessage(m.chat, { text: `╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Something's fucked up with the\n├ uptime check. Try again later, loser.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧` }, { quoted: fq });
  }
});

// ── utilsmenu
dreaded({
  pattern: "utilsmenu",
  alias: ["utils"],
  desc: "Displays only the Utils menu",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, pict } = context;
    const fq = getFakeQuoted(m);
    const botname = '𝐓𝐨𝐱𝐢𝐜-𝐌𝐃';

    const settings = await getSettings();
    const effectivePrefix = settings.prefix || '';

    const toFancyFont = (text, isUpperCase = false) => {
      const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
      };
      return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
    };

    let menuText = `╭───(    TOXIC-MD    )───\n├───≫ UTILS MENU ≪───\n├ \n├ Prefix: ${effectivePrefix || 'None'}\n├ \n`;

    let commandFiles = fs.readdirSync('./plugins/Utils').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandName = file.replace('.js', '');
      const fancyCommandName = toFancyFont(commandName);
      menuText += `├ *${fancyCommandName}*\n`;
    }

    menuText += `╰──────────────────☉\n`;
    menuText += `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await client.sendMessage(m.chat, { text: menuText }, { quoted: fq });
  });

// ── vcf
dreaded({
  pattern: "vcf",
  category: "General",
  filename: __filename
}, async (context) => {
    const { client, m, participants } = context;
    const fq = getFakeQuoted(m);

    if (!m.isGroup) {
        return m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Command meant for groups.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }

    try {
        const gcdata = await client.groupMetadata(m.chat);
        const vcard = gcdata.participants
            .map((a, i) => {
                const number = a.id.split('@')[0];
                return `BEGIN:VCARD\nVERSION:3.0\nFN:[${i}] +${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            })
            .join('\n');

        const cont = './contacts.vcf';

        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ VCF ≪───\n├ \n├ A moment, Toxic-MD is compiling\n├ ${gcdata.participants.length} contacts into a VCF...\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        await fs.promises.writeFile(cont, vcard);
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ VCF ≪───\n├ \n├ Import this VCF in a separate\n├ email account to avoid messing\n├ with your contacts...\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);

        await client.sendMessage(
            m.chat,
            {
                document: fs.readFileSync(cont),
                mimetype: 'text/vcard',
                fileName: 'Group contacts.vcf',
                caption: `╭───(    TOXIC-MD    )───\n├───≫ VCF ≪───\n├ \n├ VCF for ${gcdata.subject}\n├ ${gcdata.participants.length} contacts\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            },
            { ephemeralExpiration: 86400, quoted: fq }
        );

        await fs.promises.unlink(cont);
    } catch (error) {
        console.error(`VCF error: ${error.message}`);
        await m.reply(`╭───(    TOXIC-MD    )───\n├───≫ Eʀʀᴏʀ ≪───\n├ \n├ Failed to generate VCF.\n├ Try again later.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
});

// ── weather
dreaded({
  pattern: "weather",
  alias: ["wthr","forecast","temp"],
  desc: "Get current weather for any city",
  category: "General",
  filename: __filename
}, async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const city = (text || '').trim();
        if (!city) {
            return client.sendMessage(m.chat, {
                text: '╭───(    TOXIC-MD    )───\n├───≫ Wᴇᴀᴛʜᴇʀ ≪───\n├\n├ Give me a city name, genius.\n├ Usage: .weather Nairobi\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const w = res.data.current_condition?.[0];
            const area = res.data.nearest_area?.[0];
            if (!w) throw new Error('No data');
            const areaName = area?.areaName?.[0]?.value || city;
            const country = area?.country?.[0]?.value || '';
            const desc = w.weatherDesc?.[0]?.value || '';
            const tempC = w.temp_C || '?';
            const feelsC = w.FeelsLikeC || '?';
            const humidity = w.humidity || '?';
            const wind = w.windspeedKmph || '?';
            const visibility = w.visibility || '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            return client.sendMessage(m.chat, {
                text: `╭───(    TOXIC-MD    )───\n├───≫ Wᴇᴀᴛʜᴇʀ ≪───\n├\n├ 📍 ${areaName}, ${country}\n├ ☁️ ${desc}\n├ 🌡️ Temp: ${tempC}°C (Feels ${feelsC}°C)\n├ 💧 Humidity: ${humidity}%\n├ 💨 Wind: ${wind} km/h\n├ 👁️ Visibility: ${visibility} km\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: fq });
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return client.sendMessage(m.chat, { text: '╭───(    TOXIC-MD    )───\n├───≫ Wᴇᴀᴛʜᴇʀ ≪───\n├\n├ Weather API is throwing a tantrum. Try again.\n╰──────────────────☉\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧' }, { quoted: fq });
        }
    });
  