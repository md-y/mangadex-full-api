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
     * @param {Boolean} rememberMe Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     * @returns {Promise}
     */
    login(username, password, rememberMe=false) {
        // Reset current data
        this.sessionId = null;
        this.sessionExpiration = null;

        return new Promise((resolve, reject) => {
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
                    referer: "https://mangadex.org/login",
                    "User-Agent": "mangadex-full-api",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "multipart/form-data; boundary=" + boundary
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

            req.write(Util.generateMultipartPayload(boundary, payload));
            req.end();
        });
    }

    /**
     * Checks filepath for a cached sessionId. If none is found,
     * login() is called and the sessionId is cached. The file is stored unencrypted.
     * @param {*} filepath 
     * @param {*} username 
     * @param {*} password 
     * @param {*} persistent Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     */
    cacheLogin(filepath, username, password, persistent=false) {
        const resetCache = function (agentInstance, resolve, reject) {
            agentInstance.login(username, password, persistent).then((a) => {
                try {
                    fs.writeFileSync(filepath, a.sessionId + "; " + a.sessionExpiration, "utf8");
                    resolve(a);
                } catch(err) {
                    reject(err);
                }
            }).catch(reject);
        };

        return new Promise((resolve, reject) => {
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
                
                let data = file.split("; ");
                this.sessionId = data[0];
                if (data.length > 1) this.sessionExpiration = new Date(data[1]); 
                
                // Out of Date Token
                if (this.sessionExpiration && this.sessionExpiration < Date.now()) {
                    resetCache(this, resolve, reject);
                    return;
                }

                // Final check if the sessionId is working
                Util.getMatches("https://mangadex.org/login", {
                    "logged": /You are logged in/gmi
                }).then((m)=>{
                    if (m.logged) return resolve(this);
                    else resetCache(this, resolve, reject);
                });
            });
        });
    }

    /**
     * Sends a DM to a target user.
     * Warning: MangaDex only notifies of failed http requests, not message requests
     * (ie your message may not be delivered even on a successful callback).
     * @param {*} target Target user's username
     * @param {*} subject Message Subject
     * @param {*} body Message Body (BBCode Format)
     */
    sendMessage(target, subject, body) {
        return new Promise((resolve, reject) => {
            if (!this.sessionId) reject("No Agent Login.");

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
}

module.exports = Agent;