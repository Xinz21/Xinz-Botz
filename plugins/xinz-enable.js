/*
▶︎ ━━━━━━━•──────────── 
      ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻
*/
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import jimp from 'jimp'
import fs from 'fs'
import fetch from 'node-fetch'
var handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  let res = `Kok Belum Tidur Kak? 🥱 ${conn.getName(m.sender)}`
  if (time >= 4) {
    res = `Pagi ${conn.getName(m.sender)}`
  }
  if (time >= 10) {
    res = `Siang ${conn.getName(m.sender)}`
  }
  if (time >= 15) {
    res = `Sore ${conn.getName(m.sender)}`
  }
  if (time >= 18) {
    res = `Malam ${conn.getName(m.sender)}`
  }
  return res
} 
const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "./src/avatar_contact.png")

  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = (args[0] || '').toLowerCase();
  let isAll = false, isUser = false;
let fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` }: {} )}, message: { 'contactMessage': { 'displayName': m.name, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.name},;;;\nFN:${m.name},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp, thumbnail: pp, sendEphemeral: true }}}
  
  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          return await conn.reply(m.chat, 'Only owner can use this command in private chat!', m);
        }
      } else if (!isOwner) {
        return await conn.reply(m.chat, 'Only owner can use this command in group chat!', m);
      }
      chat.welcome = isEnable;
      break;
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          return await conn.reply(m.chat, 'Only owner can use this command in private chat!', m);
        }
      } else if (!isAdmin) {
        return await conn.reply(m.chat, 'Only admin can use this command in group chat!', m);
      }
      chat.detect = isEnable;
      break;
    case 'viewonce':
    case 'antiviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.viewonce = isEnable;
      break;
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.delete = isEnable;
      break;
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.delete = !isEnable;
      break;
    case 'document':
      chat.useDocument = isEnable;
      break;
    case 'self':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['self'] = isEnable;
      break;
    case 'public':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['self'] = !isEnable;
      break;
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.antiLink = isEnable;
      break;
    case 'autoSticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.autoSticker = isEnable;
      break;
    case 'autoupnime':
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      chat.updateAnime = isEnable;
      break;
    case 'simi':
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      chat.simi = isEnable;
      break;
      case 'simi2':
        if (!isROwner) {
          global.dfail('rowner', m, conn)
          throw false
        }
      chat.simiC = isEnable
      break
      case 'simivoice':
        if (!isROwner) {
          global.dfail('rowner', m, conn)
          throw false
        }
      chat.simivoice = isEnable
      break
    case 'antispam':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.antiSpam = isEnable;
      break;
    case 'anticall':
      isAll = true;
      if (!isOwner) {
        return await conn.reply(m.chat, 'Only owner can use this command!', m);
      }
      chat.anticall = isEnable;
      break;
    case 'nsfw':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          return await conn.reply(m.chat, 'Only admin or owner can use this command in group chat!', m);
        }
      }
      chat.nsfw = isEnable;
      break;
    case 'premnsfwchat':
      if (m.isGroup) {
        if (!isROwner) {
          return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
        }
      }
      chat.premnsfw = isEnable;
      break;
    case 'autolevelup':
      isUser = true;
      user.autolevelup = isEnable;
      break;
    case 'restrict':
      isAll = true;
      if (!isOwner) {
        return await conn.reply(m.chat, 'Only owner can use this command!', m);
      }
      bot.restrict = isEnable;
      break;
    case 'nyimak':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['nyimak'] = isEnable;
      break;
    case 'autoread':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['autoread'] = isEnable;
      break;
      case 'antirasis':
      isAll = true;
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
         throw false 
      }
      global.opts['antirasis'] = isEnable;
      break;
case 'antisticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker = isEnable
break
   case 'antifoto':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiFoto = isEnable
      break
      case 'antivideo':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiVideo = isEnable
      break
      case 'antisticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker2 = isEnable
      break
      case 'antisticker2':
      if (m.isGroup) {
        if (!(isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker2 = isEnable
break
      case 'antibot':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break
case 'toxic':
       if (m.isGroup) {
         if (!(isAdmin || isOwner)) {
           global.dfail('admin', m, conn)
           throw false
         }
       }
       chat.antiToxic = !isEnable
       break
     case 'antitoxic':
       if (m.isGroup) {
         if (!(isAdmin || isOwner)) {
           global.dfail('admin', m, conn)
           throw false
         }
       }
       chat.antiToxic = isEnable
       break
    case 'pconly':
    case 'privateonly':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['pconly'] = isEnable;
      break;
case 'autoai':
        if (!isROwner) {
          global.dfail('rowner', m, conn)
          throw false
        }
      chat.autoAi = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true;
      if (!isROwner) {
        return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
      global.opts['gconly'] = isEnable;
      break;
    case 'swonly':
    case 'statusonly':
      isAll = true; 
      if (!isROwner) {
return await conn.reply(m.chat, 'Only regular owner can use this command!', m);
      }
global.opts['swonly'] = isEnable;
      break;
    default:
      if (!/[01]/.test(command)) return conn.sendMessage(m.chat, {
document: fs.readFileSync("./package.json"),
                  jpegThumbnail: await reSize("https://telegra.ph/file/1f16448aace2a78ccffd8.jpg", 320, 180),
                  fileName: "Enable",
                  fileLength: 99999999999999,
                  pageCount: "2024",
                  mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    caption: `ʟɪsᴛ ᴏᴘᴛɪᴏɴs :\n | ⩽⩾ ᴡᴇʟᴄᴏᴍᴇ\n | ⩽⩾ ᴅᴇʟᴇᴛᴇ\n | ⩽⩾ ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ\n | ⩽⩾ sᴇʟғ\n | ⩽⩾ ᴘᴜʙʟɪᴄ\n | ⩽⩾ sɪᴍɪ\n | ⩽⩾ sɪᴍɪ2\n | ⩽⩾ sɪᴍɪ-ᴀɪ\n | ⩽⩾ ɴsғᴡ\n | ᴘʀᴇᴍɴsғᴡᴄʜᴀᴛ\n | ⩽⩾ ᴀɴᴛɪʟɪɴᴋ\n | ⩽⩾ ᴀɴᴛɪᴄᴀʟʟ\n | ⩽⩾ ᴀɴᴛɪʀᴀꜱɪꜱ\n | ⩽⩾ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ\n | ⩽⩾ ᴀɴᴛɪsᴘᴀᴍ\n | ⩽⩾ ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ\n | ⩽⩾ ᴀᴜᴛᴏʟᴇᴠᴇʟᴜᴘ\n | ⩽⩾ ᴅᴇᴛᴇᴄᴛ\n | ⩽⩾ ʀᴇsᴛʀɪᴄᴛ\n | ⩽⩾ ɴʏɪᴍᴀᴋ\n | ⩽⩾ ᴀᴜᴛᴏʀᴇᴀᴅ\n | ⩽⩾ ᴀɴᴛɪsᴛɪᴄᴋᴇʀ\n |  ⩽⩾ ᴀɴᴛɪsᴛɪᴄᴋᴇʀ2\n | ⩽⩾  ᴀɴᴛɪғᴏᴛᴏ\n | ⩽⩾ antivideo\n | ⩽⩾ ᴀɴᴛɪʙᴏᴛ\n | ⩽⩾ ᴀɴᴛɪᴛᴏxɪᴄ\n | ⩽⩾ ᴘᴄᴏɴʟʏ\n | ⩽⩾ ɢᴄᴏɴʟʏ\n | ⩽⩾ sᴡᴏɴʟʏ\n | ⩽⩾ ᴀɴɪᴍᴇᴜᴘᴅᴀᴛᴇ\n | ⩽⩾  ᴀᴜᴛᴏᴀɪ\n

 *Example*
 
 ON: on welcome ❫

 OFF: off welcome ❫

