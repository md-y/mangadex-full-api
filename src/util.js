'use strict';

const HTTPS = require('https');
const Fs = require('fs');
const Path = require('path');
const APIRequestError = require('./internal/requesterror.js');

/**
 * @typedef {(Object|Object[])} APIResponse
 */

/**
 * Sends a HTTPS request to a specified endpoint
 * @param {String} endpoint API endpoint (ex: /ping)
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method='GET'] GET, POST, PUT, or DELETE. (Default: GET)
 * @param {Object} [requestPayload] Payload used for POST and DELETE requests
 * @returns {Promise<APIResponse>}
 */
function apiRequest(endpoint, method = 'GET', requestPayload = {}) {
    return new Promise((resolve, reject) => {
        if (endpoint === undefined || typeof endpoint !== 'string') reject(new Error('Invalid Argument(s)'));
        if (endpoint[0] !== '/') endpoint = `/${endpoint}`;

        let headerObj = {};
        if (method !== 'GET') headerObj['content-type'] = 'application/json';
        if (AuthUtil.sessionToken) headerObj['authorization'] = `bearer ${AuthUtil.sessionToken}`;
        // console.log(endpoint, 'authorization' in headerObj);

        const req = HTTPS.request({
            hostname: 'api.mangadex.org',
            path: endpoint,
            method: method,
            headers: headerObj
        }, (res) => {
            let responsePayload = '';

            res.on('data', (data) => {
                responsePayload += data;
            });

            res.on('end', () => {
                if (res.headers['content-type'] !== undefined && res.headers['content-type'].includes('json')) {
                    try {
                        let parsedObj = JSON.parse(responsePayload);
                        if (parsedObj === null) reject(new APIRequestError(`HTTPS ${method} Response (${endpoint}) returned null`, APIRequestError.INVALID_RESPONSE));
                        if (res.statusCode < 400 || res.result === 'ok') resolve(parsedObj);
                        else reject(new APIRequestError(parsedObj));
                    } catch (error) {
                        reject(new APIRequestError(
                            `Failed to parse HTTPS ${method} ` +
                            `Response (${endpoint}) as JSON despite Content-Type ` +
                            `Header: ${res.headers['content-type']}\n${error}`
                        ), APIRequestError.INVALID_RESPONSE);
                    }
                } else {
                    if (res.statusCode === 429 || res.toLowerCase().includes('rate limited')) reject(new APIRequestError('You have been rate limited', APIRequestError.INVALID_RESPONSE));
                    else if (res.statusCode >= 400) reject(new APIRequestError(`Returned HTML error page ${res}`, APIRequestError.INVALID_RESPONSE));
                    else resolve(responsePayload);
                }
            });

            res.on('error', (error) => {
                reject(new APIRequestError(`HTTPS ${method} Response (${endpoint}) returned an error:\n${error}`));
            });
        }).on('error', (error) => {
            reject(new APIRequestError(`HTTPS ${method} Request (${endpoint}) returned an error:\n${error}`));
        });

        if (method !== 'GET') {
            if (typeof requestPayload !== 'string') {
                try {
                    req.write(JSON.stringify(requestPayload));
                } catch (err) {
                    reject(new Error('Invalid payload object.'));
                }
            } else req.write(requestPayload);
        }
        req.end();
    });
};
exports.apiRequest = apiRequest;

/**
 * Performs a custom request that converts an object of parameters to an endpoint URL with parameters.
 * If the response contains a results array, that is returned instead
 * @param {String} baseEndpoint Endpoint with no parameters
 * @param {Object} parameterObject Object of search parameters based on API specifications
 * @returns {Promise<APIResponse|APIResponse[]>}
 */
