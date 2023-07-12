import AuthError from '../util/AuthError.js';
import { isDebugServerInUse, performAuthCheck, setActiveAuthClient } from '../util/Network.js';

// @ts-expect-error Import is type-only
import type { Client, AuthorizationServer, OpenIDTokenEndpointResponse } from 'oauth4webapi';
import { getOAuthImport } from '../util/OAuthImporter.js';

import type { IAuthClient } from '../types/helpers.js';

type LoginData = {
    authUrl: URL;
    redirectUri: string;
    client: Client;
    challenge: string;
    verifier: string;
};

type OAuthClientData = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    accessExpire: number;
    refreshExpire: number;
    client: Client;
};

/**
 * This class represents a basic OAuth user client. It does not have the ability to automatically prompt
 * the user to login, but it has the ability to generate an authorization url and parse the callback url.
 *
 * Use {@link setActive} to make this client the one used by API calls.
 *
 * The {@link https://www.npmjs.com/package/simple-oauth-redirect | simple-oauth-redirect} package is recommended
 * for OAuth redirects.
 */
export default class OAuthClient implements IAuthClient {
    protected static authServerCache?: AuthorizationServer;
    protected static authServerIsDebugServer?: boolean;

    private oauthData: OAuthClientData;

    constructor(data: OAuthClientData) {
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
        setActiveAuthClient(this);
    }

    /**
     * Request an OAuth discovery to MangaDex, caching the resulting Authorization Server object
     */
    static async getAuthServer(): Promise<AuthorizationServer> {
        const oauth = await getOAuthImport();
        const isDebug = isDebugServerInUse();
        if (!OAuthClient.authServerCache || isDebug !== OAuthClient.authServerIsDebugServer) {
            const tld = isDebug ? 'dev' : 'org';
            const issuer = new URL(`https://auth.mangadex.${tld}/realms/mangadex`);
            const res = await oauth.discoveryRequest(issuer);
            OAuthClient.authServerCache = await oauth.processDiscoveryResponse(issuer, res);
            OAuthClient.authServerIsDebugServer = isDebug;
        }
        return OAuthClient.authServerCache;
    }

    /**
     * Generates an OAuth authorization url and client information.
     * This is the first step in logging in with OAuth. Save the information returned from this function and direct the user to the authUrl.
     * @param clientId - App client name registered with MangaDex (can be 'thirdparty-oauth-client' for sandbox server)
     * @param clientSecret - Secret app token from MangaDex
     * @param redirectUri - Where MangaDex will redirect the user to after authorization
     */
    static async getOAuthLoginData(clientId: string, clientSecret: string, redirectUri: string): Promise<LoginData> {
        const oauth = await getOAuthImport();
        const authServer = await OAuthClient.getAuthServer();
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
     * @param landingUrl - The complete callback url that the user returns to after authorization
     * @param authData - The initial OAuth login data from {@link getOAuthLoginData}
     */
    static async getClientFromOAuthRedirect(landingUrl: URL, authData: LoginData): Promise<OAuthClient> {
        const oauth = await getOAuthImport();
        const authServer = await OAuthClient.getAuthServer();
        const params = oauth.validateAuthResponse(
            authServer,
            authData.client,
            landingUrl.searchParams,
            oauth.expectNoState,
        );
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
        return new OAuthClient(OAuthClient.parseTokenResponse(tokenRes, authData.client));
    }

    /**
     * Creates and activates an AuthClient instance via the redirected url and existing login data.
     * This is the second and last step in logging in with OAuth. Use the redirect url from the user
     * and the data from {@link getOAuthLoginData} to login. Once the promise from this function resolves,
     * the user is now logged in.
     * @param landingUrl - The complete callback url that the user returns to after authorization
     * @param authData - The initial OAuth login data from {@link getOAuthLoginData}
     */
    static async loginWithOAuthRedirect(landingUrl: URL, authData: LoginData): Promise<OAuthClient> {
        const client = await OAuthClient.getClientFromOAuthRedirect(landingUrl, authData);
        client.setActive();
        return client;
    }

    /**
     * Parse the JSON response from the OpenId Token endpoint into the parameters required for Auth Client
     */
    static parseTokenResponse(res: OpenIDTokenEndpointResponse, client: Client): OAuthClientData {
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
        const authServer = await OAuthClient.getAuthServer();
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
        this.oauthData = OAuthClient.parseTokenResponse(parsedRes, this.oauthData.client);
    }

    /**
     * Check if the current access token is valid by asking MangaDex
     */
    checkSessionToken(): Promise<boolean> {
        return performAuthCheck(this.oauthData.accessToken);
    }
}
