let handler = async (m, { conn, text }) => {
  if (!text) {
    m.reply('Ada yang bisa di bantu');
  } else {
    const apiUrl = `https://xynz.vercel.app/api/openai?text=${text}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const res = data.result;
      conn.sendMessage(m.chat, {
text: `${res}\n\n\n\n Jangan Lupa Untuk Bantu Follow Channel Kami Ya!, Disitu Adalah Info Tentang Bot WhatsApp, Script Bot, Dan Dll\n> https://whatsapp.com/channel/0029VaPUf21A2pLK75IBJJ0m`,
contextInfo: {
        externalAdReply: {
        title: "AI - FIREFLY",
        body: "Hai Kak!",
        thumbnailUrl: "https://files.catbox.moe/5ev5tn.jpg",
        sourceUrl: global.sch,
        mediaType: 1,
        renderLargerThumbnail: true
        }
       }
      })
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      m.reply('Maaf, terjadi kesalahan saat mengambil data dari API.');
    }
  }
};

handler.command = ["firefly-ai"];
handler.tags = ["ai"];
handler.help = ["firefly-ai", "ai-firefly"];
handler.register = true;

export default handler;
