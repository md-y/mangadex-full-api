module.exports = {
    Manga: require("./structure/manga"),
    Chapter: require("./structure/chapter"),
    Group: require("./structure/group"),
    User: require("./structure/user"),
    Thread: require("./structure/thread"),
    Post: require("./structure/post"),
    
    Util: require("./util"),

    language: require("./enum/language"),
    genre: require("./enum/genre"),
    link: require("./enum/link")
}