'use strict';

const HTTPS = require('https');

/**
 * Sends a HTTPS request to a specified endpoint
 * @param {String} endpoint API endpoint (ex: /ping)
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method GET, POST, PUT, or DELETE
 * @param {Object} requestPayload Payload used for POST and DELETE requests
 * @returns {Promise<Object>}
 */
exports.apiRequest = (endpoint, method = 'GET', requestPayload = {}) => {
    return new Promise((resolve, reject) => {
        if (endpoint === undefined || typeof(endpoint) !== 'string') reject('Invalid argument(s)');
        if (endpoint[0] !== "/") endpoint = `/${endpoint}`;

        const req = HTTPS.request({
            hostname: 'api.mangadex.org',
            path: endpoint,
            method: method
        }, (res) => {
            let responsePayload = '';

            res.on('data', (data) => {
                responsePayload += data;
            });

            res.on('end', () => {
                if (res.headers['content-type'].includes('json')) {
                    try {
                        resolve(JSON.parse(responsePayload));
                    } catch (error) {
                        reject(new Error(
                            `Failed to parse HTTPS ${method} Response (${endpoint}) as JSON ` +
                            `despite Content-Type Header: ${res.headers['content-type']}\n` + 
                            `${error}`
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
        
        if (method === "POST" || method === "PUT" || method === "DELETE") {
            req.write(requestPayload);
        }
        req.end();
    });
};