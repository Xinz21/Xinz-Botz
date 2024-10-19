/*
* Create by cifumo
* Creator Emilia - MD
* Dont Delete this weem
* Source by https://whatsapp.com/channel/0029VadvQ9K2UPB829z2tk1A
*/


import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const cif = async (m, { conn }) => {
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "./src/avatar_contact.png")
let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) return m.reply("Sharing Media");
  let media = await q.download();
let link = await catbox(media);
  let caption = `📮 *L I N K :*
${link}
📊 *S I Z E :* ${formatBytes(media.length)}
📛 *E x p i r e d :* "No Expiry Date" 

`;

  let fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` }: {} )}, message: { 'contactMessage': { 'displayName': m.name, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.name},;;;\nFN:${m.name},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp, thumbnail: pp, sendEphemeral: true }}}
 conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
forwardingScore: 999,
isForwarded: true,
      externalAdReply: {
      title: `Tourl`,
      body: global.wm,
      thumbnailUrl: imgbot,
      sourceUrl: ``,
      mediaType: 1,
      renderLargerThumbnail: true
                         }
                  }
               }, { quoted: fkontak })
}
cif.command = cif.help = ['tourl', 'tolink']
cif.tags = ['tools', 'internet']
cif.limit = true
export default cif


function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}


/**
 * Upload image to catbox
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * - `image/webp`
 * - `video/mp4`
 * - `video/gif`
 * - `audio/mpeg`
 * - `audio/opus`
 * - `audio/mpa`
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}