> Pastikan Huruf kecil semua!!‼️`,
    contextInfo: {
        externalAdReply: {
            containsAutoReply: true,
            mediaType: 1,
            mediaUrl: '',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: '',
            thumbnailUrl: imgbot,
            title: `PASTI KAN HURUF KECIL + NO SPASI`,
            body: global.namaown,
        },
        forwardingScore: 9999,
        isForwarded: true,
        mentionedJid: [m.sender],
        businessMessageForwardInfo: {
            businessOwnerJid: conn.user.jid
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid:
"120363240926353589@newsletter",
            serverMessageId: null, 
            newsletterName: global.namebot
            }
    }
}, { quoted: { key: { participant: '0@s.whatsapp.net', remoteJid: "0@s.whatsapp.net" }, message: { conversation: global.namebot}}});
   }
let cap = `*[ ᴏᴘᴛɪᴏɴs ]*\n *ᴛʏᴘᴇ:* ${type}\n📃  sᴛᴀᴛᴜs: sᴜᴄᴄᴇss\n ᴏᴘᴛɪᴏɴs: ${isEnable ? 'Enable ✅' : 'Disable❌'}\n👥 ғᴏʀ: ${isAll ? 'ᴛʜɪs ʙᴏᴛ' : isUser ? '' : 'ᴛʜɪs ᴄʜᴀᴛs'}
`
conn.sendMessage(m.chat, {
document: fs.readFileSync("./package.json"),
            //      jpegThumbnail: await reSize("https://telegra.ph/file/1f16448aace2a78ccffd8.jpg", 320, 180),
                  fileName: namebot,
                  fileLength: 99999999999999,
                  pageCount: "2024",
                  mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      caption: cap,
    contextInfo: {
        externalAdReply: {
            containsAutoReply: true,
            mediaType: 1,
            mediaUrl: '',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: '',
            thumbnailUrl: imgbot,
            title: `乂: ${conn.getName(m.sender)} ${isEnable ? 'mengaktifkan' : 'Menonaktifkan'} ${type}`,
            body: `SUCCES`,
        },
        forwardingScore: 9999,
        isForwarded: true,
        mentionedJid: [m.sender],
        businessMessageForwardInfo: {
            businessOwnerJid: conn.user.jid
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid:
"120363240926353589@newsletter",
            serverMessageId: null,
            newsletterName: global.namebot
}}}, { quoted: fkontak})
}
handler.help = ['enable', 'disable'].map(v => v + 'able <option>');
handler.tags = ['group', 'owner'];
handler.command = /^(en|(en|dis)able|(tru|fals)e|(turn)?o(n|ff))$/i;

export default handler;

//Function
async function reSize(url, width, height, referer = null) {
    try {
        const fetchOptions = {
            redirect: 'follow',
            headers: {},
        };

        if (referer) {
            fetchOptions.headers['Referer'] = referer;
        }

        const response = await fetch(url, fetchOptions);

        if (response.ok) {
            const finalUrl = response.url;
            const arrayBuffer = await response.arrayBuffer();
            return await jimp.read(Buffer.from(arrayBuffer)).then(image => image.resize(width, height).getBufferAsync(jimp.MIME_JPEG));
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error.message);

        try {
            const undiciFetchOptions = {
                redirect: 'follow',
                headers: {},
            };

            if (referer) {
                undiciFetchOptions.headers['Referer'] = referer;
            }

            const arrayBuffer = await undiciFetch(url, undiciFetchOptions).then(response => response.arrayBuffer());
            return await jimp.read(Buffer.from(arrayBuffer)).then(image => image.resize(width, height).getBufferAsync(jimp.MIME_JPEG));
        } catch (retryError) {
            console.error('Retry Error:', retryError.message);
            return Buffer.from([]);
        }
    }
}
