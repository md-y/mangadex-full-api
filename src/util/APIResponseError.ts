import { ErrorResponseSchema, ErrorSchema } from '../types/schema.js';

export default class APIResponseError extends Error {
    constructor(info: ErrorResponseSchema | ErrorSchema[] | string) {
        if (typeof info === 'string') {
            super(info);
        } else {
            if ('result' in info) info = info.errors;
            const errorMessages = info.map((err, i, arr) => {
                let str = '';
                if (arr.length > 1) str += `[${i} of ${arr.length}] `;
                str += `${err.title} (${err.status}, ${err.id}): ${err.detail}. `;
                return str;
            });
            super(errorMessages.join('\n'));
        }
        Object.setPrototypeOf(this, APIResponseError.prototype);
        this.name = 'APIResponseError';
    }
}
