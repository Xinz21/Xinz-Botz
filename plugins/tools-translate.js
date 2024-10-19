import translate from '@vitalets/google-translate-api'

let handler = async (m, { args, usedPrefix, command }) => {
	let lang, text
	if (args.length >= 2) {
		lang = args[0] ? args[0] : 'id', text = args.slice(1).join(' ')
	} else if (m.quoted && m.quoted.text) {
		lang = args[0] ? args[0] : 'id', text = m.quoted.text
	} else throw `[❗] Ex: *${usedPrefix + command} id hello baby*`
	let res = await translate(text, { to: lang, autoCorrect: true }).catch(_ => null)
	if (!res) throw `Error : Bahasa"${lang}" Tidak Support`
	m.reply(` *Bahasa Awal:* ${res.from.language.iso}\n *Ke*:${lang}\n\n ${res.text}`.trim())
}
handler.help = ['translate']
handler.tags = ['tools']
handler.command = /^(tran(slate)|tr?)$/i

export default handler
