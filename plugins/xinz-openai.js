//api by faxx
import fetch from 'node-fetch';
import moment from 'moment';
import fs from 'fs';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

      let loadd = [
        '██▒▒▒▒▒▒▒▒▒▒▒ 10%',
        '████▒▒▒▒▒▒▒▒▒ 30%',
        '███████▒▒▒▒▒▒ 50%',
        '██████████▒▒▒ 70%',
        '█████████████ 100%',
        '𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙼𝙴𝚃𝙴𝙳...'
      ];

      const arr = [
        { text: `${res}\n\n\n\n Jangan Lupa Untuk Bantu Follow Channel Kami Ya!\n> https://whatsapp.com/channel/0029VaPUf21A2pLK75IBJJ0m`, timeout: 3000 },
      ];

      const lll = await conn.sendMessage(m.chat, { text: ` _Waif Processing Your Prompt *[${text}]*_` }, { quoted: m });

      for (let i = 0; i < arr.length; i++) {
        await new Promise(resolve => setTimeout(resolve, arr[i].timeout));
        await conn.relayMessage(m.chat, {
          protocolMessage: {
            key: lll.key,
            type: 14,
            editedMessage: {
              conversation: arr[i].text
            }
          }
        }, { quoted: { key: lll.key, remoteJid: m.chat } });
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      m.reply('Maaf, terjadi kesalahan saat mengambil data dari API.');
    }
  }
};

handler.command = ['ai', 'openai'];
handler.help = ['ai', 'openai'];
handler.tags = ['ai'];
handler.register = true;

handler.limit = true;

export default handler;

function timeConvertA(input) {
  var now = new Date().getTime();
  var timeleft = input - now;

  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  return { day: days, hour: hours, minute: minutes, second: seconds };
}
