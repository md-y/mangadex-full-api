const api = require("../src/index");

const THREAD_ID = 56429;

(async function() {
    var thread = await new api.Thread(THREAD_ID, true, 2);
    console.log(`${thread.posts[0].author.username}'s original post: ${thread.posts[0].text}`);
})();