import fetch from 'node-fetch'
import uploadImage from "../lib/uploadImage.js"

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) return conn.reply(m.chat, `Send/Reply Images with the caption *.${command}*`, m)

  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  })

  let media = await q.download()
  let url = await uploadImage(media)
  let hasil = await fetch(`https://skizo.tech/api/mirror?apikey=YantoXtz&url=${url}&filter=${command}`)
  let res = await hasil.json()

  await conn.sendFile(m.chat, res.generated_image_addresses, 'anime2d.jpg', '```Success...\nDont forget to donate```', m)
}

handler.help = handler.command = [
  "fairy_princess", "emoji", "fairy_friends", "superhero_comic", 
  "maid_dressing", "zhuxin", "bizarre_journey", "pretty_soldier", 
  "christmas_anime", "anime_2d", "starry_girl", "dark_gothic", 
  "random_style", "pirate_tale", "egyptian_pharaoh", "realistic_custom", 
  "vintage_newspaper", "biohazard", "only_goth", "anime_custom", 
  "pixelart", "school_days", "yearbook", "dead_festival", 
  "horror_night", "2d_anime", "times_square", "friendship", 
  "star_player", "daily_life", "career_elite", "ps2_game", 
  "retro_oscar", "best_actress", "office_worker", "multiverse", 
  "thinking_in_the_air", "miracle_woman", "bushido", "underwater_world", 
  "castle_ghost", "code_v", "technology_future", "best_actor", 
  "miami_scenery", "flame_art", "color_collision", "cosmic_fantasy", 
  "baby_angel", "female_pioneers", "bloody_romance", "warrior_of_glory", 
  "daily_records", "emergencies", "street_art", "rrincess_outing", 
  "grassland_love", "retro_futuristic", "elf_archer", "cyber_chef", 
  "line_magic", "confident_girl", "youth_years", "vice_city", 
  "paper_empire", "modern_art", "goddess_gaze", "magic_dungeon", 
  "hell_moon", "red_years", "imperial_afterglow", "ancient_kitchen", 
  "future_graffiti", "fire_scene", "aborigine", "watercolor_magic", 
  "power_struggle", "neon_dance_party", "ski_game", "witch_girl", 
  "on_vacation", "watercolor_portrait", "orcs", "american_campus", 
  "line_chef", "cultural_blend", "pop_empire", "futurpunk", 
  "improvisation", "cyber_sakura", "border_resident", "absolute_power", 
  "ancient_heroine", "snap_fingers", "cooking_fun", "retro_arcade", 
  "battle_royal", "preppy_age", "clay_art", "vintage_anime"
]

handler.tags = ['convert']
handler.register = true
handler.limit = 20
export default handler
