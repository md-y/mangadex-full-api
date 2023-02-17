import AuthError from '../util/AuthError.js';
import { isDebugServerInUse, performAuthCheck } from '../util/Network.js';

// @ts-expect-error Import is type-only
import type { Client, AuthorizationServer, OpenIDTokenEndpointResponse } from 'oauth4webapi';
import { getOAuthImport } from '../util/OAuthImporter.js';

type LoginData = {
    authUrl: URL;
    redirectUri: string;
    client: Client;
    challenge: string;
    verifier: string;
};

type AuthClientData = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    accessExpire: number;
    refreshExpire: number;
    client: Client;
};

/**
 * This class represents a basic OAuth user client. It does not have the ability to automatically prompt
 * the user to login, but there are included login functions for the browser and Node in the root of the MFA module.
 */
export default class AuthClient {
    private static activeClient?: AuthClient;
    protected static authServerCache?: AuthorizationServer;
    protected static authServerIsDebugServer?: boolean;

    oauthData: AuthClientData;

    constructor(data: AuthClientData) {
        this.oauthData = data;
    }

    async getSessionToken(): Promise<string> {
        if (this.oauthData.accessExpire <= Date.now()) {
            await this.refreshTokens();
            const isValid = await this.checkSessionToken();
            if (!isValid) {
                if (this.oauthData.refreshExpire <= Date.now()) {
                    throw new AuthError('Refresh token is out of date. Please login again.');
                } else {
                    throw new AuthError('Failed to validate session token for an unknown reason.');
                }
            }
        }
        return this.oauthData.accessToken;
    }

    /**
     * Set this auth instance to be the one used by all API calls
     */
    setActive() {
        AuthClient.activeClient = this;
    }

    /**
     * Removes the client currently being used by API calls
     */
    static clearActiveClient() {
        AuthClient.activeClient = undefined;
    }

    /**
     * Retrieves the user's session token via the currently active client (if there is any)
     */
    static async getActiveSessionToken(): Promise<string | undefined> {
        if (AuthClient.activeClient === undefined) return undefined;
        return await AuthClient.activeClient.getSessionToken();
    }

    /**
     * Request an OAuth discovery to MangaDex, caching the resulting Authorization Server object
     */
    static async getAuthServer(): Promise<AuthorizationServer> {
        const oauth = await getOAuthImport();
        const isDebug = isDebugServerInUse();
        if (!AuthClient.authServerCache || isDebug !== AuthClient.authServerIsDebugServer) {
            const tld = isDebug ? 'dev' : 'org';
            const issuer = new URL(`https://auth.mangadex.${tld}/realms/mangadex`);
            const res = await oauth.discoveryRequest(issuer);
            AuthClient.authServerCache = await oauth.processDiscoveryResponse(issuer, res);
            AuthClient.authServerIsDebugServer = isDebug;
        }
        return AuthClient.authServerCache;
    }

    /**
     * Generates the authorization url and client information
     */
    static async getRequiredLoginData(clientId: string, clientSecret: string, redirectUri: string): Promise<LoginData> {
        const oauth = await getOAuthImport();
        const authServer = await AuthClient.getAuthServer();
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
        const codeChallengeMethod = 'S256';

        const client: Client = {
            client_id: clientId,
            client_secret: clientSecret,
        };

        const authUrl = new URL(authServer.authorization_endpoint!);
        authUrl.searchParams.set('client_id', client.client_id);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid');

        return {
            authUrl: authUrl,
            redirectUri: redirectUri,
            client: client,
            challenge: codeChallenge,
            verifier: codeVerifier,
        };
    }

    /**
     * Create an AuthClient instance via the redirected url and existing login data
     */
    static async getClientFromUrl(landingUrl: URL, authData: LoginData): Promise<AuthClient> {
        const oauth = await getOAuthImport();
        const authServer = await AuthClient.getAuthServer();
        const params = oauth.validateAuthResponse(authServer, authData.client, landingUrl, oauth.expectNoState);
        if (oauth.isOAuth2Error(params)) throw new AuthError(params);
        const codeRes = await oauth.authorizationCodeGrantRequest(
            authServer,
            authData.client,
            params,
            authData.redirectUri,
            authData.verifier,
        );

        const challenges = oauth.parseWwwAuthenticateChallenges(codeRes);
        if (Array.isArray(challenges)) {
            throw new AuthError(`OAuth API responded with these challenges: ${challenges.join(' \n')}`);
        }

        const tokenRes = await oauth.processAuthorizationCodeOpenIDResponse(authServer, authData.client, codeRes);
        if (oauth.isOAuth2Error(tokenRes)) throw new AuthError(tokenRes);
        return new AuthClient(AuthClient.parseTokenResponse(tokenRes, authData.client));
    }

    /**
     * Creates and activates an AuthClient instance via the redirected url and existing login data
     */
    static async loginWithRedirectUrl(landingUrl: URL, authData: LoginData): Promise<AuthClient> {
        const client = await AuthClient.getClientFromUrl(landingUrl, authData);
        client.setActive();
        return client;
    }

    /**
     * Parse the JSON response from the OpenId Token endpoint into the parameters required for Auth Client
     */
    static parseTokenResponse(res: OpenIDTokenEndpointResponse, client: Client): AuthClientData {
        return {
            client: client,
            accessToken: res.access_token,
            accessExpire: Date.now() + (res.expires_in ?? 900) * 1000,
            refreshToken: res.refresh_token!,
            refreshExpire: Date.now() + ((res.refresh_expires_in as number) ?? 25200) * 1000,
            idToken: res.id_token,
        };
    }

    /**
     * Refresh the access token and update the token data for this client
     */
    async refreshTokens(): Promise<void> {
        const oauth = await getOAuthImport();
        const authServer = await AuthClient.getAuthServer();
        const res = await oauth.refreshTokenGrantRequest(
            authServer,
            this.oauthData.client,
            this.oauthData.refreshToken,
        );
        const parsedRes = (await oauth.processRefreshTokenResponse(
            authServer,
            this.oauthData.client,
            res,
        )) as OpenIDTokenEndpointResponse;
        if (oauth.isOAuth2Error(parsedRes)) throw new AuthError(parsedRes);
        this.oauthData = AuthClient.parseTokenResponse(parsedRes, this.oauthData.client);
    }

    /**
     * Check if the current access token is valid by asking MangaDex
     */
    checkSessionToken(): Promise<boolean> {
        return performAuthCheck(this.oauthData.accessToken);
    }
}
