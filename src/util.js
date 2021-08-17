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
                    else if (res.statusCode >= 400) reject(new APIRequestError(`Returned HTML error page ${res}`, APIRequestError.INVALID_RESPONSE));
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
    let cleanParameters = {};
    for (let i in parameterObject) {
        if (parameterObject[i] instanceof Array) cleanParameters[i] = parameterObject[i].map(elem => {
            // Arrays are kept in their arrays because the query name is repeated and cannot be represented as pairs (?key[]=1&key[]=2)
            if (typeof elem === 'string') return elem;
            if (typeof elem === 'object' && 'id' in elem) return elem.id;
            return elem.toString();
        });
        else if (typeof parameterObject[i] === 'object') {
            if ('id' in parameterObject[i]) cleanParameters[i] = parameterObject[i].id;
            else Object.keys(parameterObject[i]).forEach(elem => cleanParameters[`${i}[${elem}]`] = parameterObject[i][elem]);
            // Objects are represented as new properties with a key of 'object[property]'
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
    if (!(initialResponse.results instanceof Array) || typeof initialResponse.total !== 'number') {
        throw new APIRequestError(`The API did not respond the correct structure for a search request:\n${initialResponse}`, APIRequestError.INVALID_RESPONSE);
    }
    // Return if only one request is needed (either the limit is low enough for one request or one request returned all available results)
    if (limit <= maxLimit || initialResponse.total <= initialResponse.results.length + initialOffset) return initialResponse.results;

    // Subsequent concurrent requests for the rest of the results:
    limit = Math.min(initialResponse.total, limit);
    let promises = [];
    for (let offset = initialOffset + maxLimit; offset < limit; offset += maxLimit) {
        promises.push(apiParameterRequest(baseEndpoint, { ...parameterObject, limit: Math.min(limit - offset, maxLimit), offset: offset }));
    }
    let finalArray = initialResponse.results;
    for (let elem of await Promise.all(promises)) {
        if (!(elem.results instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
        finalArray = finalArray.concat(elem.results);
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
 * @param {String[]} ids
 * @param {Number} [limit=100]
 * @param {String} [searchProperty='ids']
 * @returns {Promise<Array>}
 */
async function getMultipleIds(searchFunction, ids, limit = 100, searchProperty = 'ids') {
    if (ids[0] instanceof Array) ids = ids[0];
    ids = ids.map(elem => {
        if (typeof elem === 'string') return elem;
        else if (typeof elem === 'object' && 'id' in elem) return elem.id;
        else return elem.toString();
    });
    let searchParameters = { limit: limit };
    let finalArray = [];
    let promises = [];
    while (ids.length > 0) {
        searchParameters[searchProperty] = ids.splice(0, 100);
        promises.push(searchFunction(searchParameters));
    }
    for (let i of await Promise.all(promises)) finalArray = finalArray.concat(i);
    return finalArray;
}
exports.getMultipleIds = getMultipleIds;

/**
 * Returns a buffer to be sent with a multipart POST request
 * @param {Object[]} files
 * @returns {Buffer}
 */
function createMultipartPayload(files) {
    let dataArray = [];
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