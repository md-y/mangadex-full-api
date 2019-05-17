const https = require("https");
const fs = require("fs");
const Util = require("../util");

/**
 * Represents this API as a user.
 */
class Agent {
    constructor() {
        this.sessionId = null;
        this.sessionExpiration = null;
    }

    /**
     * Retrieves required information and fills this object.
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} rememberMe Create persistent session? (Lasts 1 year)
     * @returns {Promise}
     */
    login(username, password, rememberMe) {
        return new Promise((resolve, reject) => {
            const payload = {
                "login_username": username,
                "login_password": password,
                "remember_me": rememberMe ? 1 : 0
            };

            const boundary = "mfa" + Math.floor(Math.random() * 1000).toString();
            let options = {
                host: "mangadex.org",
                path: "/ajax/actions.ajax.php?function=login",
                method: "POST",
                headers: {
                    referer: "https://mangadex.org/login",
                    "User-Agent": "mangadex-full-api",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "multipart/form-data; boundary=" + boundary,
                    "Transfer-Encoding": "chunked"
                }
            };
    
            const req = https.request(options, (res) => {
                for (let i of res.headers["set-cookie"]) {
                    if (i.includes("mangadex_session")) {
                        let m = (/mangadex_session=([^;]+);.+expires=([^;]+)/gmi).exec(i);
                        if (m.length >= 3) {
                            this.sessionId = m[1];
                            this.sessionExpiration = new Date(m[2]);
                            break;
                        }
                    }
                }

                if (this.sessionId) resolve(this);
                else reject("Failed to retrieve session id.");

            }).on('error', reject);
    
            // Send Form Data
            for (let i in payload) {
                req.write(
                    `--${boundary}\n` +
                    `Content-Disposition: form-data; name="${i}"\n` +
                    `\n` +
                    `${payload[i]}\n`);
            }
            req.write(`--${boundary}--`);
            req.end();
        });
    }

    /**
     * Checks filepath for a cached sessionId. If none is found,
     * login() is called and the sessionId is cached. The file is stored unencrypted.
     * @param {*} filepath 
     * @param {*} username 
     * @param {*} password 
     * @param {*} persistent Creates a persistent session viewable at https://mangadex.org/settings (default: true)
     */
    cacheLogin(filepath, username, password, persistent=true) {
        const resetCache = function (agentInstance, resolve, reject) {
            agentInstance.login(username, password, persistent).then((a) => {
                try {
                    fs.writeFileSync(filepath, a.sessionId);
                    resolve(a);
                } catch(err) {
                    reject(err);
                }
            });
        };

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, file) => {
                if (err) {
                    if (err.code == "ENOENT") { // No File Found
                        try {
                            fs.writeFileSync(filepath, ""); // Create file if it not exist
                            resetCache(this, resolve, reject);
                            return;
                        } catch(err) {
                            reject(err);
                            return;
                        }
                    } else return reject(err); // Other Errors
                }

                this.sessionId = file;

                // Check if the sessionId is working
                Util.getMatches("https://mangadex.org/login", {
                    "logged": /You are logged in/gmi
                }).then((m)=>{
                    if (m.logged) return resolve(this);
                    else resetCache(this, resolve, reject);
                });
            });
        });
    }
}

module.exports = Agent;