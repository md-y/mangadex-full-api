const api = require("../src/index");

var user = new api.User();
user.fill(77571).then(()=>{
    console.log(`${user.username} has uploaded ${user.uploads} chapters and has ${user.views} views.`);
}).catch(console.error);