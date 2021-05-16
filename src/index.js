'use strict';

// Internal
const Util = require('./util.js');
const LocalizedString = require('./internal/localizedstring.js');

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

/**
 * Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
 * Any invalid legacy ids will be skipped by Mangadex when remapping, so
 * call this function for each individual id if this is an issue.
 * @param {'group'|'manga'|'chapter'|'tag'} type Type of id 
 * @param {Number[]} ids Array of ids to convert
 * @returns {Promise<String[]>}
 */
function convertLegacyId(type, ids) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await Util.apiRequest('/legacy/mapping', 'POST', { type: type, ids: ids }); 
            if (Util.getResponseStatus(res) === 'ok') resolve(res.map(e => e.data.attributes.newId));
            else reject(new Error(`Failed to convert legacy id: ${Util.getResponseMessage(res)}`));
        } catch (error) {
            reject(error);
        }
    });
}
exports.convertLegacyId = convertLegacyId;

/**
 * Sets the global locaization for LocalizedStrings.
 * Uses 2-letter Mangadex region codes.
 * @type {Function}
 * @param {String} newLocale
 */
function setGlobalLocale(newLocale) {
    if (typeof(newLocale) !== 'string' || newLocale.length !== 2) throw new Error('Invalid Locale Code.');
    LocalizedString.locale = newLocale;
};
exports.setGlobalLocale = setGlobalLocale;

// Register class types to bypass circular references
const Relationship = require('./internal/relationship.js');
Relationship.registerType('author', Author);
Relationship.registerType('artist', Author);
Relationship.registerType('manga', Manga);
Relationship.registerType('chapter', Chapter);
Relationship.registerType('scanlation_group', Group);
Relationship.registerType('user', User);