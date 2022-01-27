'use strict';

// Internal
const Util = require('./util.js');
const LocalizedString = require('./internal/localizedstring.js');
const APIRequestError = require('./internal/requesterror.js');

// Export
const Manga = require('./structure/manga.js');
exports.Manga = Manga;
const Author = require('./structure/author.js');
exports.Author = Author;
const Chapter = require('./structure/chapter.js');
exports.Chapter = Chapter;
const Group = require('./structure/group.js');
exports.Group = Group;
const User = require('./structure/user.js');
exports.User = User;
const List = require('./structure/list.js');
exports.List = List;
const Cover = require('./structure/cover.js');
exports.Cover = Cover;

/**
 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
 * Any invalid legacy ids will be skipped by Mangadex when remapping, so
 * call this function for each individual id if this is an issue.
 * @param {'group'|'manga'|'chapter'|'tag'} type Type of id 
 * @param {...Number|Number[]} ids Array of ids to convert
 * @returns {Promise<String[]>}
 */
async function convertLegacyId(type, ...ids) {
    if (ids.length === 0) throw new Error('Invalid Argument(s)');
    ids = ids.flat();
    let res = await Util.apiRequest('/legacy/mapping', 'POST', { type: type, ids: ids });
    if (!(res.data instanceof Array)) throw new APIRequestError('The API did not respond with an array when it was expected to', APIRequestError.INVALID_RESPONSE);
    return res.data.map(e => e.attributes.newId);
}
exports.convertLegacyId = convertLegacyId;

/**
 * Sets the global locaization for LocalizedStrings.
 * Uses 2-letter Mangadex region codes.
 * @param {String} newLocale
 */
function setGlobalLocale(newLocale) {
    if (typeof newLocale !== 'string' || newLocale.length !== 2) throw new Error('Invalid Locale Code.');
    LocalizedString.locale = newLocale;
};
exports.setGlobalLocale = setGlobalLocale;

const AuthUtil = require('./auth.js');

/**
 * Required for authorization
 * https://api.mangadex.org/docs.html#operation/post-auth-login
 * @param {String} username 
 * @param {String} password 
 * @param {String} [cacheLocation] File location (or localStorage key for browsers) to store the persistent token IN PLAIN TEXT
 * @returns {Promise<void>}
 */
function login(username, password, cacheLocation) {
    return AuthUtil.login(username, password, cacheLocation);
}
exports.login = login;

// Register class types to bypass circular references
const Relationship = require('./internal/relationship.js');
Relationship.registerType('author', Author);
Relationship.registerType('artist', Author);
Relationship.registerType('manga', Manga);
Relationship.registerType('chapter', Chapter);
Relationship.registerType('scanlation_group', Group);
Relationship.registerType('user', User);
Relationship.registerType('leader', User);
Relationship.registerType('member', User);
Relationship.registerType('custom_list', List);
Relationship.registerType('cover_art', Cover);

/**
 * A shortcut for resolving all relationships in an array
 * @template T
 * @param {Array<Relationship<T>>} relationshipArray
 * @returns {Promise<Array<T>>}
 */
function resolveArray(relationshipArray) {
    return Relationship.resolveAll(relationshipArray);
}
exports.resolveArray = resolveArray;