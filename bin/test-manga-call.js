const api = require("../src/index");

const mangaID = 47; // Test Manga (Default: https://mangadex.org/title/47)

var [manga, promise] = new api.Manga(mangaID);
promise.then(()=>{
    console.log(`${manga.title} by ${manga.authors.join(", ")} has a rating of ${manga.rating} and ${manga.views} views.`);
}).catch(console.error);