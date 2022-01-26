'use strict';

const HTTPS = require('https');
const APIRequestError = require('./internal/requesterror.js');

const MAX_REQUESTS_PER_SECOND = 5; // The global minimum limit for normal endpoints is 5 requests per second
const MAX_POSSIBLE_LIMIT = 10000; // MD has a hard max of 10000 items for every endpoint
const MULTIPART_BOUNDARY = `mfa-boundary-${Date.now().toString(16)}`;
var requestHeaders = {};
var activeRequestCount = 0;

/**
 * Being a browser only affects how tokens are stored, so localStorage's existance is the only thing checked
 * @returns {Boolean}
 */
function isBrowser() {
    try {
        return window !== undefined && window !== null && window.localStorage !== undefined && window.localStorage !== null;
    } catch (error) {
        return false;
    }
}
exports.isBrowser = isBrowser;

/**
 * Sets a specific header value to be used by every api request
 * @param {String} name Header key
 * @param {String} value Header value
 */
function registerHeader(name, value) {
    requestHeaders[name] = value;
}
exports.registerHeader = registerHeader;

if (!isBrowser()) {
    const packageJSON = require('../package.json');
    registerHeader('User-Agent', `mangadex-full-api/${packageJSON.version} Server-side Node`);
}

/**
 * Sends a HTTPS request to a specified endpoint
 * @param {String} endpoint API endpoint (ex: /ping)
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method='GET'] GET, POST, PUT, or DELETE. (Default: GET)
 * @param {Object|String|Buffer} [requestPayload] Payload used for POST and DELETE requests
 * @returns {Promise<Object>}
 */
