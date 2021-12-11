const Command = require("../../Classes/Command");
const rover = require("rover-api");
const makeEmbed = require("../../functions/embed");
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
let jointVIPs = [];
let jointCuffRanks = [];
let other = [];

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
        if(group.VIPRanks)jointVIPs.push(...group.VIPRanks);
        if(group.hasCuffs)jointCuffRanks.push(...group.cuffsRanks);
        
    }else if(group.isDivision){
        jointDivGroupIds.push(group.id);
        jointDivOfficers.push(...group.highRanks);
        jointDivHicom.push(...group.HICOMRanks);
        jointStaff.push(...group.managementAndStaff);
        if(group.VIPRanks)jointVIPs.push(...group.VIPRanks);
        if(group.hasCuffs){
            if(group.cuffsRanks)jointCuffRanks.push(...group.cuffsRanks);
            else jointCuffRanks.push(group.id);
        }
    }  else{
        if(group.isRaider){
            jointRaiderGroups.push(group.id);
        }else {
            if(group.hasCuffs)jointCuffRanks.push(group.id);
            other.push(group.id);
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
    worksInDMs      : false,
    isDevOnly       : false,
    isSlashCommand  : true,
    options			: [{
		name : "roblox_username",
		description : "The Roblox username to check for.",
		required : false,
		autocomplete: false,
		type: 3,
		},{
        name : "discord_username",
        description : "Check for the Roblox account of a Discord user.",
        required : false,
        autocomplete: false,
        type: 6,
        }
	],
    
});

