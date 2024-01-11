export default class AuthError extends Error {
    constructor(info: string) {
        super(info);
        Object.setPrototypeOf(this, AuthError.prototype);
        this.name = 'AuthError';
    }
}
