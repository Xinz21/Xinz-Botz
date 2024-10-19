// masalah nya gamau ngetag vangke

let toM = a => '@' + a.split('@')[0]
function handler(m, text, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.id)
let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;
    let a = ps.getRandom()
    let b
    do b = ps.getRandom()
    while (b === a)
    m.reply(`@${who.split(`@`)[a]} ❤️ @${who.split(`@`)[b]}`, null, {
        mentionedJid: [a, b]
    })
}
handler.help = ['jadian']
handler.tags = ['main', 'fun']
handler.command = ['jadian']

handler.group = true

export default handler
