import Relationship from './internal/Relationship';
import Author from './shared/Author';
import Cover from './shared/Cover';
import Manga from './shared/Manga';
import Chapter from './shared/Chapter';
import User from './shared/User';
import Group from './shared/Group';

if (Relationship.getRegisteredTypes().length === 0) {
    Relationship.registerTypes(['manga'], Manga);
    Relationship.registerTypes(['author', 'artist'], Author);
    Relationship.registerTypes(['cover_art'], Cover);
    Relationship.registerTypes(['chapter'], Chapter);
    Relationship.registerTypes(['user', 'member', 'leader'], User);
    Relationship.registerTypes(['scanlation_group'], Group);
    Relationship.lockTypeMap();
}

// Export Classes:

export { default as Author } from './shared/Author';
export { default as Cover } from './shared/Cover';
export { default as Manga } from './shared/Manga';
export { default as Tag } from './shared/Tag';
export { default as Chapter } from './shared/Chapter';
export { default as User } from './shared/User';
export { default as Group } from './shared/Group';
export { default as UploadSession } from './shared/UploadSession';
export { default as OAuthClient } from './shared/OAuthClient';
export { default as LegacyAuthClient } from './shared/LegacyAuthClient';
export { default as List } from './shared/List';

// Export specific functions:

export { useDebugServer } from './util/Network';

import LocalizedString from './internal/LocalizedString';
/**
 * Sets the global language locale to be used by LocalString objects.
 */
export const setGlobalLocale = LocalizedString.setGlobalLocale;

import OAuthClient from './shared/OAuthClient';

/**
 * Generates an OAuth authorization url and client information.
 * This is the first step in logging in with OAuth. Save the information returned from this function and direct the user to the authUrl.
 * @param clientId - App client name registered with MangaDex (can be 'thirdparty-oauth-client' for sandbox server)
 * @param clientSecret - Secret app token from MangaDex
 * @param redirectUri - Where MangaDex will redirect the user to after authorization
 */
export const getOAuthLoginData = OAuthClient.getOAuthLoginData;

/**
 * Logins in via a redirected OAuth url and existing login data.
 * This is the second and last step for logging in with OAuth. Use the redirect url from the user
 * and the data from {@link getOAuthLoginData} to login. Once the promise from this function resolves,
 * the user is now logged in.
 * @param landingUrl - The complete callback url that the user returns to after authorization
 * @param authData - The initial OAuth login data from {@link getOAuthLoginData}
 */
export const loginWithOAuthRedirect = OAuthClient.loginWithOAuthRedirect;

/**
 * This will {@link Relationship.resolve} an array of relationships, returning another array
 * in the same order.
 * @param relationshipArray - An array of relationships of the same type
 */
export const resolveArray = Relationship.resolveAll;

/**
 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids. Any invalid legacy ids will be
 * skipped by Mangadex when remapping, so call this function for each individual id if this is an issue.
 */
export const convertLegacyId = Manga.convertLegacyId;

import LegacyAuthClient from './shared/LegacyAuthClient';

/**
 * Login with a legacy username and password
 *
 * @deprecated - This login method is being replaced by OAuth
 *
 * @param username - Username of the account
 * @param password - Password of the account
 */
export const login = LegacyAuthClient.login;
