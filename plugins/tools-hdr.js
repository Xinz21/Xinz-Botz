/*
 * @Author: Cifumo (plugins ini dibuat oleh)
 * @Web: https://rest.cifumo.biz.id
 */

import axios from "axios";
import FormData from "form-data";
import jimp from "jimp";

let handler = async (m, { conn, usedPrefix, command, args }) => {

  const defaultScale = 2;
  const defaultEnhance = false;


  const validScales = [2, 4, 6, 8, 16];
  const scale = args[0] ? parseInt(args[0]) : defaultScale;
  if (!validScales.includes(scale)) {
    return m.reply(`Nilai untuk scale harus salah satu dari: ${validScales.join(", ")}.`);
  }

  const enhance = args[1] ? args[1] === 'true' : defaultEnhance;
  if (args[1] && args[1] !== 'true' && args[1] !== 'false') {
    return m.reply(`Apakah foto kartun atau real jika kartun true jika real false.`);
  }

  let q = m.quoted ? m.quoted : m;
  let mime =
    (q.msg || q).mimetype ||
    q.mediaType ||
    "";

  if (!mime) {
    return m.reply(
      `Fotonya Mana kak? \nKirim Foto Dengan Caption ${usedPrefix + command}`,
    );
  }

  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Tipe ${mime} tidak didukung!`);
  }

  await m.reply('Mohon tunggu beberapa menit..')

  let img = await q.download();
    

  let response;
  try {
    response = await upscale(img, scale, enhance); // Menjalankan fungsi upscale dengan argumen scale dan enhance
  } catch (error) {
    return m.reply(`Gagal melakukan upscale: ${error.message}`);
  }

  if (!response || !response.status) {
    return m.reply("Gagal melakukan upscale.");
  }

  conn.sendFile(m.chat, response.image, "upscaled.jpg", "Ini Dia Kak", m);
};

handler.help = ["hdr"];
handler.tags = ["tools"];
handler.command = /^(hdr|hd)$/i;
handler.limit = true;
handler.error = 0;

export default handler;



/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "Aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/

async function upscale(buffer, size = 2, anime = false) {
  try {
    return await new Promise((resolve, reject) => {
      if(!buffer) return reject("undefined buffer input!");
      if(!Buffer.isBuffer(buffer)) return reject("invalid buffer input");
      if(!/(2|4|6|8|16)/.test(size.toString())) return reject("invalid upscale size!")
      jimp.read(Buffer.from(buffer)).then(image => {
        const { width, height } = image.bitmap;
        let newWidth = width * size;
        let newHeight = height * size;
        const form = new FormData();
        form.append("name", "upscale-" + Date.now())
        form.append("imageName", "upscale-" + Date.now())
        form.append("desiredHeight", newHeight.toString())
        form.append("desiredWidth", newWidth.toString())
        form.append("outputFormat", "png")
        form.append("compressionLevel", "none")
        form.append("anime", anime.toString())
        form.append("image_file", buffer, {
          filename: "upscale-" + Date.now() + ".png",
          contentType: 'image/png',
        })
        axios.post("https://api.upscalepics.com/upscale-to-size", form, {
          headers: {
            ...form.getHeaders(),
            origin: "https://upscalepics.com",
            referer: "https://upscalepics.com"
          }
        }).then(res => {
          const data = res.data;
          if(data.error) return reject("something error from upscaler api!");
          resolve({
            status: true,
            image: data.bgRemoved
          })
        }).catch(reject)
      }).catch(reject)
    })
  } catch (e) {
    return { status: false, message: e };
  }
}
