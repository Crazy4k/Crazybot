const noblox = require("noblox.js");
let cache = require("./cache");


module.exports = async ( )=>{

    const MS2Badges = await noblox.getGameBadges(1602358074,100);
    const MS1Badges = await noblox.getGameBadges(1078767831,100);
    let badgesIds = [];
    cache.badges.MS1Length = 0;
    cache.badges.MS2Length = 0;
    for(let badge of MS2Badges){
        cache.badges.MS2[badge.id] = badge.name;
        badgesIds.push(badge.id);
        cache.badges.MS2Length++
    }
    for(let badge of MS1Badges){
        cache.badges.MS1[badge.id] = badge.name;
        badgesIds.push(badge.id);
        cache.badges.MS1Length++
    }
    cache.badges.Ids = badgesIds;
    
    

}