function apiRequest(endpoint, method = 'GET', requestPayload = {}) {
    return new Promise(async (resolve, reject) => {
        if (endpoint === undefined || typeof endpoint !== 'string') reject(new Error('Invalid Argument(s)'));
        if (endpoint[0] !== '/') endpoint = `/${endpoint}`;

        activeRequestCount++;
        if (activeRequestCount >= MAX_REQUESTS_PER_SECOND) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.floor(activeRequestCount / MAX_REQUESTS_PER_SECOND)));
        }

        // console.log(endpoint, 'authorization' in requestHeaders, activeRequestCount);

        let localHeaders = { ...requestHeaders };
        if (method !== 'GET') {
            if (typeof requestPayload !== 'object') localHeaders['Content-Type'] = `text/plain`;
            else if (requestPayload instanceof Buffer) localHeaders['Content-Type'] = `multipart/form-data; boundary=${MULTIPART_BOUNDARY}`;
            else localHeaders['Content-Type'] = 'application/json';
        }

        const req = HTTPS.request({
            hostname: 'api.mangadex.org',
            path: endpoint,
            method: method,
            headers: localHeaders
        }, (res) => {
            let responsePayload = '';

            res.on('data', (data) => {
                responsePayload += data;
            });

            res.on('end', () => {
                activeRequestCount--;
                if ('set-cookie' in res.headers && !isBrowser()) registerHeader('cookie', res.headers['set-cookie'].concat(requestHeaders['cookie']).join('; '));
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
                    if (res.statusCode === 429) reject(new APIRequestError('You have been rate limited', APIRequestError.INVALID_RESPONSE));
                    else if (res.statusCode >= 400) reject(new APIRequestError(`Returned HTML error page ${responsePayload}`, APIRequestError.INVALID_RESPONSE));
                    else if (res.statusCode >= 300) reject(new APIRequestError(`Bad/moved endpoint: ${endpoint}`, APIRequestError.INVALID_REQUEST));
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
            if (localHeaders['Content-Type'] === 'application/json') {
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
 * @returns {Promise<Object|Object[]>}
 */
async function apiParameterRequest(baseEndpoint, parameterObject) {
    if (typeof baseEndpoint !== 'string' || typeof parameterObject !== 'object') throw new Error('Invalid Argument(s)');
    let params = new URLSearchParams();
    for (let [key, value] of Object.entries(parameterObject)) {
        if (value instanceof Array) value.forEach(elem => params.append(`${key}[]`, elem));
        else if (typeof value === 'object') Object.entries(value).forEach(([k, v]) => params.set(`${key}[${k}]`, v));
        else params.set(key, value);
    }
    let paramsString = params.toString();
    return await apiRequest(baseEndpoint + (paramsString.length > 0 ? '?' + paramsString : paramsString));
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
 * @returns {Promise<Object[]>}
 */
async function apiSearchRequest(baseEndpoint, parameterObject, maxLimit = 100, defaultLimit = 10) {
    if (typeof baseEndpoint !== 'string' || typeof parameterObject !== 'object') throw new Error('Invalid Argument(s)');
    let limit = 'limit' in parameterObject ? parameterObject.limit : defaultLimit;
    let initialOffset = 'offset' in parameterObject ? parameterObject.offset : 0;
    if (limit > MAX_POSSIBLE_LIMIT) limit = MAX_POSSIBLE_LIMIT;
    if (initialOffset > MAX_POSSIBLE_LIMIT - Math.min(maxLimit, limit)) limit = MAX_POSSIBLE_LIMIT - initialOffset;
    if (limit <= 0 || initialOffset >= MAX_POSSIBLE_LIMIT) return [];

    // Need at least one request to find the total items available:
    let initialResponse = await apiParameterRequest(baseEndpoint, { ...parameterObject, limit: Math.min(limit, maxLimit) });
    if (!(initialResponse.data instanceof Array) || typeof initialResponse.total !== 'number') {
        throw new APIRequestError(`The API did not respond the correct structure for a search request:\n${JSON.stringify(initialResponse)}`, APIRequestError.INVALID_RESPONSE);
    }
    // Return if only one request is needed (either the limit is low enough for one request or one request returned all available results)
    if (limit <= maxLimit || initialResponse.total <= initialResponse.data.length + initialOffset) return initialResponse.data.map(elem => { return { data: elem }; });

    // Subsequent concurrent requests for the rest of the results:
    limit = Math.min(initialResponse.total, limit);
    let promises = [];
    for (let offset = initialOffset + maxLimit; offset < limit; offset += maxLimit) {
        promises.push(apiParameterRequest(baseEndpoint, { ...parameterObject, limit: Math.min(limit - offset, maxLimit), offset: offset }));
    }
    let finalArray = initialResponse.data;
    for (let elem of await Promise.all(promises)) {
        if (!(elem.data instanceof Array)) {
            throw new APIRequestError(`The API did not respond the correct structure for a search request:\n${JSON.stringify(elem)}`, APIRequestError.INVALID_RESPONSE);
        }
        finalArray = finalArray.concat(elem.data);
    }
    return finalArray.map(elem => { return { data: elem }; }); // Emulate an array of standard manga objects from the /manga/<id> endpoint
}
exports.apiSearchRequest = apiSearchRequest;

/**
 * @param {String} endpoint
 * @param {Object} classObject
 * @param {Object} parameterObject
 * @param {Number} [maxLimit=100] What is the maximum number of results that can be returned from this endpoint at once?
 * @param {Number} [defaultLimit=10] How many should be returned by default?
 * @returns {Promise<Object[]>}
 */
async function apiCastedRequest(endpoint, classObject, parameterObject = {}, maxLimit = 100, defaultLimit = 10) {
    let res = await apiSearchRequest(endpoint, parameterObject, maxLimit, defaultLimit);
    return res.map(elem => new classObject(elem));
}
exports.apiCastedRequest = apiCastedRequest;

/**
 * Retrieves an unlimted amount of an object via a search function and id array
 * @param {Function} searchFunction
 * @param {String[]|String[][]} ids
 * @param {Number} [limit=100]
 * @param {String} [searchProperty='ids']
 * @returns {Promise<Array>}
 */
async function getMultipleIds(searchFunction, ids, limit = 100, searchProperty = 'ids') {
    let newIds = ids.flat().map(elem => {
        if (typeof elem === 'string') return elem;
        else if (elem === undefined || elem === null) throw new Error(`Invalid id: ${elem}`);
        else if (typeof elem === 'object' && 'id' in elem) return elem.id;
        else return elem.toString();
    });
    let promises = [];
    // Create new search requests with a 100 ids (max allowed) at a time
    while (newIds.length > 0) promises.push(searchFunction({ limit: limit, [searchProperty]: newIds.splice(0, 100) }));
    return (await Promise.all(promises)).flat();
}
exports.getMultipleIds = getMultipleIds;

/**
 * Returns a buffer to be sent with a multipart POST request
 * @param {Object[]} files
 * @param {{[key: string]: string}} [extra] Additional key-value pairs
 * @returns {Buffer}
 */
function createMultipartPayload(files, extra) {
    let dataArray = [];
    if (extra) {
        Object.entries(extra).forEach(([key, value]) => {
            dataArray.push(
                `--${MULTIPART_BOUNDARY}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
            );
        });
    }
    files.forEach((file, i) => {
        dataArray.push(
            `--${MULTIPART_BOUNDARY}\r\nContent-Disposition: form-data; name="file${i}"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`
        );
        dataArray.push(file.data);
        dataArray.push(`\r\n`);
    });
    dataArray.push(`--${MULTIPART_BOUNDARY}--\r\n`);
    return Buffer.concat(dataArray.map(elem => {
        if (typeof elem === 'string') return Buffer.from(elem, 'utf8');
        return Buffer.from(elem);
    }));
}
exports.createMultipartPayload = createMultipartPayload;