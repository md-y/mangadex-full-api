module.exports = {};

// Pre-export
var Agent = require("./structure/agent");
var agentInstance = new Agent();
module.exports.agent = agentInstance;  // Create and use only one instance

// Export
module.exports = {
    Manga: require("./structure/manga"),
    Chapter: require("./structure/chapter"),
    Group: require("./structure/group"),
    User: require("./structure/user"),
    Thread: require("./structure/thread"),
    Post: require("./structure/post"),
    Home: require("./structure/home"),
    MDList: require("./structure/mdlist"),
    MDNet: require("./structure/mdnet"),
    
    Util: require("./util"),

    // Enums are organized to convert MD Ids to readable info
    // ie, keys are the Ids
    language: require("./enum/language"),
    genre: require("./enum/genre"),
    link: require("./enum/link"),
    settings: require("./enum/settings"),
    chapterType: require("./enum/chapter-type"),
    demographic: require("./enum/demographic"),
    pubStatus: require("./enum/pubstatus"),
    listingOrder: require("./enum/listing-order"),
    viewingCategories: require("./enum/viewing-categories"),

    // Re-add to maintain hints
    agent: agentInstance
};