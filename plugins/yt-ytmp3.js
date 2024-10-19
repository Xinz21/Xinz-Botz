/*
*<>YTMP3<>*
  Created scrape by daffa https://whatsapp.com/channel/0029VaiVeWA8vd1HMUcb6k2S/109

  Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
GROUP: 
https://chat.whatsapp.com/ETZ8r7CLypfAPH93q0gC0y

*DON'T DELETE THIS WM!*
BEBAS RECODE,ASAL NI WM JANGAN DIHAPUS!😤
*_AKU JANJI TIDAK AKAN HAPUS WM INI_*
*/

import axios from 'axios';
import fs from 'fs';
import path from 'path';

class Fuck extends Error {
    constructor(msg) {
        super(msg);
        this.name = "Fuck";
    }
}

class API {
    constructor(details, downloads) {
        this.endpoints = { info: details, download: downloads };
    }

    headers(custom = {}) {
        return {
            'Content-Type': 'application/json',
            'User-Agent': 'Postify/1.0.0',
            'Referer': 'https://ytiz.xyz/',
            ...custom
        };
    }

    handleError(error, context) {
        const errors = error.response ? JSON.stringify(error.response.data || error.errors) : error.errors;
        console.error(`Error in ${context}:`, errors);
        throw new Fuck(errors);
    }
}

class YTMP3 extends API {
    constructor() { 
        super('https://m8.fly.dev/api/info', 'https://m8.fly.dev/api/download'); 
    }

    async request(endpoint, payload) {
        try {
            const { data } = await axios.post(this.endpoints[endpoint], payload, { headers: this.headers() });
            return data;
        } catch (error) { 
            this.handleError(error, endpoint); 
        }
    }

    async fetchDetails(videoUrl, format) {
        return this.request('info', { url: videoUrl, format, startTime: 0, endTime: 0 });
    }

    async downloadAudio(videoUrl, quality, filename, randomID, format) {
        return this.request('download', {
            url: videoUrl,
            quality,
            metadata: true,
            filename,
            randID: randomID,
            trim: false,
            startTime: 0,
            endTime: 0,
            format
        });
    }

    validParams(format, quality) {
        const formats = ['m4a', 'mp3', 'flac'];
        const qualities = ['32', '64', '128', '192', '256', '320'];

        if (!formats.includes(format)) {
            throw new Error(`Salah! Pilih salah satu opsi ini : ${formats.join(', ')}`);
        }

        if (!qualities.includes(quality)) {
            throw new Error(`Salah! Pilih salah satu opsi ini : ${qualities.join(', ')}`);
        }
    }

    async exec(videoUrl, format = 'mp3', quality = '128') {
        this.validParams(format, quality);

        const videoInfo = await this.fetchDetails(videoUrl, format);
        const audioData = await this.downloadAudio(videoUrl, quality, videoInfo.filename, videoInfo.randID, format);
        console.log(audioData);

        // Send request to get the audio buffer
        const response = await axios.post('https://m8.fly.dev/api/file_send', {
            filepath: audioData.filepath,
            randID: audioData.randID
        }, { responseType: 'arraybuffer' }); // Make sure to request an arraybuffer

        return {
            buffer: Buffer.from(response.data), // Return the audio buffer
            thumbnail: videoInfo.thumbnail, // Include the video thumbnail
            title: videoInfo.title // Include the video title
        };
    }

    static async download(videoUrl, format = 'mp3', quality = '128') {
        const downloader = new YTMP3();
        return await downloader.exec(videoUrl, format, quality).catch(err => {
            console.error(err.errors);
        });
    }
}

// Handler function for WhatsApp bot
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh penggunaan: ${usedPrefix + command} <link>`;
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const videoUrl = text.trim();
    const format = 'mp3';  // Default format can be modified
    const quality = '128'; // Default quality can be modified

    try {
        const { buffer: audioBuffer, thumbnail, title } = await YTMP3.download(videoUrl, format, quality);

        if (!audioBuffer) throw 'Gagal mendownload audio!';

        const doc = {
            audio: audioBuffer,
            mimetype: 'audio/mp4', // Change mimetype if necessary
            fileName: `${title}`,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: videoUrl,
                    title: title,
                    sourceUrl: videoUrl,
                    thumbnail: await (await conn.getFile(thumbnail)).data
                }
            }
        };

        await conn.sendMessage(m.chat, doc, { quoted: m });

        // Clean up temporary files if necessary
        fs.unlink(`${path.join(process.cwd(), 'downloads')}/${title}.mp3`, (err) => {
            if (err) {
                console.error(`Failed to delete audio file: ${err}`);
            } else {
                console.log(`Deleted audio file: ${path.join(process.cwd(), 'downloads')}/${title}.mp3`);
            }
        });
    } catch (e) {
        console.error(e);
        throw '❌ Gagal mendownload audio!';
    }
}

handler.help = ["ytmp3"];
handler.tags = ["downloader"];
handler.command = ['ytmp3', 'yta', 'ytaudio'];

export default handler;
/*
*<>YTMP3<>*
  Created scrape by daffa https://whatsapp.com/channel/0029VaiVeWA8vd1HMUcb6k2S/109

  Source: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
GROUP: 
https://chat.whatsapp.com/ETZ8r7CLypfAPH93q0gC0y

*DON'T DELETE THIS WM!*
BEBAS RECODE,ASAL NI WM JANGAN DIHAPUS!😤
*_AKU JANJI TIDAK AKAN HAPUS WM INI_*
*/