async function apiParameterRequest(baseEndpoint, parameterObject) {
    if (typeof baseEndpoint !== 'string' || typeof parameterObject !== 'object') throw new Error('Invalid Argument(s)');
    let cleanParameters = {};
    for (let i in parameterObject) {
        if (parameterObject[i] instanceof Array) cleanParameters[i] = parameterObject[i].map(elem => {
            // Arrays are kept in their arrays because the query name is repeated and cannot be represented as pairs (?key[]=1&key[]=2)
            if (typeof elem === 'string') return elem;
            if (typeof elem === 'object' && 'id' in elem) return elem.id;
            return elem.toString();
        });
        else if (typeof parameterObject[i] === 'object') {
            // Objects are represented as new properties with a key of 'object[property]'
            Object.keys(parameterObject[i]).forEach(elem => cleanParameters[`${i}[${elem}]`] = parameterObject[i][elem]);
        }
        else if (typeof parameterObject[i] !== 'string') cleanParameters[i] = parameterObject[i].toString();
        else cleanParameters[i] = parameterObject[i];
    }

    let endpoint = `${baseEndpoint}?`;
    for (let i in cleanParameters) {
        if (cleanParameters[i] instanceof Array) cleanParameters[i].forEach(e => endpoint += `${i}[]=${e}&`);
        else endpoint += `${i}=${cleanParameters[i]}&`;
    }
    return await apiRequest(encodeURI(endpoint.slice(0, -1))); // Remove last char because its an extra & or ?
}
exports.apiParameterRequest = apiParameterRequest;

/**
 * Same as apiParameterRequest, but optimized for search requests. 
 * Allows for larger searches (more than the limit max, even to Infinity) through mutliple requests, and
 * this function always returns an array instead of the normal JSON object.
 * @param {String} baseEndpoint Endpoint with no parameters
 * @param {Object} parameterObject Object of search parameters based on API specifications
 * @param {Number} [maxLimit=100] What is the maximum number of results that can be returned from this endpoint at once?
 * @param {Number} [defaultLimit=10] How many should be returned by default?
 * @returns {Promise<APIResponse[]>}
 */
