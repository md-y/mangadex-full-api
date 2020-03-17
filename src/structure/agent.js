const settings = require("../enum/settings");
const https = require("https");
const fs = require("fs");
const Util = require("../util");
const User = require("./user");
const Manga = require("./manga");

/**
 * Represents this API as a user.
 */
class Agent {
    constructor() {
        /**
         * Current session token
         */
        this.sessionId = null;
        /**
         * When this session expiries
         */
        this.sessionExpiration = null;
        /**
         * Required for maintaining a persistent session. 
         * Always used when it's not null.
         */
        this.persistentId = null;
        /**
         * Using settings.hentai enum.
         * Default: Shown (H and Non-H)
         */
        this.hentaiSetting = settings.hentai.shown;

        /**
         * This agent's user object. Filled by agent.fillUser()
         */
        this.user = new User();

        /**
         * Domain override for replacing "mangadex.org" with another domain.
         */
        this.domainOverride = null;
    }

    /**
     * Retrieves required information and fills this object.
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} rememberMe Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     * @returns {Promise}
     */
    login(username, password, rememberMe=false) {
        // Reset current data
        this.sessionId = null;
        this.sessionExpiration = null;

        return new Promise((resolve, reject) => {
            if (!username || !password) reject("Not enough login info.");
            const payload = {
                "login_username": username,
                "login_password": password,
                "remember_me": rememberMe ? 1 : 0
            };

            const boundary = Util.generateMultipartBoundary();
            let options = {
                host: "mangadex.org",
                path: "/ajax/actions.ajax.php?function=login",
                method: "POST",
                headers: {
                    "referer": "https://mangadex.org/login",
                    "Access-Control-Allow-Origin": "*",
                    "User-Agent": "mangadex-full-api",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "multipart/form-data; boundary=" + boundary
                }
            };
    
            const req = https.request(options, (res) => {
                for (let i of res.headers["set-cookie"]) {
                    // Current Session
                    if (i.includes("mangadex_session")) {
                        let m = (/mangadex_session=([^;]+);.+expires=([^;]+)/gmi).exec(i);
                        if (m.length >= 3) {
                            this.sessionId = m[1];
                            this.sessionExpiration = new Date(m[2]);
                            if (!rememberMe) break;
                        }
                    }
                    // Persistent Session
                    if (i.includes("mangadex_rememberme_token")) {
                        let m = (/mangadex_rememberme_token=([^;]+);/).exec(i);
                        if (m.length >= 2) {
                            this.persistentId = m[1];
                            break;
                        }
                    }
                }

                if (this.sessionId) resolve(this);
                else reject("Failed to retrieve session id.");

            }).on('error', reject);

            req.write(Util.generateMultipartPayload(boundary, payload));
            req.end();
        });
    }

    /**
     * Checks filepath for a cached sessionId. If none is found,
     * login() is called and the sessionId is cached. The file is stored unencrypted.
     * @param {String} filepath 
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} persistent Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     * @returns {Promise}
     */
    cacheLogin(filepath, username, password, persistent=true) {
        const resetCache = function (agentInstance, resolve, reject) {
            if (!username || !password) reject("Not enough login info.");
            agentInstance.login(username, password, persistent).then((a) => {
                try {
                    // Session; Expiration; Persistent (if it has value)
                    fs.writeFileSync(filepath, `${a.sessionId}; ${a.sessionExpiration}${(a.persistentId ? "; " + a.persistentId : "")}`, "utf8");
                    resolve(a);
                } catch(err) {
                    reject(err);
                }
            }).catch(reject);
        };

        return new Promise((resolve, reject) => {
            if (!filepath) reject("No filepath specified.");
            fs.readFile(filepath, "utf8", (err, file) => {
                // Errors
                if (err) {
                    if (err.code == "ENOENT") { // No File Found
                        try {
                            fs.writeFileSync(filepath, "", "utf8"); // Create file if it not exist
                            resetCache(this, resolve, reject);
                            return;
                        } catch(err) {
                            reject(err);
                            return;
                        }
                    } else return reject(err); // Other Errors
                }
                
                /*  
                    CACHE FILE LAYOUT:
                    last used session token; last used session expiration; persistent token
                */
                let data = file.split("; ");
                this.sessionId = data[0];
                if (data.length > 1) this.sessionExpiration = new Date(data[1]); 
                if (data.length > 2) this.persistentId = data[2];
                
                // Check if current tokens work and use Util.getHttps() automatic update of the current session token
                Util.getMatches("https://mangadex.org/login", {
                    "logged": /You are logged in/gmi
                }).then((m)=>{
                    if (m.logged) {
                        // Reset cache for current session (if it's out of data) with automatic update
                        if (data.length > 1 && new Date(data[1]) < Date.now()) {
                            data[0] = this.sessionId;
                            data[1] = this.sessionExpiration;
                            fs.writeFileSync(filepath, data.join("; "), "utf8");
                        }
                        
                        return resolve(this);
                    }
                    else resetCache(this, resolve, reject);
                });
            });
        });
    }

