var { Timer } = require("easytimer.js");
let timer = new Timer();
timer.start();



let caches = {
    commandCoolDownCache : {},
    eventsCache : {},
    fetchesCache : {totalFetches: 0},
    guildsCache : {},
    muteCache : {},
    officerPointsCache : {},
    pointsCache : {},
    raiderCache : {},
    raiderTrackerChannelCache : {},
    tempCmds : undefined,
    timerCache : [timer.getTimeValues(), timer.getTotalTimeValues()],
    warnCache : {}
}

module.exports = caches


/*The cache's job is to store data from the data base. 
Each time the requests data from the DB the cache updates so whenever the data is called again, the bot can find in the cache instead of pinging the DB every time.
The cache resets every time the bot restarts */