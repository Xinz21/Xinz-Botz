// ini auto nyala ya bukan enable soalnya kalo enable nanti di span telpon sama user bangsat
import db from '../lib/database.js'

export async function before(m) {
    let chat = global.db.data.chats[m.chat]
	this.ev.on('call', async (call) => {
		if (call[0].status == 'offer' && chat.anticall) await this.rejectCall(call[0].id, call[0].from)
	})
	return !0
}
