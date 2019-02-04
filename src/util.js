const https = require("https")

module.exports = {
    /**
     * Sends a HTTPS GET request. 
     * @param {String|URL} url 
     * @param {Function} callback Takes response payload and http.IncomingMessage as arguments
     */
    getHTTPS: function(url, callback) {
        return https.get(url, (res) => {
            let payload = "";

            res.on('data', (data) => {
                payload += data;
            });

            res.on('end', () => {
                callback(payload, res);
            });
        }).on('error', console.log);
    },
    /**
     * Sends a HTTPS GET request and parses JSON response
     * @param {String|URL} url 
     * @param {Function} callback Takes parsed JSON and http.IncomingMessage as arguments
     */
    getJSON: function(url, callback) {
        return module.exports.getHTTPS(url, (payload, res) => {
            if (res.headers["content-type"] == "application/json") callback(JSON.parse(payload), res);
            else console.error("Response header not application/json.");
        });
    },
    /**
     * Sends a HTTPS GET request, iterates through regex, and returns any capture goups in an object 
     * with the same keys as regex. Multiple groups or matches return as an array
     * @param {String|URL} url 
     * @param {RegExp} regex 
     * @param {Function} callback Takes match object and http.IncomingMessage as arguments
     */
    getMatches: function(url, regex, callback) {
        return module.exports.getHTTPS(url, (body, res) => {
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
            callback(payload, res);
        });
    },
    /**
     * Performs modified getMatch() call that returns an array of IDs
     * @param {String|URL} url Base quicksearch URL
     * @param {String} query Query like a name
     * @param {RegExp} regex 
     * @param {Function} callback Takes match object and http.IncomingMessage as arguments
     */
    quickSearch: function(url, query, regex, callback) {
        return module.exports.getMatches(url + encodeURIComponent(query), {
            "results": regex,
        }, (matches, res) => {
            if (!matches.results) matches.results = [];
            if (!(matches.results instanceof Array)) matches.results = [matches.results];
            matches.results.forEach((e, i, a)=> {a[i] = parseInt(e)});
            callback(matches.results, res);
        });
    }
}