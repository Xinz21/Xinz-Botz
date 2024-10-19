// GANTI SAMA KEY LU
import fetch from 'node-fetch'

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `• *Example :* [${usedPrefix + command} Yuki suou]`, m)
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  m.reply(`_Wait Searching For *[${text}]*_`)
  try {
  var xinz = await fetch(`https://api.lolhuman.xyz/api/pixiv?apikey=${xinz}&query=${text}`)
  var res = await xinz.json()
  var name = m.sender
  conn.sendFile(m.chat, res.result[0].image, '', `_Hasil Dari *[${text}]*_`, m)
  } catch (e) {
    console.log(e);
    m.reply(`Failed to search ${text}`);
  }
}

handler.help = ['pixiv'].map(v => v + ' *<teks>*')
handler.command = /^(pixiv)$/i  
handler.tags = ['internet']
handler.limit = true
export default handler
