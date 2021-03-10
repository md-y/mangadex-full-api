module.exports = {};

// Pre-export
var Agent = require("./structure/agent");
var agentInstance = new Agent();
module.exports.agent = agentInstance;  // Create and use only one instance


// Use individual assignments to allow circular references
module.exports.Manga = require("./structure/manga");
module.exports.Chapter = require("./structure/chapter");
module.exports.Group = require("./structure/group");
module.exports.User = require("./structure/user");
module.exports.Thread = require("./structure/thread");
module.exports.Post = require("./structure/post");
module.exports.Home = require("./structure/home");
module.exports.MDList = require("./structure/mdlist");
module.exports.MDNet = require("./structure/mdnet");
    
module.exports.Util = require("./util");

// Enums are organized to convert MD Ids to readable info
// ie, keys are the Ids
module.exports.language = require("./enum/language");
module.exports.genre = require("./enum/genre");
module.exports.link = require("./enum/link");
module.exports.settings = require("./enum/settings");
module.exports.chapterType = require("./enum/chapter-type");
module.exports.demographic = require("./enum/demographic");
module.exports.pubStatus = require("./enum/pubstatus");
module.exports.listingOrder = require("./enum/listing-order");
module.exports.viewingCategories = require("./enum/viewing-categories");