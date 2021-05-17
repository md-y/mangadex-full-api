'use strict';

const HTTPS = require('https');
const Fs = require('fs');
const Path = require('path');

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
        if (endpoint === undefined || typeof(endpoint) !== 'string') reject(new Error('Invalid argument(s)'));
        if (endpoint[0] !== "/") endpoint = `/${endpoint}`;

        let headerObj = {};
        if (method !== 'GET') headerObj['content-type'] = 'application/json';
        if (AuthUtil.sessionToken) headerObj['authorization'] = `bearer ${AuthUtil.sessionToken}`;

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
                        resolve(JSON.parse(responsePayload));
                    } catch (error) {
                        reject(new Error(
                            `Server returned invalid data: Failed to parse HTTPS ${method} ` +
                            `Response (${endpoint}) as JSON despite Content-Type ` + 
                            `Header: ${res.headers['content-type']}\n${error}`
                        ));
                    }
                } else resolve(responsePayload);
            });

            res.on('error', (error) => {
                reject(new Error(`HTTPS ${method} Response (${endpoint}) returned an error:\n${error}`));
            });
        }).on('error', (error) => {
            reject(new Error(`HTTPS ${method} Request (${endpoint}) returned an error:\n${error}`));
        });
        
        if (method !== 'GET') {
            if (typeof(requestPayload) !== 'string') {
                try {
                    req.write(JSON.stringify(requestPayload));
                } catch(err) {
                    reject(new Error("Invalid request payload."));
                }
            } else req.write(requestPayload);
        }
        req.end();
    });
};
exports.apiRequest = apiRequest;

/**
 * Performs a custom request that converts an object of parameters to an endpoint URL with parameters.
 * @param {String} baseEndpoint Endpoint with no parameters
 * @param {Object} parameterObject Object of search parameters based on API specifications
 * @returns {Promise<APIResponse>}
 */
function apiParameterRequest(baseEndpoint, parameterObject) {
    return new Promise(async (resolve, reject) => {
        if (typeof(baseEndpoint) !== 'string' || typeof(parameterObject) !== 'object') reject(new Error('Invalid Argument(s)'));
        let endpoint = `${baseEndpoint}?`;
        for (let i in parameterObject) {
            if (parameterObject[i] instanceof Array) parameterObject[i].forEach(e => endpoint += `${i}[]=${e}&`);
            else endpoint += `${i}=${parameterObject[i]}&`;
        }
        try {
            let res = await apiRequest(encodeURI(endpoint.slice(0, -1))); // Remove last char because its an extra & or ?
            if (getResponseStatus(res) !== 'ok' || res.results === undefined || !(res.results instanceof Array)) 
                reject(new Error(`Failed to perform search:\n${getResponseMessage(res)}`));
            resolve(res.results);
        } catch (error) {
            reject(error);
        }
    });
}
exports.apiParameterRequest = apiParameterRequest;

/**
 * Finds the status of a response from the API. Either 'ok', 'captcha', 'error', 'no-data', or 'multiple'.
 * The 'multiple' status is when the response is an array with different status for different elements.
 * @param {APIResponse} res Response from API to parse.
 * @returns {'ok'|'captcha'|'error'|'no-data'|'multiple'}
 */
function getResponseStatus(res) {
    if (res === undefined || typeof(res) !== 'object' || Object.keys(res).length === 0) return 'no-data';
    if (res instanceof Array) {
        let arrayStatus = res.map(e => getResponseStatus(e));
        if (arrayStatus.some(e => e !== arrayStatus[0])) return 'multiple';
        return arrayStatus[0];
    } else {
        if ('results' in res) return getResponseStatus(res.results);
        if ('errors' in res && res.errors instanceof Array) {
            if (res.errors.some(elem => elem.title.toLowerCase().indexOf('captcha') >= 0)) return 'captcha';
            return 'error';
        }
        if ('result' in res) {
            let result = res.result.toLowerCase();
            if (result === 'ok' || result === 'string') return 'ok';
            else if (result.indexOf('captcha') >= 0) return 'captcha';
            return 'error';
        } 
    }
    return 'ok';
};
exports.getResponseStatus = getResponseStatus;

