# MangaDex Full API

An unofficial [MangaDex](https://www.mangadex.org) API built with the [official JSON API](https://api.mangadex.org/docs.html). Supports Node.js and browsers.

[Documentation](https://md-y.github.io/mangadex-full-api)

[![Version](https://img.shields.io/npm/v/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)
[![License](https://img.shields.io/github/license/md-y/mangadex-full-api.svg?style=flat)](https://github.com/md-y/mangadex-full-api/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)

```bash
npm install mangadex-full-api@6.0.0-beta.0
```

```javascript
// Demo
Manga.search({
    title: 'One Piece',
    limit: Infinity, // API Max is 100 per request, but this function accepts more
    hasAvailableChapters: true,
}).then((mangas) => {
    console.log('There are', mangas.length, 'mangas with One Piece in the title!');
    mangas.forEach((manga) => {
        console.log(manga.localTitle);
    });
});
```

# Tutorials

-   [Authentication](#authentication)
-   [Getting Page Images](#page-images)
-   [Relationships](#relationships)
-   [Finding Manga](#finding-manga)
-   [Uploading Chapters](#uploading-chapters)

View more info on the [documentation website](https://md-y.github.io/mangadex-full-api).

#### Authentication

To login with a personal account, you must have a [Client ID and Secret](https://api.mangadex.dev/docs/02-authentication/personal-clients/).

```javascript
await loginPersonal({
    clientId: 'id',
    clientSecret: 'secret',
    password: 'password',
    username: 'username',
});
```

#### Page Images

```javascript
// Get a manga with chapters
const manga = await Manga.getByQuery({ order: { followedCount: 'desc' }, availableTranslatedLanguage: ['en'] });
if (!manga) throw new Error('No manga found!');

// This will get the first English chapter for this manga
const chapters = await manga.getFeed({ translatedLanguage: ['en'], limit: 1 });
const chapter = chapters[0];

// Get the image URLs for this chapter
const pages = await chapter.getReadablePages();
console.log(pages);
```

#### Relationships

MangaDex will return Relationship objects for associated data objects instead of the entirety of each object.

For example, authors and artists will be returned as `Relationship<Author>` when requesting a manga. To request the author data, use the `resolve` method.

Additionally, you can supply `'author'` to the `includes` parameter to include the author data alongside the manga request. You will still need to call the `resolve` method, but the promise will return instantly.

```javascript
const manga = await Manga.getRandom();
const firstAuthor = await manga.authors[0].resolve();
console.log('The first author is', firstAuthor.name);

// Use resolveArray to resolve an array of Relationships more efficiently
const allAuthors = await resolveArray(manga.authors);
console.log('All authors are', allAuthors.map((a) => a.name).join(', '));

// Because authors are included, the author relationships are cached
const otherManga = await Manga.getByQuery({ includes: ['author'] });
if (otherManga) {
    console.log('The authors for this manga are included and cached:', otherManga.authors[0].cached);
    const author = await otherManga.authors[0].resolve();
    console.log('The author is', author.name);
}
```

#### Finding Manga

The most common way to find manga is to use the `search` method. However, there are a few other ways as well:

```javascript
// Basic Search
Manga.search({
    title: 'One Piece',
    limit: Infinity, // API Max is 100 per request, but this function accepts more
    hasAvailableChapters: true,
}).then((mangas) => {
    console.log('There are', mangas.length, 'mangas with One Piece in the title!');
    mangas.forEach((manga) => {
        console.log(manga.localTitle);
    });
});

// This will return the first result from a search
Manga.getByQuery({ title: 'One Piece' }).then((manga) => {
    if (manga) console.log('Found a One Piece manga with id', manga.id);
    else console.log('No One Piece manga found');
});

// You can get a random manga
Manga.getRandom().then((manga) => console.log('Random:', manga.localTitle));

// You can get manga directly by UUID
Manga.get('manga-uuid-here').then((manga) => console.log(manga));
```

#### Uploading Chapters

```javascript
// Login with your credentials
await loginPersonal({
    clientId: 'id',
    clientSecret: 'secret',
    password: 'password',
    username: 'username',
});

// Create a new chapter upload session for a manga
const session = await UploadSession.begin('manga-id', ['group-id']);

// Upload pages as Blobs
await session.uploadPages([
    new Blob([fs.readFileSync('path/to/page1.jpg')], new Blob([fs.readFileSync('path/to/page2.jpg')])),
]);

// Commit the chapter
await session.commit({
    chapter: '1',
    title: 'A new chapter!',
    translatedLanguage: 'en',
    volume: '1',
});
```
