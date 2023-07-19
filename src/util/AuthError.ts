import type { OAuth2Error } from 'oauth4webapi';

export default class AuthError extends Error {
    constructor(info: string | OAuth2Error) {
        if (typeof info !== 'string') {
            info = `${info.error}, ${info.error_description ?? 'No Description'}, ${info.error_uri ?? 'No URI'}`;
        }
        super(info);
        Object.setPrototypeOf(this, AuthError.prototype);
        this.name = 'AuthError';
    }
}
