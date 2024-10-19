/*      *Vcard*
*/
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)
const sentMsg = await conn.sendContactArray(m.chat, [
[`${nomorown1}`, `XinZ`, `hmm.. apapun itu yasudalah..`, `Macbook`, `xinz32@gmail.com`, `Indonesia`, `https://xinz.xyz`, `XIXIXI`],
[`${nomorown}`, `Xiravynna Aurelia`, `Dev Bot`, `Ponsel`, `xira207@gmail.com`, `Jakarta Selatan, Indonesia`, `https://xira.me`, `Developer Xira - Botz`],
[`${nomorown2}`, `Clara`, `Love XinZ`, `Ponsel`, `clara20@gmail.com`, `Indonesia`, `nothing`, `Love💗`]
], m)
}
handler.help = ['owner', 'creator']
handler.tags = ['main']
handler.command = /^(owner|creator)/i
export default handler

/*  *Beton slide* */

//© AkiraaBot 2023-2024
// • Credits : wa.me/6287869975929 [ Bang syaii ]
// • Owner: 6287837703726,6281999319522

/*
• untuk siapa pun yang ketahuan menjual script ini tanpa sepengetahuan developer mohon untuk dilaporkan !
*/

/*
import moment from "moment-timezone"
import PhoneNum from "awesome-phonenumber"
//let regionNames = new Intl.DisplayNames(["en"], {
    type: "region",
});

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let nomor = global.owner;
    let array = [];

    if (menu === "button") {
        for (let i of nomor) {
            let num = (await conn.onWhatsApp(i))[0].jid;
            let img = await conn
                .profilePictureUrl(num, "image")
                .catch((_) => "https://telegra.ph/file/93c9aff7d28347b3ed2aa.png");
            let bio = await conn.fetchStatus(num).catch((_) => {});
            let name = await conn.getName(num);
            // let business = await conn.getBusinessProfile(num);
            let format = PhoneNum(`+${num.split("@")[0]}`);
            let country = regionNames.of(format.getRegionCode("international"));

            let wea = `*[ PROFILE OWNER ]*\n\n*° Country :* ${country.toUpperCase()}\n*° Name :* ${name ? name : "-"}\n*° Format Number :* ${format.getNumber("international")}\n*° Url Api :* wa.me/${num.split("@")[0]}\n*° Status :* ${bio?.status || "-"}\n*° Date Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale("id").format("LL") : "-"}`;

            array.push([
                wea,
                null,
                img,
                [],
                null,
                [
                    ["CHAT ME", `https://wa.me/${num.split("@")[0]}?text=bang+info+sc`]
                ],
            ]);
        }

        conn.sendCarousel(m.chat, array, m, {
            body: `*[ BERIKUT ADALAH CREATOR SAYA ]*
${global.owner.map((a, i) => `*${i + 1}.* @` + a + " *[" + " " + conn.getName(a + "@s.whatsapp.net") + "]*").join("\n")}

*[ INFORMATION ]*
> • _Jangan Spam nomor Owner *[ Sanksi Blokir ]*_
> • _Jangan Call Nomor Owner *[ Sanksi Blokir ]*_`,
        });
    } else {
        for (let i of nomor) {
            let nama = await conn.getName(i + "@s.whatsapp.net");
            array.push([i, nama]);
        }

        let caption = `*[ BERIKUT ADALAH CREATOR SAYA ]*
${global.owner.map((a, i) => `*${i + 1}.* @` + a + " *[" + " " + conn.getName(a + "@s.whatsapp.net") + "]*").join("\n")}

*[ INFORMATION ]*
> • _Jangan Spam nomor Owner *[ Sanksi Blokir ]*_
> • _Jangan Call Nomor Owner *[ Sanksi Blokir ]*_`;

        let reply = await conn.sendContact(m.chat, array, m);
        await conn.sendMessage(
            m.chat, {
                text: caption,
                mentions: conn.parseMention(caption),
            }, {
                quoted: reply,
            },
        );
    }
};

handler.help = ["owner", "creator"].map((a) => a + " *[Contact Owner]*");
handler.tags = ["info"];
handler.command = ["owner", "creator"];

export default handler
*/
