let handler = async (m, { conn, args, command, usedPrefix, text, participants }) => {
var groups = Object.keys(conn.chats)
.filter(key => key.endsWith('@g.us'))
.map(key => conn.chats[key]);

if (args.length === 0) {
var list = groups.map((group, index) => `*${index + 1}.* ${group.subject}`).join('\n');
var teks = '`L I S T - G R O U P - J O I N I N G`\n\n'
conn.reply(m.chat, `${teks}`+`${list}`, m);
} else if (args.length === 1 && /^\d+$/.test(args[0])) {
var index = parseInt(args[0]) - 1;
if (index >= 0 && index < groups.length) {
var group = groups[index];
var capt = `[ *Groups Notifikasi* ]

Hallo Everyone👋🏻,
mohon maaf bot akan keluar dari group ini dikarenakan, bot sedang dalam pembersihan group,
tapi jika anda ingin bot tetap disini silahkan menghubungi nomer di bawah ini *Terimakasih.*`
let kemii = await conn.sendMessage(group.id, { text: capt, mentions: participants.map(a => a.id) }, {quoted:m})
await conn.sendContact(group.id, ([nomorown, 'Owner']), kemii)
await conn.groupLeave(group.id)
await conn.reply(m.chat, done, m)
} else {
conn.reply(m.chat, 'Grup dengan urutan tersebut tidak ditemukan.', m);
}
} else {
conn.reply(m.chat, `• *Example :* .out 1`, m);
}
}
handler.help = ['out']
handler.tags = ['owner']
handler.command = /^(out)$/i

handler.owner = true

export default handler
