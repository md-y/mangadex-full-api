const api = require("../src/index");

(async function() {
    const chapter = await new api.Chapter(527948, true);
    console.log(`This chapter is in ${api.language[chapter.language]}`);
})();