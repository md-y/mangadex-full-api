import { fetchMDWithBody, performAuthCheck, setActiveAuthClient } from '../util/Network';
import AuthError from '../util/AuthError';

import type { IAuthClient } from '../types/helpers';
import type { RefreshResponseSchema, LoginResponseSchema } from '../types/schema';

type LoginData = {
    session: string;
    refresh: string;
    timestamp: number;
};

/**
 * This class represents a the legacy (username and password) auth client.
 * This login method is being deprecated in favor of OAuth which is implemented through {@link PersonalAuthClient} instead.
 *
 * @deprecated - This login method is being replaced by OAuth
 */
export default class LegacyAuthClient implements IAuthClient {
    data: LoginData;

    constructor(data: LoginData) {
        this.data = data;
    }

    async getSessionToken(): Promise<string> {
        // Don't refresh if the token was refreshed less than 14.9 minutes ago (15 is the maximum age)
        if (Date.now() - this.data.timestamp >= 894000) {
            await this.refreshTokens();
            const isValid = await this.checkSessionToken();
            if (!isValid) {
                throw new AuthError('Failed to validate auth token. Please login again.');
            }
        }
        return this.data.session;
    }

    /**
     * Set this auth instance to be the one used by all API calls
     */
    setActive() {
        setActiveAuthClient(this);
    }

    /**
     * Login with a legacy username and password, and activate this client for all API calls
     */
    static async login(username: string, password: string): Promise<LegacyAuthClient> {
        const res = await fetchMDWithBody<LoginResponseSchema>('/auth/login', { username, password });
        const session = res.token.session;
        const refresh = res.token.refresh;
        if (!session || !refresh) throw new AuthError('MangaDex did not return auth tokens.');
        const client = new LegacyAuthClient({
            session,
            refresh,
            timestamp: Date.now(),
        });
        client.setActive();
        return client;
    }

    /**
     * Refresh the access token and update the token data for this client
     */
    async refreshTokens() {
        const res = await fetchMDWithBody<RefreshResponseSchema>(
            '/auth/refresh',
            { token: this.data.refresh },
            undefined,
            'POST',
            { noAuth: true },
        );
        if (!res.token)
            throw new AuthError(`Failed to refresh auth tokens, MangaDex did not return any. ${res.message}`);
        const session = res.token.session;
        const refresh = res.token.refresh;
        if (!session || !refresh) throw new AuthError(`MangaDex did not return auth tokens. ${res.message}`);
        this.data = {
            session,
            refresh,
            timestamp: Date.now(),
        };
    }

    /**
     * Check if the current session token is valid by asking MangaDex
     */
    checkSessionToken(): Promise<boolean> {
        return performAuthCheck(this.data.session);
    }
}
