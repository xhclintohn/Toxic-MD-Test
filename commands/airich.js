import { randomUUID } from 'crypto';

export default {
  name: 'airich',
  aliases: ['fai1', 'rich'],
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    
    const buuAiCodeCrackedResponseId = randomUUID();
    const buuAiCodeCrackedTxt = "🫟HACKED BY TOXIC-MD🍯";
    const buuAiCodeCrackedIntro = "I LOVE MY PUNISHER…\nTOXIC-MD CLIENT:";
    
    const buuAiCodeCrackedData = Buffer.from(JSON.stringify({ 
      "response_id": buuAiCodeCrackedResponseId, 
      "sections": [
        { 
          "view_model": { 
            "primitive": { 
              "text": buuAiCodeCrackedIntro, 
              "__typename": "GenAIMarkdownTextUXPrimitive" 
            }, 
            "__typename": "GenAISingleLayoutViewModel" 
          }
        }, 
        { 
          "view_model": { 
            "primitive": { 
              "language": "javascript", 
              "code_blocks": [ 
                { "content": "console.log(", "type": "DEFAULT" }, 
                { "content": `\"${buuAiCodeCrackedTxt}\"`, "type": "STR" }, 
                { "content": ");", "type": "DEFAULT" } 
              ], 
              "__typename": "GenAICodeUXPrimitive" 
            }, 
            "__typename": "GenAISingleLayoutViewModel" 
          }
        }
      ]
    })).toString('base64');
    
    const buuAiCodeCrackedJson = { 
      "messageContextInfo": { 
        "botMetadata": { 
          "modelMetadata": {}, 
          "progressIndicatorMetadata": {}, 
          "imagineMetadata": {}, 
          "memoryMetadata": {}, 
          "richResponseSourcesMetadata": {}, 
          "botAgeCollectionMetadata": {}, 
          "unifiedResponseMutation": {}
        }
      }, 
      "botForwardedMessage": { 
        "message": { 
          "richResponseMessage": { 
            "messageType": "AI_RICH_RESPONSE_TYPE_STANDARD", 
            "submessages": [ 
              { 
                "messageType": "AI_RICH_RESPONSE_TEXT", 
                "messageText": buuAiCodeCrackedIntro 
              }, 
              { 
                "messageType": "AI_RICH_RESPONSE_CODE", 
                "codeMetadata": { 
                  "codeLanguage": "javascript", 
                  "codeBlocks": [ 
                    { "highlightType": "AI_RICH_RESPONSE_CODE_HIGHLIGHT_DEFAULT", "codeContent": "console.log(" }, 
                    { "highlightType": "AI_RICH_RESPONSE_CODE_HIGHLIGHT_STRING", "codeContent": `\"${buuAiCodeCrackedTxt}\"` }, 
                    { "highlightType": "AI_RICH_RESPONSE_CODE_HIGHLIGHT_DEFAULT", "codeContent": ");" } 
                  ]
                }
              }
            ], 
            "unifiedResponse": { 
              "data": buuAiCodeCrackedData 
            }, 
            "contextInfo": { 
              "forwardingScore": 743, 
              "isForwarded": true, 
              "forwardedAiBotMessageInfo": { 
                "botJid": "867051314767696@bot" 
              }, 
              "pairedMediaType": "NOT_PAIRED_MEDIA", 
              "forwardOrigin": "META_AI", 
              "botMessageSharingInfo": { 
                "botEntryPointOrigin": "FAVICON", 
                "forwardScore": 743 
              }
            }
          }
        }
      }
    };
    
    await sock.sendMessage(jid, buuAiCodeCrackedJson, { quoted: m });
  }
};