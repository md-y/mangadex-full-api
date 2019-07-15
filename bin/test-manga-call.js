const api = require("../src/index");

const MANGA_ID = 47; // Test Manga (Default: https://mangadex.org/title/47)

var manga = new api.Manga(MANGA_ID);
manga.fill().then(()=>{
    console.log(`${manga.title} by ${manga.authors.join(", ")}`);
});