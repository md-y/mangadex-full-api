const api = require("../src/index");

let failedTests = 0;
let passedTests = 0;

function suc(report) {
    if (arguments.length > 1) report = Array.from(arguments).join(" ");
    console.log("(Success)", report);
    passedTests += 1;
}

function err(report) {
    if (arguments.length > 1) report = Array.from(arguments).join(" ");
    console.error("(ERROR)", report);
    failedTests += 1;
}

async function coreTest() {
    console.log("Beginning Core test...");

    let testManga = new api.Manga(47);
    await testManga.fill();
    // URL is from API, rating is from Webparsing.
    if (!testManga.id || !testManga.url || !testManga.rating) err("Failed to fill Test Manga. ID: 47");
    else suc("Filled Test Manga:", testManga.url);

    /**
     * This initial test chapter from Boochi Mangadex Tutorial may be deleted, so it will try
     * and get one from test Manga #47 if the test passed.
    */
    let chapterID = 449568;
    if (testManga.chapters.length > 0) chapterID = testManga.chapters[0].id;
    let testChapter = new api.Chapter(chapterID);
    await testChapter.fill();
    // All API
    if (!testChapter.id || !testChapter.pages || !testChapter.url) err("Failed to fill chapter. ID", chapterID);
    else suc("Filled chapter", chapterID, "AKA:", testChapter.url);

    console.log("Core test completed.");
}

async function extraTest() {
    console.log("Beginning Extra test...");

    let home = await new api.Home(true);
    let topManga = home.topRating[0];
    // It is HIGHLY unlikely the topmost manga will be below a rating of 9
    if (topManga.rating < 9) err("Highest rated manga is most likely invalid:", topManga.title);
    else suc("Home: Top rated manga is", topManga.title);

    console.log("Extra test completed.");
}

async function agentTest(username, password) {
    console.log("Beginning Agent test...");

    await api.agent.login(username, password);
    if (!api.agent.sessionId) {
        err("CRITICAL FAILURE: Agent could not login.");
    } else {
        suc("Logged in. Token:", api.agent.sessionId);
    }

    let quickSearch = await api.Manga.search("Isekai");
    if (!quickSearch || quickSearch.length == 0) err("Failed to perform quicksearch.");
    else suc("Quicksearch: 'Isekai' returned a total of", quickSearch.length);

    let fullSearch = await api.Manga.fullSearch({
        includeTags: ["Isekai", 23],
        language: "JP"
    });
    if (!fullSearch || fullSearch.length == 0) err("Failed to perform a full search.");
    else suc("Fullsearch: 'JP, Isekai, & Romance' returned a total of", fullSearch.length);

    console.log("Agent test completed.");
}

async function beginTesting() {
    // CORE FUNCTIONS TEST
    await coreTest()
    .catch(err => console.log("Error while testing:", err));

    // EXTRA FUNCTIONS TEST
    await extraTest()
    .catch(err => console.log("Error while testing:", err));

    // AGENT TEST
    // If username and password args are present
    if (process.argv.length >= 4) {
        await agentTest(...process.argv.slice(2, 4))
        .catch(err => console.log("Error while testing:", err));
    } else {
        console.log("[!] WARN: Skipping Agent testing. (No username or password in args)");
    }
}

beginTesting().finally(() => {
    console.log(`${failedTests} tests failed.`);
    console.log(`${passedTests} tests passed.`);
    console.log(`${passedTests/(passedTests+failedTests)*100}% testing success.`);
});