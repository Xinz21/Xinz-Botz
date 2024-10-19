/*
<> *BLACKLIST*<>
Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  "aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/
let handler = async (m, { conn, text, command }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;

    let bl = db.data.chats[m.chat].blacklist || [];
    let peserta = await conn.groupMetadata(m.chat);
if (!m.mentionedJid[0] && !m.quoted) return 
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    switch (command) {
        case 'blacklist':
            if (!who) return conn.reply(m.chat, 'Tag/reply orangnya untuk Blacklist', m);

            try {
                if (Object.values(bl).find(v => v.id == who)) throw `Nomor ${who.split(`@`)[0]} sudah ada di *BlackList*`;

                bl.unshift({ id: who });
                db.data.chats[m.chat].blacklist = bl;
                await conn.reply(m.chat, `Sukses menambahkan @${who.split(`@`)[0]} ke *BlackList*`, m, { contextInfo: { mentionedJid: [who] }});
            } catch (e) {
                throw e;
            }
            break;
        case 'unblacklist':
            if (!who) throw 'Tag/reply orangnya untuk Unblacklist';

            try {
                if (!Object.values(bl).find(v => v.id == who)) throw `Nomor ${who.split(`@`)[0]} tidak ada di *BlackList*`;

                bl.splice(bl.findIndex(v => v.id == who), 1);
                db.data.chats[m.chat].blacklist = bl;
                await conn.reply(m.chat, `Sukses menghapus Nomor: @${who.split(`@`)[0]} dari *BlackList*`, m, { contextInfo: { mentionedJid: [who] }});
            } catch (e) {
                throw e;
            }
            break;
        case 'listblacklist':
        case 'listbl':
            let txt = `*「 Daftar Nomor Blacklist 」*\n\n*Total:* ${bl.length}\n\n┌─[ *BlackList* ]\n`;

            for (let i of bl) {
                txt += `├ @${i.id.split("@")[0]}\n`;
            }
            txt += "└─•";

            return conn.reply(m.chat, txt, m, { contextInfo: { mentionedJid: bl.map(v => v.id) } }, {mentions: bl.map(v => v.id)});
            break;
    }
};

handler.help = ['unblacklist', 'blacklist', 'listblacklist'];
handler.tags = ['group'];
handler.command = ['unblacklist', 'blacklist', 'listbl', 'listblacklist'];
handler.group = true;
handler.owner = true

handler.before = function(m, { conn, isOwner}) {
    if (!m.isGroup) return;
    if (m.fromMe) return;

    let bl = db.data.chats[m.chat].blacklist || [];

  if (Object.values(bl).find(users => users.id == m.sender) && !isOwner) {
        // Menghapus pengguna dari grup jika ada di dalam daftar hitam
        conn.sendMessage(m.chat, { delete: { ...m.key }});
 return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    }
}

export default handler;

/*
<> *BLACKLIST*<>
Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  "aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/
