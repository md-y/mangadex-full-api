const api = require("../src/index");

const groupID = 2233; // MangaDex Scans: 2233

var [group, promise] = new api.Group(groupID);
promise.then(()=>{
    console.log(`${group.title} has uploaded ${group.uploads} chapters and has ${group.followers} followers and ${group.views} views.`);
}).catch(console.error);