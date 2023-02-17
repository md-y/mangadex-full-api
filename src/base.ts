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

export { useDebugServer } from './util/Network.js';

import LocalizedString from './internal/LocalizedString.js';
export function setGlobalLocale(locale: string) {
    LocalizedString.setGlobalLocale(locale);
}
