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
    Relationship.registerTypes(['user', 'member', 'leader', 'creator'], User);
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
export { default as PersonalAuthClient } from './shared/PersonalAuthClient';
export { default as LegacyAuthClient } from './shared/LegacyAuthClient';
export { default as List } from './shared/List';

// Export specific functions:

export { useDebugServer, overrideApiOrigin, overrideAuthOrigin } from './util/Network';

import LocalizedString from './internal/LocalizedString';
/**
 * Sets the global language locale to be used by LocalString objects.
 */
export const setGlobalLocale = LocalizedString.setGlobalLocale;

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

import PersonalAuthClient from './shared/PersonalAuthClient';

/**
 * Login with a personal client. This method is recommended for smaller, private applications.
 * {@link https://api.mangadex.org/docs/02-authentication/personal-clients/}
 * @param clientInfo - Personal client info including client secret/id, username, and password
 * @param activate - By default, this client will be set as the active client for all API calls. Set this to false to disable this behavior.
 */
export const loginPersonal = PersonalAuthClient.login;

import { clearActiveAuthClient, getActiveAuthClient } from './util/Network';

/**
 * This will clear the active auth client, effectively logging out.
 */
export const logout = clearActiveAuthClient;

/**
 * This will return the current active auth client, if any.
 */
export const getCurrentAuthClient = getActiveAuthClient;
