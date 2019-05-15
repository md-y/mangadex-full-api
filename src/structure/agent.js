const https = require("https");

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
}

module.exports = Agent;