# MangaDex Full API
An unofficial MangaDex API built with the JSON API and web parsing.
No other NPM dependencies.

# Documentation

## Manga
|Method|Arguments|Return Type|Information|Web, JSON, Both, or Neither?
|-|-|-|-|-
|search()|```Query (String)```|```Array<String>```| (Static) Calls a MangaDex quicksearch and returns an array of manga IDs.|Both
|fill()|```Manga ID (Number)```|```Promise```| Fills an instance of Manga with information from the JSON API and web parsing.<br>Promise returns Manga object.|Both
|fillByQuery()|```Query (String)```|```Promise```| Executes ```search()``` then ```fill()``` with the most relevant manga.<br>Promise returns Manga object.|Both
|getFullURL()|```Property (String)```|```String```| Returns full URL for partial stored url (i.e. ```"id"``` returns ```"https://www.mangadex.org/title/(id)"```)|Neither

|Property|Type|Information
|-|-|-
|id|```Number```| This manga's MangaDex ID
|title|```String```| Manga's main title
|authors|```Array<String>```| All authors for this manga
|artists|```Array<String>```| All artists for this manga
|genres|```Array<Number>```| Array of the manga's genres' IDs.
|genreNames|```Array<String>```| Array of genre names in the same order as their IDs: ```.genres```
|cover|```String```| Partial main cover URL. See ```getFullURL('cover')```
|language|```String```| Original language code (e.g. JP, EN, DE). See ```language.js```
|hentai|```Boolean```| Hentai or not?
|description|```String```| HTML Formated description string
|links|```Array<String>```| Array of full URLs to additional links (e.g. MangaUpdates, MAL, BookWalker). See ```links.js```
|chapters|```Array<Chapter>```| Array of all chapters for this manga. Contains only minimal information like ID and title; use ```Chapter.fill()``` 

```javascript
// Example: bin/test-manga-call.js
var [manga, promise] = new Manga(mangaID);
promise.then(()=>{
    console.log(`${manga.title} by ${manga.authors.join(", ")}`);
});
```

## Chapter
|Method|Arguments|Return Type|Information|Web, JSON, Both, or Neither?
|-|-|-|-|-
|fill()|```Manga ID (Number)```|```Promise```| Fills an instance of Chapter with information from the JSON API and web parsing.<br>Promise returns Chapter object.|JSON
|getFullURL()|```Property (String)```|```String```| Returns full URL for partial stored url (i.e. ```"id"``` returns ```"https://www.mangadex.org/chapter/(id)"```)|Neither

|Property|Type|Information
|-|-|-
|id|```Number```| This chapter's MangaDex ID
|timestamp|```Number```| Unix timestamp of chapter upload
|volume|```Number```| The volume this chapter is from
|chapter|```Number```| The chapter's number
|title|```String```| The chapter's title
|language|```String```| The language code for this chapter's translated language. See ```language.js```
|parentMangaID|```Number```| The ID of the manga this chapter is from
|groups|```Array<Number>```| The IDs of the groups that translated this chapter
|commentCount|```Number```| Number of comments on this chapter
|longstrip|```Boolean```| Longstrip (e.g. WebToon style) or not?
|pages|```Array<String>```| Array of each page image's URL


```javascript
// Example: bin/test-manga-web.js
const mangaQuery = "Testing";
var manga = new Manga();
manga.fillByQuery(mangaQuery).then(()=>{
    console.log(`Query "${mangaQuery}" found ${manga.title} by ${manga.authors.join(", ")} which has a rating of ${manga.rating} and ${manga.views} views.`);
}).catch(console.error);
```