/*
  *YTMP4*

  Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
*DONT DELETE THIS WM!*
*BEBAS RECODE BOLEH,TAPI WM GW JANGAN DIHAPUS!*
AKU JANJI TIDAK AKAN HAPUS WM INI 
*/

import axios from "axios";
import yts from "yt-search";

const getVideoId = (url) => {
  const videoIdPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|[^v\r\n\s]+?\/|user\/[^\/\n\s]+|embed\/|videoseries\?list=)|(?:youtu\.)?be(?:\.com)?\/(?:watch\?v=|v\/|u\/\w\/|embed\/|watch\?v%3Dd%2026|watch\?v-|-+|watch\/|-+|v=)?)((\w|-){11}).*/;
  const match = url.match(videoIdPattern);
  if (match) {
    return match[1];
  }
  throw new Error("Invalid YouTube URL");
};

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Ytdl = {
  mp4: async (url) => {
    try {
      const videoId = getVideoId(url);
      const videoUrl = (await yts(videoId)).videos[0].url;

      const { data: mediaData } = await axios.post("https://api.cobalt.tools/api/json", {
        url: videoUrl,
        filenamePattern: "basic",
        resolution: "480p",  // Resolusi 480p
      }, {
        headers: {
          Accept: "application/json",
          origin: "https://cobalt.tools",
          referer: "https://cobalt.tools/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/128.0.0.0 Safari/537.36",
        }
      });

      const videoData = (await yts("https://youtu.be/" + videoId)).videos[0];
      const authorData = (await yts(videoData.author.name)).channels[0];

      return {
        status: true,
        msg: "Success Download Content!",
        title: videoData.title,
        metadata: {
          id: videoData.videoId,
          duration: videoData.timestamp,
          thumbnail: videoData.image,
          views: formatNumber(videoData.views),
          description: videoData.description,
        },
        author: {
          name: authorData.name,
          url: authorData.url,
          bio: authorData.about,
          avatar: authorData.image,
          subscriber: formatNumber(authorData.subCount),
        },
        url: "https://youtu.be/" + videoId,
        media: mediaData.url,
      };
    } catch (error) {
      return {
        status: false,
        msg: "Gagal saat mengambil data!",
        err: error.message,
      };
    }
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Harap masukkan URL YouTube!\nContoh: ${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ`;
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  const result = await Ytdl.mp4(text);

  if (result.status) {
    let caption = `
*Judul:* ${result.title}
*Durasi:* ${result.metadata.duration}
*Views:* ${result.metadata.views}
*Deskripsi:* ${result.metadata.description}
*Author:* ${result.author.name} (${result.author.subscriber} subscriber)
*Link:* ${result.url}
`;
    await conn.sendFile(m.chat, result.media, 'video.mp4', caption, m);
  } else {
    throw result.msg;
  }
};

handler.help = ["ytmp4"];
handler.tags = ["downloader"];
handler.command = /^(ytmp4|ytv)$/i;
/*
  *YTMP4*

  Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
*DONT DELETE THIS WM!*
AKU JANJI TIDAK AKAN HAPUS WM INI 
*/

export default handler;
/*
import ytdl from "ytdl-core";

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return m.reply(`*Example:* .${command} https://www.youtube.com/xxxxxxx`);
	conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
	let obj = await ytmp3(text);
	let title = obj.meta.title;
	conn.sendFile(m.chat, obj.buffer, '', "", m, 0, {
		mimetype: "video/mp4",
		fileName: `${title}.mp4`,
		asDocument: false,
	});
};

handler.help = ['ytmp4']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'ytv']
export default handler 

async function ytmp3(url) {
	try {
		const { videoDetails } = await ytdl.getInfo(url, {
			lang: "id",
		});
		const stream = ytdl(url, {
			filter: "videoandaudio",
		});
		const chunks = [];
		stream.on("data", (chunk) => {
			chunks.push(chunk);
		});
		await new Promise((resolve, reject) => {
			stream.on("end", resolve);
			stream.on("error", reject);
		});
		const buffer = Buffer.concat(chunks);
		return {
			meta: {
				title: videoDetails.title,
				channel: videoDetails.author.name,
				seconds: videoDetails.lengthSeconds,
				description: videoDetails.description,
				image: videoDetails.thumbnails.slice(-1)[0].url,
			},
			buffer: buffer,
			size: buffer.length,
		};
	} catch (error) {
		throw error;
	}
}
*/
/*
import { youtubedl, youtubedlv2 } from "@bochilteam/scraper";
let handler = async (m, { conn, args, command, usedPrefix }) => {
	conn.room = conn.room ? conn.room : {};
	if (!args[0])
		return m.reply(
			`Masukan Link Youtube!\n\nContoh :\n${
				usedPrefix + command
			} https://youtu.be/Wky7Gz_5CZs`,
		);
	let id = "youtubedl_" + m.sender;
	if (id in conn.room) return m.reply("Kamu Masih Mendownload!");
	try {
		conn.room[id] = true;
		let { video, title, thumbnail } = await youtubedl(args[0]).catch(
			async (_) => await youtubedlv2(args[0]),
		);
		let text = "Youtube Video Downloader\n\n";
		text += `❏ Title: ${title}\n`;
		text += `❏ Quality: ${video["360p"].quality}\n`;
		text += `❏ File Size: ${video["360p"].fileSizeH}`;
		let msg = await conn.sendFile(m.chat, thumbnail, null, text, m);
		conn.sendMessage(
			m.chat,
			{
				video: { url: await video["360p"].download() },
				fileName: title + ".mp4",
				mimetype: "video/mp4",
				caption: title,
			},
			{ quoted: msg },
		);
	} catch (e) {
		throw "Failed :(";
	} finally {
		delete conn.room[id];
	}
};
handler.help = ["ytmp4"].map((v) => v + " <𝒖𝒓𝒍>");
handler.tags = [tdownload];
handler.command = ["ytmp4"];



export default handler;
*/
