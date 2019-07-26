module.exports = {}

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
    
    Util: require("./util"),

    language: require("./enum/language"),
    genre: require("./enum/genre"),
    link: require("./enum/link"),
    settings: require("./enum/settings"),
    chapterType: require("./enum/chapter-type"),

    // Re-add to maintain hints
    agent: agentInstance
}