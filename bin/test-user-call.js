const api = require("../src/index");

const username = "mdy";

var user = new api.User();
user.fillByQuery(username).then(()=>{
    console.log(`${user.username} has uploaded ${user.uploads} chapters and has ${user.views} views.`);
    console.log(user);
}).catch(console.error);