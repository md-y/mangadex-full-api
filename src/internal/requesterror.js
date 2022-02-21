'use strict';

/**
 * This error respresents when the API responds with an error or invalid response.
 * In other words, this error represents 400 and 500 status code responses.
 */
class APIRequestError extends Error {
    /** @type {Number} */
    static OTHER = 0;
    /** @type {Number} */
    static AUTHORIZATION = 1;
    /** @type {Number} */
    static INVALID_REQUEST = 2;
    /** @type {Number} */
    static INVALID_RESPONSE = 3;

    /**
     * @param {String|Object} reason An error message or response from the API
     * @param {Number} code
     * @param {String} requestId The `X-Request-ID` header value sent via the API.
     * @param  {...any} params
     */
    constructor(reason = 'Unknown Request Error', code = 0, requestId = "Unknown Request ID", ...params) {
        super(...params);

        /**
         * What type of error is this?
         * AUTHORIZATION, INVALID_RESPONSE, etc.
         * @type {Number}
         */
        this.code = code;

        /** @type {String} */
        this.name = 'APIRequestError';

        /** @type {String} */
        this.requestId = requestId;

        if (typeof reason === 'string') {
            /** @type {String} */
            this.message = reason;
        } else {
            if (reason.errors instanceof Array && reason.errors.length > 0) {
                this.message = `${reason.errors[0].detail} (${reason.errors[0].status}: ${reason.errors[0].title})`;
                if (reason.errors[0].status === 400 || reason.errors[0].status === 404) this.code = APIRequestError.INVALID_REQUEST;
                else if (reason.errors[0].status === 403) this.code = APIRequestError.AUTHORIZATION;
                else if (code > 500) this.code = APIRequestError.INVALID_RESPONSE;
            } else this.message = 'Unknown Reason.';
        }
        if (requestId !== "Unknown Request ID"){
            this.message = `[X-Request-ID: ${this.requestId}] ${this.message}`;
        }
    }
}
exports = module.exports = APIRequestError;