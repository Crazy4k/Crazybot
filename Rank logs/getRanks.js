const tsuGroups = require("../config/TSUGroups.json")
const noblox = require("noblox.js");
const cache = require("./cache");


module.exports = async () => {

    let branches = {};
    let divisions = {};
    let roles = {};

    for(let i in tsuGroups){

        if(tsuGroups[i].isBranch){
            branches[i] = tsuGroups[i].highRanks[0];
        } else if(tsuGroups[i].isDivision){
            divisions[i] = tsuGroups[i].id;
        }

    }
    
    for(let i in branches){

        const branch = await noblox.getRoles(parseInt(i)).catch(e=>undefined);

        let HRs = [];
        let isAboveFirstHighRank = false;

        for(let rank of branch){
            
            
            if(rank.id === parseInt(branches[i]))isAboveFirstHighRank = true;
            if(isAboveFirstHighRank){
                roles[rank.id] = {
                    name : rank.name,
                    hierarchy : rank.rank
                }
                HRs.push(rank.id);
            }
        }

        branches[i] = HRs

    }
 
    for(let i in divisions){

        

        const groupId = divisions[i];

        const division = await noblox.getRoles(groupId).catch(e=>undefined);
        let rankIds = [];

        for(let rank of division){
            roles[rank.id] = {
                name : rank.name,
                hierarchy : rank.rank
            }

            rankIds.push(rank.id);
        }
        
        divisions[i] = rankIds;

    }

    const finalObject = {};

    for(let groupId in branches){
        
        finalObject[groupId] = branches[groupId];
    }
    for(let groupId in divisions){
        
        finalObject[groupId] = divisions[groupId];
    }


   
    cache.ranks = finalObject;
    cache.roles = roles
    cache.roles[null] = {
        name: "Untracked",
        hierarchy: 0
    }
    
    console.log("Fetched TSU groups")
}