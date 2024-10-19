import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

/*============== NOMOR ==============*/
global.nomorbot = '62888021017××' //Nomor Bot
global.nomorown = '62813198103××' //Nomor Ownerlobal.namebot 
global.namebot = 'Xinz-Botz'
global.nameown = 'XinZ' // Nama Owner

/*============== Owner ==============*/
global.owner = [
  ['+62888021017××', 'Xira', true],
  ['+62813198103××', 'XinZ', true],
  ['+62815376687××', 'Vanz', true]
  ]//Nomor owner 

global.mods = ['', '']
global.prems = ['', '', '']
global.APIs = { // API Prefix
  // name: 'https://website'
  xteam: 'https://api.xteam.xyz',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
}
global.APIKeys = { // APIKey Here*
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://zenzapis.xyz': '675e34de8a',
}
global.wm = 'Xinz-Botz' //Main Watermark
global.titlebot = 'Xinz-Botz'
global.yanto = 'Xinz-Botz' // ini nama bot nya di all
//-------link-------//
global.fotononya ='https://telegra.ph/file/082a4ae9d2a7c28e72efd.jpg'
global.sch = 'https://whatsapp.com/channel/0029VaPUf21A2pLK75IBJJ0m'
global.fotonya = 'https://telegra.ph/file/ebc31e6041812a4241a91.jpg'
global.shop = 'https://telegra.ph/file/62f7921ca44e045fc416c.jpg'
global.music = 'https://telegra.ph/file/707d8cccd585aaa224f48.jpg'
global.denied =
'https://telegra.ph/file/07366941f4baae7251bf1.jpg'
global.wel =
  'https://telegra.ph/file/c0b8126d1c948e3d29837.mp4'
global.good = 
  'https://telegra.ph/file/2e96639cf2f23858ac2e1.mp4'
global.ppKosong = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png'
global.thumbnail = 'https://telegra.ph/file/fc5a59759d9c0dad9c14d.jpg'
global.ppUrl = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png'
global.registrasi = 
  'https://telegra.ph/file/d1080dd644d6476cfa5e5.jpg'

// Sticker WM and react
global.packname = ''
global.author = 'Xinz'
global.wait = '*_Wait_*'
global.nsfw = '🥵'
global.done = '✅'
global.error = '❌'

global.multiplier = 69
global.maxwarn = '2' // maximal warn

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
