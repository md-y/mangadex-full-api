const api = require("../src/index");

const [chapter, promise] = new api.Chapter(527948);
promise.then(()=>{
    console.log(`This chapter is in ${api.language[chapter.language]}`);
}).catch(console.error)