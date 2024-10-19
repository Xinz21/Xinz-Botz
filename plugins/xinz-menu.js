import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises, readFileSync } from 'fs'
import fs from 'fs'
import jimp from 'jimp';
import { join } from 'path'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let handler  = async (m, { conn, isOwner}) => {
   let user = global.db.data.users[m.sender]    
   let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
   let { premium, owner, level, limit, exp, lastclaim, registered, regTime, age, pasangan, skill, name } = global.db.data.users[m.sender]
    let username = conn.getName(who)
    var now = new Date() * 1
    let ppnya = await conn.profilePictureUrl(m.sender, "image").catch(() => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')
 const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default
let msgs = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `

\`Y O U R  S T A T U S\`

> - *Nama:*  @${who.replace(/@.+/, '')}
> - *Nomor:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
> - *Premium:* ${premium ? "Aktif" :"Tidak"}
> - *Limit:* ${user.limit}
> - *Money:* ${user.money}
> - *Role:* ${user.role}
> - *Level:* ${user.level}
> - *Xp:* ${user.exp}
> -  *Register:* ${registered ? 'Terdaftar': 'Tidak'}.
> - *Owner:* ${isOwner ? "Ya" :"Tidak"}
 
\`B O T  S T A T U S\`
> - *Name Bot:* *${global.yanto}*
> - *Baileys:* *whiskeysockets/6.6.0*
> - *Baileys Bawaan:* *adiwajshing*
> - *Version:* *2.2*


_JANGAN LUPA *DAFTAR* AGAR BOT DAPAT MENGINGAT ANDA SELALU ୧⍤⃝_
`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "",
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: namebot,
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: "https://telegra.ph/file/9c4a3d6027736dd38f6b4.jpg" }}, { upload: conn.waUploadToServer }))
          }),
contextInfo: { 
          	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363240926353589@newsletter',
			newsletterName: 'My Community Channel', 
			serverMessageId: -1
		}
          }, 
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
{                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"All Menu\",\"id\":\".id\"}"
              },
              {
                 "name": "cta_url",
                 "buttonParamsJson": "{\"display_text\":\"Owner\",\"url\":\"https://wa.me/6281319810300?text=bang+mau+sewa+bot+dong\",\"merchant_url\":\"https://wa.me/6281319810300?text=bang+mau+sewa+bot+dong\"}"
              },
/*{
                "name": "single_select",
                "buttonParamsJson": "{\"title\":\"Sewa/Premium/Jadibot \",\"sections\":[{\"Sewa/Premium/Jadibot\":\"title\",\"highlight_label\":\"kilik\",\"rows\":[{\"\":\".owner\",\"title\":\"Jangan Lupa Kirim Ss Bukti Transfer Ke Owner\",\"description\":\"> https://saweria.co/Xianzuki\",\"id\":\".owner\"}]}]}"
              },*/
           ],
          })
        })
    }
  }
}, {})

return await conn.relayMessage(m.key.remoteJid, msgs.message, {
  messageId: m.key.id
})
}
handler.command = /^(menu)$/i;

export default handler

    function timeConvertA(input) {
    var now = new Date().getTime();
    var timeleft = input - now;

    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    return {day: days, hour: hours, minute: minutes, second: seconds}
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari\n" + hours + " Jam\n" + minutes + " Menit";
    // +minutes+":"+sec;
}
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
const Styles = (text, style = 1) => {
            var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
            var yStr = Object.freeze({
     1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
     // 1: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇1234567890'
            });
            var replacer = [];
            xStr.map((v, i) => replacer.push({
              original: v,
              convert: yStr[style].split('')[i]
            }));
            var str = text.toLowerCase().split('');
            var output = [];
            str.map(v => {
              const find = replacer.find(x => x.original == v);
              find ? output.push(find.convert) : output.push(v);
            });
           return output.join('');
         };
