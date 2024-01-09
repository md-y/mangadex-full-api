import { ErrorResponseSchema, ErrorSchema } from '../types/schema';

export default class APIResponseError extends Error {
    constructor(info: ErrorResponseSchema | ErrorSchema[] | string) {
        if (typeof info !== 'string') {
            let errors: ErrorSchema[];
            if ('result' in info) errors = info.errors;
            else errors = info;

            const parsedErrors = errors.map((err, i, arr) => {
                let str = '';
                if (arr.length > 1) str += `[${i} of ${arr.length}] `;
                str += `${err.title} (${err.status}, ${err.id}): ${err.detail}. `;
                return str;
            });
            info = parsedErrors.join('\n');
        }

        if (info.includes('36 characters')) {
            info +=
                '\n\nIt looks like MangaDex expected a UUID, but you provided a non-UUID string. If you are using Tags, please use Tag.getByName() instead of the literal name.';
        }

        super(info);
        Object.setPrototypeOf(this, APIResponseError.prototype);
        this.name = 'APIResponseError';
    }
}
