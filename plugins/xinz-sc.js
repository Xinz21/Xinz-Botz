import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import canvafy from "canvafy";
import { promises, readFileSync } from 'fs'
import fs from 'fs'
import jimp from 'jimp';
import { join } from 'path'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let handler  = async (m, { conn, isOwner}) => {
   let user = global.db.data.users[m.sender]    
   let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let username = conn.getName(who)
    var now = new Date() * 1
 let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');
let p = fs.readFileSync('./img/images (8).jpg');
  /*let p = await new canvafy.Security()
 .setAvatar(pp)
 .setBackground("color", "#FF0033")
 .setLocale("id")
 .setOverlayOpacity(1.0)
 .setAvatarBorder("#fff")
 .setCreatedTimestamp(Date.now())
 .setSuspectTimestamp(1)
 .build();
*/
 const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default
    let media = await prepareWAMessageMedia({
                image: p
              }, {
             upload: conn.waUploadToServer
            })
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
\`<🏷️Script Bot *${global.namebot}*>\`

 *乂 B O T - S C R I P T* 

 ┌=>
 │  ◦ Sc: xira-botz.zip
 │  ◦ Name: *Xira - Botz*
 │  ◦ Size: *5,23 MB*
 │  ◦ Type: *Plug Module*
 │  ◦  Creator: *@6288802101736*
 └-=>

> \`Private\`


\`Sc Lainnya\`
>
*-Sc Huohuo-MD*
> Private
*-Sc Xinz-Botz*
Link: https://github.com/Xinz21/Xinz-Botz
*-Sc Momoi-MD*
> Private
*-Sc Yura-MD*
> Private
> 

\`Panel\`
-----------------------
*-Panel 1gb*
*-Panel 2gb*
*-Panel Unli*
-----------------------
`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: global.wm,
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: namebot,
            hasMediaAttachment: true,
            ...media,
          }),
contextInfo: { 
          	      mentionedJid: ['6288802101736@s.whatsapp.net'],
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363240926353589@newsletter',
			newsletterName: 'My Community Channel', 
			serverMessageId: -1
		}
          }, 
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                 "name": "cta_url",
                 "buttonParamsJson": "{\"display_text\":\"Hubungi Owner\",\"url\":\"https://wa.link/mp3ala\",\"merchant_url\":\"https://wa.link/mp3ala\"}"
              },
{                   "name": "cta_url",
                 "buttonParamsJson": "{\"display_text\":\"Support Me\",\"url\":\"https://saweria.co/xianzuki\",\"merchant_url\":\"https://saweria.co/xianzuki\"}"
              }
/*{
                "name": "single_select",
                "buttonParamsJson": "{\"title\":\"Sewa/Premium/Jadibot \",\"sections\":[{\"Sewa/Premium/Jadibot\":\"title\",\"highlight_label\":\"kilik\",\"rows\":[{\"\":\".owner\",\"title\":\"Jangan Lupa Kirim Ss Bukti Transfer Ke Owner\",\"description\":\"> https://wa.link/mp3ala\",\"id\":\".owner\"}]}]}"
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
handler.customPrefix = /^(sc|SC|.SC|.sc)$/i;
handler.command = new RegExp();
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
