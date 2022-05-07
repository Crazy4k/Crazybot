const cache = require("./cache");
const fs = require("fs");

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
                let highRanks = comrade.roles.filter(a=>a >= 70);
                if(highRanks.length)goodFriends.push(`${friendsUserIdsAndNames[userId]}`)
                
            }
        }
        if(raiderFriends.length)notes.push("User has raider friends."); else notes.push("User has no raider friends."); 
        resolve({notes, raiderFriends, susFriends, goodFriends});

    });
    
    
}

module.exports = checkFriends;