    /**
     * Sends a DM to a target user.
     * Warning: MangaDex only notifies of failed http requests, not message requests
     * (ie your message may not be delivered even on a successful callback).
     * @param {String} target Target user's username
     * @param {String} subject Message Subject
     * @param {String} body Message Body (BBCode Format)
     * @returns {Promise}
     */
    sendMessage(target, subject, body) {
        return new Promise((resolve, reject) => {
            if (!this.sessionId) reject("No Agent Login.");
            if (!target || !subject || !body) reject("Not enough arguments.");

            const payload = {
                "recipient": target,
                "subject": subject,
                "text": body
            };

            const boundary = Util.generateMultipartBoundary();
            let options = {
                host: "mangadex.org",
                path: "/ajax/actions.ajax.php?function=msg_send",
                method: "POST",
                headers: {
                    referer: "https://mangadex.org/messages/send",
                    "Access-Control-Allow-Origin": "*",
                    "User-Agent": "mangadex-full-api",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "multipart/form-data; boundary=" + boundary,
                    "Cookie": "mangadex_session=" + this.sessionId + ";"
                }
            };

            const req = https.request(options, (res) => {
                if (res.statusCode < 400) resolve(target, subject, body);
                else reject("Failed with " + res.statusCode + " response code.");
            });

            req.write(Util.generateMultipartPayload(boundary, payload));
            req.end();
        });
    }

    /**
     * Fills agent.user with the agent's information. It must be logged in.
     */
    fillUser() {
        return new Promise((resolve, reject) => {
            Util.getMatches("https://mangadex.org", {
                "userid": /<a[^>]*href=["']\/user\/(\d+)\/[^"']+["'][^>]*class="[^"']+dropdown-toggle"[^>]*>/gmi             
            }).then((m) => {
                if (!m.userid) reject("Cannot find User ID. Is the agent logged in?");
                this.user.fill(m.userid).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Returns (up to) the last 10 manga read by this agent.
     */
    getHistory() {
        return new Promise((resolve, reject) => {
            Util.getMatches("https://mangadex.org/history", {
                "ids": /<a[^>]*class=["'][^'"]*manga_title[^'"]*["'][^>]*title=["'][^'"]+["'][^>]*href=["']\/title\/(\d+)\/[^'"]+["'].+<\/a>/gmi,
                "titles":  /<a[^>]*class=["'][^'"]*manga_title[^'"]*["'][^>]*title=["']([^'"]+)["'][^>]*href=["']\/title\/\d+\/[^'"]+["'].+<\/a>/gmi
            }).then((m) => {
                if (!m.ids) m.ids = [];
                let history = [];
                for (let i in m.ids) {
                    let manga = new Manga(m.ids[i], false);
                    manga.title = m.titles[i];
                    history.push(manga);
                }
                resolve(history);
            });
        });
    }
}

module.exports = Agent;