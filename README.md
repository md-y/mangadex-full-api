# MangaDex Full API
An unofficial [MangaDex](https://www.mangadex.org) API built with the [official JSON API](https://api.mangadex.org/docs.html).

[Documentation](#Classes) <br>
[Browser Usage](#Browser)

[![Version](https://img.shields.io/npm/v/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)
[![License](https://img.shields.io/github/license/md-y/mangadex-full-api.svg?style=flat)](https://github.com/md-y/mangadex-full-api/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)

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

## Classes

<dl>
<dt><a href="#Author">Author</a></dt>
<dd><p>Represents an author or artist
<a href="https://api.mangadex.org/docs.html#tag/Author">https://api.mangadex.org/docs.html#tag/Author</a></p>
</dd>
<dt><a href="#Chapter">Chapter</a></dt>
<dd><p>Represents a chapter with readable pages
<a href="https://api.mangadex.org/docs.html#tag/Chapter">https://api.mangadex.org/docs.html#tag/Chapter</a></p>
</dd>
<dt><a href="#Cover">Cover</a></dt>
<dd><p>Represents the cover art of a manga volume
<a href="https://api.mangadex.org/docs.html#tag/Cover">https://api.mangadex.org/docs.html#tag/Cover</a></p>
</dd>
<dt><a href="#Group">Group</a></dt>
<dd><p>Represents a scanlation group
<a href="https://api.mangadex.org/docs.html#tag/Group">https://api.mangadex.org/docs.html#tag/Group</a></p>
</dd>
<dt><a href="#List">List</a></dt>
<dd><p>Represents a custom, user-created list of manga
<a href="https://api.mangadex.org/docs.html#tag/CustomList">https://api.mangadex.org/docs.html#tag/CustomList</a></p>
</dd>
<dt><a href="#Manga">Manga</a></dt>
<dd><p>Represents a manga object
<a href="https://api.mangadex.org/docs.html#tag/Manga">https://api.mangadex.org/docs.html#tag/Manga</a></p>
</dd>
<dt><a href="#User">User</a></dt>
<dd><p>Represents an user
<a href="https://api.mangadex.org/docs.html#tag/User">https://api.mangadex.org/docs.html#tag/User</a></p>
</dd>
<dt><a href="#Links">Links</a></dt>
<dd><p>Represents the links that represent manga on different websites
<a href="https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data">https://api.mangadex.org/docs.html#section/Static-data/Manga-links-data</a></p>
</dd>
<dt><a href="#LocalizedString">LocalizedString</a></dt>
<dd><p>Represents a string, but in different languages.
Generates properties for each language available 
(ie you can index with language codes through localizedString[&#39;en&#39;] or localizedString.jp)</p>
</dd>
<dt><a href="#Relationship">Relationship</a></dt>
<dd><p>Represents a relationship from one Mangadex object to another such as a manga, author, etc via its id.</p>
</dd>
<dt><a href="#APIRequestError">APIRequestError</a></dt>
<dd><p>This error respresents when the API responds with an error or invalid response.
In other words, this error represents 400 and 500 status code responses.</p>
</dd>
<dt><a href="#Tag">Tag</a></dt>
<dd><p>Represents a manga tag</p>
</dd>
<dt><a href="#UploadSession">UploadSession</a></dt>
<dd><p>Represents a chapter upload session
<a href="https://api.mangadex.org/docs.html#tag/Upload">https://api.mangadex.org/docs.html#tag/Upload</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#convertLegacyId">convertLegacyId(type, ...ids)</a> ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code></dt>
<dd><p>Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
Any invalid legacy ids will be skipped by Mangadex when remapping, so
call this function for each individual id if this is an issue.</p>
</dd>
<dt><a href="#setGlobalLocale">setGlobalLocale(newLocale)</a></dt>
<dd><p>Sets the global locaization for LocalizedStrings.
Uses 2-letter Mangadex region codes.</p>
</dd>
<dt><a href="#login">login(username, password, [cacheLocation])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Required for authorization
<a href="https://api.mangadex.org/docs.html#operation/post-auth-login">https://api.mangadex.org/docs.html#operation/post-auth-login</a></p>
</dd>
<dt><a href="#resolveArray">resolveArray(relationshipArray)</a> ⇒ <code>Promise</code></dt>
<dd><p>A shortcut for resolving all relationships in an array</p>
</dd>
</dl>

<a name="Author"></a>

## Author
Represents an author or artisthttps://api.mangadex.org/docs.html#tag/Author

**Kind**: global class  

* [Author](#Author)
    * [new Author(context)](#new_Author_new)
    * _instance_
        * [.id](#Author+id) : <code>String</code>
        * [.name](#Author+name) : <code>String</code>
        * [.imageUrl](#Author+imageUrl) : <code>String</code>
        * [.biography](#Author+biography) : <code>Array.&lt;String&gt;</code>
        * [.createdAt](#Author+createdAt) : <code>Date</code>
        * [.updatedAt](#Author+updatedAt) : <code>Date</code>
        * [.manga](#Author+manga) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
    * _static_
        * [.search([searchParameters], [includeSubObjects])](#Author.search) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
        * [.getMultiple(...ids)](#Author.getMultiple) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
        * [.get(id, [includeSubObjects])](#Author.get) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
        * [.getByQuery([searchParameters])](#Author.getByQuery) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)

<a name="new_Author_new"></a>

### new Author(context)
There is no reason to directly create an author object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="Author+id"></a>

### author.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+name"></a>

### author.name : <code>String</code>
Name of this author/artist

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+imageUrl"></a>

### author.imageUrl : <code>String</code>
Image URL for this author/artist

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+biography"></a>

### author.biography : <code>Array.&lt;String&gt;</code>
Author/Artist biography

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+createdAt"></a>

### author.createdAt : <code>Date</code>
The date of this author/artist page creation

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+updatedAt"></a>

### author.updatedAt : <code>Date</code>
The date the author/artist was last updated

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+manga"></a>

### author.manga : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Manga this author/artist has been attributed to

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author.search"></a>

### Author.search([searchParameters], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
Peforms a search and returns an array of a authors/artists.https://api.mangadex.org/docs.html#operation/get-author

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>AuthorParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the name |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Author.getMultiple"></a>

### Author.getMultiple(...ids) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
Gets multiple authors

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Author</code>](#Author) \| [<code>Relationship</code>](#Relationship) | 

<a name="Author.get"></a>

### Author.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
Retrieves and returns a author by its id

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Author.getByQuery"></a>

### Author.getByQuery([searchParameters]) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
Performs a search for one author and returns that author

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type | Description |
| --- | --- | --- |
| [searchParameters] | <code>AuthorParameterObject</code> \| <code>String</code> | An object of offical search parameters, or a string representing the name |

<a name="Chapter"></a>

## Chapter
Represents a chapter with readable pageshttps://api.mangadex.org/docs.html#tag/Chapter

**Kind**: global class  

* [Chapter](#Chapter)
    * [new Chapter(context)](#new_Chapter_new)
    * _instance_
        * [.id](#Chapter+id) : <code>String</code>
        * [.volume](#Chapter+volume) : <code>String</code>
        * [.chapter](#Chapter+chapter) : <code>String</code>
        * [.title](#Chapter+title) : <code>String</code>
        * [.translatedLanguage](#Chapter+translatedLanguage) : <code>String</code>
        * [.hash](#Chapter+hash) : <code>String</code>
        * [.createdAt](#Chapter+createdAt) : <code>Date</code>
        * [.updatedAt](#Chapter+updatedAt) : <code>Date</code>
        * [.publishAt](#Chapter+publishAt) : <code>Date</code>
        * [.pageNames](#Chapter+pageNames) : <code>Array.&lt;String&gt;</code>
        * [.saverPageNames](#Chapter+saverPageNames) : <code>Array.&lt;String&gt;</code>
        * [.isExternal](#Chapter+isExternal) : <code>Boolean</code>
        * [.externalUrl](#Chapter+externalUrl) : <code>String</code>
        * [.groups](#Chapter+groups) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.manga](#Chapter+manga) : [<code>Relationship</code>](#Relationship)
        * [.uploader](#Chapter+uploader) : [<code>Relationship</code>](#Relationship)
        * [.getReadablePages([saver])](#Chapter+getReadablePages) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.changeReadMarker([read])](#Chapter+changeReadMarker) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
    * _static_
        * [.search([searchParameters], [includeSubObjects])](#Chapter.search) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getMultiple(...ids)](#Chapter.getMultiple) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.get(id, [includeSubObjects])](#Chapter.get) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
        * [.getByQuery([searchParameters])](#Chapter.getByQuery) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
        * [.changeReadMarker(id, [read])](#Chapter.changeReadMarker) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_Chapter_new"></a>

### new Chapter(context)
There is no reason to directly create a chapter object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="Chapter+id"></a>

### chapter.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+volume"></a>

### chapter.volume : <code>String</code>
This chapter's volume number/string

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+chapter"></a>

### chapter.chapter : <code>String</code>
This chapter's number/string identifier

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+title"></a>

### chapter.title : <code>String</code>
Title of this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+translatedLanguage"></a>

### chapter.translatedLanguage : <code>String</code>
Translated language code (2 Letters)

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+hash"></a>

### chapter.hash : <code>String</code>
Hash id of this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+createdAt"></a>

### chapter.createdAt : <code>Date</code>
The date of this chapter's creation

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+updatedAt"></a>

### chapter.updatedAt : <code>Date</code>
The date this chapter was last updated

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+publishAt"></a>

### chapter.publishAt : <code>Date</code>
The date this chapter was published

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+pageNames"></a>

### chapter.pageNames : <code>Array.&lt;String&gt;</code>
Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+saverPageNames"></a>

### chapter.saverPageNames : <code>Array.&lt;String&gt;</code>
Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+isExternal"></a>

### chapter.isExternal : <code>Boolean</code>
Is this chapter only a link to another website (eg Mangaplus) instead of being hosted on MD?

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+externalUrl"></a>

### chapter.externalUrl : <code>String</code>
The external URL to this chapter if it is not hosted on MD. Null if it is hosted on MD

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+groups"></a>

### chapter.groups : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
The scanlation groups that are attributed to this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+manga"></a>

### chapter.manga : [<code>Relationship</code>](#Relationship)
The manga this chapter belongs to

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+uploader"></a>

### chapter.uploader : [<code>Relationship</code>](#Relationship)
The user who uploaded this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+getReadablePages"></a>

### chapter.getReadablePages([saver]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Retrieves URLs for actual images from Mangadex @ Home.This only gives URLs, so it does not report the status of the server to Mangadex @ Home.Therefore applications that download image data pleaese report failures as stated here:https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report

**Kind**: instance method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [saver] | <code>Boolean</code> | <code>false</code> | Use data saver images? |

<a name="Chapter+changeReadMarker"></a>

### chapter.changeReadMarker([read]) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
Marks this chapter as either read or unread

**Kind**: instance method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [read] | <code>Boolean</code> | <code>true</code> | True to mark as read, false to mark unread |

<a name="Chapter.search"></a>

### Chapter.search([searchParameters], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Peforms a search and returns an array of chapters.https://api.mangadex.org/docs.html#operation/get-chapter

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>ChapterParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the title |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Chapter.getMultiple"></a>

### Chapter.getMultiple(...ids) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Gets multiple chapters

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Chapter</code>](#Chapter) \| [<code>Relationship</code>](#Relationship) | 

<a name="Chapter.get"></a>

### Chapter.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
Retrieves and returns a chapter by its id

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Chapter.getByQuery"></a>

### Chapter.getByQuery([searchParameters]) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
Performs a search for one chapter and returns that chapter

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Description |
| --- | --- | --- |
| [searchParameters] | <code>ChapterParameterObject</code> \| <code>String</code> | An object of offical search parameters, or a string representing the title |

<a name="Chapter.changeReadMarker"></a>

### Chapter.changeReadMarker(id, [read]) ⇒ <code>Promise.&lt;void&gt;</code>
Marks a chapter as either read or unread

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  |  |
| [read] | <code>Boolean</code> | <code>true</code> | True to mark as read, false to mark unread |

<a name="Cover"></a>

## Cover
Represents the cover art of a manga volumehttps://api.mangadex.org/docs.html#tag/Cover

**Kind**: global class  

* [Cover](#Cover)
    * [new Cover(context)](#new_Cover_new)
    * _instance_
        * [.id](#Cover+id) : <code>String</code>
        * [.volume](#Cover+volume) : <code>String</code>
        * [.description](#Cover+description) : <code>String</code>
        * [.createdAt](#Cover+createdAt) : <code>Date</code>
        * [.updatedAt](#Cover+updatedAt) : <code>Date</code>
        * [.manga](#Cover+manga) : [<code>Relationship</code>](#Relationship)
        * [.uploader](#Cover+uploader) : [<code>Relationship</code>](#Relationship)
        * [.imageSource](#Cover+imageSource) : <code>String</code>
        * [.image512](#Cover+image512) : <code>String</code>
        * [.image256](#Cover+image256) : <code>String</code>
    * _static_
        * [.get(id, [includeSubObjects])](#Cover.get) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
        * [.search([searchParameters], [includeSubObjects])](#Cover.search) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
        * [.getMultiple(...ids)](#Cover.getMultiple) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
        * [.getByQuery([searchParameters])](#Cover.getByQuery) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
        * [.getMangaCovers(...manga)](#Cover.getMangaCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>

<a name="new_Cover_new"></a>

### new Cover(context)
There is no reason to directly create a cover art object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="Cover+id"></a>

### cover.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+volume"></a>

### cover.volume : <code>String</code>
Manga volume this is a cover for

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+description"></a>

### cover.description : <code>String</code>
Description of this cover

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+createdAt"></a>

### cover.createdAt : <code>Date</code>
The date of the cover's creation

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+updatedAt"></a>

### cover.updatedAt : <code>Date</code>
The date the cover was last updated

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+manga"></a>

### cover.manga : [<code>Relationship</code>](#Relationship)
Manga this is a cover for

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+uploader"></a>

### cover.uploader : [<code>Relationship</code>](#Relationship)
The user who uploaded this cover

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+imageSource"></a>

### cover.imageSource : <code>String</code>
URL to the source image of the cover

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+image512"></a>

### cover.image512 : <code>String</code>
URL to the 512px image of the cover

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover+image256"></a>

### cover.image256 : <code>String</code>
URL to the 256px image of the cover

**Kind**: instance property of [<code>Cover</code>](#Cover)  
<a name="Cover.get"></a>

### Cover.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
Retrieves and returns a cover by its id

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Cover.search"></a>

### Cover.search([searchParameters], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Peforms a search and returns an array of covers.https://api.mangadex.org/docs.html#operation/get-cover

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>CoverParameterObject</code> |  |  |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Cover.getMultiple"></a>

### Cover.getMultiple(...ids) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Gets multiple covers

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Cover</code>](#Cover) \| [<code>Relationship</code>](#Relationship) | 

<a name="Cover.getByQuery"></a>

### Cover.getByQuery([searchParameters]) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
Performs a search for one manga and returns that manga

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type |
| --- | --- |
| [searchParameters] | <code>CoverParameterObject</code> | 

<a name="Cover.getMangaCovers"></a>

### Cover.getMangaCovers(...manga) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Get an array of manga's covers

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type |
| --- | --- |
| ...manga | <code>String</code> \| [<code>Manga</code>](#Manga) \| [<code>Relationship</code>](#Relationship) | 

<a name="Group"></a>

## Group
Represents a scanlation grouphttps://api.mangadex.org/docs.html#tag/Group

**Kind**: global class  

* [Group](#Group)
    * [new Group(context)](#new_Group_new)
    * _instance_
        * [.id](#Group+id) : <code>String</code>
        * [.name](#Group+name) : <code>String</code>
        * [.createdAt](#Group+createdAt) : <code>Date</code>
        * [.updatedAt](#Group+updatedAt) : <code>Date</code>
        * [.locked](#Group+locked) : <code>Boolean</code>
        * [.website](#Group+website) : <code>String</code>
        * [.ircServer](#Group+ircServer) : <code>String</code>
        * [.ircChannel](#Group+ircChannel) : <code>String</code>
        * [.discord](#Group+discord) : <code>String</code>
        * [.description](#Group+description) : <code>String</code>
        * [.official](#Group+official) : <code>Boolean</code>
        * [.verified](#Group+verified) : <code>Boolean</code>
        * [.leader](#Group+leader) : [<code>Relationship</code>](#Relationship)
        * [.members](#Group+members) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.changeFollowship([follow])](#Group+changeFollowship) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
    * _static_
        * [.search([searchParameters], [includeSubObjects])](#Group.search) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
        * [.getMultiple(...ids)](#Group.getMultiple) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
        * [.get(id, [includeSubObjects])](#Group.get) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
        * [.getByQuery([searchParameters])](#Group.getByQuery) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
        * [.getFollowedGroups([limit], [offset])](#Group.getFollowedGroups) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
        * [.changeFollowship(id, [follow])](#Group.changeFollowship) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_Group_new"></a>

### new Group(context)
There is no reason to directly create a group object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="Group+id"></a>

### group.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+name"></a>

### group.name : <code>String</code>
Name of this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+createdAt"></a>

### group.createdAt : <code>Date</code>
The date of this group's creation

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+updatedAt"></a>

### group.updatedAt : <code>Date</code>
The date the group was last updated

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+locked"></a>

### group.locked : <code>Boolean</code>
Is this group locked?

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+website"></a>

### group.website : <code>String</code>
Website URL for this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+ircServer"></a>

### group.ircServer : <code>String</code>
IRC Server for this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+ircChannel"></a>

### group.ircChannel : <code>String</code>
IRC Channel for this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+discord"></a>

### group.discord : <code>String</code>
Discord Invite Code for this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+description"></a>

### group.description : <code>String</code>
The group's custom description

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+official"></a>

### group.official : <code>Boolean</code>
Is this group an official publisher?

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+verified"></a>

### group.verified : <code>Boolean</code>
Is this group managed by an official publisher?

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+leader"></a>

### group.leader : [<code>Relationship</code>](#Relationship)
This group's leader

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+members"></a>

### group.members : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Array of this group's members

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+changeFollowship"></a>

### group.changeFollowship([follow]) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
Makes the logged in user either follow or unfollow this group

**Kind**: instance method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="Group.search"></a>

### Group.search([searchParameters], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
Peforms a search and returns an array of groups.https://api.mangadex.org/docs.html#operation/get-search-group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>GroupParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the name |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Group.getMultiple"></a>

### Group.getMultiple(...ids) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
Gets multiple groups

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Group</code>](#Group) \| [<code>Relationship</code>](#Relationship) | 

<a name="Group.get"></a>

### Group.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
Retrieves and returns a group by its id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Group.getByQuery"></a>

### Group.getByQuery([searchParameters]) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
Performs a search for one group and returns that group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| [searchParameters] | <code>GroupParameterObject</code> \| <code>String</code> | An object of offical search parameters, or a string representing the name |

<a name="Group.getFollowedGroups"></a>

### Group.getFollowedGroups([limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
Returns all groups followed by the logged in user

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>Number</code> | <code>100</code> | Amount of groups to return (0 to Infinity) |
| [offset] | <code>Number</code> | <code>0</code> | How many groups to skip before returning |

<a name="Group.changeFollowship"></a>

### Group.changeFollowship(id, [follow]) ⇒ <code>Promise.&lt;void&gt;</code>
Makes the logged in user either follow or unfollow a group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  |  |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="List"></a>

## List
Represents a custom, user-created list of mangahttps://api.mangadex.org/docs.html#tag/CustomList

**Kind**: global class  

* [List](#List)
    * [new List(context)](#new_List_new)
    * _instance_
        * [.id](#List+id) : <code>String</code>
        * [.name](#List+name) : <code>String</code>
        * [.version](#List+version) : <code>String</code>
        * [.visibility](#List+visibility) : <code>&#x27;public&#x27;</code> \| <code>&#x27;private&#x27;</code>
        * [.manga](#List+manga) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.owner](#List+owner) : [<code>Relationship</code>](#Relationship)
        * [.public](#List+public) : <code>Boolean</code>
        * [.getFeed([parameterObject])](#List+getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.delete()](#List+delete) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.rename(newName)](#List+rename) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.changeVisibility([newVis])](#List+changeVisibility) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.updateMangaList(newList)](#List+updateMangaList) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.addManga(manga)](#List+addManga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.removeManga(manga)](#List+removeManga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
    * _static_
        * [.get(id, [includeSubObjects])](#List.get) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.create(name, manga, [visibility])](#List.create) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.delete(id)](#List.delete) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.addManga(listId, manga)](#List.addManga) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.removeManga(listId, manga)](#List.removeManga) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getLoggedInUserLists([limit], [offset], [includeSubObjects])](#List.getLoggedInUserLists) ⇒ <code>Promise.&lt;Array.&lt;List&gt;&gt;</code>
        * [.getUserLists(user, [limit], [offset], [includeSubObjects])](#List.getUserLists) ⇒ <code>Promise.&lt;Array.&lt;List&gt;&gt;</code>
        * [.getFeed(id, parameterObject, [includeSubObjects])](#List.getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>

<a name="new_List_new"></a>

### new List(context)
There is no reason to directly create a custom list object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="List+id"></a>

### list.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+name"></a>

### list.name : <code>String</code>
Name of this custom list

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+version"></a>

### list.version : <code>String</code>
Version of this custom list

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+visibility"></a>

### list.visibility : <code>&#x27;public&#x27;</code> \| <code>&#x27;private&#x27;</code>
String form of this list's visibility

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+manga"></a>

### list.manga : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to all of the manga in this custom list

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+owner"></a>

### list.owner : [<code>Relationship</code>](#Relationship)
This list's owner

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+public"></a>

### list.public : <code>Boolean</code>
Is this list public?

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+getFeed"></a>

### list.getFeed([parameterObject]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a list of the most recent chapters from the manga in a listhttps://api.mangadex.org/docs.html#operation/get-list-id-feed

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| [parameterObject] | <code>FeedParameterObject</code> | Information on which chapters to be returned |

<a name="List+delete"></a>

### list.delete() ⇒ <code>Promise.&lt;void&gt;</code>
Delete a custom list. Must be logged in

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List+rename"></a>

### list.rename(newName) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Renames a custom list. Must be logged in

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| newName | <code>String</code> | 

<a name="List+changeVisibility"></a>

### list.changeVisibility([newVis]) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Changes the visibility a custom list. Must be logged in

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| [newVis] | <code>&#x27;public&#x27;</code> \| <code>&#x27;private&#x27;</code> | Leave blank to toggle |

<a name="List+updateMangaList"></a>

### list.updateMangaList(newList) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Changes the manga in a custom list. Must be logged in

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| newList | [<code>Array.&lt;Manga&gt;</code>](#Manga) \| <code>Array.&lt;String&gt;</code> | 

<a name="List+addManga"></a>

### list.addManga(manga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Adds a manga to this list

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List+removeManga"></a>

### list.removeManga(manga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Removes a manga from this list

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List.get"></a>

### List.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Retrieves and returns a list by its id

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="List.create"></a>

### List.create(name, manga, [visibility]) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Create a new custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default |
| --- | --- | --- |
| name | <code>String</code> |  | 
| manga | [<code>Array.&lt;Manga&gt;</code>](#Manga) \| <code>Array.&lt;String&gt;</code> |  | 
| [visibility] | <code>&#x27;public&#x27;</code> \| <code>&#x27;private&#x27;</code> | <code>&#x27;private&#x27;</code> | 

<a name="List.delete"></a>

### List.delete(id) ⇒ <code>Promise.&lt;void&gt;</code>
Deletes a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="List.addManga"></a>

### List.addManga(listId, manga) ⇒ <code>Promise.&lt;void&gt;</code>
Adds a manga to a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| listId | <code>String</code> | 
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List.removeManga"></a>

### List.removeManga(listId, manga) ⇒ <code>Promise.&lt;void&gt;</code>
Removes a manga from a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| listId | <code>String</code> | 
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List.getLoggedInUserLists"></a>

### List.getLoggedInUserLists([limit], [offset], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;List&gt;&gt;</code>
Returns all lists created by the logged in user.

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>Number</code> | <code>100</code> | Amount of lists to return (0 to Infinity) |
| [offset] | <code>Number</code> | <code>0</code> | How many lists to skip before returning |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="List.getUserLists"></a>

### List.getUserLists(user, [limit], [offset], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;List&gt;&gt;</code>
Returns all public lists created by a user.

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| user | <code>String</code> \| [<code>User</code>](#User) \| [<code>Relationship</code>](#Relationship) |  |  |
| [limit] | <code>Number</code> | <code>100</code> | Amount of lists to return (0 to Infinity) |
| [offset] | <code>Number</code> | <code>0</code> | How many lists to skip before returning |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="List.getFeed"></a>

### List.getFeed(id, parameterObject, [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a list of the most recent chapters from the manga in a list

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id of the list |
| parameterObject | <code>FeedParameterObject</code> |  | Information on which chapters to be returned |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga"></a>

## Manga
Represents a manga objecthttps://api.mangadex.org/docs.html#tag/Manga

**Kind**: global class  

* [Manga](#Manga)
    * [new Manga(context)](#new_Manga_new)
    * _instance_
        * [.id](#Manga+id) : <code>String</code>
        * [.localizedTitle](#Manga+localizedTitle) : [<code>LocalizedString</code>](#LocalizedString)
        * [.localizedAltTitles](#Manga+localizedAltTitles) : [<code>Array.&lt;LocalizedString&gt;</code>](#LocalizedString)
        * [.localizedDescription](#Manga+localizedDescription) : [<code>LocalizedString</code>](#LocalizedString)
        * [.isLocked](#Manga+isLocked) : <code>Boolean</code>
        * [.links](#Manga+links) : [<code>Links</code>](#Links)
        * [.originalLanguage](#Manga+originalLanguage) : <code>String</code>
        * [.lastVolume](#Manga+lastVolume) : <code>String</code>
        * [.lastChapter](#Manga+lastChapter) : <code>String</code>
        * [.publicationDemographic](#Manga+publicationDemographic) : <code>&#x27;shounen&#x27;</code> \| <code>&#x27;shoujo&#x27;</code> \| <code>&#x27;josei&#x27;</code> \| <code>&#x27;seinen&#x27;</code>
        * [.status](#Manga+status) : <code>&#x27;ongoing&#x27;</code> \| <code>&#x27;completed&#x27;</code> \| <code>&#x27;hiatus&#x27;</code> \| <code>&#x27;cancelled&#x27;</code>
        * [.year](#Manga+year) : <code>Number</code>
        * [.contentRating](#Manga+contentRating) : <code>&#x27;safe&#x27;</code> \| <code>&#x27;suggestive&#x27;</code> \| <code>&#x27;erotica&#x27;</code> \| <code>&#x27;pornographic&#x27;</code>
        * [.createdAt](#Manga+createdAt) : <code>Date</code>
        * [.updatedAt](#Manga+updatedAt) : <code>Date</code>
        * [.authors](#Manga+authors) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.artists](#Manga+artists) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.mainCover](#Manga+mainCover) : [<code>Relationship</code>](#Relationship)
        * [.tags](#Manga+tags) : [<code>Array.&lt;Tag&gt;</code>](#Tag)
        * [.title](#Manga+title) : <code>String</code>
        * [.altTitles](#Manga+altTitles) : <code>Array.&lt;String&gt;</code>
        * [.description](#Manga+description) : <code>String</code>
        * [.createUploadSession([...groups])](#Manga+createUploadSession) ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)
        * [.getCovers()](#Manga+getCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
        * [.getFeed([parameterObject], [includeSubObjects])](#Manga+getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.addToList(list)](#Manga+addToList) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getReadingStatus()](#Manga+getReadingStatus) ⇒ <code>Promise.&lt;(&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
        * [.setReadingStatus([status])](#Manga+setReadingStatus) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.changeFollowship([follow])](#Manga+changeFollowship) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getReadChapters()](#Manga+getReadChapters) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getAggregate(...languages)](#Manga+getAggregate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * _static_
        * [.search([searchParameters], [includeSubObjects])](#Manga.search) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
        * [.getMultiple(...ids)](#Manga.getMultiple) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
        * [.get(id, [includeSubObjects])](#Manga.get) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getByQuery([searchParameters], [includeSubObjects])](#Manga.getByQuery) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getFeed(id, [parameterObject], [includeSubObjects])](#Manga.getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getRandom([includeSubObjects])](#Manga.getRandom) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getFollowedManga([limit], [offset])](#Manga.getFollowedManga) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
        * [.getTag(indentity)](#Manga.getTag) ⇒ [<code>Promise.&lt;Tag&gt;</code>](#Tag)
        * [.getAllTags()](#Manga.getAllTags) ⇒ <code>Promise.&lt;Array.&lt;Tag&gt;&gt;</code>
        * [.getReadingStatus(id)](#Manga.getReadingStatus) ⇒ <code>Promise.&lt;(&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
        * [.setReadingStatus(id, [status])](#Manga.setReadingStatus) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getAllReadingStatuses()](#Manga.getAllReadingStatuses) ⇒ <code>Object.&lt;string, (&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
        * [.getFollowedFeed([parameterObject], [includeSubObjects])](#Manga.getFollowedFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.changeFollowship(id, [follow])](#Manga.changeFollowship) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getReadChapters(...ids)](#Manga.getReadChapters) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getCovers(...id)](#Manga.getCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
        * [.getAggregate(id, ...languages)](#Manga.getAggregate) ⇒ <code>Promise.&lt;Object.&lt;string, AggregateVolume&gt;&gt;</code>
        * [.createUploadSession(id, [...groups])](#Manga.createUploadSession) ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)
        * [.getCurrentUploadSession()](#Manga.getCurrentUploadSession) ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)

<a name="new_Manga_new"></a>

### new Manga(context)
There is no reason to directly create a manga object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="Manga+id"></a>

### manga.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+localizedTitle"></a>

### manga.localizedTitle : [<code>LocalizedString</code>](#LocalizedString)
Main title with different localization options

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+localizedAltTitles"></a>

### manga.localizedAltTitles : [<code>Array.&lt;LocalizedString&gt;</code>](#LocalizedString)
Alt titles with different localization options

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+localizedDescription"></a>

### manga.localizedDescription : [<code>LocalizedString</code>](#LocalizedString)
Description with different localization options

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+isLocked"></a>

### manga.isLocked : <code>Boolean</code>
Is this Manga locked?

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+links"></a>

### manga.links : [<code>Links</code>](#Links)
Link object representing links to other websites about this mangahttps://api.mangadex.org/docs.html#section/Static-data/Manga-links-data

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+originalLanguage"></a>

### manga.originalLanguage : <code>String</code>
2-letter code for the original language of this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+lastVolume"></a>

### manga.lastVolume : <code>String</code>
This manga's last volume based on the default feed order

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+lastChapter"></a>

### manga.lastChapter : <code>String</code>
This manga's last chapter based on the default feed order

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+publicationDemographic"></a>

### manga.publicationDemographic : <code>&#x27;shounen&#x27;</code> \| <code>&#x27;shoujo&#x27;</code> \| <code>&#x27;josei&#x27;</code> \| <code>&#x27;seinen&#x27;</code>
Publication demographic of this mangahttps://api.mangadex.org/docs.html#section/Static-data/Manga-publication-demographic

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+status"></a>

### manga.status : <code>&#x27;ongoing&#x27;</code> \| <code>&#x27;completed&#x27;</code> \| <code>&#x27;hiatus&#x27;</code> \| <code>&#x27;cancelled&#x27;</code>
Publication/Scanlation status of this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+year"></a>

### manga.year : <code>Number</code>
Year of this manga's publication

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+contentRating"></a>

### manga.contentRating : <code>&#x27;safe&#x27;</code> \| <code>&#x27;suggestive&#x27;</code> \| <code>&#x27;erotica&#x27;</code> \| <code>&#x27;pornographic&#x27;</code>
The content rating of this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+createdAt"></a>

### manga.createdAt : <code>Date</code>
The date of this manga's page creation

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+updatedAt"></a>

### manga.updatedAt : <code>Date</code>
The date the manga was last updated

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+authors"></a>

### manga.authors : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Authors attributed to this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+artists"></a>

### manga.artists : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Artists attributed to this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+mainCover"></a>

### manga.mainCover : [<code>Relationship</code>](#Relationship)
This manga's main cover. Use 'getCovers' to retrive other covers

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+tags"></a>

### manga.tags : [<code>Array.&lt;Tag&gt;</code>](#Tag)
Array of tags for this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+title"></a>

### manga.title : <code>String</code>
Main title string based on global locale

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+altTitles"></a>

### manga.altTitles : <code>Array.&lt;String&gt;</code>
Alt titles array based on global locale

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+description"></a>

### manga.description : <code>String</code>
Description string based on global locale

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+createUploadSession"></a>

### manga.createUploadSession([...groups]) ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)
Creates a new upload session with this manga as the target

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| [...groups] | <code>String</code> \| [<code>Group</code>](#Group) | 

<a name="Manga+getCovers"></a>

### manga.getCovers() ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Returns all covers for this manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  
<a name="Manga+getFeed"></a>

### manga.getFeed([parameterObject], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a feed of this manga's chapters.

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parameterObject] | <code>FeedParameterObject</code> \| <code>Number</code> |  | Either a parameter object or a number representing the limit |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga+addToList"></a>

### manga.addToList(list) ⇒ <code>Promise.&lt;void&gt;</code>
Adds this manga to a list

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| list | [<code>List</code>](#List) \| <code>String</code> | 

<a name="Manga+getReadingStatus"></a>

### manga.getReadingStatus() ⇒ <code>Promise.&lt;(&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
Retrieves the logged in user's reading status for this manga.If there is no status, null is returned

**Kind**: instance method of [<code>Manga</code>](#Manga)  
<a name="Manga+setReadingStatus"></a>

### manga.setReadingStatus([status]) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Sets the logged in user's reading status for this manga. Call without arguments to clear the reading status

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type | Default |
| --- | --- | --- |
| [status] | <code>&#x27;reading&#x27;</code> \| <code>&#x27;on\_hold&#x27;</code> \| <code>&#x27;plan\_to\_read&#x27;</code> \| <code>&#x27;dropped&#x27;</code> \| <code>&#x27;re\_reading&#x27;</code> \| <code>&#x27;completed&#x27;</code> | <code></code> | 

<a name="Manga+changeFollowship"></a>

### manga.changeFollowship([follow]) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Makes the logged in user either follow or unfollow this manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="Manga+getReadChapters"></a>

### manga.getReadChapters() ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns an array of every chapter that has been marked as read for this manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  
<a name="Manga+getAggregate"></a>

### manga.getAggregate(...languages) ⇒ <code>Promise.&lt;Object&gt;</code>
Returns a summary of every chapter for this manga including each of their numbers and volumes they belong tohttps://api.mangadex.org/docs.html#operation/post-manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| ...languages | <code>String</code> | 

<a name="Manga.search"></a>

### Manga.search([searchParameters], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
Peforms a search and returns an array of manga.https://api.mangadex.org/docs.html#operation/get-search-manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>MangaParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the title |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.getMultiple"></a>

### Manga.getMultiple(...ids) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
Gets multiple manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Relationship</code>](#Relationship) | 

<a name="Manga.get"></a>

### Manga.get(id, [includeSubObjects]) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Retrieves and returns a manga by its id

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.getByQuery"></a>

### Manga.getByQuery([searchParameters], [includeSubObjects]) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Performs a search for one manga and returns that manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>MangaParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the title |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.getFeed"></a>

### Manga.getFeed(id, [parameterObject], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a feed of chapters for a manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  |  |
| [parameterObject] | <code>FeedParameterObject</code> \| <code>Number</code> |  | Either a parameter object or a number representing the limit |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.getRandom"></a>

### Manga.getRandom([includeSubObjects]) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Returns one random manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.getFollowedManga"></a>

### Manga.getFollowedManga([limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
Returns all manga followed by the logged in user

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>Number</code> | <code>100</code> | Amount of manga to return (0 to Infinity) |
| [offset] | <code>Number</code> | <code>0</code> | How many manga to skip before returning |

<a name="Manga.getTag"></a>

### Manga.getTag(indentity) ⇒ [<code>Promise.&lt;Tag&gt;</code>](#Tag)
Retrieves a tag object based on its id or name ('Oneshot', 'Thriller,' etc).The result of every available tag is cached, so subsequent tag requests will have no delayhttps://api.mangadex.org/docs.html#operation/get-manga-tag

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| indentity | <code>String</code> | 

<a name="Manga.getAllTags"></a>

### Manga.getAllTags() ⇒ <code>Promise.&lt;Array.&lt;Tag&gt;&gt;</code>
Returns an array of every tag available on Mangadex right now.The result is cached, so subsequent tag requests will have no delayhttps://api.mangadex.org/docs.html#operation/get-manga-tag

**Kind**: static method of [<code>Manga</code>](#Manga)  
<a name="Manga.getReadingStatus"></a>

### Manga.getReadingStatus(id) ⇒ <code>Promise.&lt;(&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
Retrieves the logged in user's reading status for a manga.If there is no status, null is returned

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="Manga.setReadingStatus"></a>

### Manga.setReadingStatus(id, [status]) ⇒ <code>Promise.&lt;void&gt;</code>
Sets the logged in user's reading status for this manga. Call without arguments to clear the reading status

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>String</code> |  | 
| [status] | <code>&#x27;reading&#x27;</code> \| <code>&#x27;on\_hold&#x27;</code> \| <code>&#x27;plan\_to\_read&#x27;</code> \| <code>&#x27;dropped&#x27;</code> \| <code>&#x27;re\_reading&#x27;</code> \| <code>&#x27;completed&#x27;</code> | <code></code> | 

<a name="Manga.getAllReadingStatuses"></a>

### Manga.getAllReadingStatuses() ⇒ <code>Object.&lt;string, (&#x27;reading&#x27;\|&#x27;on\_hold&#x27;\|&#x27;plan\_to\_read&#x27;\|&#x27;dropped&#x27;\|&#x27;re\_reading&#x27;\|&#x27;completed&#x27;)&gt;</code>
Returns the reading status for every manga for this logged in user as an object with Manga ids as keys

**Kind**: static method of [<code>Manga</code>](#Manga)  
<a name="Manga.getFollowedFeed"></a>

### Manga.getFollowedFeed([parameterObject], [includeSubObjects]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Gets the combined feed of every manga followed by the logged in user

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parameterObject] | <code>FeedParameterObject</code> \| <code>Number</code> |  | Either a parameter object or a number representing the limit |
| [includeSubObjects] | <code>Boolean</code> | <code>false</code> | Attempt to resolve sub objects (eg author, artists, etc) when available through the base request |

<a name="Manga.changeFollowship"></a>

### Manga.changeFollowship(id, [follow]) ⇒ <code>Promise.&lt;void&gt;</code>
Makes the logged in user either follow or unfollow a manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  |  |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="Manga.getReadChapters"></a>

### Manga.getReadChapters(...ids) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Retrieves the read chapters for multiple manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| ...ids | <code>String</code> \| [<code>Manga</code>](#Manga) \| [<code>Relationship</code>](#Relationship) | 

<a name="Manga.getCovers"></a>

### Manga.getCovers(...id) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Returns all covers for a manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Description |
| --- | --- | --- |
| ...id | <code>String</code> \| [<code>Manga</code>](#Manga) \| [<code>Relationship</code>](#Relationship) | Manga id(s) |

<a name="Manga.getAggregate"></a>

### Manga.getAggregate(id, ...languages) ⇒ <code>Promise.&lt;Object.&lt;string, AggregateVolume&gt;&gt;</code>
Returns a summary of every chapter for a manga including each of their numbers and volumes they belong tohttps://api.mangadex.org/docs.html#operation/post-manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| ...languages | <code>String</code> | 

<a name="Manga.createUploadSession"></a>

### Manga.createUploadSession(id, [...groups]) ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)
Creates a new upload session with a manga as the target

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 
| [...groups] | <code>String</code> \| [<code>Group</code>](#Group) | 

<a name="Manga.getCurrentUploadSession"></a>

### Manga.getCurrentUploadSession() ⇒ [<code>Promise.&lt;UploadSession&gt;</code>](#UploadSession)
Returns the currently open upload session for the logged in user.Returns null if there is no current session

**Kind**: static method of [<code>Manga</code>](#Manga)  
<a name="User"></a>

## User
Represents an userhttps://api.mangadex.org/docs.html#tag/User

**Kind**: global class  

* [User](#User)
    * [new User(context)](#new_User_new)
    * _instance_
        * [.id](#User+id) : <code>String</code>
        * [.username](#User+username) : <code>String</code>
        * [.changeFollowship([follow])](#User+changeFollowship) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
    * _static_
        * [.get(id)](#User.get) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
        * [.getFollowedUsers([limit], [offset])](#User.getFollowedUsers) ⇒ <code>Promise.&lt;Array.&lt;User&gt;&gt;</code>
        * [.getLoggedInUser()](#User.getLoggedInUser) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
        * [.changeFollowship(id, [follow])](#User.changeFollowship) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_User_new"></a>

### new User(context)
There is no reason to directly create a user object. Use static methods, ie 'get()'.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> \| <code>String</code> | Either an API response or Mangadex id |

<a name="User+id"></a>

### user.id : <code>String</code>
Mangadex id for this object

**Kind**: instance property of [<code>User</code>](#User)  
<a name="User+username"></a>

### user.username : <code>String</code>
Username of this user

**Kind**: instance property of [<code>User</code>](#User)  
<a name="User+changeFollowship"></a>

### user.changeFollowship([follow]) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Makes the logged in user either follow or unfollow this user

**Kind**: instance method of [<code>User</code>](#User)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="User.get"></a>

### User.get(id) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Retrieves and returns a user by its id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="User.getFollowedUsers"></a>

### User.getFollowedUsers([limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;User&gt;&gt;</code>
Returns all users followed by the logged in user

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>Number</code> | <code>100</code> | Amount of users to return (0 to Infinity) |
| [offset] | <code>Number</code> | <code>0</code> | How many users to skip before returning |

<a name="User.getLoggedInUser"></a>

### User.getLoggedInUser() ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Returns the logged in user as a user object

**Kind**: static method of [<code>User</code>](#User)  
<a name="User.changeFollowship"></a>

### User.changeFollowship(id, [follow]) ⇒ <code>Promise.&lt;void&gt;</code>
Makes the logged in user either follow or unfollow a user

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  |  |
| [follow] | <code>Boolean</code> | <code>true</code> | True to follow, false to unfollow |

<a name="Links"></a>

## Links
Represents the links that represent manga on different websiteshttps://api.mangadex.org/docs.html#section/Static-data/Manga-links-data

**Kind**: global class  

* [Links](#Links)
    * [.al](#Links+al) : <code>String</code>
    * [.ap](#Links+ap) : <code>String</code>
    * [.bw](#Links+bw) : <code>String</code>
    * [.mu](#Links+mu) : <code>String</code>
    * [.nu](#Links+nu) : <code>String</code>
    * [.mal](#Links+mal) : <code>String</code>
    * [.kt](#Links+kt) : <code>String</code>
    * [.amz](#Links+amz) : <code>String</code>
    * [.ebj](#Links+ebj) : <code>String</code>
    * [.raw](#Links+raw) : <code>String</code>
    * [.engtl](#Links+engtl) : <code>String</code>
    * [.cdj](#Links+cdj) : <code>String</code>
    * [.availableLinks](#Links+availableLinks) : <code>Array.&lt;String&gt;</code>

<a name="Links+al"></a>

### links.al : <code>String</code>
Anilist (https://anilist.co) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+ap"></a>

### links.ap : <code>String</code>
AnimePlanet (https://anime-planet.com) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+bw"></a>

### links.bw : <code>String</code>
Bookwalker (https://bookwalker.jp/) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+mu"></a>

### links.mu : <code>String</code>
Mangaupdates (https://mangaupdates.com) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+nu"></a>

### links.nu : <code>String</code>
Novelupdates (https://novelupdates.com) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+mal"></a>

### links.mal : <code>String</code>
MyAnimeList (https://myanimelist.net) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+kt"></a>

### links.kt : <code>String</code>
Kitsu (https://kitsu.io) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+amz"></a>

### links.amz : <code>String</code>
Amazon (https://amazon.com) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+ebj"></a>

### links.ebj : <code>String</code>
EBookJapan (https://ebookjapan.yahoo.co.jp) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+raw"></a>

### links.raw : <code>String</code>
Link to manga raws

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+engtl"></a>

### links.engtl : <code>String</code>
Link to offical english manga translation

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+cdj"></a>

### links.cdj : <code>String</code>
CDJapan (https://www.cdjapan.co.jp/) link to manga

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="Links+availableLinks"></a>

### links.availableLinks : <code>Array.&lt;String&gt;</code>
All of the links that have valid values

**Kind**: instance property of [<code>Links</code>](#Links)  
<a name="LocalizedString"></a>

## LocalizedString
Represents a string, but in different languages.Generates properties for each language available (ie you can index with language codes through localizedString['en'] or localizedString.jp)

**Kind**: global class  

* [LocalizedString](#LocalizedString)
    * [.availableLocales](#LocalizedString+availableLocales) : <code>Array.&lt;String&gt;</code>
    * [.localString](#LocalizedString+localString) ⇒ <code>String</code>

<a name="LocalizedString+availableLocales"></a>

### localizedString.availableLocales : <code>Array.&lt;String&gt;</code>
Array with all locales with values in this object

**Kind**: instance property of [<code>LocalizedString</code>](#LocalizedString)  
<a name="LocalizedString+localString"></a>

### localizedString.localString ⇒ <code>String</code>
String from global locale setting (setGlobalLocale)

**Kind**: instance property of [<code>LocalizedString</code>](#LocalizedString)  
<a name="Relationship"></a>

## Relationship
Represents a relationship from one Mangadex object to another such as a manga, author, etc via its id.

**Kind**: global class  

* [Relationship](#Relationship)
    * [.id](#Relationship+id) : <code>String</code>
    * [.type](#Relationship+type) : <code>String</code>
    * [.cached](#Relationship+cached) : <code>Boolean</code>
    * [.resolve()](#Relationship+resolve) ⇒ <code>Promise.&lt;(Manga\|Author\|Chapter\|User\|Group\|List\|Cover)&gt;</code>

<a name="Relationship+id"></a>

### relationship.id : <code>String</code>
Id of the object this is a relationship to

**Kind**: instance property of [<code>Relationship</code>](#Relationship)  
<a name="Relationship+type"></a>

### relationship.type : <code>String</code>
The type of the object this is a relationship to

**Kind**: instance property of [<code>Relationship</code>](#Relationship)  
<a name="Relationship+cached"></a>

### relationship.cached : <code>Boolean</code>
True if this relationship will instantly return with an included object instead of sending a requestwhen resolve() is called

**Kind**: instance property of [<code>Relationship</code>](#Relationship)  
<a name="Relationship+resolve"></a>

### relationship.resolve() ⇒ <code>Promise.&lt;(Manga\|Author\|Chapter\|User\|Group\|List\|Cover)&gt;</code>
This function must be called to return the proper and complete object representation of this relationship.Essentially, it calls and returns Manga.get(), Author.get(), Cover.get(), etc.

**Kind**: instance method of [<code>Relationship</code>](#Relationship)  
<a name="APIRequestError"></a>

## APIRequestError
This error respresents when the API responds with an error or invalid response.In other words, this error represents 400 and 500 status code responses.

**Kind**: global class  

* [APIRequestError](#APIRequestError)
    * [new APIRequestError(reason, code, ...params)](#new_APIRequestError_new)
    * [.OTHER](#APIRequestError+OTHER) : <code>Number</code>
    * [.AUTHORIZATION](#APIRequestError+AUTHORIZATION) : <code>Number</code>
    * [.INVALID_REQUEST](#APIRequestError+INVALID_REQUEST) : <code>Number</code>
    * [.INVALID_RESPONSE](#APIRequestError+INVALID_RESPONSE) : <code>Number</code>
    * [.code](#APIRequestError+code) : <code>Number</code>
    * [.name](#APIRequestError+name) : <code>String</code>
    * [.message](#APIRequestError+message) : <code>String</code>

<a name="new_APIRequestError_new"></a>

### new APIRequestError(reason, code, ...params)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| reason | <code>String</code> \| <code>Object</code> | <code>Unknown Request Error</code> | An error message or response from the API |
| code | <code>Number</code> | <code>0</code> |  |
| ...params | <code>any</code> |  |  |

<a name="APIRequestError+OTHER"></a>

### apiRequestError.OTHER : <code>Number</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+AUTHORIZATION"></a>

### apiRequestError.AUTHORIZATION : <code>Number</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+INVALID_REQUEST"></a>

### apiRequestError.INVALID\_REQUEST : <code>Number</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+INVALID_RESPONSE"></a>

### apiRequestError.INVALID\_RESPONSE : <code>Number</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+code"></a>

### apiRequestError.code : <code>Number</code>
What type of error is this?AUTHORIZATION, INVALID_RESPONSE, etc.

**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+name"></a>

### apiRequestError.name : <code>String</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="APIRequestError+message"></a>

### apiRequestError.message : <code>String</code>
**Kind**: instance property of [<code>APIRequestError</code>](#APIRequestError)  
<a name="Tag"></a>

## Tag
Represents a manga tag

**Kind**: global class  

* [Tag](#Tag)
    * [.cache](#Tag+cache) : [<code>Array.&lt;Tag&gt;</code>](#Tag)
    * [.id](#Tag+id) : <code>String</code>
    * [.localizedName](#Tag+localizedName) : [<code>LocalizedString</code>](#LocalizedString)
    * [.localizedDescription](#Tag+localizedDescription) : [<code>LocalizedString</code>](#LocalizedString)
    * [.group](#Tag+group) : <code>String</code>
    * [.name](#Tag+name) : <code>String</code>
    * [.description](#Tag+description) : <code>String</code>

<a name="Tag+cache"></a>

### tag.cache : [<code>Array.&lt;Tag&gt;</code>](#Tag)
A cached response from https://api.mangadex.org/manga/tag

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+id"></a>

### tag.id : <code>String</code>
Mangadex id of this tag

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+localizedName"></a>

### tag.localizedName : [<code>LocalizedString</code>](#LocalizedString)
Name with different localization options

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+localizedDescription"></a>

### tag.localizedDescription : [<code>LocalizedString</code>](#LocalizedString)
Description with different localization options

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+group"></a>

### tag.group : <code>String</code>
What type of tag group this tag belongs to

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+name"></a>

### tag.name : <code>String</code>
Name string based on global locale

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="Tag+description"></a>

### tag.description : <code>String</code>
Description string based on global locale

**Kind**: instance property of [<code>Tag</code>](#Tag)  
<a name="UploadSession"></a>

## UploadSession
Represents a chapter upload sessionhttps://api.mangadex.org/docs.html#tag/Upload

**Kind**: global class  

* [UploadSession](#UploadSession)
    * [new UploadSession(res)](#new_UploadSession_new)
    * _instance_
        * [.id](#UploadSession+id) : <code>String</code>
        * [.manga](#UploadSession+manga) : [<code>Relationship</code>](#Relationship)
        * [.groups](#UploadSession+groups) : [<code>Relationship</code>](#Relationship)
        * [.uploader](#UploadSession+uploader) : [<code>Relationship</code>](#Relationship)
        * [.isCommitted](#UploadSession+isCommitted) : <code>Boolean</code>
        * [.isProcessed](#UploadSession+isProcessed) : <code>Boolean</code>
        * [.isDeleted](#UploadSession+isDeleted) : <code>Boolean</code>
        * [.open](#UploadSession+open) : <code>Boolean</code>
        * [.pages](#UploadSession+pages) : <code>Array.&lt;String&gt;</code>
        * [.uploadPages(pages)](#UploadSession+uploadPages) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.close()](#UploadSession+close) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.commit(chapterDraft, pageOrder)](#UploadSession+commit) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
        * [.deletePage(...page)](#UploadSession+deletePage) ⇒ <code>Promise.&lt;void&gt;</code>
    * _static_
        * [.open(manga, [...groups])](#UploadSession.open) ⇒ [<code>UploadSession</code>](#UploadSession)
        * [.getCurrentSession()](#UploadSession.getCurrentSession) ⇒ [<code>UploadSession</code>](#UploadSession) \| <code>null</code>

<a name="new_UploadSession_new"></a>

### new UploadSession(res)
There is no reason to directly create an upload session object. Use static methods, ie 'open()'.


| Param | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | API response |

<a name="UploadSession+id"></a>

### uploadSession.id : <code>String</code>
Id of this upload session

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+manga"></a>

### uploadSession.manga : [<code>Relationship</code>](#Relationship)
Relationship of the target manga

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+groups"></a>

### uploadSession.groups : [<code>Relationship</code>](#Relationship)
Relationships to the groups attributed to this chapter

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+uploader"></a>

### uploadSession.uploader : [<code>Relationship</code>](#Relationship)
Relationship to the uploader (the current user)

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+isCommitted"></a>

### uploadSession.isCommitted : <code>Boolean</code>
Is this session commited?

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+isProcessed"></a>

### uploadSession.isProcessed : <code>Boolean</code>
Is this session processed?

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+isDeleted"></a>

### uploadSession.isDeleted : <code>Boolean</code>
Is this session deleted?

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+open"></a>

### uploadSession.open : <code>Boolean</code>
Is this session open for uploading pages?

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+pages"></a>

### uploadSession.pages : <code>Array.&lt;String&gt;</code>
The ids of every page uploaded THIS session

**Kind**: instance property of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+uploadPages"></a>

### uploadSession.uploadPages(pages) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Uploads pages through this upload session

**Kind**: instance method of [<code>UploadSession</code>](#UploadSession)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - Returns the ids of every newly uploaded file  

| Param | Type |
| --- | --- |
| pages | <code>Array.&lt;PageFileObject&gt;</code> | 

<a name="UploadSession+close"></a>

### uploadSession.close() ⇒ <code>Promise.&lt;void&gt;</code>
Closes this upload session

**Kind**: instance method of [<code>UploadSession</code>](#UploadSession)  
<a name="UploadSession+commit"></a>

### uploadSession.commit(chapterDraft, pageOrder) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
**Kind**: instance method of [<code>UploadSession</code>](#UploadSession)  
**Returns**: [<code>Promise.&lt;Chapter&gt;</code>](#Chapter) - Returns the new chapter  

| Param | Type | Description |
| --- | --- | --- |
| chapterDraft | <code>ChapterDraftObject</code> |  |
| pageOrder | <code>Array.&lt;String&gt;</code> | Array of file ids sorted by their proper order. Default is the upload order |

<a name="UploadSession+deletePage"></a>

### uploadSession.deletePage(...page) ⇒ <code>Promise.&lt;void&gt;</code>
Deletes an uploaded page via its upload file id.

**Kind**: instance method of [<code>UploadSession</code>](#UploadSession)  

| Param | Type |
| --- | --- |
| ...page | <code>String</code> | 

<a name="UploadSession.open"></a>

### UploadSession.open(manga, [...groups]) ⇒ [<code>UploadSession</code>](#UploadSession)
Requests MD to start an upload session

**Kind**: static method of [<code>UploadSession</code>](#UploadSession)  

| Param | Type |
| --- | --- |
| manga | <code>String</code> \| [<code>Manga</code>](#Manga) | 
| [...groups] | <code>String</code> \| [<code>Group</code>](#Group) \| [<code>Relationship</code>](#Relationship) | 

<a name="UploadSession.getCurrentSession"></a>

### UploadSession.getCurrentSession() ⇒ [<code>UploadSession</code>](#UploadSession) \| <code>null</code>
Returns the currently open upload session for the logged in user.Returns null if there is no current session

**Kind**: static method of [<code>UploadSession</code>](#UploadSession)  
<a name="convertLegacyId"></a>

## convertLegacyId(type, ...ids) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.Any invalid legacy ids will be skipped by Mangadex when remapping, socall this function for each individual id if this is an issue.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;group&#x27;</code> \| <code>&#x27;manga&#x27;</code> \| <code>&#x27;chapter&#x27;</code> \| <code>&#x27;tag&#x27;</code> | Type of id |
| ...ids | <code>Number</code> \| <code>Array.&lt;Number&gt;</code> | Array of ids to convert |

<a name="setGlobalLocale"></a>

## setGlobalLocale(newLocale)
Sets the global locaization for LocalizedStrings.Uses 2-letter Mangadex region codes.

**Kind**: global function  

| Param | Type |
| --- | --- |
| newLocale | <code>String</code> | 

<a name="login"></a>

## login(username, password, [cacheLocation]) ⇒ <code>Promise.&lt;void&gt;</code>
Required for authorizationhttps://api.mangadex.org/docs.html#operation/post-auth-login

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> |  |
| password | <code>String</code> |  |
| [cacheLocation] | <code>String</code> | File location (or localStorage key for browsers) to store the persistent token IN PLAIN TEXT |

<a name="resolveArray"></a>

## resolveArray(relationshipArray) ⇒ <code>Promise</code>
A shortcut for resolving all relationships in an array

**Kind**: global function  

| Param | Type |
| --- | --- |
| relationshipArray | [<code>Array.&lt;Relationship&gt;</code>](#Relationship) | 

*Documentation created with [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown)*

## Browser

Mangadex Full API works out of the box with [Browserify](https://browserify.org/) and does not require additional configuration.

```bash
browserify yourproject.js > bundle.js
```

As for [Webpack](https://webpack.js.org/) and similar applications, Mangadex Full API is untested and may require additional configuration.
However, the only node-specific module used by the program is ```HTTPS```, so if that is substituted by something like [https-browserify](https://www.npmjs.com/package/https-browserify), there should be no issues.
The ```fs``` and ```Path``` modules are also included in ```auth.js```, but are only required for node environments and can be excluded for browsers.
