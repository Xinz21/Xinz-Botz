// create by © ponta, recode? by me xinz maybe🗿.
const orders = [
    'nasi goreng', 'ayam bakar', 'mie goreng', 'nasi uduk',
    'sate', 'bakso', 'soto', 'gado-gado', 'rendang', 'burger', 'pizza', 'sosis bakar', 'nasi padang', 'bakso bakar', 'martabak', 'ikan goreng', 'ikan bakar', 'rawon', 'sushi', 'ramen', 'es teh', 'kopi susu', 'kopi hitam', 'teh manis', 'es jeruk', 'es campur', 'coca cola'
];


const wartegs = {};
const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to get a random value in the range [min, max]
function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { conn }) => {
    let command = m.text.split(' ')[0].toLowerCase();
    let user = m.sender;
    let chatId = m.chat;

    // Ensure wartegs[chatId] exists
    if (!wartegs[chatId]) {
        wartegs[chatId] = {};
    }

    // Ensure wartegs[chatId][user] exists
    if (!wartegs[chatId][user]) {
        wartegs[chatId][user] = {
            isOpen: false,
            currentOrder: null,
            eris: 0,
            exp: 0,
            inventory: {
                common: [],
                uncommon: []
            },
            customerCount: 0,
            timer: null,
            interval: null
        };
    }

    // Ensure global.db.data.users[user] exists
    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            eris: 0,
            exp: 0,
            inventory: {
                common: [],
                uncommon: []
            },
            lastClosed: 0
        };
    }

    const newCustomer = () => {
        if (!wartegs[chatId][user].isOpen) return;
        let order = orders[Math.floor(Math.random() * orders.length)];
        wartegs[chatId][user].currentOrder = order;
        conn.reply(chatId, `⟣───「 *PESANAN* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${wartegs[chatId][user].customerCount + 1}/5 ]
 │📝 [ *Makanan* : ${order} ]
⟣──────────⟢

Ketik .pesanan <makanan>`, floc);

        wartegs[chatId][user].timer = setTimeout(() => {
            if (wartegs[chatId][user].isOpen && wartegs[chatId][user].currentOrder) {
                conn.reply(chatId, `Info @${user.replace(/@.+/, '')}, Warteg kamu tutup karena tidak melayani pelanggan tepat waktu.`, floc);
                clearInterval(wartegs[chatId][user].interval);
                wartegs[chatId][user].isOpen = false;
                wartegs[chatId][user].currentOrder = null;
                wartegs[chatId][user].customerCount = 0;
                global.db.data.users[user].lastClosed = Date.now();
            }
        }, 3 * 60 * 1000); // 3 minutes
    };

    if (command === '.warteg') {
        if (wartegs[chatId][user].isOpen) {
            conn.reply(chatId, `Hey @${user.replace(/@.+/, '')}, Warteg kamu masih buka. Silakan layani pelanggan.`, floc);
            return;
        }

        let currentTime = Date.now();
        if (currentTime - global.db.data.users[user].lastClosed < cooldown) {
            let remainingTime = cooldown - (currentTime - global.db.data.users[user].lastClosed);
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah melayani pelanggan seharian, istirahatlah sejenak\n${Math.ceil(remainingTime / 60000)} menit lagi.`, floc);

            // Set a timeout to notify the user when the cooldown period is over
            setTimeout(() => {
                conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sudah bisa buka warteg lagi! Ketik .warteg untuk memulai.`, floc);
            }, remainingTime);
            return;
        }

        wartegs[chatId][user].isOpen = true;
        wartegs[chatId][user].customerCount = 0;
        conn.reply(chatId, 'Warteg dibuka! Siap-siap melayani pelanggan setiap 3 menit.\n\nKetik .tutup untuk mengakhiri permainan', floc);

        newCustomer();
        wartegs[chatId][user].interval = setInterval(() => {
            if (wartegs[chatId][user].isOpen) {
                newCustomer();
            }
        }, 3 * 60 * 1000);

    } else if (command === '.pesanan') {
        if (!wartegs[chatId][user].isOpen) {
            conn.reply(chatId, `Aduh @${user.replace(/@.+/, '')}, Warteg kamu belum buka. Ketik .warteg untuk mulai`, floc);
            return;
        }

        if (!wartegs[chatId][user].currentOrder) {
            conn.reply(chatId, `Sabar @${user.replace(/@.+/, '')}, Tidak ada pelanggan saat ini. Tunggu pelanggan baru datang.`, null);
            return;
        }

        let userOrder = m.text.split(' ').slice(1).join(' ').trim().toLowerCase();
        if (!userOrder) {
            conn.reply(chatId, 'Kamu harus menyertakan nama makanan setelah .pesanan.', floc);
            return;
        }

        let rewardEris = 0;
        let rewardExp = 0;
        let rewardUncommon = 0;
        let rewardCommon = 0;

        if (userOrder === wartegs[chatId][user].currentOrder) {
            rewardEris = getRandomReward(100000, 2100000); // Random money reward between 100000 and 2100000
            rewardExp = getRandomReward(100000, 500000); // Random exp reward between 100000 and 500000
            rewardCommon = getRandomReward(100, 120); // Common item reward between 100 and 120
            rewardUncommon = getRandomReward(100, 120); // Uncommon item reward between 100 and 120
            wartegs[chatId][user].customerCount++; // Increase customer count
        } else {
            rewardEris = getRandomReward(-2100000, -100000); // Penalty between -2100000 and -100000 money
            rewardExp = 0; // No exp if the order is wrong
        }

        wartegs[chatId][user].currentOrder = null;
        wartegs[chatId][user].eris += rewardEris;
        wartegs[chatId][user].exp += rewardExp;
        if (rewardEris >= 0) { // Add items only if the order is correct
            wartegs[chatId][user].inventory.common.push(rewardCommon);
            wartegs[chatId][user].inventory.uncommon.push(rewardUncommon);
        }

        // Save rewards to global user database
        global.db.data.users[user].eris += rewardEris;
        global.db.data.users[user].exp += rewardExp;
        if (rewardEris >= 0) {
            // Ensure inventory is initialized
            if (!global.db.data.users[user].inventory) {
                global.db.data.users[user].inventory = { common: [], uncommon: [] };
            }
            if (!global.db.data.users[user].inventory.common) {
                global.db.data.users[user].inventory.common = [];
            }
            if (!global.db.data.users[user].inventory.uncommon) {
                global.db.data.users[user].inventory.uncommon = [];
            }
            global.db.data.users[user].inventory.common.push(rewardCommon);
            global.db.data.users[user].inventory.uncommon.push(rewardUncommon);
        }

        // Reset timer only if the order is correct, next customer will come after the existing interval
        clearTimeout(wartegs[chatId][user].timer);

        // Format the rewards with commas
        let formattedEris = rewardEris.toLocaleString();
        let formattedExp = rewardExp.toLocaleString();
        let formattedCommon = rewardCommon.toLocaleString();
        let formattedUncommon = rewardUncommon.toLocaleString();

        // Send a reply to the user
        let message = `⟣───「 *STATISTIK* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${wartegs[chatId][user].customerCount}/5 ]
 │🏪 [ *Info* : Pesanan ${userOrder} ${rewardEris < 0 ? 'salah' : 'dilayani'} ]
⟣──────────⟢

⟣───「 *REWARD* 」───⟢
 │💰 Money ${rewardEris < 0 ? '' : '+'}${formattedEris}
 │🌟 Exp +${formattedExp}
 │📦 Common +${formattedCommon}
 │📦 Uncommon +${formattedUncommon}
⟣──────────⟢

Tunggu 3 menit untuk pelanggan berikutnya`;

        conn.reply(chatId, message, floc);

        // Automatically close the warteg if 5 customers are served
        if (wartegs[chatId][user].customerCount >= 5) {
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Warteg kamu tutup karena sudah malam setelah melayani 5 pelanggan. Kamu bisa membuka lagi dalam 30 menit.`, floc);
            clearInterval(wartegs[chatId][user].interval);
            clearTimeout(wartegs[chatId][user].timer);
            wartegs[chatId][user].isOpen = false;
            wartegs[chatId][user].currentOrder = null;
            wartegs[chatId][user].customerCount = 0;
            global.db.data.users[user].lastClosed = Date.now();

            // Save any remaining rewards to global user database
            global.db.data.users[user].eris += wartegs[chatId][user].eris;
            global.db.data.users[user].exp += wartegs[chatId][user].exp;

            if (wartegs[chatId][user].eris >= 0) {
                if (!global.db.data.users[user].inventory) {
                    global.db.data.users[user].inventory = { common: [], uncommon: [] };
                }
                if (!global.db.data.users[user].inventory.common) {
                    global.db.data.users[user].inventory.common = [];
                }
                if (!global.db.data.users[user].inventory.uncommon) {
                    global.db.data.users[user].inventory.uncommon = [];
                }
                global.db.data.users[user].inventory.common.push(...wartegs[chatId][user].inventory.common);
                global.db.data.users[user].inventory.uncommon.push(...wartegs[chatId][user].inventory.uncommon);
            }

            // Reset user warteg data
            wartegs[chatId][user].eris = 0;
            wartegs[chatId][user].exp = 0;
            wartegs[chatId][user].inventory.common = [];
            wartegs[chatId][user].inventory.uncommon = [];
        }

    } else if (command === '.tutup') {
        if (!wartegs[chatId][user].isOpen) {
            conn.reply(chatId, 'Warteg kamu sudah tutup atau belum buka.', floc);
            return;
        }
        clearInterval(wartegs[chatId][user].interval);
        clearTimeout(wartegs[chatId][user].timer);
        wartegs[chatId][user].isOpen = false;
        wartegs[chatId][user].currentOrder = null;
        wartegs[chatId][user].customerCount = 0;
        global.db.data.users[user].lastClosed = Date.now();
        conn.reply(chatId, 'Warteg ditutup.', floc);
    }
};

handler.help = ['warteg', 'pesanan <makanan>', 'tutup'];
handler.tags = ['game'];
handler.command = /^(warteg|pesanan|tutup)$/i;

export default handler;

function clockString(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}
