import { IAuthClient } from '../types/helpers';
import AuthError from '../util/AuthError';
import { fetchMDAuth, performAuthCheck, setActiveAuthClient } from '../util/Network';

type PersonalClientInfo = {
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
};

type ClientData = PersonalClientInfo & {
    accessToken: string;
    accessExpiration: number;
    refreshToken: string;
    refreshExpiration: number;
};

type TokenBody = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
};

/**
 * This class is used to authenticate with the MangaDex API using a personal client.
 * {@link https://api.mangadex.org/docs/02-authentication/personal-clients/}
 */
export default class PersonalAuthClient implements IAuthClient {
    data: ClientData;

    constructor(data: ClientData) {
        this.data = data;
    }

    /**
     * Returns the client's access token and refreshes it if necessary.
     */
    async getSessionToken() {
        if (Date.now() > this.data.refreshExpiration) {
            throw new AuthError('Refresh token has expired. Please login again.');
        }
        if (Date.now() > this.data.accessExpiration) {
            await this.refreshTokens();
            const isValid = await performAuthCheck(this.data.accessToken);
            if (!isValid) {
                throw new AuthError('Failed to validate auth token. Please login again.');
            }
        }
        return this.data.accessToken;
    }

    /**
     * Refreshes the client's access token and refresh token.
     */
    async refreshTokens() {
        // Documentation says to use this url but it doesn't work:
        // '/realms/mangadex/protocol/openid-connect/token/auth/refresh'

        const res = await fetchMDAuth<TokenBody>('/realms/mangadex/protocol/openid-connect/token', {
            grant_type: 'refresh_token',
            refresh_token: this.data.refreshToken,
            client_id: this.data.clientId,
            client_secret: this.data.clientSecret,
        });

        this.data.accessToken = res.access_token;
        this.data.accessExpiration = toExpiration(res.expires_in);
        this.data.refreshToken = res.refresh_token;
        this.data.refreshExpiration = toExpiration(res.refresh_expires_in);
    }

    /**
     * Creates a new PersonalAuthClient and optionally sets it as the active client.
     */
    static async login(info: PersonalClientInfo, activate = true): Promise<PersonalAuthClient> {
        const res = await fetchMDAuth<TokenBody>('/realms/mangadex/protocol/openid-connect/token', {
            grant_type: 'password',
            username: info.username,
            password: info.password,
            client_id: info.clientId,
            client_secret: info.clientSecret,
        });

        const client = new PersonalAuthClient({
            ...info,
            accessToken: res.access_token,
            accessExpiration: toExpiration(res.expires_in),
            refreshToken: res.refresh_token,
            refreshExpiration: toExpiration(res.refresh_expires_in),
        });
        if (activate) setActiveAuthClient(client);
        return client;
    }
}

/**
 * Converts the "expires_in" value from the token body to an expiration timestamp
 */
function toExpiration(offset: number): number {
    // Subtract 5s to account for network latency
    return offset * 1000 + Date.now() - 5000;
}
