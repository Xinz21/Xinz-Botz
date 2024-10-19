import axios from "axios"
let handler = async (m, { conn, isOwner, usedPrefix, command, text }) => {
  if (!text) return m.reply("Mau nanya apa sama gambar itu?");
  const requestData = { content: text, user: m.sender };
  const quoted = m && (m.quoted || m);
 
  try {
    let response;
    if (quoted && /image/.test(quoted.mimetype || quoted.msg.mimetype)) {
      requestData.imageBuffer = await quoted.download();
    }
    
    response = (await axios.post('https://lumin-ai.xyz', requestData)).data.result;
    m.reply(response);
  } catch (e) {
    m.reply(e.message);
  }
}
handler.help = ['luminai']
handler.tags = ['ai']
handler.command = /^(luminai)$/i
handler.limit = true

export default handler
