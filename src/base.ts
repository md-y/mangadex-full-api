import Relationship from './shared/Relationship.js';
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
export { default as Relationship } from './shared/Relationship.js';
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
 * This is the first step in logging in with OAuth. Save the information returned from
 * this function and direct the user to the authUrl.
 */
export const getRequiredLoginData = AuthClient.getRequiredLoginData;

/**
 * This is the second and last step in logging in with OAuth. Use the redirect url from the user
 * and the data from {@link getRequiredLoginData} to login. Once the promise from this function resolves,
 * the user is now logged in.
 */
export const loginWithRedirectUrl = AuthClient.loginWithRedirectUrl;

/**
 * Resolves an array of Relationship objects. This function is more efficient that resolving
 * each array individually.
 */
export const resolveArray = Relationship.resolveAll;

/**
 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids. Any invalid legacy ids will be
 * skipped by Mangadex when remapping, so call this function for each individual id if this is an issue.
 */
export const convertLegacyId = Manga.convertLegacyId;
