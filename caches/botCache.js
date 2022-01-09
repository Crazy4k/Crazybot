var { Timer } = require("easytimer.js");
let timer = new Timer();
timer.start();



let caches = {
    isReady: false,
    timeOutCache: {},
    commandCoolDownCache : {},
    eventsCache : {},
    fetchesCache : {totalFetches: 0},
    guildsCache : {},
    pointsCache : {},
    trackedRaiders: [],
    trackedMassRaids : {},
    raiderCache : {},
    raiderTrackerChannelCache : {raiders: null, raids : null},
    tempCmds : {},
    timerCache : [timer.getTimeValues(), timer.getTotalTimeValues()],
    executes : {slash: {}, legacy: {}},

}

module.exports = caches


/*The cache's job is to store data from the data base. 
Each time the requests data from the DB the cache updates so whenever the data is called again, the bot can find in the cache instead of pinging the DB every time.
The cache resets every time the bot restarts */