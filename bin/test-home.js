const api = require("../src/index");

let home = new api.Home();
home.fill().then(()=>{
    console.log(`${home.topRating[0].title} is the highest rated manga on MangaDex.`);
}).catch(console.error);