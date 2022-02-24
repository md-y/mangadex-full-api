'use strict';

const Util = require('./util.js');
var fs, Path;
if (!Util.isBrowser()) {
    fs = require('fs');
    Path = require('path');
}
const APIRequestError = require('./internal/requesterror.js');

/**
 * Any function that requires authentication should call 'validateTokens().'
 * How authentication works:
 * If there is no cache or its invalid, simply request tokens through logging in ('login()').
 * If there is a cache, check if the tokens are up to date ('validateTokens()').
 * If the session token is out of date, refresh it ('validateTokens()').
 * If the refresh token is out of date, log in again ('login()').
 * At most there are three calls to the API, two of which are rate limited (/auth/refresh and /auth/login).
 */
class AuthUtil {
    /** @type {Boolean} */
    static canAuth = false;
    /** @type {Cache} */
    static cache;

    /**
     * @param {String} username 
     * @param {String} password 
     * @param {String} [cacheLocation]
     * @returns {Promise<void>}
     */
    static async login(username, password, cacheLocation) {
        if (username === undefined || password === undefined) throw new Error('Invalid Argument(s)');

        AuthUtil.canAuth = true;
        if (Util.isBrowser()) AuthUtil.cache = new BrowserCache(cacheLocation, username);
        else AuthUtil.cache = new Cache(cacheLocation, username);

        // Check if the cache tokens are still valid
        if (await AuthUtil.cache.read()) {
            try {
                let token = await AuthUtil.validateTokens(true);
                if (token === AuthUtil.token) return;
            } catch (error) { }
        }

        // Login if the cache is not valid or missing
        let res = await Util.apiRequest('/auth/login', 'POST', { username: username, password: password });
        if (!('token') in res) throw new APIRequestError('The API did not respond with any tokens when logging in', APIRequestError.INVALID_RESPONSE);
        AuthUtil.cache.write({ ...res.token, date: Date.now() });
        AuthUtil.updateHeader();
    }

    /**
     * Checks if the current tokens are valid and refreshes them if needed
     * @param {Boolean} [force] If false, will not skip validation based on the last verification time
     * @returns {Promise<String>} Returns session token
     */
    static async validateTokens(force = false) {
        if (!AuthUtil.canAuth) throw new APIRequestError('Not logged in.', APIRequestError.AUTHORIZATION);
        AuthUtil.updateHeader();

        // Don't refresh if the token was refreshed less than 14.9 minutes ago (15 is the maximum age)
        if (!force && Date.now() - AuthUtil.cache.date < 894000) return AuthUtil.token;

        // Check if session token is out of date:
        let res = await Util.apiRequest('/auth/check');
        if (res.isAuthenticated) return AuthUtil.token;

        // Refresh token
        return await AuthUtil.refreshToken();
    }
    
    /**
     * Refreshes the current token.
     * @returns {Promise<String>} Returns session token
     */
    static async refreshToken() {
        res = await Util.apiRequest('/auth/refresh', 'POST', { token: AuthUtil.cache.refresh });
        if (!('token') in res) throw new APIRequestError('The API did not respond with any tokens when refreshing tokens', APIRequestError.INVALID_RESPONSE);
        AuthUtil.cache.write({ ...res.token, date: Date.now() });
        AuthUtil.updateHeader();
        return AuthUtil.token;
    }

    /**
     * Updates the authorization header with the session current token
     */
    static updateHeader() {
        Util.registerHeader('authorization', `bearer ${AuthUtil.token}`);
    }

    static get token() {
        return AuthUtil.cache.session;
    }
}

class Cache {
    /** @type {Object} */
    static allUsers = {};

    /**
     * @param {String} location File location or localStorage key
     */
    constructor(location, user) {
        this.location = location;
        this.user = user;
    }

    /**
     * Retrieves the information of a user from a string of all users, or 
     * retrieves the information of all users as a string from the object of one user.
     * Also updates any changed information for all instances.
     * Returns null if the user object is invalid
     * @param {Object|String} obj 
     * @returns {Object|String|null}
     */
    parse(obj) {
        const KEYS = [['session', 'string'], ['refresh', 'string'], ['date', 'number']];

        let read = typeof obj === 'string';
        if (read) {
            try {
                Cache.allUsers = JSON.parse(obj);
                if (!(this.user in Cache.allUsers)) return null;
                obj = Cache.allUsers[this.user];
            } catch (error) {
                return null;
            }
        }

        // Return null if any keys are missing or if their types are wrong
        if (KEYS.some(key => !(key[0] in obj) || typeof obj[key[0]] !== key[1])) return null;

        if (read) return obj; // Returns target user as an object
        else {
            Cache.allUsers[this.user] = obj;
            return JSON.stringify(Cache.allUsers); // Returns all users as a string
        }
    }

    /** @returns {String} */
    get session() {
        if (!(this.user) in Cache.allUsers) return undefined;
        return Cache.allUsers[this.user].session;
    }

    /** @returns {String} */
    get refresh() {
        if (!(this.user) in Cache.allUsers) return undefined;
        return Cache.allUsers[this.user].refresh;
    }

    /** @returns {Number} */
    get date() {
        if (!(this.user) in Cache.allUsers) return undefined;
        return Cache.allUsers[this.user].date;
    }

    /**
     * Reads from file using 'fs'
     * @returns {Boolean} False if failed
     */
    read() {
        if (this.user in Cache.allUsers && this.session !== undefined) return true; // No need to read if we already have the info
        if (!this.location || !fs.existsSync(this.location)) return false; // Won't throw error if file doesn't exist
        if (fs.lstatSync(this.location).isDirectory()) {
            this.location = Path.join(this.location, '.md_tokens'); // Default name for the file is this
            if (!fs.existsSync(this.location)) return false;
        }
        let res = fs.readFileSync(this.location).toString(); // Will throw error if the file cannot be read
        return this.parse(res) !== null;
    }

    /**
     * Write to file using 'fs'
     * @param {Object} obj
     * @returns {Boolean} False if failed
     */
    write(obj) {
        let str = this.parse(obj);
        if (str !== null && this.location !== undefined) fs.writeFileSync(this.location, str); // Will throw error if the file cannot be written
    }
}

class BrowserCache extends Cache {
    /**
     * Reads from localStorage
     * @returns {Boolean} False if failed
     */
    read() {
        if (this.location === undefined) this.location = 'md_tokens';
        if (!window.localStorage.getItem(this.location)) return false;
        let res = window.localStorage.getItem(this.location);
        return this.parse(res) !== null;
    }

    /**
     * Writes to localStorage
     * @param {Object} obj
     * @returns {Boolean} False if failed
     */
    write(obj) {
        let str = this.parse(obj);
        if (str !== null && this.location !== undefined) window.localStorage.setItem(this.location, str);
    }
}

exports = module.exports = AuthUtil;
