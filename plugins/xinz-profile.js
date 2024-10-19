import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import canvafy from "canvafy";
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender]
    
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/f1ed66b7930885e565d2a.jpg')
    let { premium, owner, level, limit, exp, lastclaim, registered, regTime, age, pasangan, skill, name } = global.db.data.users[m.sender]
    let username = conn.getName(who)
    var now = new Date() * 1
        
let fkon = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` }: {} )}, message: { 'contactMessage': { 'displayName': name, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${name},;;;\nFN:${name},\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp, thumbnail: pp, sendEphemeral: true }}}
    let str = `
  €---------<(*Y O U R S T A T U S*)>----------   
  | *📛 Nama:* ${username}
  | *👤 Username:* ${registered ? name : ''}
  | *📌 Title:* ${user.title}
  | *@  Tag:* @${who.replace(/@.+/, '')}
  | *#️⃣ Nomor:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
  | *🔗 Link:* https://wa.me/${who.split`@`[0]}
  | *💹Money:*  ${user.money}
  | *🏦Bank :* ${user.bank} / $.${user.fullatm}
  | *💳𝗔𝘁𝗺:* ${user.atm > 0 ? 'Level ' + user.atm : 'Tidak Punya'}
  | *📊Limit:* ${user.limit}
  | *📗Exp:* ${user.exp}
  |  🪪 *Umur:* ${registered ? age : ''} Tahun
  | *👥 Pasangan:*  ${pasangan ? `@${pasangan.split("@")[0]}` : `Tidak Punya`}
  | ®️ *Register:* ${registered ? 'Terdaftar': 'Tidak'}
  | 🎫 *Premium:* ${premium ? "Aktif" :"Tidak"}
  | 🏷️ *Owner:* ${owner ? "Aktif" :"Tidak"}
--------------------------------------------------------£
`.trim()

let p = await new canvafy.Security()
. setAvatar (pp)
. setBackground ("color","#FF0033")
. setLocale ("id")
. setOverlayOpacity (1.0)
. setAvatarBorder ("#fff")
   .setCreatedTimestamp(Date.now())
        .setSuspectTimestamp(1)
.build()
  conn.sendFile(m.chat, p, '', str, m, null, {
fileLength: '10000',
  contextInfo: {
  mentionedJid: [m.sender],
        forwardingScore: 9999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
       newsletterJid:
"120363240926353589@newsletter",
        newsletterName: namebot,
      },
    externalAdReply: {
      showAdAttribution: true,
      mediaType: 1,
      description: nameown,
      title: `ʜᴀʟʟᴏ ᴋᴀᴋ ${name}`,
      body: namebot,
renderLargerThumbnail: true,
thumbnailUrl: imgbot2,
//      thumbnail: await (await fetch (``)).buffer(),
      sourceUrl: ''
        }}}, { quoted: fkon})
}
handler.help = ['profile']
handler.tags = ['main']
handler.command = /^(pm|profile|profil|me|my)$/i
handler.banned = false
export default handler

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
