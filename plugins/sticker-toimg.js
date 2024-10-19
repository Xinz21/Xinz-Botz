let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = `Who Sticker? :\n\n *[${usedPrefix + command}]*`
    if (!m.quoted) throw notStickerMessage
    const q = m.quoted || m
    let mime = q.mediaType || ''
    if (/webp/.test(mime)) throw notStickerMessage
    let media = await q.download()
    await conn.sendMessage(m.chat, {image: media, caption: 'nih'}, {quoted: m})
}
handler.help = ['toimg <sticker>']
handler.tags = ['sticker']
handler.command = /^(toimg)$/i

export default handler
