const Command = require("../../Classes/Command");
const rover = require("rover-api");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const checkUser = require("../../functions/checkUser");
const noblox = require("noblox.js");
const TSUgroups = require("../../config/TSUGroups.json");
let gamepasses = require("../../raiderTracker/gamepasses.json");
const getRaiderPower = require("../../raiderTracker/calculategamepasses")
const raiderGroups = require("../../raiderTracker/raiderGroups.json");

let gamepassIdsMS1 = [];
for (const i in gamepasses["MS1"]) gamepassIdsMS1.push(gamepasses["MS1"][i].id);
let gamepassIdsMS2 = [];
for (const i in gamepasses["MS2"]) gamepassIdsMS2.push(gamepasses["MS2"][i].id);


let jointRaiderGroups = [];
let jointBranchGroupIds = [];
let jointDivGroupIds = [];
let jointOfficers = [];
let jointDivOfficers = [];
let jointHicom = [];
let jointDivHicom = [];
let jointStaff = [];

for(let group of raiderGroups){
    TSUgroups[group.id] = group;
    TSUgroups[group.id].isRaider = true;
}


for(let index in TSUgroups){
    let group = TSUgroups[index]
    if(group.isBranch){
        jointBranchGroupIds.push(group.id);
        jointOfficers.push(...group.highRanks);
        jointHicom.push(...group.HICOMRanks);
        jointStaff.push(...group.managementAndStaff);
    }else if(group.isDivision){
        jointDivGroupIds.push(group.id);
        jointDivOfficers.push(...group.highRanks);
        jointDivHicom.push(...group.HICOMRanks);
        jointStaff.push(...group.managementAndStaff);
    }  else{
        if(group.isRaider){
            jointRaiderGroups.push(group.id);
        }
    }
}



let check = new Command("check");
check.set({
    aliases         : [],
    description     : "Shows the user's TSU profile and status",
    usage           : "check <roblox username or ID>",
    cooldown        : 7,
    unique          : true,
    category        : "roblox",
    worksInDMs      : true,
    isDevOnly       : false,
    isSlashCommand  : false,
    
});

check.execute = async (message, args, server) =>{

    let roblox = args[0]
    let username = checkUser(message, args, 0);
    let res;
    let status;
    let id;
    let robloxUsernameUwU;
        switch (username) {
           
            case "everyone":	
                const embed = makeEmbed('invalid username',"Did you really ping everyone for this?", server);
                message.channel.send({embeds: [embed]});
                return false;
                break;
            case "not valid":
            case "not useable":
                robloxUsernameUwU = roblox.toLowerCase();
                id = await noblox.getIdFromUsername(robloxUsernameUwU).catch(e=>id = 0);
                break;
            case "no args": 
                username = message.author.id;
            default:
                status = 1;
                res = await rover(username).catch(err => status = 0);
                if(!status){
                    const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id",server);
                    message.channel.send({embeds:[embed]});
                    return true;
                }
        }
        if(!res)res = {status: "e"};


        if(res.status === "ok" || id ){
            
                let {robloxUsername, robloxId} = res;
                if(!id)id = robloxId;
                if(!robloxUsername) robloxUsername = robloxUsernameUwU;
                //GET GROUPS
                const groups = await noblox.getGroups(id);
                let branches    = groups.filter((group)=>jointBranchGroupIds.includes(group.Id));
                let divisions   = groups.filter((group)=>jointDivGroupIds.includes(group.Id));
                let raiders     = groups.filter((group)=>jointRaiderGroups.includes(group.Id));
                let lebels      = [];
                let notableTSU  = [];
                let raiderGroups= [];
                branches.forEach(group => {notableTSU.push(`**${TSUgroups[group.Id].name}**(${group.Role})`); if(jointOfficers.includes(group.RoleId))lebels.push("Branch officer");else if(jointHicom.includes(group.RoleId))lebels.push("Branch HICOM");else if(jointStaff.includes(group.RoleId))lebels.push("Staff team/ Management");else lebels.push("Branch member");});
                divisions.forEach(group =>{notableTSU.push(`**${TSUgroups[group.Id].name}**(${group.Role})`); if(jointDivOfficers.includes(group.RoleId))lebels.push("Division officer");else if(jointStaff.includes(group.RoleId))lebels.push("Staff team/ Management");else if(jointDivHicom.includes(group.RoleId))lebels.push("Division HICOM");else lebels.push("Division member");});
                raiders.forEach(group => {raiderGroups.push(`**${TSUgroups[group.Id].name}**(${group.Role})`)});

                if(raiderGroups.length)lebels.push("Raider");
                if(!notableTSU.length)lebels.push("Immigrant");
                //GET GAMEPASSES

                let ownedGamepassesInV2 = {};
                let ownedGamepassesInV1 = {};
                let gamepassOwnership;
                
                gamepassOwnership = await Promise.all(gamepassIdsMS2.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass")));
                let i = 0;
        
                for(let gamepassName in gamepasses["MS2"]){
                    ownedGamepassesInV2[gamepassName] = gamepassOwnership[i];
                    i++;
                }
            
                gamepassOwnership = await Promise.all(gamepassIdsMS1.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass")));
                i = 0;
                
                for(let gamepassName in gamepasses["MS1"]){
                    ownedGamepassesInV1[gamepassName] = gamepassOwnership[i];
                    i++;
                }
                
                let ownedGamepassesInV2Array = [];
                let ownedGamepassesInV1Array = [];

                for(let gamepass in ownedGamepassesInV2)if(ownedGamepassesInV2[gamepass])ownedGamepassesInV2Array.push(gamepass);
                for(let gamepass in ownedGamepassesInV1)if(ownedGamepassesInV1[gamepass])ownedGamepassesInV1Array.push(gamepass);
            
                let raiderPowerV2 = getRaiderPower(ownedGamepassesInV2Array);
                let raiderPowerV1 = getRaiderPower(ownedGamepassesInV1Array);

                if(raiderPowerV1 + raiderPowerV2)lebels.push("Armed");

                if(!ownedGamepassesInV1Array.length)ownedGamepassesInV1Array.push("**-**");
                if(!ownedGamepassesInV2Array.length)ownedGamepassesInV2Array.push("**-**");

                //BUILD THE EMBED
                const uniqueLebels = [...new Set(lebels)] 
                const embed = makeEmbed(`${robloxUsername}'s soviet profile`,`Here are the info related to the player`,server);
                embed.addField(`Username:`,`**${robloxUsername}**(${id})`,true);

                if(notableTSU.length)embed.addField("The Soviet Union groups:",`${notableTSU.join("\n")}`,true);
                if(raiderGroups.length)embed.addField("Raider groups:",`${raiderGroups.join("\n")}`,true);
                embed.addField(`Gamepasses:`,`**V1:** ${ownedGamepassesInV1Array.join(", ")}\n**V2:** ${ownedGamepassesInV2Array.join(", ")}`);
                embed.addField(`Raider power`,`**V1:** ${raiderPowerV1}\n**V2:** ${raiderPowerV2}`);
                embed.addField(`Lebels`,`\`${uniqueLebels.join("`,`")}\``);
                embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
                message.channel.send({embeds:[embed]});
                return true;

        } else{
            const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr an error could've occured.",server);
            message.channel.send({embeds:[embed]});
            return true;
        }










};

module.exports = check;