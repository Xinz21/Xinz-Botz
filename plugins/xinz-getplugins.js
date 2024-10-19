import { readFileSync } from 'fs'
import fs from 'fs' 

let handler = async (m, { usedPrefix, command, text, conn }) => {
    if (conn.user.jid !== global.conn.user.jid) return
    let ar = Object.keys(plugins)
    let ar1 = ar.map(v => v.replace('.js', ''))
    if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} menu`, m)
    if (!ar1.includes(text)) return conn.reply(m.chat, `'${text}' tidak ditemukan!\n\n${ar1.map(v => ' ' + v).join`\n`}`, m)
    let Xira = readFileSync('./plugins/' + text + '.js', 'utf-8')
    conn.sendMessage(m.chat, {
text: Xira,
contextInfo: {
externalAdReply: {
title: "Get Plugins | Xinz",
thumbnailUrl: imgbot2,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
}
handler.help = ['getplugin'].map(v => v + ' *<teks>*')
handler.tags = ['owner']
handler.command = /^(getplugin|gp)$/i

handler.owner = true

export default handler
