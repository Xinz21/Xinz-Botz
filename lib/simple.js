// work beton list
import path from "path";
import { toAudio } from "./converter.js";
import chalk from "chalk";
import fetch from "node-fetch";
import PhoneNumber from "awesome-phonenumber";
import fs from "fs";
import util from "util";
import { fileTypeFromBuffer } from "file-type";
import { format } from "util";
import { fileURLToPath } from "url";
import store from "./store.js";
import jimp from "jimp";
import { randomBytes } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('@adiwajshing/baileys')}
 */
const {
  default: _makeWaSocket,
  makeWALegacySocket,
  proto,
  downloadContentFromMessage,
  jidDecode,
  areJidsSameUser,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateWAMessage,
  WAMessageStubType,
  extractMessageContent,
  prepareWAMessageMedia,
} = (await import("@adiwajshing/baileys")).default;

export function makeWASocket(connectionOptions, options = {}) {
  /**
   * @type {import('@adiwajshing/baileys').WASocket | import('@adiwajshing/baileys').WALegacySocket}
   */
  let conn = (global.opts["legacy"] ? makeWALegacySocket : _makeWaSocket)(
    connectionOptions,
  );

  let sock = Object.defineProperties(conn, {
    chats: {
      value: { ...(options.chats || {}) },
      writable: true,
    },
    decodeJid: {
      value(jid) {
        if (!jid || typeof jid !== "string")
          return (!nullish(jid) && jid) || null;
        return jid.decodeJid();
      },
    },
    logger: {
      get() {
        return {
          info(...args) {
            console.log(
              chalk.bold.bgRgb(51, 204, 51)("INFO "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.cyan(format(...args)),
            );
          },
          error(...args) {
            console.log(
              chalk.bold.bgRgb(247, 38, 33)("ERROR "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.rgb(255, 38, 0)(format(...args)),
            );
          },
          warn(...args) {
            console.log(
              chalk.bold.bgRgb(255, 153, 0)("WARNING "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.redBright(format(...args)),
            );
          },
          trace(...args) {
            console.log(
              chalk.grey("TRACE "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.white(format(...args)),
            );
          },
          debug(...args) {
            console.log(
              chalk.bold.bgRgb(66, 167, 245)("DEBUG "),
              `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
              chalk.white(format(...args)),
            );
          },
        };
      },
      enumerable: true,
    },
    /**
     * Translate Text
     * @param {String} code
     * @param {String|Buffer} text
     */
    translate: {
      async value(code, text) {
        return translate(text, {
          from: "id",
          to: code,
        }).then((a) => a.text);
      },
    },
    /**
     *
     * @param {String} text
     * @returns
     */
    filter: {
      value(text = "") {
        let mati = [
          "q",
          "w",
          "r",
          "t",
          "y",
          "p",
          "s",
          "d",
          "f",
          "g",
          "h",
          "j",
          "k",
          "l",
          "z",
          "x",
          "c",
          "v",
          "b",
          "n",
          "m",
        ];
        if (/[aiueo][aiueo]([qwrtypsdfghjklzxcvbnm])?$/i.test(text))
          return text.substring(text.length - 1);
        else {
          let res = Array.from(text).filter((v) => mati.includes(v));
          let resu = res[res.length - 1];
          for (let huruf of mati) {
            if (text.endsWith(huruf)) {
              resu = res[res.length - 2];
            }
          }
          let misah = text.split(resu);
          return resu + misah[misah.length - 1];
        }
      },
    },
    smlcap: {
      value(text, except = []) {
        if (!text) return text;
        let regex =
          /(wa.me|https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
        let link = text.match(regex);
        let smlcap = (res) =>
          res
            .replace(/a|A/g, "ᴀ")
            .replace(/b|B/g, "ʙ")
            .replace(/c|C/g, "ᴄ")
            .replace(/d|D/g, "ᴅ")
            .replace(/e|E/g, "ᴇ")
            .replace(/f|F/g, "ꜰ")
            .replace(/g|G/g, "ɢ")
            .replace(/h|H/g, "ʜ")
            .replace(/i|I/g, "ɪ")
            .replace(/j|J/g, "ᴊ")
            .replace(/k|K/g, "ᴋ")
            .replace(/l|L/g, "ʟ")
            .replace(/m|M/g, "ᴍ")
            .replace(/n|N/g, "ɴ")
            .replace(/o|O/g, "ᴏ")
            .replace(/p|P/g, "ᴘ")
            .replace(/q|Q/g, "ǫ")
            .replace(/r|R/g, "ʀ")
            .replace(/s|S/g, "ꜱ")
            .replace(/t|T/g, "ᴛ")
            .replace(/u|U/g, "ᴜ")
            .replace(/v|V/g, "ᴠ")
            .replace(/w|W/g, "ᴡ")
            .replace(/x|X/g, "x")
            .replace(/y|Y/g, "ʏ")
            .replace(/z|Z/g, "ᴢ");
        let result = smlcap(text);
        if (except.length > 0) {
          for (let i = 0; i < except.length; i++) {
            result = result.replace(smlcap(except[i]), except[i]);
          }
          if (link) {
            for (let i = 0; i < link.length; i++) {
              result = result.replace(smlcap(link[i]), link[i]);
            }
            return result;
          } else {
            return result;
          }
        } else {
          if (link) {
            for (let i = 0; i < link.length; i++) {
              result = result.replace(smlcap(link[i]), link[i]);
            }
            return result;
          } else {
            return result;
          }
        }
      },
      enumerable: true,
    },
    delay: {
      async value(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
      },
    },
    sendThumb: {
      /**
    Reply message using larger thumbnail
    **/
      value(jid, text = "", url, quoted, options) {
        conn.sendMessage(
          jid,
          {
            text: text,
            contextInfo: {
              externalAdReply: {
                title: global.db.data.bots.info.wm || global.wm,
                body: "",
                showAdAttribution: true,
                mediaType: 1,
                sourceUrl: sgc || global.db.data.bots.link.group,
                thumbnail: conn.getFile(url, true).data,
                renderLargerThumbnail: true,
              },
            },
          },
          { quoted, ...options },
        );
      },
    },
    editMessage: {
      value(jid, key, text = "", quoted, options) {
        return conn.relayMessage(
          jid,
          {
            protocolMessage: {
              key,
              type: 14,
              editedMessage: {
                conversation: text,
              },
            },
          },
          {
            quoted,
            ...options,
          },
        );
      },
      writeable: true,
    },
    sendContactArray: {
      async value(jid, data, quoted, options) {
        if (!Array.isArray(data[0]) && typeof data[0] === "string")
          data = [data];
        let contacts = [];
        for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
          number = number.replace(/[^0-9]/g, "");
          let njid = number + "@s.whatsapp.net";
          let biz =
            (await conn.getBusinessProfile(njid).catch((_) => null)) || {};
          // N:;${name.replace(/\n/g, '\\n').split(' ').reverse().join(';')};;;
          let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, "\\n")}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber("+" + number).getNumber("international")}
item1.X-ABLabel:${isi1}
item2.EMAIL;type=INTERNET:${isi2}
item2.X-ABLabel:📧 Email
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:📍 Region
item4.URL:${isi4}
item4.X-ABLabel:Website
item5.X-ABLabel:${isi5}
END:VCARD`.trim();
          contacts.push({ vcard, displayName: name });
        }
        return await conn.sendMessage(
          jid,
          {
            contacts: {
              displayName:
                (contacts.length > 1
                  ? `2013 kontak`
                  : contacts[0].displayName) || null,
              contacts,
            },
          },
          {
            quoted,
            ...options,
          },
        );
      },
    },

    loadingMsg: {
      async value(jid, loamsg, loamsgEdit, loadingMessages, quoted) {
        const { key } = await conn.sendMessage(
          jid,
          {
            text: loamsg,
          },
          {
            quoted,
          },
        );

        for (const message of loadingMessages) {
          await conn.sendMessage(
            jid,
            {
              text: message,
              edit: key,
            },
            {
              quoted,
            },
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Jeda 1 detik
        }

        await conn.sendMessage(
          jid,
          {
            text: loamsgEdit,
            edit: key,
          },
          {
            quoted,
          },
        );
      },
    },
    getFile: {
      /**
       * getBuffer hehe
       * @param {fs.PathLike} PATH
       * @param {Boolean} saveToFile
       */
      async value(PATH, saveToFile = false) {
        let res, filename;
        const data = Buffer.isBuffer(PATH)
          ? PATH
          : PATH instanceof ArrayBuffer
            ? PATH.toBuffer()
            : /^data:.*?\/.*?;base64,/i.test(PATH)
              ? Buffer.from(PATH.split`,`[1], "base64")
              : /^https?:\/\//.test(PATH)
                ? await (res = await fetch(PATH)).buffer()
                : fs.existsSync(PATH)
                  ? ((filename = PATH), fs.readFileSync(PATH))
                  : typeof PATH === "string"
                    ? PATH
                    : Buffer.alloc(0);
        if (!Buffer.isBuffer(data))
          throw new TypeError("Result is not a buffer");
        const type = (await fileTypeFromBuffer(data)) || {
          mime: "application/octet-stream",
          ext: ".bin",
        };
        if (data && saveToFile && !filename)
          (filename = path.join(
            __dirname,
            "../tmp/" + new Date() * 1 + "." + type.ext,
          )),
            await fs.promises.writeFile(filename, data);
        return {
          res,
          filename,
          ...type,
          data,
          deleteFile() {
            return filename && fs.promises.unlink(filename);
          },
        };
      },
      enumerable: true,
    },
    resize: {
      /**
       * Resize By Fokus ID
       * @param {Buffer} buffer
       * @param {String|Number} uk1
       * @param {String|Number} uk2
       * @returns
       */
      value(buffer, uk1, uk2) {
        return new Promise(async (resolve, reject) => {
          let baper = await jimp.read(buffer);
          let result = await baper
            .resize(uk1, uk2)
            .getBufferAsync(jimp.MIME_JPEG);
          resolve(result);
        });
      },
      enumerable: true,
    },
    sendFile: {
      /**
       * Send Media/File with Automatic Type Specifier
       * @param {String} jid
       * @param {String|Buffer} path
       * @param {String} filename
       * @param {String} caption
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Boolean} ptt
       * @param {Object} options
       */
      async value(
        jid,
        path,
        filename = "",
        text = "",
        quoted,
        ptt = false,
        options = {},
        smlcap = { smlcap: false },
      ) {
        let isSmlcap =
          global.db.data.settings[conn.user.jid].smlcap && smlcap.smlcap;
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        let caption = isSmlcap
          ? conn.smlcap(text, smlcap.except ? smlcap.except : false)
          : text;
        let type = await conn.getFile(path, true);
        let { res, data: file, filename: pathFile } = type;
        if ((res && res.status !== 200) || file.length <= 65536) {
          try {
            throw { json: JSON.parse(file.toString()) };
          } catch (e) {
            if (e.json) throw e.json;
          }
        }
        const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
        let opt = {};
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        let mtype = "",
          mimetype = options.mimetype || type.mime,
          convert;
        if (
          /webp/.test(type.mime) ||
          (/image/.test(type.mime) && options.asSticker)
        )
          mtype = "sticker";
        else if (
          /image/.test(type.mime) ||
          (/webp/.test(type.mime) && options.asImage)
        )
          mtype = "image";
        else if (/video/.test(type.mime)) mtype = "video";
        else if (/audio/.test(type.mime))
          (convert = await toAudio(file, type.ext)),
            (file = convert.data),
            (pathFile = convert.filename),
            (mtype = "audio"),
            (mimetype = options.mimetype || "audio/ogg; codecs=opus");
        else mtype = "document";
        if (options.asDocument) mtype = "document";

        delete options.asSticker;
        delete options.asLocation;
        delete options.asVideo;
        delete options.asDocument;
        delete options.asImage;

        let message = {
          ...options,
          caption,
          ptt,
          [mtype]: { url: pathFile },
          mimetype,
          fileName: filename || pathFile.split("/").pop(),
        };
        /**
         * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
         */
        let m;
        try {
          m = await conn.sendMessage(jid, message, {
            ...opt,
            ...options,
            ephemeralExpiration: ephemeral,
          });
        } catch (e) {
          console.error(e);
          m = null;
        } finally {
          if (!m)
            m = await conn.sendMessage(
              jid,
              { ...message, [mtype]: file },
              { ...opt, ...options, ephemeralExpiration: ephemeral },
            );
          file = null; // releasing the memory
          return m;
        }
      },
      enumerable: true,
    },
    sendContact: {
      /**
       * Send Contact
       * @param {String} jid
       * @param {String[][]|String[]} data
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */
      async value(jid, data, quoted, options) {
        if (!Array.isArray(data[0]) && typeof data[0] === "string")
          data = [data];
        let contacts = [];
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        for (let [number, name] of data) {
          number = number.replace(/[^0-9]/g, "");
          let njid = number + "@s.whatsapp.net";
          let biz =
            (await conn.getBusinessProfile(njid).catch((_) => null)) || {};
          let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, "\\n")};;;
FN:${name.replace(/\n/g, "\\n")}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber("+" + number).getNumber("international")}${
            biz.description
              ? `
X-WA-BIZ-NAME:${(conn.chats[njid]?.vname || conn.getName(njid) || name).replace(/\n/, "\\n")}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, "\\n")}
`.trim()
              : ""
          }
END:VCARD
`.trim();
          contacts.push({ vcard, displayName: name });
        }
        return await conn.sendMessage(
          jid,
          {
            ...options,
            contacts: {
              ...options,
              displayName:
                (contacts.length >= 2
                  ? `${contacts.length} kontak`
                  : contacts[0].displayName) || null,
              contacts,
            },
          },
          { quoted, ...options, ephemeralExpiration: ephemeral },
        );
      },
      enumerable: true,
    },
    ctaButton: {
      get() {
        class Button {
          constructor() {
            this._title = "";
            this._subtitle = "";
            this._body = "";
            this._footer = "";
            this._buttons = [];
            this._data = null;
            this._contextInfo = {};
            this._currentSelectionIndex = -1;
            this._currentSectionIndex = -1;
          }
          setType(type) {
            this._type = type;
            return this;
          }
          setBody(body) {
            this._body = body;
            return this;
          }
          setFooter(footer) {
            this._footer = footer;
            return this;
          }
          makeRow(header = "", title = "", description = "", id = "") {
            if (this._currentSelectionIndex === -1 || this._currentSectionIndex === -1) {
              throw new Error("You need to create a selection and a section first");
            }
            const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson);
            buttonParams.sections[this._currentSectionIndex].rows.push({
              header: header,
              title: title,
              description: description,
              id: id
            });
            this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
            return this;
          }
          makeSections(title = "") {
            if (this._currentSelectionIndex === -1) {
              throw new Error("You need to create a selection first");
            }
            const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson);
            buttonParams.sections.push({
              title: title,
              rows: []
            });
            this._currentSectionIndex = buttonParams.sections.length - 1;
            this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
            return this;
          }
          addSelection(title) {
            this._buttons.push({
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                title: title,
                sections: []
              })
            });
            this._currentSelectionIndex = this._buttons.length - 1;
            this._currentSectionIndex = -1;
            return this;
          }
          addReply(display_text = "", id = "") {
            this._buttons.push({
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: display_text,
                id: id
              })
            });
            return this;
          }
          setVideo(path, options = {}) {
            if (!path) throw new Error("URL or buffer needed");
            this._data = Buffer.isBuffer(path) ? {
              video: path,
              ...options
            } : {
              video: {
                url: path
              },
              ...options
            };
            return this;
          }
          setImage(path, options = {}) {
            if (!path) throw new Error("URL or buffer needed");
            this._data = Buffer.isBuffer(path) ? {
              image: path,
              ...options
            } : {
              image: {
                url: path
              },
              ...options
            };
            return this;
          }
          setDocument(path, options = {}) {
            if (!path) throw new Error("URL or buffer needed");
            this._data = Buffer.isBuffer(path) ? {
              document: path,
              ...options
            } : {
              document: {
                url: path
              },
              ...options
            };
            return this;
          }
          setTitle(title) {
            this._title = title;
            return this;
          }
          setSubtitle(subtitle) {
            this._subtitle = subtitle;
            return this;
          }
          async run(jid, conn, quoted = {}) {
            const message = {
              body: proto.Message.InteractiveMessage.Body.create({
                text: this._body
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: this._footer
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: this._title,
                subtitle: this._subtitle,
                hasMediaAttachment: !!this._data,
                ...this._data ? await prepareWAMessageMedia(this._data, {
                  upload: conn.waUploadToServer
                }) : {}
              })
            };
            const msg = generateWAMessageFromContent(jid, {
              viewOnceMessage: {
                message: {
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    ...message,
                    contextInfo: this._contextInfo,
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: this._buttons
                    })
                  })
                }
              }
            }, {
              quoted: quoted
            });
            await conn.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id
            });
            return msg;
          }
        }
        const button = new Button();
        return button;
      }
    },
    reply: {
      /**
       * Reply to a message
       * @param {String} jid
       * @param {String|Buffer} text
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */
      value(
        jid,
        text = "",
        quoted,
        options = {},
        smlcap = { smlcap: false },
        tr = { tr: false, code: "en" },
      ) {
        let isSmlcap =
          global.db.data.settings[conn.user.jid].smlcap && smlcap.smlcap;
        let isTranslate = global.db.data.settings[conn.user.jid].tr && tr.tr;
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        if (isTranslate) {
          text = conn.translate(tr.code, text);
        }

        if (global.db.data.settings[conn.user.jid].adReply) {
          let thumb = ["thumb-1", "thumb-2", "thumb-3", "thumb-4", "thumb-5"];
          return Buffer.isBuffer(text)
            ? conn.sendFile(jid, text, "file", "", quoted, false, options)
            : conn.adReply(
                jid,
                text,
                global.config.watermark,
                "",
                fs.readFileSync("./media/" + thumb.getRandom() + ".jpg"),
                false,
                quoted,
                false,
                false,
                smlcap,
              );
        } else {
          return Buffer.isBuffer(text)
            ? conn.sendFile(jid, text, "file", "", quoted, false, options)
            : conn.sendMessage(
                jid,
                {
                  text: isSmlcap
                    ? conn.smlcap(text, smlcap.except ? smlcap.except : false)
                    : text,

                  contextInfo: global.rpl.contextInfo,
                  mentions: conn.parseMention(text),
                  ...options,
                },
                { quoted, ...options, ephemeralExpiration: ephemeral },
              );
        }
      },
    },
    adReply: {
      async value(
        jid,
        text,
        title = "",
        body = "",
        buffer,
        source = "",
        quoted,
        large = true,
        options = {},
        smlcap = { smlcap: false },
      ) {
        let isSmlcap =
          global.db.data.settings[conn.user.jid].smlcap && smlcap.smlcap;
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        let { data } = await conn.getFile(buffer, true);
        let hwaifu = JSON.parse(fs.readFileSync("./json/hwaifu.json", "utf-8"));
        return conn.sendMessage(
          jid,
          {
            text: isSmlcap
              ? conn.smlcap(text, smlcap.except ? smlcap.except : false)
              : text,
            mentions: conn.parseMention(text),
            contextInfo: {
              mentionedJid: await conn.parseMention(text),
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: global.db.data.bots.link.chid,
                serverMessageId: null,
                newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
              },
              externalAdReply: {
                showAdAttribution: false,
                mediaType: 1,
                title: title,
                body: body,
                thumbnail: data,
                renderLargerThumbnail: large ? true : false,
                mediaUrl: hwaifu.getRandom(),
                sourceUrl: source,
              },
            },
          },
          { quoted: quoted, ...options, ephemeralExpiration: ephemeral },
        );
      },
      enumerable: true,
    },
    sendButton: {
      async value(
        jid,
        title,
        body,
        footer,
        button = [],
        m,
        options = {},
        smlcap = { smlcap: false },
      ) {
        let isSmlcap =
          global.db.data.settings[conn.user.jid].smlcap && smlcap.smlcap;
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        let msg = generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: isSmlcap
                      ? conn.smlcap(body, smlcap.except ? smlcap.except : false)
                      : body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: isSmlcap
                      ? conn.smlcap(
                          footer,
                          smlcap.except ? smlcap.except : false,
                        )
                      : footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: isSmlcap
                      ? conn.smlcap(
                          title,
                          smlcap.except ? smlcap.except : false,
                        )
                      : title,
                    subtitle: "",
                    hasMediaAttachment: false,
                  }),
                  ...options,
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: button,
                    }),
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return await conn.relayMessage(jid, msg.message, {});
      },
      enumerable: true,
    },
    sendButtonImg: {
      async value(
        jid,
        image,
        title,
        body,
        footer,
        button = [],
        m,
        options = {},
        smlcap = { smlcap: true },
      ) {
        let isSmlcap =
          global.db.data.settings[conn.user.jid].smlcap && smlcap.smlcap;
        let ephemeral =
          conn.chats[jid]?.metadata?.ephemeralDuration ||
          conn.chats[jid]?.ephemeralDuration ||
          false;

        const media = await prepareWAMessageMedia(
          { image: (await conn.getFile(image)).data },
          { upload: conn.waUploadToServer },
        );

        let msg = generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: isSmlcap
                      ? conn.smlcap(body, smlcap.except ? smlcap.except : false)
                      : body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: isSmlcap
                      ? conn.smlcap(
                          footer,
                          smlcap.except ? smlcap.except : false,
                        )
                      : footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: isSmlcap
                      ? conn.smlcap(
                          title,
                          smlcap.except ? smlcap.except : false,
                        )
                      : title,
                    subtitle: "",
                    hasMediaAttachment: true,
                    ...media,
                  }),
                  ...options,
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: button,
                    }),
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return await conn.relayMessage(jid, msg.message, {});
      },
      enumerable: true,
    },
    footerImg: {
      async value(jid, footer, text, media, quoted, options) {
        let msg = await generateWAMessageFromContent(
          jid,
          {
            interactiveMessage: {
              body: {
                text: null,
              },
              footer: {
                text: footer,
              },
              header: {
                title: text,
                hasMediaAttachment: false,
                ...(await prepareWAMessageMedia(
                  { image: { url: media } },
                  { upload: conn.waUploadToServer },
                )),
              },
              nativeFlowMessage: {
                buttons: [{ title: "" }],
              },
            },
          },
          { quoted, ...options },
        );
        await conn.relayMessage(jid, msg.message, {});
      },
    },
    footerTxt: {
      async value(jid, footer, text, quoted, options) {
        let msg = await generateWAMessageFromContent(
          jid,
          {
            interactiveMessage: {
              body: {
                text: null,
              },
              footer: {
                text: footer,
              },
              header: {
                title: text,
                hasMediaAttachment: false,
              },
              nativeFlowMessage: {
                buttons: [{ title: "" }],
              },
            },
          },
          { quoted, ...options },
        );
        await conn.relayMessage(jid, msg.message, {});
      },
    },
    sendButtonMessages: {
      async value(jid, messages, quoted, options) {
        messages.length > 1
          ? await conn.sendCarousel(jid, messages, quoted, options)
          : await conn.sendNCarousel(jid, ...messages[0], quoted, options);
      },
    },
    /**
     * Send nativeFlowMessage
     */
    sendNCarousel: {
      async value(
        jid,
        text = "",
        footer = "",
        buffer,
        buttons,
        copy,
        urls,
        list,
        quoted,
        options,
      ) {
        let img, video;
        if (buffer) {
          if (/^https?:\/\//i.test(buffer)) {
            try {
              const response = await fetch(buffer);
              const contentType = response.headers.get("content-type");
              if (/^image\//i.test(contentType)) {
                img = await prepareWAMessageMedia(
                  {
                    image: {
                      url: buffer,
                    },
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else if (/^video\//i.test(contentType)) {
                video = await prepareWAMessageMedia(
                  {
                    video: {
                      url: buffer,
                    },
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else {
                console.error("Jenis MIME tidak kompatibel:", contentType);
              }
            } catch (error) {
              console.error("Gagal mendapatkan jenis MIME:", error);
            }
          } else {
            try {
              const type = await conn.getFile(buffer);
              if (/^image\//i.test(type.mime)) {
                img = await prepareWAMessageMedia(
                  {
                    image: /^https?:\/\//i.test(buffer)
                      ? {
                          url: buffer,
                        }
                      : type && type?.data,
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              } else if (/^video\//i.test(type.mime)) {
                video = await prepareWAMessageMedia(
                  {
                    video: /^https?:\/\//i.test(buffer)
                      ? {
                          url: buffer,
                        }
                      : type && type?.data,
                  },
                  {
                    upload: conn.waUploadToServer,
                    ...options,
                  },
                );
              }
            } catch (error) {
              console.error("Gagal mendapatkan tipe file:", error);
            }
          }
        }

        const dynamicButtons = buttons.map((btn) => ({
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: btn[0],
            id: btn[1],
          }),
        }));

        dynamicButtons.push(
          copy && (typeof copy === "string" || typeof copy === "number")
            ? {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Copy",
                  copy_code: copy,
                }),
              }
            : null,
        );

        urls?.forEach((url) => {
          dynamicButtons.push({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: url[0],
              url: url[1],
              merchant_url: url[1],
            }),
          });
        });

        list?.forEach((lister) => {
          dynamicButtons.push({
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: lister[0],
              sections: lister[1],
            }),
          });
        });

        const interactiveMessage = {
          body: {
            text: text || namebot,
          },
          footer: {
            text: footer || wm,
          },
          header: {
            hasMediaAttachment:
              img?.imageMessage || video?.videoMessage ? true : false,
            imageMessage: img?.imageMessage || null,
            videoMessage: video?.videoMessage || null,
          },
          nativeFlowMessage: {
            buttons: dynamicButtons.filter(Boolean),
            messageParamsJson: "",
          },
          ...Object.assign(
            {
              mentions:
                typeof text === "string"
                  ? await conn.parseMention(text || "@0")
                  : [],
              contextInfo: {
                mentionedJid:
                  typeof text === "string"
                    ? await conn.parseMention(text || "@0")
                    : [],
              },
            },
            {
              ...(options || {}),
              ...(conn.temareply?.contextInfo && {
                contextInfo: {
                  ...(options?.contextInfo || {}),
                  ...conn.temareply?.contextInfo,
                  externalAdReply: {
                    ...(options?.contextInfo?.externalAdReply || {}),
                    ...conn.temareply?.contextInfo?.externalAdReply,
                  },
                },
              }),
            },
          ),
        };

        const messageContent = proto.Message.fromObject({
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage,
            },
          },
        });

        const msgs = await generateWAMessageFromContent(jid, messageContent, {
          userJid: conn.user.jid,
          quoted: quoted,
          upload: conn.waUploadToServer,
          ephemeralExpiration: ephemeral,
        });

        await conn.relayMessage(jid, msgs.message, {
          messageId: msgs.key.id,
        });
      },
    },
    /**
     * Send carouselMessage
     */
    sendCarousel: {
      async value(jid, messages, quoted, options) {
        if (messages.length > 1) {
          const cards = await Promise.all(
            messages.map(
              async ([
                text = "",
                footer = "",
                buffer,
                buttons,
                copy,
                urls,
                list,
              ]) => {
                let img, video;
                if (/^https?:\/\//i.test(buffer)) {
                  try {
                    const response = await fetch(buffer);
                    const contentType = response.headers.get("content-type");
                    if (/^image\//i.test(contentType)) {
                      img = await prepareWAMessageMedia(
                        {
                          image: {
                            url: buffer,
                          },
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else if (/^video\//i.test(contentType)) {
                      video = await prepareWAMessageMedia(
                        {
                          video: {
                            url: buffer,
                          },
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else {
                      console.error(
                        "Jenis MIME tidak kompatibel:",
                        contentType,
                      );
                    }
                  } catch (error) {
                    console.error("Gagal mendapatkan jenis MIME:", error);
                  }
                } else {
                  try {
                    const type = await conn.getFile(buffer);
                    if (/^image\//i.test(type.mime)) {
                      img = await prepareWAMessageMedia(
                        {
                          image: /^https?:\/\//i.test(buffer)
                            ? {
                                url: buffer,
                              }
                            : type && type?.data,
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    } else if (/^video\//i.test(type.mime)) {
                      video = await prepareWAMessageMedia(
                        {
                          video: /^https?:\/\//i.test(buffer)
                            ? {
                                url: buffer,
                              }
                            : type && type?.data,
                        },
                        {
                          upload: conn.waUploadToServer,
                          ...options,
                        },
                      );
                    }
                  } catch (error) {
                    console.error("Gagal mendapatkan tipe file:", error);
                  }
                }
                const dynamicButtons = buttons.map((btn) => ({
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: btn[0],
                    id: btn[1],
                  }),
                }));

                dynamicButtons.push(
                  copy &&
                    (typeof copy === "string" || typeof copy === "number") && {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Copy",
                        copy_code: copy,
                      }),
                    },
                );

                urls?.forEach((url) => {
                  dynamicButtons.push({
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: url[0],
                      url: url[1],
                      merchant_url: url[1],
                    }),
                  });
                });

                list?.forEach((lister) => {
                  dynamicButtons.push({
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: lister[0],
                      sections: lister[1],
                    }),
                  });
                });

                return {
                  body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: text || namebot,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: footer || wm,
                  }),
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: "Carousel Message",
                    subtitle: botdate,
                    hasMediaAttachment:
                      img?.imageMessage || video?.videoMessage ? true : false,
                    imageMessage: img?.imageMessage || null,
                    videoMessage: video?.videoMessage || null,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.fromObject(
                      {
                        buttons: dynamicButtons.filter(Boolean),
                        messageParamsJson: "",
                      },
                    ),
                  ...Object.assign(
                    {
                      mentions:
                        typeof text === "string"
                          ? await conn.parseMention(text || "@0")
                          : [],
                      contextInfo: {
                        mentionedJid:
                          typeof text === "string"
                            ? await conn.parseMention(text || "@0")
                            : [],
                      },
                    },
                    {
                      ...(options || {}),
                      ...(conn.temareply?.contextInfo && {
                        contextInfo: {
                          ...(options?.contextInfo || {}),
                          ...conn.temareply?.contextInfo,
                          externalAdReply: {
                            ...(options?.contextInfo?.externalAdReply || {}),
                            ...conn.temareply?.contextInfo?.externalAdReply,
                          },
                        },
                      }),
                    },
                  ),
                };
              },
            ),
          );

          const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: namebot,
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: wm,
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: author,
              subtitle: botdate,
              hasMediaAttachment: false,
            }),
            carouselMessage:
              proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards,
              }),
            ...Object.assign(
              {
                mentions:
                  typeof text === "string"
                    ? await conn.parseMention(text || "@0")
                    : [],
                contextInfo: {
                  mentionedJid:
                    typeof text === "string"
                      ? await conn.parseMention(text || "@0")
                      : [],
                },
              },
              {
                ...(options || {}),
                ...(conn.temareply?.contextInfo && {
                  contextInfo: {
                    ...(options?.contextInfo || {}),
                    ...conn.temareply?.contextInfo,
                    externalAdReply: {
                      ...(options?.contextInfo?.externalAdReply || {}),
                      ...conn.temareply?.contextInfo?.externalAdReply,
                    },
                  },
                }),
              },
            ),
          });

          const messageContent = proto.Message.fromObject({
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage,
              },
            },
          });

          const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: conn.user.jid,
            quoted: quoted,
            upload: conn.waUploadToServer,
            ephemeralExpiration: ephemeral,
          });

          await conn.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id,
          });
        } else {
          await conn.sendNCarousel(jid, ...messages[0], quoted, options);
        }
      },
    },
    sendButton2: {
      /**
       * send Button
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {Buffer} buffer
       * @param {String[] | String[][]} buttons
       * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */

      async value(jid, head = "", body = "", footer = "", json, m) {
        const template = [
          {
            name: "quick_reply",
            buttonParamsJson: '{"display_text":"dispText","id":"idText"}',
          },
        ];

        const buttons = [];

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template[0]));
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /dispText/g,
              item[0],
            );
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /idText/g,
              item[1],
            );
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template[0]));
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /dispText/g,
            json[0],
          );
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /idText/g,
            json[1],
          );
          buttons.push(newObj);
        }

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: buttons,
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
      enumerable: true,
    },
    /*quick_reply*/
    sendQuickThumb: {
      /**
       * send Button
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {Buffer} buffer
       * @param {String[] | String[][]} buttons
       * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */

      async value(
        jid,
        head = "",
        body = "",
        footer = "",
        title,
        thumb,
        json,
        m,
      ) {
        const template = [
          {
            name: "quick_reply",
            buttonParamsJson: '{"display_text":"dispText","id":"idText"}',
          },
        ];

        const buttons = [];

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template[0]));
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /dispText/g,
              item[0],
            );
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /idText/g,
              item[1],
            );
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template[0]));
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /dispText/g,
            json[0],
          );
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /idText/g,
            json[1],
          );
          buttons.push(newObj);
        }

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: buttons,
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                    businessMessageForwardInfo: {
                      businessOwnerJid: conn.decodeJid(conn.user.id),
                    },
                    externalAdReply: {
                      title: title || wm,
                      thumbnailUrl: thumb || global.thumb,
                      sourceUrl: "",
                      mediaType: 2,
                      renderLargerThumbnail: false,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
      enumerable: true,
    },

    sendImgButton: {
      /**
       * send Button
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {Buffer} buffer
       * @param {String[] | String[][]} buttons
       * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */

      async value(jid, buffer, head = "", body = "", footer = "", json, m) {
        const template = [
          {
            name: "quick_reply",
            buttonParamsJson: '{"display_text":"dispText","id":"idText"}',
          },
        ];

        const buttons = [];

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template[0]));
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /dispText/g,
              item[0],
            );
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /idText/g,
              item[1],
            );
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template[0]));
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /dispText/g,
            json[0],
          );
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /idText/g,
            json[1],
          );
          buttons.push(newObj);
        }

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia(
                      { image: { url: buffer } },
                      { upload: conn.waUploadToServer },
                    )),
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: buttons,
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
      enumerable: true,
    },
    //---
    sendVideoButton: {
      /**
       * send Button
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {Buffer} buffer
       * @param {String[] | String[][]} buttons
       * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */

      async value(jid, buffer, head = "", body = "", footer = "", json, m) {
        const template = [
          {
            name: "quick_reply",
            buttonParamsJson: '{"display_text":"dispText","id":"idText"}',
          },
        ];

        const buttons = [];

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template[0]));
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /dispText/g,
              item[0],
            );
            newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
              /idText/g,
              item[1],
            );
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template[0]));
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /dispText/g,
            json[0],
          );
          newObj.buttonParamsJson = newObj.buttonParamsJson.replace(
            /idText/g,
            json[1],
          );
          buttons.push(newObj);
        }

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia(
                      { video: { url: buffer } },
                      { upload: conn.waUploadToServer },
                    )),
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: buttons,
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );

        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
      enumerable: true,
    },
    //---
    sendList: {
      async value(
        jid,
        head,
        body,
        footer,
        title,
        description,
        json,
        m,
        options,
      ) {
        const template = {
          header: "S_HEAD",
          title: "S_TIT",
          description: "S_DES",
          id: "S_ID",
        };
        const buttons = [];
        const rop = (target, replacement) => {
          if (target === false || target === null) {
            return "";
          } else {
            return replacement;
          }
        };

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template));
            newObj.header = rop(
              item[0],
              newObj.header.replace("S_HEAD", item[0]),
            );
            newObj.title = rop(item[1], newObj.title.replace("S_TIT", item[1]));
            newObj.description = rop(
              item[2],
              newObj.description.replace("S_DES", item[2]),
            );
            newObj.id = rop(item[3], newObj.id.replace("S_ID", item[3]));
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template));
          newObj.header = rop(
            json[0],
            newObj.header.replace("S_HEAD", json[0]),
          );
          newObj.title = rop(json[1], newObj.title.replace("S_TIT", json[1]));
          newObj.description = rop(
            json[2],
            newObj.description.replace("S_DES", json[2]),
          );
          newObj.id = rop(json[3], newObj.id.replace("S_ID", json[3]));
          buttons.push(newObj);
        }
        const messageButtons = {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: title,
            sections: [{ title: description, rows: buttons }],
          }),
        };

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [messageButtons],
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m, ephemeralExpiration: ephemeral },
          {},
        );
        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
    },
    sendEvent: {
            async value(jid, text, des, loc, link) {
let msg = generateWAMessageFromContent(jid, {
        messageContextInfo: {
            messageSecret: randomBytes(32)
        },
        eventMessage: {
            isCanceled: false,
            name: text,
            description: des,
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: loc
            },
            joinLink: link,
            startTime: 'm.messageTimestamp'
        }
    }, {});

    conn.relayMessage(jid, msg.message, {
          messageId: msg.key.id,
        })
            },
            enumerable: true
        },
    //--
    sendImgList: {
      async value(
        jid,
        buffer,
        head,
        body,
        footer,
        title,
        description,
        json,
        m,
        options,
      ) {
        const template = {
          header: "S_HEAD",
          title: "S_TIT",
          description: "S_DES",
          id: "S_ID",
        };
        const buttons = [];
        const rop = (target, replacement) => {
          if (target === false || target === null) {
            return "";
          } else {
            return replacement;
          }
        };

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template));
            newObj.header = rop(
              item[0],
              newObj.header.replace("S_HEAD", item[0]),
            );
            newObj.title = rop(item[1], newObj.title.replace("S_TIT", item[1]));
            newObj.description = rop(
              item[2],
              newObj.description.replace("S_DES", item[2]),
            );
            newObj.id = rop(item[3], newObj.id.replace("S_ID", item[3]));
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template));
          newObj.header = rop(
            json[0],
            newObj.header.replace("S_HEAD", json[0]),
          );
          newObj.title = rop(json[1], newObj.title.replace("S_TIT", json[1]));
          newObj.description = rop(
            json[2],
            newObj.description.replace("S_DES", json[2]),
          );
          newObj.id = rop(json[3], newObj.id.replace("S_ID", json[3]));
          buttons.push(newObj);
        }
        const messageButtons = {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: title,
            sections: [{ title: description, rows: buttons }],
          }),
        };

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia(
                      { image: { url: buffer } },
                      { upload: conn.waUploadToServer },
                    )),
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [messageButtons],
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid || global.chid,
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m },
          {},
        );
        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
    },
    sendVideoList: {
      async value(
        jid,
        buffer,
        head,
        body,
        footer,
        title,
        description,
        json,
        options,
      ) {
        const template = {
          header: "S_HEAD",
          title: "S_TIT",
          description: "S_DES",
          id: "S_ID",
        };
        const buttons = [];
        const rop = (target, replacement) => {
          if (target === false || target === null) {
            return "";
          } else {
            return replacement;
          }
        };

        if (Array.isArray(json[0])) {
          json.forEach((item) => {
            const newObj = JSON.parse(JSON.stringify(template));
            newObj.header = rop(
              item[0],
              newObj.header.replace("S_HEAD", item[0]),
            );
            newObj.title = rop(item[1], newObj.title.replace("S_TIT", item[1]));
            newObj.description = rop(
              item[2],
              newObj.description.replace("S_DES", item[2]),
            );
            newObj.id = rop(item[3], newObj.id.replace("S_ID", item[3]));
            buttons.push(newObj);
          });
        } else {
          const newObj = JSON.parse(JSON.stringify(template));
          newObj.header = rop(
            json[0],
            newObj.header.replace("S_HEAD", json[0]),
          );
          newObj.title = rop(json[1], newObj.title.replace("S_TIT", json[1]));
          newObj.description = rop(
            json[2],
            newObj.description.replace("S_DES", json[2]),
          );
          newObj.id = rop(json[3], newObj.id.replace("S_ID", json[3]));
          buttons.push(newObj);
        }
        const messageButtons = {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: title,
            sections: [{ title: description, rows: buttons }],
          }),
        };

        let msg = generateWAMessageFromContent(
          jid,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: body,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footer,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia(
                      { video: { url: buffer } },
                      { upload: conn.waUploadToServer },
                    )),
                    title: head,
                    subtitle: head,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [messageButtons],
                    }),
                  contextInfo: {
                    mentionedJid: await conn.parseMention(body),
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.db.data.bots.link.chid || global.chid || '',
                      serverMessageId: null,
                      newsletterName: `⌜ ${global.db.data.bots.info.wm || global.wm} ⌟ © ${global.db.data.bots.info.ownername || global.info.namaowner}`,
                    },
                  },
                }),
              },
            },
          },
          { quoted: m },
          {},
        );
        return conn.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      },
    },
    preSudo: {
      async value(text, who, m, chatupdate) {
        let messages = await generateWAMessage(
          m.chat,
          { text, mentions: await conn.parseMention(text) },
          { userJid: who, quoted: m.quoted && m.quoted.fakeObj },
        );
        messages.key.fromMe = areJidsSameUser(who, conn.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.name;
        if (m.isGroup) messages.key.participant = messages.participant = who;
        let msg = {
          ...chatupdate,
          messages: [proto.WebMessageInfo.fromObject(messages)].map(
            (v) => ((v.conn = this), v),
          ),
          type: "append",
        };
        return msg;
      },
    },
    appenTextMessage: {
      async value(_msg, text, chatUpdate) {
        let messages = await generateWAMessage(_msg.chat, {
          text: text,
          mentions: _msg.mentionedJid
        }, {
          userJid: conn.user.id,
          quoted: _msg.quoted && _msg.quoted.fakeObj
        });
        messages.key.fromMe = areJidsSameUser(_msg.sender, conn.user.id);
        messages.key.id = _msg.key.id;
        messages.pushName = _msg.pushName;
        if (_msg.isGroup) messages.participant = _msg.sender;
        let msg = {
          ...chatUpdate,
          messages: [proto.WebMessageInfo.fromObject(messages)],
          type: "append"
        };
        conn.ev.emit("messages.upsert", msg);
      }
    },
    sendReact: {
      async value(jid, text, key) {
        return conn.sendMessage(jid, { react: { text: text, key: key } });
      },
    },
    cMod: {
      /**
       * cMod
       * @param {String} jid
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
       * @param {String} text
       * @param {String} sender
       * @param {*} options
       * @returns
       */
      value(jid, message, text = "", sender = conn.user.jid, options = {}) {
        if (options.mentions && !Array.isArray(options.mentions))
          options.mentions = [options.mentions];
        let copy = message.toJSON();
        delete copy.message.messageContextInfo;
        delete copy.message.senderKeyDistributionMessage;
        let mtype = Object.keys(copy.message)[0];
        let msg = copy.message;
        let content = msg[mtype];
        if (typeof content === "string") msg[mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== "string") {
          msg[mtype] = { ...content, ...options };
          msg[mtype].contextInfo = {
            ...(content.contextInfo || {}),
            mentionedJid:
              options.mentions || content.contextInfo?.mentionedJid || [],
          };
        }
        if (copy.participant)
          sender = copy.participant = sender || copy.participant;
        else if (copy.key.participant)
          sender = copy.key.participant = sender || copy.key.participant;
        if (copy.key.remoteJid.includes("@s.whatsapp.net"))
          sender = sender || copy.key.remoteJid;
        else if (copy.key.remoteJid.includes("@broadcast"))
          sender = sender || copy.key.remoteJid;
        copy.key.remoteJid = jid;
        copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false;
        return proto.WebMessageInfo.fromObject(copy);
      },
      enumerable: true,
    },
    copyNForward: {
      /**
       * Exact Copy Forward
       * @param {String} jid
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
       * @param {Boolean|Number} forwardingScore
       * @param {Object} options
       */
      async value(jid, message, forwardingScore = true, options = {}) {
        let vtype;
        if (options.readViewOnce && message.message.viewOnceMessage?.message) {
          vtype = Object.keys(message.message.viewOnceMessage.message)[0];
          delete message.message.viewOnceMessage.message[vtype].viewOnce;
          message.message = proto.Message.fromObject(
            JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)),
          );
          message.message[vtype].contextInfo =
            message.message.viewOnceMessage.contextInfo;
        }
        let mtype = Object.keys(message.message)[0];
        let m = generateForwardMessageContent(message, !!forwardingScore);
        let ctype = Object.keys(m)[0];
        if (
          forwardingScore &&
          typeof forwardingScore === "number" &&
          forwardingScore > 1
        )
          m[ctype].contextInfo.forwardingScore += forwardingScore;
        m[ctype].contextInfo = {
          ...(message.message[mtype].contextInfo || {}),
          ...(m[ctype].contextInfo || {}),
        };
        m = generateWAMessageFromContent(jid, m, {
          ...options,
          userJid: conn.user.jid,
        });
        await conn.relayMessage(jid, m.message, {
          messageId: m.key.id,
          additionalAttributes: { ...options },
        });
        return m;
      },
      enumerable: true,
    },
    fakeReply: {
      /**
       * Fake Replies
       * @param {String} jid
       * @param {String|Object} text
       * @param {String} fakeJid
       * @param {String} fakeText
       * @param {String} fakeGroupJid
       * @param {String} options
       */
      value(
        jid,
        text = "",
        fakeJid = this.user.jid,
        fakeText = "",
        fakeGroupJid,
        options,
      ) {
        return conn.reply(jid, text, {
          key: {
            fromMe: areJidsSameUser(fakeJid, conn.user.id),
            participant: fakeJid,
            ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}),
          },
          message: { conversation: fakeText },
          ...options,
        });
      },
    },
    downloadM: {
      /**
       * Download media message
       * @param {Object} m
       * @param {String} type
       * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
       * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
       */
      async value(m, type, saveToFile) {
        let filename;
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
        const stream = await downloadContentFromMessage(m, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        if (saveToFile) ({ filename } = await conn.getFile(buffer, true));
        return saveToFile && fs.existsSync(filename) ? filename : buffer;
      },
      enumerable: true,
    },
    parseMention: {
      /**
       * Parses string into mentionedJid(s)
       * @param {String} text
       * @returns {Array<String>}
       */
      value(text = "") {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
          (v) => v[1] + "@s.whatsapp.net",
        );
      },
      enumerable: true,
    },
    getName: {
      /**
       * Get name from jid
       * @param {String} jid
       * @param {Boolean} withoutContact
       */
      value(jid = "", withoutContact = false) {
        jid = conn.decodeJid(jid);
        withoutContact = conn.withoutContact || withoutContact;
        let v;
        if (jid.endsWith("@g.us"))
          return new Promise(async (resolve) => {
            v = conn.chats[jid] || {};
            if (!(v.name || v.subject))
              v = (await conn.groupMetadata(jid)) || {};
            resolve(
              v.name ||
                v.subject ||
                PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
                  "international",
                ),
            );
          });
        else
          v =
            jid === "0@s.whatsapp.net"
              ? {
                  jid,
                  vname: "WhatsApp",
                }
              : areJidsSameUser(jid, conn.user.id)
                ? conn.user
                : conn.chats[jid] || {};
        return (
          (withoutContact ? "" : v.name) ||
          v.subject ||
          v.vname ||
          v.notify ||
          v.verifiedName ||
          PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
            "international",
          )
        );
      },
      enumerable: true,
    },
    loadMessage: {
      /**
       *
       * @param {String} messageID
       * @returns {import('@adiwajshing/baileys').proto.WebMessageInfo}
       */
      value(messageID) {
        return Object.entries(conn.chats)
          .filter(([_, { messages }]) => typeof messages === "object")
          .find(([_, { messages }]) =>
            Object.entries(messages).find(
              ([k, v]) => k === messageID || v.key?.id === messageID,
            ),
          )?.[1].messages?.[messageID];
      },
      enumerable: true,
    },
    relayWAMessage: {
      async value(pesanfull) {
        if (pesanfull.message.audioMessage) {
          await conn.sendPresenceUpdate("recording", pesanfull.key.remoteJid);
        } else {
          await conn.sendPresenceUpdate("composing", pesanfull.key.remoteJid);
        }
        var mekirim = await conn.relayMessage(
          pesanfull.key.remoteJid,
          pesanfull.message,
          { messageId: pesanfull.key.id },
        );
        conn.ev.emit("messages.upsert", {
          messages: [pesanfull],
          type: "append",
        });
        return mekirim;
      },
    },
    processMessageStubType: {
      /**
       * to process MessageStubType
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
       */
      async value(m) {
        if (!m.messageStubType) return;
        const chat = conn.decodeJid(
          m.key.remoteJid ||
            m.message?.senderKeyDistributionMessage?.groupId ||
            "",
        );
        if (!chat || chat === "status@broadcast") return;
        const emitGroupUpdate = (update) => {
          conn.ev.emit("groups.update", [{ id: chat, ...update }]);
        };
        switch (m.messageStubType) {
          case WAMessageStubType.REVOKE:
          case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
            emitGroupUpdate({ revoke: m.messageStubParameters?.[0] });
            break;
          case WAMessageStubType.GROUP_CHANGE_ICON:
            emitGroupUpdate({ icon: m.messageStubParameters?.[0] });
            break;
          default: {
            console.log({
              messageStubType: m.messageStubType,
              messageStubParameters: m.messageStubParameters,
              type: WAMessageStubType[m.messageStubType],
            });
            break;
          }
        }
        const isGroup = chat.endsWith("@g.us");
        if (!isGroup) return;
        let chats = conn.chats[chat];
        if (!chats) chats = conn.chats[chat] = { id: chat };
        chats.isChats = true;
        const metadata = await conn.groupMetadata(chat).catch((_) => null);
        if (!metadata) return;
        chats.subject = metadata.subject;
        chats.metadata = metadata;
      },
    },
    insertAllGroup: {
      async value() {
        const groups =
          (await conn.groupFetchAllParticipating().catch((_) => null)) || {};
        for (const group in groups)
          conn.chats[group] = {
            ...(conn.chats[group] || {}),
            id: group,
            subject: groups[group].subject,
            isChats: true,
            metadata: groups[group],
          };
        return conn.chats;
      },
    },
    pushMessage: {
      /**
       * pushMessage
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} m
       */
      async value(m) {
        if (!m) return;
        if (!Array.isArray(m)) m = [m];
        for (const message of m) {
          try {
            // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
            if (!message) continue;
            if (
              message.messageStubType &&
              message.messageStubType != WAMessageStubType.CIPHERTEXT
            )
              conn.processMessageStubType(message).catch(console.error);
            const _mtype = Object.keys(message.message || {});
            const mtype =
              (!["senderKeyDistributionMessage", "messageContextInfo"].includes(
                _mtype[0],
              ) &&
                _mtype[0]) ||
              (_mtype.length >= 3 &&
                _mtype[1] !== "messageContextInfo" &&
                _mtype[1]) ||
              _mtype[_mtype.length - 1];
            const chat = conn.decodeJid(
              message.key.remoteJid ||
                message.message?.senderKeyDistributionMessage?.groupId ||
                "",
            );
            if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
              /**
               * @type {import('@adiwajshing/baileys').proto.IContextInfo}
               */
              let context = message.message[mtype].contextInfo;
              let participant = conn.decodeJid(context.participant);
              const remoteJid = conn.decodeJid(
                context.remoteJid || participant,
              );
              /**
               * @type {import('@adiwajshing/baileys').proto.IMessage}
               *
               */
              let quoted = message.message[mtype].contextInfo.quotedMessage;
              if (remoteJid && remoteJid !== "status@broadcast" && quoted) {
                let qMtype = Object.keys(quoted)[0];
                if (qMtype == "conversation") {
                  quoted.extendedTextMessage = { text: quoted[qMtype] };
                  delete quoted.conversation;
                  qMtype = "extendedTextMessage";
                }
                if (!quoted?.[qMtype]?.contextInfo)
                  quoted[qMtype].contextInfo = {};
                quoted[qMtype].contextInfo.mentionedJid =
                  context.mentionedJid ||
                  quoted[qMtype].contextInfo.mentionedJid ||
                  [];
                const isGroup = remoteJid.endsWith("g.us");
                if (isGroup && !participant) participant = remoteJid;
                const qM = {
                  key: {
                    remoteJid,
                    fromMe: areJidsSameUser(conn.user.jid, remoteJid),
                    id: context.stanzaId,
                    participant,
                  },
                  message: JSON.parse(JSON.stringify(quoted)),
                  ...(isGroup ? { participant } : {}),
                };
                let qChats = conn.chats[participant];
                if (!qChats)
                  qChats = conn.chats[participant] = {
                    id: participant,
                    isChats: !isGroup,
                  };
                if (!qChats.messages) qChats.messages = {};
                if (!qChats.messages[context.stanzaId] && !qM.key.fromMe)
                  qChats.messages[context.stanzaId] = qM;
                let qChatsMessages;
                if (
                  (qChatsMessages = Object.entries(qChats.messages)).length > 40
                )
                  qChats.messages = Object.fromEntries(
                    qChatsMessages.slice(30, qChatsMessages.length),
                  ); // maybe avoid memory leak
              }
            }
            if (!chat || chat === "status@broadcast") continue;
            const isGroup = chat.endsWith("@g.us");
            let chats = conn.chats[chat];
            if (!chats) {
              if (isGroup) await conn.insertAllGroup().catch(console.error);
              chats = conn.chats[chat] = {
                id: chat,
                isChats: true,
                ...(conn.chats[chat] || {}),
              };
            }
            let metadata, sender;
            if (isGroup) {
              if (!chats.subject || !chats.metadata) {
                metadata =
                  (await conn.groupMetadata(chat).catch((_) => ({}))) || {};
                if (!chats.subject) chats.subject = metadata.subject || "";
                if (!chats.metadata) chats.metadata = metadata;
              }
              sender = conn.decodeJid(
                (message.key?.fromMe && conn.user.id) ||
                  message.participant ||
                  message.key?.participant ||
                  chat ||
                  "",
              );
              if (sender !== chat) {
                let chats = conn.chats[sender];
                if (!chats) chats = conn.chats[sender] = { id: sender };
                if (!chats.name)
                  chats.name = message.pushName || chats.name || "";
              }
            } else if (!chats.name)
              chats.name = message.pushName || chats.name || "";
            if (
              ["senderKeyDistributionMessage", "messageContextInfo"].includes(
                mtype,
              )
            )
              continue;
            chats.isChats = true;
            if (!chats.messages) chats.messages = {};
            const fromMe =
              message.key.fromMe ||
              areJidsSameUser(sender || chat, conn.user.id);
            if (
              !["protocolMessage"].includes(mtype) &&
              !fromMe &&
              message.messageStubType != WAMessageStubType.CIPHERTEXT &&
              message.message
            ) {
              delete message.message.messageContextInfo;
              delete message.message.senderKeyDistributionMessage;
              chats.messages[message.key.id] = JSON.parse(
                JSON.stringify(message, null, 2),
              );
              let chatsMessages;
              if ((chatsMessages = Object.entries(chats.messages)).length > 40)
                chats.messages = Object.fromEntries(
                  chatsMessages.slice(30, chatsMessages.length),
                );
            }
          } catch (e) {
            console.error(e);
          }
        }
      },
    },
    serializeM: {
      /**
       * Serialize Message, so it easier to manipulate
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
       */
      value(m) {
        return smsg(conn, m);
      },
    },
    ...(typeof conn.chatRead !== "function"
      ? {
          chatRead: {
            /**
             * Read message
             * @param {String} jid
             * @param {String|undefined|null} participant
             * @param {String} messageID
             */
            value(jid, participant = conn.user.jid, messageID) {
              return conn.sendReadReceipt(jid, participant, [messageID]);
            },
            enumerable: true,
          },
        }
      : {}),
    ...(typeof conn.setStatus !== "function"
      ? {
          setStatus: {
            /**
             * setStatus bot
             * @param {String} status
             */
            value(status) {
              return conn.query({
                tag: "iq",
                attrs: {
                  to: S_WHATSAPP_NET,
                  type: "set",
                  xmlns: "status",
                },
                content: [
                  {
                    tag: "status",
                    attrs: {},
                    content: Buffer.from(status, "utf-8"),
                  },
                ],
              });
            },
            enumerable: true,
          },
        }
      : {}),
  });
  if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id);
  store.bind(sock);
  return sock;
}
/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
 * @param {Boolean} hasParent
 */
export function smsg(conn, m, hasParent) {
  if (!m) return m;
  /**
   * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
   */
  let M = proto.WebMessageInfo;
  m = M.fromObject(m);
  m.conn = conn;
  let protocolMessageKey;
  if (m.message) {
    if (m.mtype == "protocolMessage" && m.msg.key) {
      protocolMessageKey = m.msg.key;
      if (protocolMessageKey == "status@broadcast")
        protocolMessageKey.remoteJid = m.chat;
      if (
        !protocolMessageKey.participant ||
        protocolMessageKey.participant == "status_me"
      )
        protocolMessageKey.participant = m.sender;
      protocolMessageKey.fromMe =
        conn.decodeJid(protocolMessageKey.participant) ===
        conn.decodeJid(conn.user.id);
      if (
        !protocolMessageKey.fromMe &&
        protocolMessageKey.remoteJid === conn.decodeJid(conn.user.id)
      )
        protocolMessageKey.remoteJid = m.sender;
    }
    if (m.quoted) if (!m.quoted.mediaMessage) delete m.quoted.download;
  }
  if (!m.mediaMessage) delete m.download;

  try {
    if (protocolMessageKey && m.mtype == "protocolMessage")
      conn.ev.emit("message.delete", protocolMessageKey);
  } catch (e) {
    console.error(e);
  }
  return m;
}

// https://github.com/Nurutomo/wabot-aq/issues/490
export function serialize() {
  const MediaType = [
    "imageMessage",
    "videoMessage",
    "audioMessage",
    "stickerMessage",
    "documentMessage",
  ];
  return Object.defineProperties(proto.WebMessageInfo.prototype, {
    conn: {
      value: undefined,
      enumerable: false,
      writable: true,
    },
    id: {
      get() {
        return this.key?.id;
      },
    },
    isBaileys: {
      get() {
        return (
          this.id?.length === 16 ||
          (this.id?.startsWith("BAE5") && this.id?.length === 16) || this.id?.length === 22 ||
          (this.id?.startsWith("3EB0") && this.id?.length === 22) ||
          false
        );
      },
    },
    chat: {
      get() {
        const senderKeyDistributionMessage =
          this.message?.senderKeyDistributionMessage?.groupId;
        return (
          this.key?.remoteJid ||
          (senderKeyDistributionMessage &&
            senderKeyDistributionMessage !== "status@broadcast") ||
          ""
        ).decodeJid();
      },
    },
    isGroup: {
      get() {
        return this.chat.endsWith("@g.us");
      },
      enumerable: true,
    },
    sender: {
      get() {
        return this.conn?.decodeJid(
          (this.key?.fromMe && this.conn?.user.id) ||
            this.participant ||
            this.key.participant ||
            this.chat ||
            "",
        );
      },
      enumerable: true,
    },
    fromMe: {
      get() {
        return (
          this.key?.fromMe ||
          areJidsSameUser(this.conn?.user.id, this.sender) ||
          false
        );
      },
    },
    mtype: {
      get() {
        if (!this.message) return "";
        const type = Object.keys(this.message);
        return (
          (!["senderKeyDistributionMessage", "messageContextInfo"].includes(
            type[0],
          ) &&
            type[0]) || // Sometimes message in the front
          (type.length >= 3 && type[1] !== "messageContextInfo" && type[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3
          type[type.length - 1]
        ); // common case
      },
      enumerable: true,
    },
    msg: {
      get() {
        if (!this.message) return null;
        return this.message[this.mtype];
      },
    },
    mediaMessage: {
      get() {
        if (!this.message) return null;
        const Message =
          (this.msg?.url || this.msg?.directPath
            ? { ...this.message }
            : extractMessageContent(this.message)) || null;
        if (!Message) return null;
        const mtype = Object.keys(Message)[0];
        return MediaType.includes(mtype) ? Message : null;
      },
      enumerable: true,
    },

    mediaType: {
      get() {
        let message;
        if (!(message = this.mediaMessage)) return null;
        return Object.keys(message)[0];
      },
      enumerable: true,
    },
    quoted: {
      get() {
        /**
         * @type {ReturnType<typeof makeWASocket>}
         */
        const self = this;
        const msg = self.msg;
        const contextInfo = msg?.contextInfo;
        const quoted = contextInfo?.quotedMessage;
        if (!msg || !contextInfo || !quoted) return null;
        const type = Object.keys(quoted)[0];
        let q = quoted[type];
        const text = typeof q === "string" ? q : q.text;
        return Object.defineProperties(
          JSON.parse(JSON.stringify(typeof q === "string" ? { text: q } : q)),
          {
            mtype: {
              get() {
                return type;
              },
              enumerable: true,
            },
            mediaMessage: {
              get() {
                const Message =
                  (q.url || q.directPath
                    ? { ...quoted }
                    : extractMessageContent(quoted)) || null;
                if (!Message) return null;
                const mtype = Object.keys(Message)[0];
                return MediaType.includes(mtype) ? Message : null;
              },
              enumerable: true,
            },
            mediaType: {
              get() {
                let message;
                if (!(message = this.mediaMessage)) return null;
                return Object.keys(message)[0];
              },
              enumerable: true,
            },
            id: {
              get() {
                return contextInfo.stanzaId;
              },
              enumerable: true,
            },
            chat: {
              get() {
                return contextInfo.remoteJid || self.chat;
              },
              enumerable: true,
            },
            isBaileys: {
              get() {
                return (
                  this.id?.length === 16 ||
                  (this.id?.startsWith("BAE5") && this.id.length === 16) || this.id?.length === 22 ||
                  (this.id?.startsWith("3EB0") && this.id.length === 22) ||
                  false
                );
              },
              enumerable: true,
            },
            sender: {
              get() {
                return (contextInfo.participant || this.chat || "").decodeJid();
              },
              enumerable: true,
            },
            fromMe: {
              get() {
                return areJidsSameUser(this.sender, self.conn?.user.jid);
              },
              enumerable: true,
            },
            text: {
              get() {
                return (
                  text ||
                  this.caption ||
                  this.contentText ||
                  this.selectedDisplayText ||
                  ""
                );
              },
              enumerable: true,
            },
            mentionedJid: {
              get() {
                return (
                  q.contextInfo?.mentionedJid ||
                  self.getQuotedObj()?.mentionedJid ||
                  []
                );
              },
              enumerable: true,
            },
            name: {
              get() {
                const sender = this.sender;
                return sender ? self.conn?.getName(sender) : null;
              },
              enumerable: true,
            },
            vM: {
              get() {
                return proto.WebMessageInfo.fromObject({
                  key: {
                    fromMe: this.fromMe,
                    remoteJid: this.chat,
                    id: this.id,
                  },
                  message: quoted,
                  ...(self.isGroup ? { participant: this.sender } : {}),
                });
              },
            },
            fakeObj: {
              get() {
                return this.vM;
              },
            },
            download: {
              value(saveToFile = false) {
                const mtype = this.mediaType;
                return self.conn?.downloadM(
                  this.mediaMessage[mtype] ||
                    this.message.viewOnceMessageV2.message[mtype] ||
                    this.header[mtype],
                  mtype.replace(/message/i, ""),
                  saveToFile,
                );
              },
              enumerable: true,
              configurable: true,
            },
            reply: {
              /**
               * Reply to quoted message
               * @param {String|Object} text
               * @param {String|false} chatId
               * @param {Object} options
               */
              value(text, chatId, options = {}, smlcap = { smlcap: false }) {
                return self.conn?.reply(
                  chatId ? chatId : this.chat,
                  text,
                  this.vM,
                  options,
                  smlcap,
                );
              },
              enumerable: true,
            },
            copy: {
              /**
               * Copy quoted message
               */
              value() {
                const M = proto.WebMessageInfo;
                return smsg(conn, M.fromObject(M.toObject(this.vM)));
              },
              enumerable: true,
            },
            forward: {
              /**
               * Forward quoted message
               * @param {String} jid
               *  @param {Boolean} forceForward
               */
              value(jid, force = false, options) {
                return self.conn?.sendMessage(
                  jid,
                  {
                    forward: this.vM,
                    force,
                    ...options,
                  },
                  { ...options },
                );
              },
              enumerable: true,
            },
            copyNForward: {
              /**
               * Exact Forward quoted message
               * @param {String} jid
               * @param {Boolean|Number} forceForward
               * @param {Object} options
               */
              value(jid, forceForward = false, options) {
                return self.conn?.copyNForward(
                  jid,
                  this.vM,
                  forceForward,
                  options,
                );
              },
              enumerable: true,
            },
            cMod: {
              /**
               * Modify quoted Message
               * @param {String} jid
               * @param {String} text
               * @param {String} sender
               * @param {Object} options
               */
              value(jid, text = "", sender = this.sender, options = {}) {
                return self.conn?.cMod(jid, this.vM, text, sender, options);
              },
              enumerable: true,
            },
            delete: {
              /**
               * Delete quoted message
               */
              value() {
                return self.conn?.sendMessage(this.chat, {
                  delete: this.vM.key,
                });
              },
              enumerable: true,
            },
            react: {
                        value(text) {
                            return self.conn?.sendMessage(this.chat, {
                                react: {
                                    text,
                                    key: this.vM.key
                                }
                            })
                        },
                        enumerable: true,
                    }
          },
        );
      },
      enumerable: true,
    },
    _text: {
      value: null,
      writable: true,
    },
    text: {
      get() {
        const msg = this.msg;
        const text =
          (typeof msg === "string" ? msg : msg?.text) ||
          msg?.caption ||
          msg?.contentText ||
          msg?.selectedId ||
          msg?.nativeFlowResponseMessage ||
          msg?.message?.imageMessage?.caption ||
          msg?.message?.videoMessage?.caption ||
          "";
        return typeof this._text === "string"
          ? this._text
          : "" ||
              (typeof text === "string"
                ? text
                : text?.selectedDisplayText ||
                  text?.hydratedTemplate?.hydratedContentText ||
                  JSON.parse(text?.paramsJson)?.id ||
                  text) ||
              "";
      },
      set(str) {
        return (this._text = str);
      },
      enumerable: true,
    },
    mentionedJid: {
      get() {
        return (
          (this.msg?.contextInfo?.mentionedJid?.length &&
            this.msg.contextInfo.mentionedJid) ||
          []
        );
      },
      enumerable: true,
    },
    name: {
      get() {
        return (
          (!nullish(this.pushName) && this.pushName) ||
          this.conn?.getName(this.sender)
        );
      },
      enumerable: true,
    },
    download: {
      value(saveToFile = false) {
        const mtype = this.mediaType;
        return this.conn?.downloadM(
          this.mediaMessage[mtype] ||
            this.message.viewOnceMessageV2.message[mtype] ||
            this.header[mtype],
          mtype.replace(/message/i, ""),
          saveToFile,
        );
      },
      enumerable: true,
      configurable: true,
    },
    reply: {
      value(text, chatId, options = {}, smlcap = { smlcap: false }) {
        return this.conn?.reply(
          chatId ? chatId : this.chat,
          text,
          this,
          options,
          smlcap,
        );
      },
    },
    copy: {
      value() {
        const M = proto.WebMessageInfo;
        return smsg(this.conn, M.fromObject(M.toObject(this)));
      },
      enumerable: true,
    },
    forward: {
      value(jid, force = false, options = {}) {
        return this.conn?.sendMessage(
          jid,
          {
            forward: this,
            force,
            ...options,
          },
          { ...options },
        );
      },
      enumerable: true,
    },
    copyNForward: {
      value(jid, forceForward = false, options = {}) {
        return this.conn?.copyNForward(jid, this, forceForward, options);
      },
      enumerable: true,
    },
    cMod: {
      value(jid, text = "", sender = this.sender, options = {}) {
        return this.conn?.cMod(jid, this, text, sender, options);
      },
      enumerable: true,
    },
    getQuotedObj: {
      value() {
        if (!this.quoted.id) return null;
        const q = proto.WebMessageInfo.fromObject(
          this.conn?.loadMessage(this.quoted.id) || this.quoted.vM,
        );
        return smsg(this.conn, q);
      },
      enumerable: true,
    },
    getQuotedMessage: {
      get() {
        return this.getQuotedObj;
      },
    },
    delete: {
      value() {
        return this.conn?.sendMessage(this.chat, { delete: this.key });
      },
      enumerable: true,
    },
    react: {
            value(text) {
                return this.conn?.sendMessage(this.chat, {
                    react: {
                        text,
                        key: this.key
                    }
                })
            },
            enumerable: true
        }
  });
}

export function logic(check, inp, out) {
  if (inp.length !== out.length)
    throw new Error("Input and Output must have same length");
  for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i];
  return null;
}

export function protoType() {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
    const ab = new ArrayBuffer(this.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < this.length; ++i) {
      view[i] = this[i];
    }
    return ab;
  };
  /**
   * @returns {ArrayBuffer}
   */
  Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
    return this.buffer.slice(
      this.byteOffset,
      this.byteOffset + this.byteLength,
    );
  };
  /**
   * @returns {Buffer}
   */
  ArrayBuffer.prototype.toBuffer = function toBuffer() {
    return Buffer.from(new Uint8Array(this));
  };
  // /**
  //  * @returns {String}
  //  */
  // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
  //     return util.format(this)
  // }
  Uint8Array.prototype.getFileType =
    ArrayBuffer.prototype.getFileType =
    Buffer.prototype.getFileType =
      async function getFileType() {
        return await fileTypeFromBuffer(this);
      };
  /**
   * @returns {Boolean}
   */
  String.prototype.isNumber = Number.prototype.isNumber = isNumber;
  /**
   *
   * @returns {String}
   */
  String.prototype.capitalize = function capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1, this.length);
  };
  /**
   * @returns {String}
   */
  String.prototype.capitalizeV2 = function capitalizeV2() {
    const str = this.split(" ");
    return str.map((v) => v.capitalize()).join(" ");
  };
  String.prototype.decodeJid = function decodeJid() {
    if (/:\d+@/gi.test(this)) {
      const decode = jidDecode(this) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        this
      ).trim();
    } else return this.trim();
  };
  /**
   * number must be milliseconds
   * @returns {string}
   */
  Number.prototype.toTimeString = function toTimeString() {
    // const milliseconds = this % 1000
    const seconds = Math.floor((this / 1000) % 60);
    const minutes = Math.floor((this / (60 * 1000)) % 60);
    const hours = Math.floor((this / (60 * 60 * 1000)) % 24);
    const days = Math.floor(this / (24 * 60 * 60 * 1000));
    return (
      (days ? `${days} day(s) ` : "") +
      (hours ? `${hours} hour(s) ` : "") +
      (minutes ? `${minutes} minute(s) ` : "") +
      (seconds ? `${seconds} second(s)` : "")
    ).trim();
  };
  Number.prototype.getRandom =
    String.prototype.getRandom =
    Array.prototype.getRandom =
      getRandom;
}

function isNumber() {
  const int = parseInt(this);
  return typeof int === "number" && !isNaN(int);
}

function getRandom() {
  if (Array.isArray(this) || this instanceof String)
    return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
}

/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
  return !(args !== null && args !== undefined);
}

// TypeError: Cannot read properties of null (reading 'user')
//     at WebMessageInfo.get (file:///home/container/lib/120363042986874411@g.us.js:888:70)
//     at Object.value (file:///home/container/lib/simple.js:731:61)
//     at Object.handler (file:///home/container/handler.js?update=1646537086773:18:10)
//     at EventEmitter.emit (node:events:532:35)
//     at Object.all (file:///home/container/plugins/_templateResponse.js?update=1646538543307:79:13)
//     at async Object.handler (file:///home/container/handler.js?update=1646537086773:346:21)
