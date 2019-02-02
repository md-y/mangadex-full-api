const api = require("../src/index");

const mangaQuery = "Testing";

var manga = new api.Manga();
manga.fillByQuery(mangaQuery).then(()=>{
    console.log(`Query "${mangaQuery}" found ${manga.title} by ${manga.authors.join(", ")} which has a rating of ${manga.rating} and ${manga.views} views.`);
}).catch(console.error);