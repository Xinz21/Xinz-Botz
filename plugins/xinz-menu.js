import PhoneNumber from 'awesome-phonenumber';
import moment from 'moment';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';
import jimp from 'jimp';
import { join } from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, isOwner }) => {
  // Mendapatkan informasi pengguna
  let user = global.db.data.users[m.sender];
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let { premium, owner, level, limit, exp, lastclaim, registered, regTime, age, pasangan, skill, name } = global.db.data.users[m.sender];

  // Mendapatkan nama pengguna
  let username = conn.getName(who);

  // Mendapatkan foto profil pengguna
  let ppnya = await conn.profilePictureUrl(m.sender, "image").catch(() => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg');

  // Membuat pesan interaktif
  const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;
  
  let sections = [{
      title: 'Artificial Intelligence ( Ai )', 
		highlight_label: 'Populer Plugins',
		rows: [{
	    title: ' Xinz-ai on/off',
    	description: `Automatic Chat Bot ( Chat Bot )`, 
    	id: '.xinz-ai'
		},
		{
		title: 'Openai', 
		description: " Ai with Openai ( Openai )", 
		id: '.ai'
		},
		{
		title: 'Gemini', 
		description: "image use prompt ( Gemini )", 
		id: '.gemini'
	    }]
	    }, 
    	{
	    title: 'Populer Menu(list menu)', 
		highlight_label: 'Populer plugins',
		rows: [{
	    title: ' All Menu',
    	description: `Dipslay All menu bot ( All )`, 
    	id: '.id'
	    }, {
        title: ' Downloader Feature',
 description: 'Display Menu Downloader ( Download Menu )',
 id: '.md'
 }, {
 title: ' Ai Feature',
 description: 'Display Menu Ai ( Ai Menu )', 
 id: '.ma'
 }, {
 title: ' Game Feature',
 description: 'Display Menu Game ( Game menu )', 
 id: '.mg'
 }, {
 title: ' Fun Feature',
 description: 'Display Menu Fun ( Fun Menu )',
 id: '.mf'
 }, {
 title: ' Tools Feature',
 description: 'Display Menu Tools ( Tools Menu )',
 id: '.mt'
 }, {
 title: ' Rpg Feature',
 description: 'Display Menu Rpg ( Rpg Menu )',
 id: '.mr'
 }, {
 title: ' Sticker Feature',
 description: 'Display Menu Sticker ( Sticker Menu )', 
 id: '.mst'
      }]
	    }, 
    	{
	    title: 'Basic Menu (list menu)', 
		highlight_label: 'Populer Plugins',
		rows: [{
      title: ' Main Feature',
description: `Display Menu Main ( Main Menu )`, 
id: '.menu'
}, {
  title: ' Info Feature',
  description: 'Display Menu Info ( information )',
  id: '.mf'
  }, {
  title: ' Diffusion Feature',
  description: 'Display Menu Diffusion ( Diffusion Menu )',
  id: '.md'
  }, {
  title: ' Convert Feature',
  description: 'Display Menu Convert ( Convert menu )',
  id: '.mc'
  }, {
  title: ' Premium Feature',
  description: 'Display Menu Premium ( Premium Menu )', 
  id: '.mp'
       }]
	     }, 
    	 {
	    title: 'quotes (lquotes menu)', 
		highlight_label: 'Populer Plugins',
		rows: [{
  title: ' Quotes Feature',
  description: 'Display Menu Quotes ( Quotes Menu )',
  id: '.mq'
  }, {
		title: ' Group Feature',
description: 'Display Menu Group ( Group Menu )',
id: '.mg'
}, {
title: ' Store Feature',
description: 'Display Menu Store ( Store Menu )',
id: '.mst'
     }]
	    }, 
        {
	    title: 'jadibot (jadi bot menu)', 
		highlight_label: 'Populer plugins',
		rows: [{
title: ' Jadibot Feature',
description: 'Display Menu Jadibot ( information )',
id: '.mjd'
}, {
title: ' Internet Feature',
description: 'Display Menu Internet ( Internet Menu )',
id: '.min'
}, {
title: ' Search Feature',
description: 'Display Menu Search ( Search Menu )', 
id: '.msh'
}, {
title: ' Islami Feature',
description: 'Display Menu Islami ( Islami Menu )',
id: '.msci'
     }]
	    }, 
        {
	    title: 'owner (owner menu)', 
		highlight_label: 'Populer Plugins',
		rows: [{
title: ' Owner Feature',
description: 'Display Menu Owner ( Owner Menu )',
id: '.mown'
}, {
title: ' Panel Feature',
description: 'Display Menu Panel ( Panel Menu )', 
id: '.mpnl'
}, {
title: ' Simulator Feature',
description: 'Display Menu Simulator ( Simulator Menu',
id: '.menu simulator'
}, {
title: ' Anonymous Feature',
description: 'Display Menu Anonymous ( Anonymous Menu )',
id: '.menu anonymous'
}, {
title: ' Anime Feature',
description: 'Display Menu Anime ( Anime Menu )', 
id: '.menu anime'
}]
	    },
	    {
	    title: 'System Information (info)', 
		highlight_label: 'My owner',
		rows: [{
	    title: ' Creator Bot',
    	description: `bot owner info, who created it ( information )`, 
    	id: '.owner'
    	},
    	{
    	title: ' Sewa & Premium', 
		description: "Displays Rental and Premium List ( information )", 
		id: '.sewa'
		},
		{
		title: 'Script Info', 
		description: "Source Code Bot WhatsApp Info ( information )", 
		id: '.sc'
		},
		{
		title: ' Bot Status', 
		description: "Viewing System Info on Bot ( information )", 
		id: '.botstatus'
	    }]
     }]
let listMessage = {
    title: 'List Menu', 
    sections
};
  let msgs = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `
\`Y O U R  S T A T U S\`

> - *Nama:*  @${who.replace(/@.+/, '')}
> - *Nomor:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
> - *Premium:* ${premium ? "Aktif" : "Tidak"}
> - *Limit:* ${user.limit}
> - *Money:* ${user.money}
> - *Role:* ${user.role}
> - *Level:* ${user.level}
> - *Xp:* ${user.exp}
> -  *Register:* ${registered ? 'Terdaftar' : 'Tidak'}.
> - *Owner:* ${isOwner ? "Ya" : "Tidak"}

\`B O T  S T A T U S\`
> - *Name Bot:* *${global.yanto}*
> - *Baileys:* *whiskeysockets/6.7.8*
> - *Baileys Bawaan:* *adiwajshing*
> - *Version:* *4.2.1*

_JANGAN LUPA *DAFTAR* AGAR BOT DAPAT MENGINGAT ANDA SELALU ୧⍤⃝_
`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "",
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: global.namebot, // Pastikan variabel ini didefinisikan
            hasMediaAttachment: true, ... (await prepareWAMessageMedia({
              image: { url: "https://files.catbox.moe/r6x5ho.jpg" }
            }, { upload: conn.waUploadToServer }))
          }),
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363240926353589@newsletter',
              newsletterName: 'My Community Channel',
              serverMessageId: -1
            }
          },
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              },
            ],
          })
        })
    }
  }
}, {})
             
  return await conn.relayMessage(m.key.remoteJid, msgs.message, {
    messageId: m.key.id
  })
}
handler.command = /^(menu)$/i;
export default handler
