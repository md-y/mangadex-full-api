const api = require("../src/index");

const threadID = 56429;

var thread = new api.Thread();
thread.fill(threadID, 2).then(()=>{
    console.log(`${thread.posts[0].author.username}'s original post: ${thread.posts[0].text}`);
}).catch(console.error);