/**
 * Finds the specific response message from an API response. 
 * For finding the general status of a response, use 'getResponseStatus()'; 
 * this is mostly for getting error messages for debugging purposes.
 * @param {APIResponse} res Response from API to parse.
 * @returns {String}
 */
function getResponseMessage(res) {
    if (res === undefined || res === null) return 'Unknown Message (No Data)';
    if (typeof(res) !== 'object') return res;
    if ('errors' in res) {
        if (res.errors.length == 1) return `API Error: (${res.errors[0].status}/${res.errors[0].title}) ${res.errors[0].detail}`;
        return res.errors.map(e, i => `API Error ${i}: (${e.status}/${e.title}) ${e.detail}`).join('\n');
    }
    if ('result' in res) return res.result;
    return res;
}
exports.getResponseMessage = getResponseMessage;

class AuthUtil {
    /** @type {String} */
    static sessionToken;
    /** @type {String} */
    static refreshToken;

    /**
     * @param {String} username 
     * @param {String} password 
     * @param {String} [cacheLocation]
     * @returns {Promise}
     */
    static login(username, password, cacheLocation = null) {
        return new Promise(async (resolve, reject) => {
            if (username === undefined || password === undefined) reject(new Error('Invalid argument(s)'));

            // Read refresh token from file
            if (cacheLocation) {
                try {
                    if (!Path.basename(cacheLocation).includes('.')) cacheLocation = Path.join(cacheLocation, '.md_token');
                    if (Fs.existsSync(cacheLocation)) {
                        let tokenArray = Fs.readFileSync(cacheLocation).toString().split(';');
                        if (tokenArray.length < 2) Fs.unlinkSync(cacheLocation); // Delete corrupted file
                        else {
                            AuthUtil.refreshToken = tokenArray[0];
                            AuthUtil.sessionToken = tokenArray[1];
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            }

            // Attempt to use that refresh token to login, but continue to login if it fails
            if (AuthUtil.refreshToken) {
                try {
                    await AuthUtil.validateTokens();
                    return resolve();
                } catch (error) {
                    AuthUtil.refreshToken = null;
                }
            }

            // Login
            try {
                let res = await apiRequest('/auth/login', 'POST', { username: username, password: password });
                if (getResponseStatus(res) !== 'ok') reject(`Failed to login: ${getResponseMessage(res)}`);
                AuthUtil.sessionToken = res.token.session;
                AuthUtil.refreshToken = res.token.refresh;
                if (cacheLocation) Fs.writeFileSync(cacheLocation, `${AuthUtil.refreshToken};${AuthUtil.sessionToken}`);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
     * @param {String} [token] Refresh token
     * @returns {Promise<String>} Session Token
     */
    static validateTokens(token) {
        return new Promise(async (resolve, reject) => {
            if (token) AuthUtil.refreshToken = token;
            else if (!AuthUtil.refreshToken) reject(new Error(`No refresh token. Logged in?`));
            if (AuthUtil.sessionToken) {
                try {
                    let res = await apiRequest('/auth/check');
                    if (getResponseStatus(res) === 'ok' && res.isAuthenticated) return resolve(AuthUtil.sessionToken);
                } catch (error) {
                    // If it fails the check, refresh it in the next try-catch block
                    AuthUtil.sessionToken = null;
                }
            }

            try {
                let res = await apiRequest('/auth/refresh', 'POST', { token: AuthUtil.refreshToken });
                if (getResponseStatus(res) !== 'ok') reject(new Error(`Failed to refresh token: ${getResponseMessage(res)}`));
                AuthUtil.sessionToken = res.token.session;
                AuthUtil.refreshToken = res.token.refresh;
                resolve(AuthUtil.sessionToken);
            } catch (err) {
                reject(err);
            }
        })
    }
}
exports.AuthUtil = AuthUtil;