async function apiSearchRequest(baseEndpoint, parameterObject, maxLimit = 100, defaultLimit = 10) {
    if (typeof baseEndpoint !== 'string' || typeof parameterObject !== 'object') throw new Error('Invalid Argument(s)');
    let limit = 'limit' in parameterObject ? parameterObject.limit : defaultLimit;
    if (limit <= 0) return [];
    let res = await apiParameterRequest(baseEndpoint, { ...parameterObject, limit: Math.min(limit, maxLimit) });
    let finalArray = res.results;
    if (!(finalArray instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
    if (limit > maxLimit && finalArray.length === maxLimit && res.offset + res.limit < res.total) {
        parameterObject.limit = limit - maxLimit;
        parameterObject.offset = ('offset' in parameterObject ? parameterObject.offset : 0) + maxLimit;
        let newRes = await apiSearchRequest(baseEndpoint, parameterObject);
        finalArray = finalArray.concat(newRes);
    }
    return finalArray;
}
exports.apiSearchRequest = apiSearchRequest;

/**
 * @param {String} endpoint
 * @param {Object} classObject
 * @param {Object} parameterObject
 * @param {Number} [maxLimit=100] What is the maximum number of results that can be returned from this endpoint at once?
 * @param {Number} [defaultLimit=10] How many should be returned by default?
 * @returns {Promise<APIResponse[]>}
 */
async function apiCastedRequest(endpoint, classObject, parameterObject = {}, maxLimit = 100, defaultLimit = 10) {
    let res = await apiSearchRequest(endpoint, parameterObject, maxLimit, defaultLimit);
    return res.map(elem => new classObject(elem));
}
exports.apiCastedRequest = apiCastedRequest;

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
    /** @type {String} */
    static sessionToken;
    /** @type {String} */
    static refreshToken;
    /** @type {String} */
    static cacheLocation;
    /** @type {String} */
    static authUser;
    /** @type {Boolean} */
    static canAuth = false;
    /** @type {Number} */
    static timeOfRefresh;

    /**
     * @param {String} username 
     * @param {String} password 
     * @param {String} [cacheLocation]
     * @returns {Promise<void>}
     */
    static async login(username, password, cacheLocation) {
        if (username === undefined || password === undefined) throw new Error('Invalid Argument(s)');
        AuthUtil.canAuth = true;
        // Read refresh token from file
        if (cacheLocation) {
            try {
                if (!Path.basename(cacheLocation).includes('.')) cacheLocation = Path.join(cacheLocation, '.md_token');
                if (AuthUtil.readFromCache(cacheLocation) && AuthUtil.authUser === username) {
                    await AuthUtil.validateTokens();
                    return;
                }
            } catch (error) {
                // Continue and retry at login
                AuthUtil.refreshToken = null;
                AuthUtil.sessionToken = null;
                AuthUtil.timeOfRefresh = null;
            }
        }

        // Login
        AuthUtil.authUser = username;
        let res = await apiRequest('/auth/login', 'POST', { username: username, password: password });
        AuthUtil.sessionToken = res.token.session;
        AuthUtil.refreshToken = res.token.refresh;
        AuthUtil.timeOfRefresh = Date.now();
        if (cacheLocation) AuthUtil.writeToCache(cacheLocation);
        return;
    }

    /**
     * @param {String} [token] Refresh token
     * @returns {Promise<String>} Session Token
     */
    static async validateTokens(token) {
        if (typeof AuthUtil.timeOfRefresh === 'number' && Date.now() - AuthUtil.timeOfRefresh < 870000) {
            // Don't refresh if the token was refreshed less than 14.5 minutes ago (15 is the maximum age)
            return AuthUtil.sessionToken;
        }

        if (token) AuthUtil.refreshToken = token;
        if (!AuthUtil.canAuth || !AuthUtil.refreshToken) throw new APIRequestError('Not logged in.', APIRequestError.AUTHORIZATION);
        // Check if session token is out of date:
        if (AuthUtil.sessionToken) {
            try {
                let res = await apiRequest('/auth/check');
                if (res.isAuthenticated) return AuthUtil.sessionToken;
            } catch (error) {
                // If it fails the check, refresh it in the next try-catch block
                AuthUtil.sessionToken = null;
                AuthUtil.timeOfRefresh = null;
            }
        }

        // Refresh token/Check if refresh token is out of date
        let res = await apiRequest('/auth/refresh', 'POST', { token: AuthUtil.refreshToken });
        AuthUtil.sessionToken = res.token.session;
        AuthUtil.refreshToken = res.token.refresh;
        AuthUtil.timeOfRefresh = Date.now();
        AuthUtil.writeToCache();
        return AuthUtil.sessionToken;
    }

    /**
     * Writes the current state of authentication to a file
     * @param {String} [cacheLocation] 
     * @returns {Boolean} True of OK, False if not
     */
    static writeToCache(cacheLocation) {
        if (cacheLocation) AuthUtil.cacheLocation = cacheLocation;
        if (AuthUtil.cacheLocation) {
            try {
                Fs.writeFileSync(AuthUtil.cacheLocation, `${AuthUtil.authUser}\n${AuthUtil.refreshToken}\n${AuthUtil.sessionToken}`);
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    /**
     * Reads the state of authentication from a file
     * @param {String} cacheLocation 
     * @returns {Boolean} True of OK, False if not
     */
    static readFromCache(cacheLocation) {
        if (cacheLocation) AuthUtil.cacheLocation = cacheLocation;
        if (AuthUtil.cacheLocation) {
            try {
                if (!Fs.existsSync(AuthUtil.cacheLocation)) return false;
                let tokenArray = Fs.readFileSync(AuthUtil.cacheLocation).toString().split('\n');
                if (tokenArray.length < 3) return false;
                AuthUtil.authUser = tokenArray[0];
                AuthUtil.refreshToken = tokenArray[1];
                AuthUtil.sessionToken = tokenArray[2];
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;
    }
}
exports.AuthUtil = AuthUtil;