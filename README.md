# MangaDex Full API
An unofficial [MangaDex](https://www.mangadex.org) API built with the [official JSON API](https://api.mangadex.org/docs.html).

[![Version](https://img.shields.io/npm/v/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)
[![License](https://img.shields.io/github/license/md-y/mangadex-full-api.svg?style=flat)](https://github.com/md-y/mangadex-full-api/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/mangadex-full-api.svg?style=flat)](https://www.npmjs.com/package/mangadex-full-api)

```npm install mangadex-full-api```

# Examples

```javascript

API.login('username', 'password123', './bin/.md_cache').then(() => {
    API.Manga.search({
        title: 'villainess',
        status: [ 'ongoing', 'completed' ]
    }, 100).then(results => {
        console.log(`Search returned ${results.length} results:`);
        results.forEach((elem, i) => console.log(`[${i}] ${elem.title}`));
    }).catch(console.error);
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
<dt><a href="#Tag">Tag</a></dt>
<dd><p>Represents a manga tag</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#convertLegacyId">convertLegacyId(type, ids)</a> ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code></dt>
<dd><p>Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.
Any invalid legacy ids will be skipped by Mangadex when remapping, so
call this function for each individual id if this is an issue.</p>
</dd>
<dt><a href="#setGlobalLocale">setGlobalLocale(newLocale)</a></dt>
<dd><p>Sets the global locaization for LocalizedStrings.
Uses 2-letter Mangadex region codes.</p>
</dd>
<dt><a href="#login">login(username, password, [cacheLocation])</a> ⇒ <code>Promise</code></dt>
<dd><p>Required for authorization
<a href="https://api.mangadex.org/docs.html#operation/post-auth-login">https://api.mangadex.org/docs.html#operation/post-auth-login</a></p>
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
        * [.fill()](#Author+fill) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
    * _static_
        * [.search([searchParameters], [limit], [offset])](#Author.search) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
        * [.get(id)](#Author.get) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)

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
Relationships to manga this author/artist has been attributed to

**Kind**: instance property of [<code>Author</code>](#Author)  
<a name="Author+fill"></a>

### author.fill() ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
Retrieves all data for this author from the API using its id.Sets the data in place and returns a new author object as well.Use if there is an incomplete data due to this object simply being a reference.

**Kind**: instance method of [<code>Author</code>](#Author)  
<a name="Author.search"></a>

### Author.search([searchParameters], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Author&gt;&gt;</code>
Peforms a search and returns an array of a authors/artists.https://api.mangadex.org/docs.html#operation/get-author

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>AuthorParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the name |
| [limit] | <code>Number</code> | <code>10</code> | The maximum amount (100) of results to return. (Default: 10) |
| [offset] | <code>Number</code> | <code>0</code> | The amount of results to skip before recording them. (Default: 0) |

<a name="Author.get"></a>

### Author.get(id) ⇒ [<code>Promise.&lt;Author&gt;</code>](#Author)
Retrieves and returns a author by its id

**Kind**: static method of [<code>Author</code>](#Author)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="Chapter"></a>

## Chapter
Represents a chapter with readable pageshttps://api.mangadex.org/docs.html#tag/Chapter

**Kind**: global class  

* [Chapter](#Chapter)
    * [new Chapter(context)](#new_Chapter_new)
    * _instance_
        * [.id](#Chapter+id) : <code>String</code>
        * [.volume](#Chapter+volume) : <code>Number</code>
        * [.chapter](#Chapter+chapter) : <code>Number</code>
        * [.title](#Chapter+title) : <code>String</code>
        * [.translatedLanguage](#Chapter+translatedLanguage) : <code>String</code>
        * [.hash](#Chapter+hash) : <code>String</code>
        * [.createdAt](#Chapter+createdAt) : <code>Date</code>
        * [.updatedAt](#Chapter+updatedAt) : <code>Date</code>
        * [.publishAt](#Chapter+publishAt) : <code>Date</code>
        * [.pageNames](#Chapter+pageNames) : <code>String</code>
        * [.saverPageNames](#Chapter+saverPageNames) : <code>String</code>
        * [.groups](#Chapter+groups) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.manga](#Chapter+manga) : [<code>Relationship</code>](#Relationship)
        * [.uploader](#Chapter+uploader) : [<code>Relationship</code>](#Relationship)
        * [.fill()](#Chapter+fill) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
        * [.getReadablePages([saver])](#Chapter+getReadablePages) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * _static_
        * [.search([searchParameters], [limit], [offset])](#Chapter.search) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.get(id)](#Chapter.get) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)

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

### chapter.volume : <code>Number</code>
Number this chapter's volume

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+chapter"></a>

### chapter.chapter : <code>Number</code>
Number of this chapter

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

### chapter.pageNames : <code>String</code>
Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+saverPageNames"></a>

### chapter.saverPageNames : <code>String</code>
Dont Use. This is an array of partial URLs. Use 'getReadablePages()' to retrieve full urls.

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+groups"></a>

### chapter.groups : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to scanlation groups that are attributed to this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+manga"></a>

### chapter.manga : [<code>Relationship</code>](#Relationship)
Relationships to the manga this chapter belongs to

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+uploader"></a>

### chapter.uploader : [<code>Relationship</code>](#Relationship)
Relationships to the user who uploaded this chapter

**Kind**: instance property of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+fill"></a>

### chapter.fill() ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
Retrieves all data for this chapter from the API using its id.Sets the data in place and returns a new chapter object as well.Use if there is an incomplete in this object

**Kind**: instance method of [<code>Chapter</code>](#Chapter)  
<a name="Chapter+getReadablePages"></a>

### chapter.getReadablePages([saver]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Retrieves URLs for actual images from Mangadex @ Home.This only gives URLs, so it does not report the status of the server to Mangadex @ Home.Therefore applications that download image data pleaese report failures as stated here:https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report

**Kind**: instance method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [saver] | <code>Boolean</code> | <code>false</code> | Use data saver images? |

<a name="Chapter.search"></a>

### Chapter.search([searchParameters], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Peforms a search and returns an array of manga.https://api.mangadex.org/docs.html#operation/get-chapter

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>ChapterParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the title |
| [limit] | <code>Number</code> | <code>10</code> | The maximum amount (100) of results to return. (Default: 10) |
| [offset] | <code>Number</code> | <code>0</code> | The amount of results to skip before recording them. (Default: 0) |

<a name="Chapter.get"></a>

### Chapter.get(id) ⇒ [<code>Promise.&lt;Chapter&gt;</code>](#Chapter)
Retrieves and returns a chapter by its id

**Kind**: static method of [<code>Chapter</code>](#Chapter)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="Cover"></a>

## Cover
Represents the cover art of a manga volumehttps://api.mangadex.org/docs.html#tag/Cover

**Kind**: global class  

* [Cover](#Cover)
    * [new Cover(context)](#new_Cover_new)
    * _instance_
        * [.id](#Cover+id) : <code>String</code>
        * [.volume](#Cover+volume) : <code>Number</code>
        * [.description](#Cover+description) : <code>String</code>
        * [.createdAt](#Cover+createdAt) : <code>Date</code>
        * [.updatedAt](#Cover+updatedAt) : <code>Date</code>
        * [.manga](#Cover+manga) : [<code>Relationship</code>](#Relationship)
        * [.uploader](#Cover+uploader) : [<code>Relationship</code>](#Relationship)
        * [.imageSource](#Cover+imageSource) : <code>String</code>
        * [.image512](#Cover+image512) : <code>String</code>
        * [.image256](#Cover+image256) : <code>String</code>
        * [.fill()](#Cover+fill) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
    * _static_
        * [.get(id)](#Cover.get) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
        * [.search([searchParameters], [limit], [offset])](#Cover.search) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getMangaCovers(manga)](#Cover.getMangaCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>

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

### cover.volume : <code>Number</code>
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
<a name="Cover+fill"></a>

### cover.fill() ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
Retrieves all data for this cover from the API using its id.Sets the data in place and returns a new cover object as well.Use if there is an incomplete in this object

**Kind**: instance method of [<code>Cover</code>](#Cover)  
<a name="Cover.get"></a>

### Cover.get(id) ⇒ [<code>Promise.&lt;Cover&gt;</code>](#Cover)
Retrieves and returns a cover by its id

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="Cover.search"></a>

### Cover.search([searchParameters], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Peforms a search and returns an array of manga.https://api.mangadex.org/docs.html#operation/get-chapter

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>CoverParameterObject</code> |  |  |
| [limit] | <code>Number</code> | <code>10</code> | The maximum amount (100) of results to return. (Default: 10) |
| [offset] | <code>Number</code> | <code>0</code> | The amount of results to skip before recording them. (Default: 0) |

**Properties**

| Name | Type |
| --- | --- |
| CoverParameterObject.order | <code>Object</code> | 

<a name="Cover.getMangaCovers"></a>

### Cover.getMangaCovers(manga) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Get an array of a manga's covers

**Kind**: static method of [<code>Cover</code>](#Cover)  

| Param | Type |
| --- | --- |
| manga | <code>String</code> | 

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
        * [.chapters](#Group+chapters) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.leaderName](#Group+leaderName) : [<code>User</code>](#User)
        * [.leader](#Group+leader) : [<code>Relationship</code>](#Relationship)
        * [.memberNames](#Group+memberNames) : [<code>Array.&lt;User&gt;</code>](#User)
        * [.members](#Group+members) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.fill()](#Group+fill) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
    * _static_
        * [.search([searchParameters], [limit], [offset])](#Group.search) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
        * [.get(id)](#Group.get) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)

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
<a name="Group+chapters"></a>

### group.chapters : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to chapters attributed to this group

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+leaderName"></a>

### group.leaderName : [<code>User</code>](#User)
Username of the group's leader. Resolve the leader relationship to retrieve other data

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+leader"></a>

### group.leader : [<code>Relationship</code>](#Relationship)
Relationship to this group's leader

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+memberNames"></a>

### group.memberNames : [<code>Array.&lt;User&gt;</code>](#User)
Username of the group's member. Resolve the members' relationships to retrieve other data

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+members"></a>

### group.members : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to each group's members

**Kind**: instance property of [<code>Group</code>](#Group)  
<a name="Group+fill"></a>

### group.fill() ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
Retrieves all data for this group from the API using its id.Sets the data in place and returns a new group object as well.Use if there is an incomplete data due to this object simply being a reference.

**Kind**: instance method of [<code>Group</code>](#Group)  
<a name="Group.search"></a>

### Group.search([searchParameters], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Group&gt;&gt;</code>
Peforms a search and returns an array of a group.https://api.mangadex.org/docs.html#operation/get-search-group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>GroupParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the name |
| [limit] | <code>Number</code> | <code>10</code> | The maximum amount (100) of results to return. (Default: 10) |
| [offset] | <code>Number</code> | <code>0</code> | The amount of results to skip before recording them. (Default: 0) |

<a name="Group.get"></a>

### Group.get(id) ⇒ [<code>Promise.&lt;Group&gt;</code>](#Group)
Retrieves and returns a group by its id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

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
        * [.ownerName](#List+ownerName) : <code>String</code>
        * [.public](#List+public) : <code>Boolean</code>
        * [.getFeed([limit], [offset])](#List+getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.delete()](#List+delete) ⇒ <code>Promise</code>
        * [.rename(newName)](#List+rename) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.changeVisibility([newVis])](#List+changeVisibility) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.updateMangaList(newList)](#List+updateMangaList) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.addManga(manga)](#List+addManga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.removeManga(manga)](#List+removeManga) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.fill()](#List+fill) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
    * _static_
        * [.get(id)](#List.get) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.create(name, manga, [public])](#List.create) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
        * [.delete(id)](#List.delete) ⇒ <code>Promise</code>
        * [.addManga(listId, manga)](#List.addManga) ⇒ <code>Promise</code>
        * [.removeManga(listId, manga)](#List.removeManga) ⇒ <code>Promise</code>
        * [.getFeed(id, [limit], [offset])](#List.getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>

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
Relationship to this list's owner

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+ownerName"></a>

### list.ownerName : <code>String</code>
Name of this list's owner. Resolve this owner relationship object for other user info

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+public"></a>

### list.public : <code>Boolean</code>
Is this list public?

**Kind**: instance property of [<code>List</code>](#List)  
<a name="List+getFeed"></a>

### list.getFeed([limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a list of the most recent chapters from the manga in a list

**Kind**: instance method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [limit] | <code>Number</code> | <code>100</code> | Amount of chapters to return (Max 500) |
| [offset] | <code>Number</code> | <code>0</code> | How many chapters to skip before returning |

<a name="List+delete"></a>

### list.delete() ⇒ <code>Promise</code>
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

<a name="List+fill"></a>

### list.fill() ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Retrieves all data for this list from the API using its id.Sets the data in place and returns a new list object as well.Use if there is an incomplete in this object

**Kind**: instance method of [<code>List</code>](#List)  
<a name="List.get"></a>

### List.get(id) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Retrieves and returns a list by its id

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="List.create"></a>

### List.create(name, manga, [public]) ⇒ [<code>Promise.&lt;List&gt;</code>](#List)
Create a new custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> |  |
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> |  |
| [public] | <code>Boolean</code> | Public visibility? |

<a name="List.delete"></a>

### List.delete(id) ⇒ <code>Promise</code>
Deletes a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="List.addManga"></a>

### List.addManga(listId, manga) ⇒ <code>Promise</code>
Adds a manga to a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| listId | <code>String</code> | 
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List.removeManga"></a>

### List.removeManga(listId, manga) ⇒ <code>Promise</code>
Removes a manga from a custom list. Must be logged in

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type |
| --- | --- |
| listId | <code>String</code> | 
| manga | [<code>Manga</code>](#Manga) \| <code>String</code> | 

<a name="List.getFeed"></a>

### List.getFeed(id, [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a list of the most recent chapters from the manga in a list

**Kind**: static method of [<code>List</code>](#List)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | Mangadex id of the list |
| [limit] | <code>Number</code> | <code>100</code> | Amount of chapters to return (Max 500) |
| [offset] | <code>Number</code> | <code>0</code> | How many chapters to skip before returning |

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
        * [.lastVolume](#Manga+lastVolume) : <code>Number</code>
        * [.lastChapter](#Manga+lastChapter) : <code>String</code>
        * [.publicationDemographic](#Manga+publicationDemographic) : <code>&#x27;shounen&#x27;</code> \| <code>&#x27;shoujo&#x27;</code> \| <code>&#x27;josei&#x27;</code> \| <code>&#x27;seinen&#x27;</code>
        * [.status](#Manga+status) : <code>&#x27;ongoing&#x27;</code> \| <code>&#x27;completed&#x27;</code> \| <code>&#x27;hiatus&#x27;</code> \| <code>&#x27;abandoned&#x27;</code>
        * [.year](#Manga+year) : <code>Number</code>
        * [.contentRating](#Manga+contentRating) : <code>&#x27;safe&#x27;</code> \| <code>&#x27;suggestive&#x27;</code> \| <code>&#x27;erotica&#x27;</code> \| <code>&#x27;pornographic&#x27;</code>
        * [.createdAt](#Manga+createdAt) : <code>Date</code>
        * [.updatedAt](#Manga+updatedAt) : <code>Date</code>
        * [.authors](#Manga+authors) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.artists](#Manga+artists) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.chapters](#Manga+chapters) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.mainCover](#Manga+mainCover) : [<code>Relationship</code>](#Relationship)
        * [.tags](#Manga+tags) : [<code>Array.&lt;Tag&gt;</code>](#Tag)
        * [.title](#Manga+title) : <code>String</code>
        * [.altTitles](#Manga+altTitles) : <code>Array.&lt;String&gt;</code>
        * [.description](#Manga+description) : <code>String</code>
        * [.getCovers()](#Manga+getCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
        * [.fill()](#Manga+fill) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getFeed([params], [limit], [offset])](#Manga+getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.addToList(list)](#Manga+addToList) ⇒ <code>Promise</code>
    * _static_
        * [.search([searchParameters], [limit], [offset])](#Manga.search) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
        * [.get(id)](#Manga.get) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getFeed(id, [params], [limit], [offset])](#Manga.getFeed) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
        * [.getRandom()](#Manga.getRandom) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
        * [.getFollowedManga()](#Manga.getFollowedManga) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
        * [.getCovers(id)](#Manga.getCovers) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>

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

### manga.lastVolume : <code>Number</code>
Number this manga's last volume

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+lastChapter"></a>

### manga.lastChapter : <code>String</code>
Name of this manga's last chapter

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+publicationDemographic"></a>

### manga.publicationDemographic : <code>&#x27;shounen&#x27;</code> \| <code>&#x27;shoujo&#x27;</code> \| <code>&#x27;josei&#x27;</code> \| <code>&#x27;seinen&#x27;</code>
Publication demographic of this mangahttps://api.mangadex.org/docs.html#section/Static-data/Manga-publication-demographic

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+status"></a>

### manga.status : <code>&#x27;ongoing&#x27;</code> \| <code>&#x27;completed&#x27;</code> \| <code>&#x27;hiatus&#x27;</code> \| <code>&#x27;abandoned&#x27;</code>
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
Relationships to authors attributed to this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+artists"></a>

### manga.artists : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to artists attributed to this manga

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+chapters"></a>

### manga.chapters : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to this manga's chapters

**Kind**: instance property of [<code>Manga</code>](#Manga)  
<a name="Manga+mainCover"></a>

### manga.mainCover : [<code>Relationship</code>](#Relationship)
Relationships to this manga's main cover. Use 'getCovers' to retrive other covers

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
<a name="Manga+getCovers"></a>

### manga.getCovers() ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Returns all covers for this manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  
<a name="Manga+fill"></a>

### manga.fill() ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Retrieves all data for this manga from the API using its id.Sets the data in place and returns a new manga object as well.Use if there is an incomplete in this object

**Kind**: instance method of [<code>Manga</code>](#Manga)  
<a name="Manga+getFeed"></a>

### manga.getFeed([params], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
Returns a feed of the most recent chapters of this manga

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type | Default |
| --- | --- | --- |
| [params] | <code>FeedParameterObject</code> |  | 
| [limit] | <code>Number</code> | <code>100</code> | 
| [offset] | <code>Number</code> | <code>0</code> | 

<a name="Manga+addToList"></a>

### manga.addToList(list) ⇒ <code>Promise</code>
Adds this manga to a list

**Kind**: instance method of [<code>Manga</code>](#Manga)  

| Param | Type |
| --- | --- |
| list | [<code>List</code>](#List) \| <code>String</code> | 

<a name="Manga.search"></a>

### Manga.search([searchParameters], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
Peforms a search and returns an array of manga.https://api.mangadex.org/docs.html#operation/get-search-manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [searchParameters] | <code>MangaParameterObject</code> \| <code>String</code> |  | An object of offical search parameters, or a string representing the title |
| [limit] | <code>Number</code> | <code>10</code> | The maximum amount (100) of results to return. (Default: 10) |
| [offset] | <code>Number</code> | <code>0</code> | The amount of results to skip before recording them. (Default: 0) |

<a name="Manga.get"></a>

### Manga.get(id) ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Retrieves and returns a manga by its id

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

<a name="Manga.getFeed"></a>

### Manga.getFeed(id, [params], [limit], [offset]) ⇒ <code>Promise.&lt;Array.&lt;Chapter&gt;&gt;</code>
**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>String</code> |  | 
| [params] | <code>FeedParameterObject</code> |  | 
| [limit] | <code>Number</code> | <code>100</code> | 
| [offset] | <code>Number</code> | <code>0</code> | 

<a name="Manga.getRandom"></a>

### Manga.getRandom() ⇒ [<code>Promise.&lt;Manga&gt;</code>](#Manga)
Returns one random manga

**Kind**: static method of [<code>Manga</code>](#Manga)  
<a name="Manga.getFollowedManga"></a>

### Manga.getFollowedManga() ⇒ <code>Promise.&lt;Array.&lt;Manga&gt;&gt;</code>
Returns all manga followed by the logged in user

**Kind**: static method of [<code>Manga</code>](#Manga)  
<a name="Manga.getCovers"></a>

### Manga.getCovers(id) ⇒ <code>Promise.&lt;Array.&lt;Cover&gt;&gt;</code>
Returns all covers for a manga

**Kind**: static method of [<code>Manga</code>](#Manga)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Manga id |

<a name="User"></a>

## User
Represents an userhttps://api.mangadex.org/docs.html#tag/User

**Kind**: global class  

* [User](#User)
    * [new User(context)](#new_User_new)
    * _instance_
        * [.id](#User+id) : <code>String</code>
        * [.username](#User+username) : <code>String</code>
        * [.chapters](#User+chapters) : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
        * [.fill()](#User+fill) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
    * _static_
        * [.get(id)](#User.get) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)

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
<a name="User+chapters"></a>

### user.chapters : [<code>Array.&lt;Relationship&gt;</code>](#Relationship)
Relationships to chapters attributed to this user

**Kind**: instance property of [<code>User</code>](#User)  
<a name="User+fill"></a>

### user.fill() ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Retrieves all data for this user from the API using its id.Sets the data in place and returns a new user object as well.Use if there is an incomplete data due to this object simply being a reference.

**Kind**: instance method of [<code>User</code>](#User)  
<a name="User.get"></a>

### User.get(id) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Retrieves and returns a user by its id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Mangadex id |

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
    * [.resolve()](#Relationship+resolve) ⇒ <code>Promise.&lt;(Manga\|Author\|Chapter\|User\|Group\|List\|Cover)&gt;</code>

<a name="Relationship+id"></a>

### relationship.id : <code>String</code>
Id of the object this is a relationship to

**Kind**: instance property of [<code>Relationship</code>](#Relationship)  
<a name="Relationship+type"></a>

### relationship.type : <code>String</code>
The type of the object this is a relationship to

**Kind**: instance property of [<code>Relationship</code>](#Relationship)  
<a name="Relationship+resolve"></a>

### relationship.resolve() ⇒ <code>Promise.&lt;(Manga\|Author\|Chapter\|User\|Group\|List\|Cover)&gt;</code>
This function must be called to return the proper and complete object representation of this relationship.Essentially, it calls and returns Manga.get(), Author.get(), Cover.get(), etc.

**Kind**: instance method of [<code>Relationship</code>](#Relationship)  
<a name="Tag"></a>

## Tag
Represents a manga tag

**Kind**: global class  

* [Tag](#Tag)
    * [.id](#Tag+id) : <code>String</code>
    * [.localizedName](#Tag+localizedName) : [<code>LocalizedString</code>](#LocalizedString)
    * [.localizedDescription](#Tag+localizedDescription) : [<code>LocalizedString</code>](#LocalizedString)
    * [.group](#Tag+group) : <code>String</code>
    * [.name](#Tag+name) : <code>String</code>
    * [.description](#Tag+description) : <code>String</code>

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
<a name="convertLegacyId"></a>

## convertLegacyId(type, ids) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Converts old (pre v5, numeric ids) Mangadex ids to v5 ids.Any invalid legacy ids will be skipped by Mangadex when remapping, socall this function for each individual id if this is an issue.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;group&#x27;</code> \| <code>&#x27;manga&#x27;</code> \| <code>&#x27;chapter&#x27;</code> \| <code>&#x27;tag&#x27;</code> | Type of id |
| ids | <code>Array.&lt;Number&gt;</code> | Array of ids to convert |

<a name="setGlobalLocale"></a>

## setGlobalLocale(newLocale)
Sets the global locaization for LocalizedStrings.Uses 2-letter Mangadex region codes.

**Kind**: global function  

| Param | Type |
| --- | --- |
| newLocale | <code>String</code> | 

<a name="login"></a>

## login(username, password, [cacheLocation]) ⇒ <code>Promise</code>
Required for authorizationhttps://api.mangadex.org/docs.html#operation/post-auth-login

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>String</code> |  |
| password | <code>String</code> |  |
| [cacheLocation] | <code>String</code> | File location to store the persistent token (Warning: saved in plaintext) |

*Documentation created with [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown)*