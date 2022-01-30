# MangaDex Full API
An unofficial [MangaDex](https://www.mangadex.org) API built with the [official JSON API](https://api.mangadex.org/docs.html).

[Documentation](https://md-y.github.io/mangadex-full-api)

[![Version](https://img.shields.io/npm/v/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)
[![License](https://img.shields.io/github/license/md-y/mangadex-full-api.svg?style=flat)](https://github.com/md-y/mangadex-full-api/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)
[![Mocha Tests](https://github.com/md-y/mangadex-full-api/actions/workflows/mocha-tests.yml/badge.svg)](https://github.com/md-y/mangadex-full-api/actions/workflows/mocha-tests.yml)

```bash
npm install mangadex-full-api
```

## Examples

```javascript
const MFA = require('mangadex-full-api');

MFA.login('username', 'password123', './bin/.md_cache').then(() => {
    MFA.Manga.search({
        title: 'isekai',
        limit: Infinity // API Max is 100 per request, but this function accepts more
    }).then(results => {
        console.log(`There are ${results.length} manga with 'isekai' in the title:`);
        results.forEach((elem, i) => console.log(`[${i + 1}] ${elem.title}`));
    }).catch(console.error);
}).catch(console.error);

```

```javascript
const MFA = require('mangadex-full-api');

MFA.login('username', 'password123', './bin/.md_cache').then(async () => {
    // Get a manga:
    let manga = await MFA.Manga.getByQuery('Ancient Magus Bride');

    // Get the manga's chapters:
    let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true); 
    // True means that related objects are returned with the base request
    // See Release 5.2.0 for more info: https://github.com/md-y/mangadex-full-api/releases/tag/5.2.0
    let chapter = chapters[0];

    // Get the chapter's pages:
    let pages = await chapter.getReadablePages(); 
    // Please read the following page if you are creating a chapter-reading application:
    // https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report

    // Get who uploaded the chapter:
    let uploader = await chapter.uploader.resolve();

    // Get the names of the groups who scanlated the chapter:
    let resolvedGroups = await MFA.resolveArray(chapter.groups) // You can resolve Relationship arrays with this shortcut
    let groupNames = resolvedGroups.map(elem => elem.name);

    console.log(`Manga "${manga.title}" has a chapter titled "${chapter.title}" that was uploaded by ${uploader.username} and scanlated by ${groupNames.join('and')}.`);
    console.log(`Here is the first page: ${pages[0]}`);
}).catch(console.error);

```

```javascript
/*
    Upload a chapter with node modules:
*/
const MFA = require('mangadex-full-api');
const fs = require('fs');
const path = require('path');

MFA.login('username', 'password123', './bin/.md_cache').then(async () => {
    let currentSession = await MFA.Manga.getCurrentUploadSession();
    if (currentSession) {
        await currentSession.close();
        console.log('Closed existing session.');
    }

    let mangaId = 'f9c33607-9180-4ba6-b85c-e4b5faee7192'; // Official test manga
    let session = await MFA.Manga.createUploadSession(mangaId); 
    console.log('Created new upload session.');

    let chapterDir = './chapter'; // Directory to retrieve page images
    let files = fs.readdirSync(chapterDir)
    await session.uploadPages(files.map(name => {
        return {
            data: fs.readFileSync(path.join(chapterDir, name)), // Buffer-like data
            name: name // The name of this image
        };
    }));
    console.log('Uploaded pages.');

    let chapter = await session.commit({
        chapter: '0', // Change chapter number
        volume: null, // Change volume number
        title: 'New Chapter', // Change chapter name
        translatedLanguage: 'en'
    });

    console.log(`Uploaded new chapter at: https://mangadex.org/chapter/${chapter.id}`);
}).catch(console.error);

```

```typescript
// TypeScript Example:
import MFA from 'mangadex-full-api';
// You can also import directly like:
// import { Manga, login } from 'mangadex-full-api';

MFA.login('username', 'password123').then(async () => {
    const query = 'Ancient Magus Bride';
    const list = await MFA.Manga.search({ title: query, limit: Infinity });
    console.log(list.length, 'results for', query);
    console.log('The first result was written by', (await list[0].authors[0].resolve()).name);
});
```

## Info

* Requests will automatically be rate limited to about 5 requests/second.
* The entire package is typed thanks to JSDoc and the included ```index.d.ts``` file, so TypeScript is supported.
* The entire project is written as regular NodeJS with CommonJS imports/exports. As for browser support, see below:

#### Browser

Mangadex Full API works out of the box with [Browserify](https://browserify.org/) and does not require additional configuration.

```bash
browserify yourproject.js > bundle.js
```

As for [Webpack](https://webpack.js.org/) and similar applications, Mangadex Full API only requires ```https``` to be polyfilled; ```fs``` and ```path``` can be excluded.
