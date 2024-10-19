//bukan all
import fetch from 'node-fetch'
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `mau gitclone github?\n\n• contoh : *[${usedPrefix + command} https://github.com/Xinz21/Xinz-Botz.git]*`
    if (!regex.test(args[0])) throw '[❌] link *Invalid*'
    let [_, user, repo] = args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
  
    m.reply(` *Sedang Memuat ..*`)
    conn.sendFile(m.chat, url, filename, null, m)
}
handler.help = ['gitclone <url>']
handler.tags = ['dl']
handler.command = ['gitclone'] 
handler.diamond = true

export default handler
