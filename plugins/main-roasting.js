. convertesm const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*• Example:* ${usedPrefix + command} *[username]*`);
  
  let apiUrl = '';
  if (command === 'roasting') {
    apiUrl = `https://fastrestapis.fasturl.cloud/ai/github/roasting?username=${text}&profile=false&language=id`;
  } else if (command === 'praising') {
    apiUrl = `https://fastrestapis.fasturl.cloud/ai/github/praising?username=${text}&profile=true&language=id`;
  }

  try {
    let response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': '0777052b-e6ef-49bb-bbc4-9aa397228c06'
      }
    });

    let kont = await response.json();

    if (kont && kont.data && kont.data.roasting) {
      m.reply(kont.data.roasting);
    } else if (kont && kont.data && kont.data.praising) {
      m.reply(kont.data.praising);
    } else {
      m.reply(eror);
    }
  } catch (error) {
    m.reply(`Terjadi kesalahan: ${error.message}`);
  }
};

handler.help = ["roasting","praising"].map((a) => a + ` *[akun github]*`);
handler.tags = ["internet"];
handler.command = ["roasting", "praising"];

module.exports = handler;
