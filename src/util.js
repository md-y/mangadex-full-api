const https = require("https");
const index = require("./index");

module.exports = {
    /**
     * Sends a HTTPS GET request. 
     * @param {String|URL} url 
     * @returns {Promise} Returns promise with resolve(response, http.IncomingMessage)
     */
    getHTTPS: function(url) {
        return new Promise((resolve, reject) => {
            if (!url) reject("No URL.");

            if (index.agent.domainOverride) url = url.replace("mangadex.org", index.agent.domainOverride);

            let options = {
                headers: {
                    "User-Agent": "mangadex-full-api",
                    "Cookie": "",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            
            if (index.agent.sessionId) options.headers.Cookie += "mangadex_session=" + index.agent.sessionId + "; ";
            if (index.agent.persistentId) options.headers.Cookie += "mangadex_rememberme_token=" + index.agent.persistentId + "; ";
            options.headers.Cookie += "mangadex_h_toggle=" + index.agent.hentaiSetting + "; ";
            options.headers.Cookie += "mangadex_title_mode=2"; // If there's no agent, this will have 100 manga per MDList page

            https.get(new URL(url), options, (res) => {
                // Update current session token if new one is given.
                if ("set-cookie" in res.headers) {
                    for (let i of res.headers["set-cookie"]) {
                        let m = (/mangadex_session=([^;]+);.+expires=([^;]+)/gmi).exec(i);
                        if (m && m.length >= 3) {
                            index.agent.sessionId = m[1];
                            index.agent.sessionExpiration = new Date(m[2]);
                            break;
                        }
                    }
                }

                res.url = url;
                let payload = "";

                if (res.statusCode == 503 || res.statusCode == 502 || res.statusCode == 403) reject(`MangaDex is currently in DDOS mitigation mode. (Status code ${res.statusCode})`);
                else if (res.statusCode >= 500) reject(`MangaDex is currently unavailable. (Status code ${res.statusCode})`);
                else if (res.statusCode == 404) reject("Cannot reach Mangadex.org (404). Use agent.domainOverride for a mirror.");

                res.on('data', (data) => {
                    payload += data;
                });

                res.on('end', () => {
                    resolve(payload);
                });
            }).on('error', reject);
        });
    },
    /**
     * Sends a HTTPS GET request and parses JSON response
     * @param {String|URL} url 
     * @returns {Promise} Returns promise with resolve(response, http.IncomingMessage)
     */
    getJSON: function(url) {
        return new Promise((resolve, reject) => {
            if (!url) reject("No URL.");
            module.exports.getHTTPS(url).then(payload => {
                try {
                    let obj = JSON.parse(payload);
                    resolve(obj);
                } catch (err) {
                    reject(err);
                }
            }).catch(reject);
        });
    },
    /**
     * Sends a HTTPS GET request, iterates through regex, and returns any capture goups in an object 
     * with the same keys as regex. Multiple groups or matches return as an array
     * @param {String|URL} url 
     * @param {RegExp} regex 
     * @returns {Promise} Returns promise with resolve(response, http.IncomingMessage)
     */
    getMatches: function(url, regex) {
        return new Promise((resolve, reject) => {
            if (!url || !regex) reject("Invalid Arguments.");
            module.exports.getHTTPS(url).then(body => {
                let payload = {};
                let m;
                for (let i in regex) { // For each regular expression...
                    while ((m = regex[i].exec(body)) != null) { // Look for matches...
                        if (!payload[i]) payload[i] = []; // Create an empty array if needed
                        if (m.length > 1) for (let a of m.slice(1)) payload[i].push(a); // If the regex includes groups
                        else payload[i].push(m[0]); // If the regex does not
                    }
                    if (payload[i] && payload[i].length == 1) payload[i] = payload[i][0]; // Convert to string if the only element
                }
                resolve(payload);
            }).catch(reject);
        });
    },
    /**
     * Performs modified getMatch() call that returns an array of IDs
     * @param {String|URL} url Base quicksearch URL
     * @param {String} query Query like a name
     * @param {RegExp} regex 
     * @returns {Promise} Returns promise with resolve(response, http.IncomingMessage)
     */
    quickSearch: function(query, regex) {
        let url = "https://mangadex.org/quick_search/";
        return new Promise((resolve, reject) => {
            if (!query || !regex) reject("Invalid Arguments.");
            module.exports.getMatches(url + encodeURIComponent(query), {
                "results": regex,
                "error": /<!-- login_container -->/gmi // Only appears when not logged in.
            }).then(matches => {
                if (matches.error != undefined) reject("MangaDex is in DDOS mitigation mode. No search available. Not using agent?");

                if (!matches.results) matches.results = [];
                if (!(matches.results instanceof Array)) matches.results = [matches.results];
                matches.results.forEach((e, i, a)=> { a[i] = parseInt(e); });
                resolve(matches.results);
            }).catch(reject);
        });
    },
    /**
     * Returns a random string following the mfa[0-1000] pattern
     */
    generateMultipartBoundary: function() {
        return "mfa" + Math.floor(Math.random() * 1000).toString();
    },
    /**
     * Returns multipart payload for POST requests
     * @param {String} boundary Any String
     * @param {Object} obj Name-Content Key-Value Pairs
     */
    generateMultipartPayload: function(boundary = "mfa", obj = {}) {
        payload = "";
        for (let i in obj) {
            payload +=  `--${boundary}\n` +
                        `Content-Disposition: form-data; name="${i}"\n` +
                        `\n` +
                        `${obj[i]}\n`;
        }
        payload += `--${boundary}--`;
        return payload;
    },
    /**
     * Gets a key by value.
     * @param {Object}
     * @param {String} value 
     * @returns {String}
     */
    getKeyByValue: function(obj, value) {
        // Direct search
        let keyResult = Object.keys(obj).find(key => obj[key] === value);
        if (keyResult) return keyResult;

        // Includes value
        if (typeof value === "string") keyResult = Object.keys(obj).find(key => obj[key].toLowerCase().includes(value));
        return keyResult;
    },
    /**
     * Convert a key and value array to a key array
     * @param {Object} en Enum object with integer keys
     * @param {Array} arr Element array 
     */
    parseEnumArray: function(en, arr) {
        let newArray = [];
        for (let i in arr) {
            if (isNaN(arr[i])) {
                let elem = this.getKeyByValue(en, arr[i]);
                if (elem) newArray.push(elem);
            } else newArray.push(arr[i]);
        }
        return newArray;
    }
};