const raiderGroups = require("./allRaiderGroups.json");
const noblox = require("noblox.js");
const fs = require("fs");
const moment = require("moment");

let groupIDs = [];
for(let i in raiderGroups){
    groupIDs.push(raiderGroups[i].id)
}
console.log(groupIDs)
module.exports = async () =>{
    fs.readFile("./backgroundChecker/raiderGroupsHistory.json","utf-8",async (err,config)=>{
        if(err) {
            console.log(err);
            console.log("Failed to update the raider groups history.");
            return;
        }
        else {
            let obj = JSON.parse(config);
            let theAllMightyObject = {};
            for(let id of groupIDs)theAllMightyObject[id] = {};
            let date = moment().format("YYYY-MM-DD");

            let rolesArray = await Promise.all(groupIDs.map(id => noblox.getRoles(id)));
            let roleNames = {};
            let rolesIdsArray = [];

            for (let I = 0; I < groupIDs.length; I++) {
              
              const shit = [];
              const group = rolesArray[I];
              for(let role of group){
                
                theAllMightyObject[groupIDs[I]][role.id] = [];
                roleNames[role.id] = role.name;
                shit.push(role.id);
                
              }
              rolesIdsArray[I] = shit;
               
            }
            
            
            for(let grou in theAllMightyObject){
              for(let role in theAllMightyObject[grou]){
                let players = await noblox.getPlayers(grou ,role);
                for(let bruh of players)theAllMightyObject[grou][role].push(bruh.userId);
                
              }
              
            }
            
            
           
            for(let groupID in theAllMightyObject){
              let group = theAllMightyObject[groupID];
              for(let roleID in group){
                let role = group[roleID];
                for(let user of role){
                  let userDate = obj[user]
                  if(userDate){
                    
                    if(userDate.groups.includes(raiderGroups[groupID].name)){
                      let index = userDate.groups.indexOf(raiderGroups[groupID].name);

                      obj[user].groups[index] = raiderGroups[groupID].name;
                      obj[user].dates[index] = date;
                      obj[user].ranks[index] = roleNames[roleID];
                      console.log(index);
                    } else {
                      obj[user].groups.push(raiderGroups[groupID].name)
                      obj[user].dates.push(date);
                      obj[user].ranks.push(roleNames[roleID]);
                    }
                  }else {
                    obj[user] = {
                      username: await noblox.getUsernameFromId(user),
                      userId: user,
                      ranks: [
                        roleNames[roleID]
                      ],
                      groups: [
                        raiderGroups[groupID].name
                      ],
                      dates: [
                        date
                      ]
                    };
                  }
                }
              }
              
            }

           
            


            let stringObj = JSON.stringify(obj, null, 2);
            fs.writeFile("./backgroundChecker/raiderGroupsHistory.json",stringObj ,(err, config)=>{
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("done");
                }
            });
        }
    });
}