check.execute = async (message, args, server) =>{

    let isAuthor = false;
    let isSlash = false;
    let res;
    let status;
    let id;
    let username;
    
    if(message.type === "APPLICATION_COMMAND"){
        isSlash = true;
        if(args[0]){
            if(args[0].name === "roblox_username")username = args[0].value;
            else if(args[0].name === "discord_username")username = args[0].value;

        }
        else {
            username = message.user.id;
            isAuthor = true;
        }
    } else username = checkUser(message, args, 0);

    let args0 = args[0]
    if(isSlash){
        if(args[0]){
            args0 = args[0].value;
        } else args0 = undefined;
    }

        switch (username) {
           
            case "everyone":	
                const embed = makeEmbed('invalid username',"Did you really ping everyone for this?", server);
                message.reply({embeds: [embed]});
                return false;
                break;
            case "not valid":
            case "not useable":

                id = await noblox.getIdFromUsername(args0).catch(e=>id = 0);
                if(!id){
                    let robloxUsername = await noblox.getUsernameFromId(args0).catch(e=>id = 0);
                    if(robloxUsername)id = args0;
                }
                break;
            case "no args": 
                if(!isSlash)username = message.author.id;
                else username = message.user.id;
                isAuthor = true;

            default:

                if(!isSlash)if(username === message.author.id)isAuthor = true;
                else if(username === message.user.id)isAuthor = true;
                if(username === args0 && isSlash && args[0].name === "roblox_username"){
                    
                    id = await noblox.getIdFromUsername(username).catch(e=>id = 0);
                    if(!id){
                        let robloxUsername = await noblox.getUsernameFromId(username).catch(e=>id = 0);
                        if(robloxUsername)username = args0;
                    }
                    break;
                }
                            
                status = 1;
                res = await rover(username).catch(err => status = 0);
                if(!status){
                    if(isAuthor){
                        const embed = makeEmbed("User not found", `**You're not verfied**\n please connect your Roblox account using \`${server.prefix}verify\` or enter your roblox username like this: \`${server.prefix}check [Roblox username or ID]\``,server);
                        message.reply({embeds:[embed]});
                        return true;
                    }else{
                        const embed = makeEmbed("User not found", "Couldn't find the Roblox profile of this Discord account because the user isn't verified",server);
                        message.reply({embeds:[embed]});
                        return true;
                    }
                    
                }
        }
        if(!res)res = {status: "e"};

        if(res.status === "ok" || id ){
            
            
                let {robloxUsername, robloxId} = res;
                if(!id)id = robloxId;
                if(!robloxUsername) robloxUsername = args0;
                //GET GROUPS
                const groups = await noblox.getGroups(id);
                let branches    = groups.filter((group)=>jointBranchGroupIds.includes(group.Id));
                let divisions   = groups.filter((group)=>jointDivGroupIds.includes(group.Id));
                let raiders     = groups.filter((group)=>jointRaiderGroups.includes(group.Id));
                let others      = groups.filter((group)=>other.includes(group.Id));
                let lebels      = [];
                let globalGroups= [];
                let notableTSU  = [];
                let raiderGroups= [];
                branches.forEach(group => {notableTSU.push(`**${TSUgroups[group.Id].name}**(${group.Role})`); if(jointOfficers.includes(group.RoleId))lebels.push("Branch officer");else if(jointHicom.includes(group.RoleId))lebels.push("Branch HICOM");else if(jointStaff.includes(group.RoleId))lebels.push("Staff team/ Management");else lebels.push("Branch member");if(jointVIPs.includes(group.RoleId))lebels.push("VIP assigned by the system");if(jointCuffRanks.includes(group.RoleId))lebels.push("has cuffs");});
                divisions.forEach(group =>{notableTSU.push(`**${TSUgroups[group.Id].name}**(${group.Role})`); if(jointDivOfficers.includes(group.RoleId))lebels.push("Division officer");else if(jointStaff.includes(group.RoleId))lebels.push("Staff team/ Management");else if(jointDivHicom.includes(group.RoleId))lebels.push("Division HICOM");else lebels.push("Division member");if(jointVIPs.includes(group.RoleId))lebels.push("VIP assigned by the system");if(jointCuffRanks.includes(group.RoleId) || jointCuffRanks.includes(group.Id))lebels.push("has cuffs");});
                raiders.forEach(group => {raiderGroups.push(`**${TSUgroups[group.Id].name}**(${group.Role})`)});
                others.forEach(group => {globalGroups.push(`**${TSUgroups[group.Id].name}**(${group.Role})`); if (jointCuffRanks.includes(group.Id))lebels.push("has cuffs"); if(group.Id === 4291835 || group.Id === 5157127)lebels.push("is REDACTED")});
            
                if(!notableTSU.length){
                    if(raiderGroups.length)lebels.push("Raider");
                    else lebels.push("Immigrant");
                }      

                if(lebels.includes("Branch officer") || lebels.includes("Branch HICOM") || lebels.includes("Staff team/ Management"))lebels.push("has admin");
                
                //GET GAMEPASSES

                let ownedGamepassesInV2 = {};
                let ownedGamepassesInV1 = {};
                let gamepassOwnership;
                
                let isBanned = false;

                gamepassOwnership = await Promise.all(gamepassIdsMS2.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass"))).catch(e=>isBanned = true);
                if(isBanned){
                    const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr the user could be banned from Roblox",server);
                    message.reply({embeds:[embed]});
                    return true
                }
                let i = 0;
        
                for(let gamepassName in gamepasses["MS2"]){
                    ownedGamepassesInV2[gamepassName] = gamepassOwnership[i];
                    i++;
                }
            
                gamepassOwnership = await Promise.all(gamepassIdsMS1.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass"))).catch(e=>isBanned = true);
                if(isBanned){
                    const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr the user could be banned from Roblox",server);
                    message.reply({embeds:[embed]});
                    return true
                }
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

                if(branches.length || divisions.length){
                    raiderPowerV1++;raiderPowerV2++;
                    if(raiderPowerV1 > 10) raiderPowerV1 = 10;
                    if(raiderPowerV2 > 10) raiderPowerV2 = 10; 
                }
                if(lebels.includes("has cuffs")){
                    raiderPowerV1++;raiderPowerV2++;
                    if(raiderPowerV1 > 10) raiderPowerV1 = 10;
                    if(raiderPowerV2 > 10) raiderPowerV2 = 10; 
                }

                if(raiderPowerV1 + raiderPowerV2)lebels.push("Armed");
                if(raiderPowerV1 + raiderPowerV2 && lebels.includes("Immigrant")){
                    lebels.splice(lebels.indexOf("Immigrant"),1);
                    lebels.push("Possible raider");
                }  

                if(!ownedGamepassesInV1Array.length)ownedGamepassesInV1Array.push("**-**");
                if(!ownedGamepassesInV2Array.length)ownedGamepassesInV2Array.push("**-**");

                //BUILD THE EMBED
                const uniqueLebels = [...new Set(lebels)] 
                const embed = makeEmbed(`${robloxUsername}'s soviet profile`,`Here are the info related to the player`,server);
                embed.addField(`Username:`,`**${robloxUsername}**(${id})`,true);
                embed.addField(`Profile link`,`[CLICK HERE](https://www.roblox.com/users/${id})`,true);

                if(notableTSU.length)embed.addField("The Soviet Union groups:",`${notableTSU.join("\n")}`,false);
                if(globalGroups.length)embed.addField("Noteable groups",globalGroups.join("\n"),false)
                if(raiderGroups.length)embed.addField("Raider groups:",`${raiderGroups.join("\n")}`,false);
                embed.addField(`Gamepasses:`,`**V1:** ${ownedGamepassesInV1Array.join(", ")}\n**V2:** ${ownedGamepassesInV2Array.join(", ")}`);
                embed.addField(`Raider power`,`**V1:** ${raiderPowerV1}\n**V2:** ${raiderPowerV2}`);
                embed.addField(`Lebels`,`\`${uniqueLebels.join("`,      `")}\``);
                embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
                message.reply({embeds:[embed]});
                return true;

        } else if(isAuthor){
            const embed = makeEmbed("User not found", "**You're not verfied**\n please connect your Roblox account using `;verify`",server);
            message.reply({embeds:[embed]});
            return true;
        } else{
            const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr an error could've occured.",server);
            message.reply({embeds:[embed]});
            return true;
        }










};

module.exports = check;