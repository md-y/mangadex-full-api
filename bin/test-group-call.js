const api = require("../src/index");

const GROUP_ID = 2233; // MangaDex Scans: 2233

var group = new api.Group(GROUP_ID);
group.fill().then(()=>{
    console.log(`${group.title} has uploaded ${group.uploads} chapters and has ${group.followers} followers and ${group.views} views.`);
}).catch(console.error);