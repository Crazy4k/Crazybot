const cache = require("./cache");
const fs = require("fs");
const TSUGroups = require("../config/TSUGroups.json");



let TSUGroupNamesToIds = {};
for (let i in TSUGroups){
    if(!TSUGroups[i].isRaider)TSUGroupNamesToIds[TSUGroups[i].name] = i;
    
}


/**
 * loops through the provided friends response and returns data containing whether there are raiders amongst these friends
 * @param {object} friends noblox.getFriends() response passed in  
 * @returns {object} with 2 properties: notes, which is an array of strings and raiderFriends which is an array of strings formatted like this: `${username} (user id)`
 */
async function checkFriends(friends){
    return new Promise(async(resolve, reject) => {

         
        let raiders = JSON.parse(fs.readFileSync("./Private_JSON_files/raiderGroupsHistory.json","utf-8"));
        let comrades = JSON.parse(fs.readFileSync("./Private_JSON_files/TSU_careers.json","utf-8"));
        

        let friendsUserIdsAndNames = {};
        let friendsUserIds = [];

        let notes = [];
        let raiderFriends = [];
        let susFriends = []
        let goodFriends = [];
        
        for(let friend of friends.data){
            
            friendsUserIdsAndNames[friend.id] = friend.name;
            friendsUserIds.push(friend.id);
             
        }

        for(let userId of friendsUserIds){
            if(cache.raiderMembers.includes(userId)){
                raiderFriends.push(`${friendsUserIdsAndNames[userId]}`);
            } else if(raiders[userId])susFriends.push(`${friendsUserIdsAndNames[userId]}`);
            const comrade = comrades[userId];
            if(comrade){
                for(let groupName of comrade.groups){
                    
                    if(!TSUGroups?.[TSUGroupNamesToIds?.[groupName]]?.ImportantRole) continue;
                    
                    if(comrade.roles[comrade.groups.indexOf(groupName)] >= TSUGroups[TSUGroupNamesToIds[groupName]].ImportantRole)goodFriends.push(`${friendsUserIdsAndNames[userId]}`)
                }
                
                
            }
        }
        goodFriends = [...new Set(goodFriends)];
        if(raiderFriends.length)notes.push("User has raider friends."); else notes.push("User has no raider friends."); 
        resolve({notes, raiderFriends, susFriends, goodFriends});

    });
    
    
}

module.exports = checkFriends;