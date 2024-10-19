// * Code By Nazand Code
// * Fitur Convert Cjs To Esm (Dibuat Krn Gabut)
// * Hapus Wm Denda 500k Rupiah
// * https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

let handler = async (m, { text }) => {
    if (!text) return m.reply('Masukkan Code Cjs Yang Ingin Di Convert Esm.');

    try {
        const esmCode = convertCJStoESM(text);

        m.reply(`//To Esm\n\n${esmCode}`);
    } catch (error) {
        console.error('Error Convert Code Cjs To Esm:', error);
        m.reply('Ada Yang Error Om, Cek Lagi Code nya.');
    }
};

function convertCJStoESM(cjsCode) {
    let esmCode = cjsCode.replace(/const (.*) = require\((.*)\);?/g, (match, p1, p2) => {
        return `import ${p1} from ${p2};`;
    });
    
    esmCode = esmCode.replace(/module\.exports =/g, 'export default');
    esmCode = esmCode.replace(/exports\.(.*) =/g, 'export const $1 =');

    return esmCode;
}
handler.tags = ['tools'];
handler.command = ['convertesm'];
handler.help = ['convertesm cjscode'];
handler.limit = true
export default handler;

// * Code By Nazand Code
// * Fitur Convert Cjs To Esm (Dibuat Krn Gabut)
// * Hapus Wm Denda 500k Rupiah
// * https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
