const Util = require("../src/util");

/*
This script compares the local enum lists to those on MD's API and announces the differences.
*/

const checkFunctions = [
    // Tags/Genre
    async function() {
        let oldTags = require("../src/enum/genre");
        let newTags = await getData("https://api.mangadex.org/v2/tag", "Tags/Genre");

        let changed = false;
        for (let i of newTags) {
            if (i.id in oldTags && oldTags[i.id] === i.name) continue;
            changed = true;
            console.log(`[!] New Genre/Tag: ${i.name} (${i.id})`);
        }

        if (!changed) return "Up to Date Genres/Tags";
        else return "Outdated Genres/Tags";
    },
    // Categories/Follow Types
    async function() {
        let oldTypes = require("../src/enum/viewing-categories");
        let newTypes = await getData("https://api.mangadex.org/v2/follows", "Categories/Follow Types");

        let oldTypesIDs = Object.values(oldTypes);
        let changed = false;
        for (let i of newTypes) {
            if (oldTypesIDs.lastIndexOf(i.id) !== -1) continue;
            changed = true;
            console.log(`[!] New Category/Follow Type: ${i.name} (${i.id})`);
        }

        if (!changed) return "Up to Date Categories/Follow Types";
        else return "Outdated Categories/Follow Types";
    }
];

async function getData(url, context) {
    let res = await Util.getJSON(url); 
    if (!res || res.status !== "OK") return `Invalid Server Response for ${context}`;
    return Object.values(res.data);
}

async function check() {
    for (let func of checkFunctions) {
        let res = await func();
        console.log(res);
        console.log("--------");
    }
}

check().then(() => console.log("Done!")).catch(console.error);