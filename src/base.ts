import Relationship from './internal/Relationship.js';
import Author from './shared/Author.js';
import Cover from './shared/Cover.js';
import Manga from './shared/Manga.js';
import Chapter from './shared/Chapter.js';
import User from './shared/User.js';
import Group from './shared/Group.js';

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

export { default as Author } from './shared/Author.js';
export { default as Cover } from './shared/Cover.js';
export { default as Manga } from './shared/Manga.js';
export { default as Tag } from './shared/Tag.js';
export { default as Chapter } from './shared/Chapter.js';
export { default as User } from './shared/User.js';
export { default as Group } from './shared/Group.js';
export { default as UploadSession } from './shared/UploadSession.js';
export { default as AuthClient } from './shared/AuthClient.js';

// Export specific functions:

export { useDebugServer } from './util/Network.js';

import LocalizedString from './internal/LocalizedString.js';
/**
 * Sets the global language locale to be used by LocalString objects.
 */
export const setGlobalLocale = LocalizedString.setGlobalLocale;

import AuthClient from './shared/AuthClient.js';

/**
 * Generates an OAuth authorization url and client information.
 * This is the first step in logging in with OAuth. Save the information returned from this function and direct the user to the authUrl.
 * @param clientId - App client name registered with MangaDex (can be 'thirdparty-oauth-client' for sandbox server)
 * @param clientSecret - Secret app token from MangaDex
 * @param redirectUri - Where MangaDex will redirect the user to after authorization
 */
export const getOAuthLoginData = AuthClient.getOAuthLoginData;

/**
 * Creates and activates an AuthClient instance via the redirected url and existing login data.
 * This is the second and last step in logging in with OAuth. Use the redirect url from the user
 * and the data from {@link getOAuthLoginData} to login. Once the promise from this function resolves,
 * the user is now logged in.
 * @param landingUrl - The complete callback url that the user returns to after authorization
 * @param authData - The initial OAuth login data from {@link getOAuthLoginData}
 */
export const loginWithOAuthRedirect = AuthClient.loginWithOAuthRedirect;

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
