const client = require("../index");
const getRobloxData = require("../functions/getRobloxData");
const makeEmbed = require("../functions/embed");
const noblox = require("noblox.js");
const TSUgroups = require("../config/TSUGroups.json");
const raiderGroups = require("./allRaiderGroups.json");
const sendAndDelete = require("../functions/sendAndDelete");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const friendShipChecker = require("./friendShipChecker");
const cache = require("./cache");
const {MessageActionRow, MessageButton} = require("discord.js");
const {usernamesCache, robloxVerificationCache} = require("../caches/botCache");
const botCache = require("../caches/botCache");
const reportBug = require("../functions/reportErrorToDev");




let jointOfficers = [];
let jointDivOfficers = [];
let jointHicom = [];
let jointBranchLeaders = [];
let jointDivHicom = [];
let jointStaff = [];




for(let index in TSUgroups){
    let group = TSUgroups[index]
    if(group.isBranch){
        
        jointBranchLeaders.push(group.branchLeader);
        jointOfficers.push(...group.highRanks);
        jointHicom.push(...group.HICOMRanks);
        jointStaff.push(...group.managementAndStaff);
        
    }else if(group.isDivision){
        
        if(group.highRanks)jointDivOfficers.push(...group.highRanks);
        if(group.HICOMRanks)jointDivHicom.push(...group.HICOMRanks);
        if(group.managementAndStaff)jointStaff.push(...group.managementAndStaff);

    } 
}

const token = process.env.TRELLO_TOKEN;
const key = process.env.TRELLO_KEY;

let trelloInfo = {
    key,
    token,
    blackListBoardId : "5f5240eb7d10715ed708c8ae",
    kgbTrelloId: "60239dcea166e18eca0f89ea"

}
let loggingChannelId = "930527323260866671"


let jointRaiderGroups = [];
let jointBranchGroupIds = [];
let jointDivGroupIds = [];
let other = [];

let raiderClothes = [];


for(let groupId in raiderGroups){
    let group = raiderGroups[groupId];

    TSUgroups[group.id] = group;
    TSUgroups[group.id].isRaider = true;
    raiderClothes.push(...group.clothes[11]);
    raiderClothes.push(...group.clothes[12]);
    raiderClothes.push(...group.clothes[2]);
}


for(let index in TSUgroups){
    let group = TSUgroups[index]
    if(group.isBranch){
        jointBranchGroupIds.push(group.id);
        
        
    }else if(group.isDivision){
        jointDivGroupIds.push(group.id);
       
    }else{
        if(group.isRaider){
            jointRaiderGroups.push(group.id);
        }
    }
}

function getRaiderHistory(id){
    let thing =  fs.readFileSync("./Private_JSON_files/raiderGroupsHistory.json","utf-8");
    return JSON.parse(thing)[id];
        
}
function getTSUHistory(id){
    let thing =  fs.readFileSync("./Private_JSON_files/TSU_careers.json","utf-8");
    return JSON.parse(thing)[id];
        
}


module.exports = async (message, args, server, isSlash, res, status, id, username, args0, author, isAuthor, pendingMessage, queueTime) =>{
    try {
        
        let benchMarkOne = Date.now();
    
        //interactive buttons
        const mainButton = new MessageButton()
        .setCustomId('main')
        .setLabel('Main Info')
        .setEmoji("🏠")
        .setStyle("SECONDARY");
        const friendsButton = new MessageButton()
        .setCustomId('friends')
        .setLabel('Friends')
        .setEmoji("👥")
        .setStyle("SECONDARY");
        const clothesButton =  new MessageButton()
        .setCustomId('clothes')
        .setLabel('Clothes')
        .setEmoji("👚")
        .setStyle("SECONDARY")
        .setDisabled(true);
        const missingBadgesButton = new MessageButton()
        .setCustomId('badges')
        .setLabel('Badges') 
        .setEmoji("📚")
        .setStyle("SECONDARY");
        const historyButton = new MessageButton()
        .setCustomId("history")
        .setLabel("History")
        .setEmoji("⌛")
        .setStyle("SECONDARY");
        const scoreButton = new MessageButton()
        .setCustomId("score")
        .setLabel("Score details")
        .setEmoji("🧮")
        .setStyle("SECONDARY");
        const row = new MessageActionRow().addComponents(mainButton, historyButton, friendsButton );
        const row2 = new MessageActionRow().addComponents(clothesButton, missingBadgesButton, scoreButton);
    
        //switch for the first argument and determine who to execute the command on
        switch (username) {
            
            case "everyone":	
                const embed = makeEmbed('invalid username',"Did you really ping everyone for this?", server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server)
                return;
                break;
            case "not valid":
            case "not useable":
    
                id = await noblox.getIdFromUsername(args0).catch(e=>id = 0);
                if(!id){
                    let robloxUsername = usernamesCache[args0] ?? await noblox.getUsernameFromId(args0).catch(e=>id = 0);
                    if(robloxUsername){
                        id = args0;
                        usernamesCache[id] = robloxUsername;
                        
                    }
                }
                break;
            case "no args": 
                if(!isSlash)username = message.author.id;
                else username = message.user.id;
                isAuthor = true;
    
            default:
                
                if(username === author.id)isAuthor = true;
                
                if(username === args0 && isSlash && args[0].name === "roblox_username"){
                    
                    id = await noblox.getIdFromUsername(username).catch(e=>id = 0);
                    
                    if(!id){
                        
                        let robloxUsername = await noblox.getUsernameFromId(username).catch(e=>id = 0);
                        if(robloxUsername)username = args0;
                    }
                    break;
                }
                            
                
                status = 1;
                
                res = await getRobloxData(username).catch(err => status = 0);
                
                if(!status){
                    
                    if(isAuthor){
                        const embed = makeEmbed("User not found", `**You're not verfied**\n please connect your Roblox account using \`${server.prefix}verify\``,server);
                        sendAndDelete(message, embed, server);
                        pendingMessage?.delete().catch(e=>e);
                        return;
                    }else{
                        const embed = makeEmbed("User not found", "Couldn't find the Roblox profile of this Discord account because the user isn't verified",server);
                        sendAndDelete(message, embed, server);
                        pendingMessage?.delete().catch(e=>e);
                        return;
                    }
                    
                }
        }
        if(!res)res = {status: "e"};
    
        //if the user is found, proceed, else stop
        if(res.status === "ok" || id || status === 2 ){


            //resort the variables
            let erroredOut = false;
            let {cachedUsername, robloxId} = res;
            if(!id)id = robloxId;
            if(!cachedUsername) cachedUsername = args0;
    
            //info to be used for the archive. if user isnt verifed, abort
            let loggingInfo = {};
            if(isAuthor){
                
                loggingInfo.username = cachedUsername;
                loggingInfo.DiscordId = author.id;

            } else {

                let status = 1;
                
                res = await getRobloxData(author.id).catch(err => status = 0);
                
                
                if(!status){
                    
                    const embed = makeEmbed("Verification required", `**You're not verfied**\n please connect your Roblox account using \`${server.prefix}verify\``,server);
                    pendingMessage?.delete().catch(e=>e);
                    sendAndDelete(message, embed, server);
                    return;                
                } else {
                    robloxVerificationCache[author.id] = {robloxId : res.robloxId, cachedUsername : res.cachedUsername}; //save verification info for later use
                    loggingInfo.username = res.cachedUsername; 
                    loggingInfo.DiscordId = author.id;
                }
            }

            if(botCache.bgcCache[id]){
                let loggingChannel = client.channels.cache.get(loggingChannelId);
            
                if(loggingChannel && loggingChannel.guild.available){

                    botCache.bgcCache[id].main.setDescription("Data retrieved from cache.")
                    loggingChannel.send({embeds: botCache.bgcCache[id].all}).then(async yes=>{
                        
                        
                        pendingMessage?.delete().catch(e=>e);
        
                        if(isSlash)await message?.editReply({embeds: [botCache.bgcCache[id].main], components: [row, row2]});
                        let newMsg = !isSlash ? await message.reply({embeds:[botCache.bgcCache[id].main], components: [row, row2] }) : await message.fetchReply();
                        
                        
                        const collector = newMsg.createMessageComponentCollector({ filter: button =>  button.user.id === author.id, time:   4 * 60 * 1000 });
        
                        collector.on('collect', async i => {
                            collector.resetTimer();
        
                            mainButton.setDisabled(false)
                            if(botCache.bgcCache[id].friends.description)friendsButton.setDisabled(false);
                            if(botCache.bgcCache[id].clothes.description)clothesButton.setDisabled(false);
                            if(botCache.bgcCache[id].badges.description)missingBadgesButton.setDisabled(false);
                            scoreButton.setDisabled(false);
                            historyButton.setDisabled(false);
                            
        
                            switch (i.customId) {
                                case "main":
                                    mainButton.setDisabled(true);
                                    break;
                                case "friends":
                                    friendsButton.setDisabled(true);
                                    break;
                                case "badges":
                                    missingBadgesButton.setDisabled(true);
                                    break;
                                case "clothes":
                                    clothesButton.setDisabled(true);
                                case "history":
                                    historyButton.setDisabled(true);
                                case "score":
                                    scoreButton.setDisabled(true);
                            }
        
                            
                            
                            i.update({embeds:[botCache.bgcCache[id][i.customId]],  components: [row, row2]});
                            
                        }); 
                        
                        collector.on('end', collected => {
                            if(isSlash) message.editReply({components:[]}).catch(e=>e)//if e, message was deleted
                            else newMsg.edit({components:[]}).catch(e=>e)//if e, message was deleted
                        });
                        
        
                    }).catch(no=>{
                        
                        console.log(no);
                        const embed = makeEmbed("Command failed", "There was an error while sending the message, contact the developer if this happens again.",server);
                        sendAndDelete(message, embed, server);
                        pendingMessage?.delete().catch(e=>e);
                        return;
                    })
                } else {
                    const embed = makeEmbed("Command failed", "Could not trace this action. Please try again later.",server);
                    sendAndDelete(message, embed, server);
                    pendingMessage?.delete().catch(e=>e);
                    return;
                }
                return;
            }
            
            //GET DATA
    
            let notes = [];
            let scoreDeductions = []
            let isBanned = false;
            let score = 0;
            let maxScore = 10;
    
            let information = await noblox.getPlayerInfo({userId: id}).catch(error=>isBanned = true);
    
            if(isBanned)information = {isBanned : true};
    
            let groups = information.isBanned ? [] : noblox.getGroups(id).catch(e=>erroredOut = true).catch(e=>erroredOut = true);
            let friends = information.isBanned ? [] : noblox.getFriends(id).catch(e=>erroredOut = true).catch(e=>erroredOut = true);
    
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
    
            let hasPublicInventory = true;
            let nextCursor = "yes";
            let inventory = [];
            let badges = [];
            let limit = 20;
            let current = 0;

            do{

                let requst = await axios.get(`https://inventory.roblox.com/v2/users/${id}/inventory?assetTypes=TShirt%2C,Pants%2C,Shirt&limit=100${nextCursor === "yes" ? "" : "&cursor=" + nextCursor}&sortOrder=Asc`).catch(e=>{hasPublicInventory = false; nextCursor = null;});
                
                nextCursor = requst?.data?.nextPageCursor;
                
                if(hasPublicInventory){
                    inventory.push(...requst.data.data);
                }
                current++
            }
            while(nextCursor && limit >= current)
            
            if(current >= limit)notes.push("User has a lot of clothing assets");
            nextCursor = "yes";
            current = 0;

            if(!hasPublicInventory){
                maxScore -= 2;
                scoreDeductions.push("User has private inventory, score limit -2")
            } else {
                do{

                    let requst = await axios.get(`https://badges.roblox.com/v1/users/${id}/badges?limit=100${nextCursor === "yes" ? "" : "&cursor=" + nextCursor}&sortOrder=Asc`).catch(e=>{hasPublicInventory = false; nextCursor = null;});
                    
                    nextCursor = requst?.data?.nextPageCursor;
                    
                    if(hasPublicInventory){
                        badges.push(...requst.data.data);
                    }
                    current++
                }
                while(nextCursor && limit >= current)
            }

            
            if(current >= limit)notes.push("User has a lot of badges");
            
            const resolve = await Promise.all([groups, friends]).catch(e=>erroredOut = true);
            groups = resolve[0];
            friends = resolve[1];
            
    
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving group & friends data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }

            
            if(hasPublicInventory && badges.length){
                for (let i = 0; i < 30; i++) {

                    const badge = badges[i];

                    if(!badge)break;
                    
                    if(cache.badges.Ids.includes(badge.id)){
                        notes.push("User has an MS badge very early on. An alt account?");
                        scoreDeductions.push("User has an early MS badge, score limit -1.")
                        maxScore -= 1;
                        break;
                    }
                }
            }
    
            let raiderHistory = await getRaiderHistory(id);
            let tsuHistory = await getTSUHistory(id);

            let raiderFriendsData = information.isBanned ? {notes: [],raiderFriends: [], susFriends : [], goodFriends: [] } : await friendShipChecker(friends);
    
            

            
            

            //past raiding groups
            let exRaidingGroups = [];
            if(raiderHistory){
    
                const max = raiderHistory.ranks.length - 1;
                
                let iteration = 0;
                let index = 0;
    
                for (let j = 1; j <= Math.ceil(max/7); j++) {
    
                    let field = [];
                    if(!index)field.push("`(Year-Month-Day)`");
                    
                    while (index < (7 + 1 * iteration)) {
                        if(!raiderHistory.groups[index])break;
                        
                        field.push(`*User was in **${raiderHistory.groups[index]}**. They were last seen as ${raiderHistory.ranks[index ]} on ${raiderHistory.dates[index]}`);
                        index++;
                    }
    
                    iteration += 7;           
                         
                    exRaidingGroups.push(field);
                }
                
            } else{

                score += 2;
                scoreDeductions.push("User was never in a raiding group, score +2");
            }

            //past tsu groups
            let exTSUGroups = [];
            if(tsuHistory){
                const max = tsuHistory.ranks.length - 1;
                
                let iteration = 0;
                let index = 0;
    
                for (let j = 1; j <= Math.ceil(max/7); j++) {
    
                    let field = [];
                    if(!index)field.push("`(Year-Month-Day)`");
                    
                    while (index < (7 + 1 * iteration)) {
                        if(!tsuHistory.groups[index])break;
                        
                        field.push(`*User was a ${tsuHistory.ranks[index ]} in **${tsuHistory.groups[index]}** first seen on ${tsuHistory.dates[index]}`);
                        index++;
                    }
    
                    iteration += 7;           
                         
                    exTSUGroups.push(field);
                }
            }
    
    
            // GET BLACKLISTS
            const trelloData = await axios.get(`https://api.trello.com/1/search?query=${cachedUsername}&idBoards=${trelloInfo.blackListBoardId}&modelTypes=cards&key=${trelloInfo.key}&token=${trelloInfo.token}`).catch(e=>erroredOut = true);
            
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Trello, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
    
            let blacklistCards = [];
            if(trelloData)for(let card of trelloData?.data?.cards){
                if(card?.name?.toLowerCase() === cachedUsername.toLowerCase()){
                    let obj = {};
                    let array = card.desc.split("\n");
                    
                    obj.div = array[0];
                    obj.name = card.name;
                    obj.assigner = array.find(string => string.includes("Assigned"))?.split("*")?.join("");
                    obj.url = card.url;
    
                    blacklistCards.push(obj);
    
                }
            }
            
            //organise groups
    
            let branches    = groups.filter((group)=>jointBranchGroupIds.includes(group.Id));
            let divisions   = groups.filter((group)=>jointDivGroupIds.includes(group.Id));
            let raiders     = groups.filter((group)=>jointRaiderGroups.includes(group.Id));
            let others      = groups.filter((group)=>other.includes(group.Id));
    
            let globalGroups= [];
            let notableTSU  = [];
            let raiderGroups= [];
            
            branches.forEach(group => {notableTSU.push(`${TSUgroups[group.Id].name}: ${group.Role}`);});
            divisions.forEach(group =>{notableTSU.push(`${TSUgroups[group.Id].name}: ${group.Role}`);});
            raiders.forEach(group => {raiderGroups.push(`${TSUgroups[group.Id].name}: ${group.Role}`)});
            others.forEach(group => {globalGroups.push(`${TSUgroups[group.Id].name}: ${group.Role}`);});
    
    
            //GET BADGE OWNERSHIP
           
            const ownedBadges = {MS1: [], MS2: []};

            if(hasPublicInventory){
                
                let tempBadgesObject = {};

                for(let badge of badges){
                   tempBadgesObject[badge.id] = true;
                }

                let badgeOwnderShip = cache.badges.Ids.map(badgeId => tempBadgesObject[badgeId] ?? false);
                

                let ownerShipObject = {};
                for (let i = 0; i < badgeOwnderShip.length; i++) {
                    const badge = cache.badges.Ids[i];
                    const isOwned = badgeOwnderShip[i];
                    ownerShipObject[badge] = isOwned;
                    
                }
                

                for(let badgeId in ownerShipObject){
                    
                    if(cache.badges.MS1[badgeId] && ownerShipObject[badgeId])ownedBadges.MS1.push(cache.badges.MS1[badgeId]);
                    else if(cache.badges.MS2[badgeId] && ownerShipObject[badgeId])ownedBadges.MS2.push(cache.badges.MS2[badgeId]);
                }
        
                let amountOfOwnedBadgesBadges = ownedBadges.MS1.length + ownedBadges.MS2.length; 
                
        
                if(ownedBadges.MS1.length === 0) ownedBadges.MS1 = ["No badges"];
                if(ownedBadges.MS2.length === 0) ownedBadges.MS2 = ["No badges"];

                if((ownedBadges.MS1.length + ownedBadges.MS2.length) / badges.length > 0.1){
                    maxScore -= 1;
                    scoreDeductions.push("10% of this user's badges are from TSU, score limit -1.");
                }
        
                
                notes.push(`User owns ${amountOfOwnedBadgesBadges } out of ${cache.badges.Ids.length} TSU badges.`);
                
        
                if(!ownerShipObject[2124474041] && ownedBadges.MS1.length > 1){
                    notes.push("User deleted the MS1 welcome badge.")
                } else score += 0.125;
                if(!ownerShipObject[2124518225] && ownedBadges.MS2.length > 1){
                    notes.push("User deleted the MS2 welcome badge.")
                } else score += 0.125;
                
                
                if(badges.length > 100) {score += 0.25; scoreDeductions.push("User has more than 100 badges total, score +0.25");} else {maxScore -= 3; scoreDeductions.push("User has less than 100 total badges, score limit -3");}
                if(badges.length > 250) {score += 0.25; scoreDeductions.push("User has more than 250 badges total, score +0.25");} else {maxScore -= 2; scoreDeductions.push("User has less than 250 total badges, score limit -2");}
                if(badges.length > 500) {score += 0.25; scoreDeductions.push("User has more than 500 badges total, score +0.25");}
                if(badges.length > 750) {score += 0.25; scoreDeductions.push("User has more than 750 badges total, score +0.25");}
                if(badges.length > 1000) {score += 0.25; scoreDeductions.push("User has more than 1000 badges total, score +0.25");}
                
            }
            
    
            //GET RAIDER CLOTHES OWNERSHIP
            
    
            const ownedRaiderAssets = [];
    
            if(hasPublicInventory && !information.isBanned && inventory.length){
                
                for(let asset of inventory)
                {
                    
                    let index = raiderClothes.indexOf(asset.assetId);
                    if(index >= 0)ownedRaiderAssets.push(raiderClothes[index]);
                   
                }
                
    
            }
    
            
                
            //BUILD THE EMBED(s)
            let ping = Date.now() - benchMarkOne
    
            const embed = makeEmbed(`${cachedUsername}'s background check`,`Data retrieved in ${ping}ms\n Time spent in queue: ${queueTime} seconds`,server,false,"Do not completely rely on this. Use it only as a tool.");
            embed.addField(`Username:`,`${cachedUsername}`,true);
            embed.addField(`ID:`,`${id}`,true);
            embed.addField(`Profile link`,`[CLICK HERE](https://www.roblox.com/users/${id})`,true);
            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
    
            const friendsEmbed = makeEmbed(`${cachedUsername}'s suspicious friends`, ``, server);
            friendsEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let friendsEmbedSrting = [];
    
            const clothesEmbed = makeEmbed(`${cachedUsername}'s suspicious clothes`, ``, server);
            clothesEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let clothesEmbedSrtring = [];
    
            const badgesEmbed = makeEmbed(`${cachedUsername}'s badges`, ``, server);
            badgesEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let badgesEmbedString = [];

            const historyEmbed = makeEmbed(`${cachedUsername}'s history`, `Past ranks`, server);
            historyEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);

            const scoreEmbed = makeEmbed(`${cachedUsername}'s score details`, "", server)
            scoreEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);

            
    
            // STATS
            embed.addField(`Stats`,`${information.friendCount ? "*Friends: " + information.friendCount : ""}${information.followerCount ? "\n*Followers: " + information.followerCount : ""} ${information.followingCount ? "\n*Following: " + information.followingCount : ""} ${information.age ? "\n*Account age: " + information.age + " days": ""} ${ "\n*Groups: " + groups.length } ${hasPublicInventory ? "\n*Basic clothing assets: "+ inventory.length : ""} ${hasPublicInventory ? "\n*Badges: " + badges.length + (current >= limit ? "+" : "") : ""} ${information.isBanned ? "\n*Is terminated: ✅": ""}`,false);
            if(information?.friendCount > 30){score += 0.25; scoreDeductions.push("User has more than 30 frieds, score +0.25");}
            if(information?.followerCount > 30 && information?.followerCount < 200) {score +=0.25; scoreDeductions.push("User has between 30 and 200 followers, score + 0.25");}
            if(information?.age > 730) {score += 0.5; scoreDeductions.push("User's account age is greater than 2 years, score +0.5");} else if(information?.age > 365){score += 0.25; scoreDeductions.push("User's account age is greater than 1 year, score +0.25");}  
            if(notableTSU.length / groups.length >= 0.5){
                notes.push("User is in too many TSU groups");
            } else {score += 0.5; scoreDeductions.push("More than 50% of the user's groups are not TSU-related, score +0.5");}

            notes.push(`TSU groups/total groups ratio: ${ (notableTSU.length / groups.length).toFixed(2)} / 1`);
            if(information?.age < 365)notes.push("Account is a bit young.");
    
            // past names

            if(information.oldNames?.length){ 

                embed.addField("Past usernames: ", information.oldNames.join(", "));
            }
    
            //groups
            if(notableTSU.length || globalGroups.length || raiderGroups.length){

                if(notableTSU.length) {score += 1.5; scoreDeductions.push("User is in a TSU group, score +1.5");}
                if(notableTSU.length > 5) {score += 0.5; scoreDeductions.push("User is in more than 5 TSU groups, score +0.5");}
                embed.addField("Groups",`${notableTSU.length ? "**The Soviet Union Groups**:\n\n"+notableTSU.join("\n")+"\n\n" : ""}${globalGroups.length ? "**Notable Groups**:\n\n"+globalGroups.join("\n")+"\n\n" : ""}${raiderGroups.length ? "**Raider Groups**:\n\n"+raiderGroups.join("\n")+"\n\n" : ""}`,false);
            }
    
            //blacklists
            if(blacklistCards.length){
                let strings = [];
                for(let obj of blacklistCards){
                    strings.push(`${obj.div}: [${obj.name}](${obj.url})   ${obj.assigner}`);
                }
                embed.addField("Blacklists",strings.join("\n"), false);
            } else {score += 1.25; scoreDeductions.push("User was never blacklisted, score +1.25");}
    
            //ex rading groups
    
            if(exRaidingGroups.length){
                
                historyEmbed.addField("\u200b","**Raiding history**", false);
                exRaidingGroups.forEach(f=>historyEmbed.addField("\u200b",f.join("\n"), false));
                
                if(raiderGroups.length)notes.push("User is in a raiding group.");
                else notes.push("User is an ex-raider."); 

            } 

            // ex tsu groups
            if(exTSUGroups.length){
                
                historyEmbed.addField("\u200b","**TSU history**", false);
                exTSUGroups.forEach(f=>historyEmbed.addField("\u200b",f.join("\n"), false));
            }

            
            branches.forEach(group => {
                
                if(jointOfficers.includes(group.RoleId)){ score += 1; scoreDeductions.push("User is an officer, score +1");}
                else if(jointHicom.includes(group.RoleId)) {score += 3; scoreDeductions.push("User is a Hicom, score +3");}
                else if(jointBranchLeaders.includes(group.RoleId)) {score += 5; scoreDeductions.push("User is a branch leader, score +5");}
                else if(jointStaff.includes(group.RoleId)) {score += 5; scoreDeductions.push("User is in staff team, score +5");}
                
            });

            divisions.forEach(group =>{
                
                if(jointDivOfficers.includes(group.RoleId)){score += 1; scoreDeductions.push("User is divisional officer, score +1");}
                else if(jointDivHicom.includes(group.RoleId)){score += 3; scoreDeductions.push("User is divisional Hicom, score +3");}
                
            });
                
            // sus friends
            if(raiderFriendsData.notes.length)notes.push(raiderFriendsData.notes);
            if(raiderFriendsData.raiderFriends.length || raiderFriendsData.susFriends.length || raiderFriendsData.goodFriends.length){
                if(raiderFriendsData.raiderFriends.length / information?.friendCount  < 0.1){score += 0.5; scoreDeductions.push("User has less than 10% TSU raider friends, score +0.5");}
                else {
                    notes.push("User has a lot of raider friends");
                    
                }
                if(raiderFriendsData.susFriends.length / information?.friendCount  < 0.10){score += 0.5; scoreDeductions.push("User has less than 10% sus friends, score +0.5");}
                if(raiderFriendsData.goodFriends.length / information?.friendCount  > 0.25){
                    notes.push("User has a lot of TSU friends");
                }
    
                friendsEmbedSrting.push("\n**Raider friends**\n");
                friendsEmbedSrting.push(raiderFriendsData.raiderFriends.length ? raiderFriendsData.raiderFriends.join(",  ") : "-");
                friendsEmbedSrting.push("\n**ex-raider friends**\n");
                friendsEmbedSrting.push(raiderFriendsData.susFriends.length ? raiderFriendsData.susFriends.join(",  ") : "-");
                friendsEmbedSrting.push("\n**Important/formerly important TSU friends\n**");
                friendsEmbedSrting.push(raiderFriendsData.goodFriends.length ? raiderFriendsData.goodFriends.join(", ") : "-")
                
            } 
    
            
    
            //badges
           
                
            if(ownedBadges.MS1.length || ownedBadges.MS2.length){
            
                badgesEmbedString.push("**Owned Badges:**\n\n")
                badgesEmbedString.push("\n**MS1:**\n");
                
                if(ownedBadges.MS1.length){
                    badgesEmbedString.push(ownedBadges.MS1.join(",    "));
                } else badgesEmbedString.push("**-**");
    
                badgesEmbedString.push("\n**MS2:**\n");
    
                if(ownedBadges.MS2.length){
                    badgesEmbedString.push(ownedBadges.MS2.join(",    "));
                } else badgesEmbedString.push("**-**");
                
                
                
            }
            
            
    
            //raider clothes


            if(hasPublicInventory){
                clothesButton.setDisabled(false);
                if(ownedRaiderAssets.length){
                    
                    let string = [];
                    ownedRaiderAssets.forEach(assetId=>string.push(`[asset](https://www.roblox.com/catalog/${assetId})`));
                    
                    if(string.length){
                        clothesEmbedSrtring.push("**Owned raiding groups clothing**");
                        clothesEmbedSrtring.push(string.length ? string.join(", ") : "**-**");
                    }
    
                } else {score += 2; scoreDeductions.push("User has no raider-related assets, score +2");}
    
            } else notes.push("User has a private inventory.");
    

            //notes


            if(score > maxScore) score = maxScore;
            if(score < 0) score = 0;
            embed.addField("Score", `${score}`, true);
            notes = [...new Set(notes)]; 
            if(notes.length)embed.addField("Extra notes", notes.join("\n"), true);
            

            

            const logEmbed = makeEmbed("",`${loggingInfo.username} (<@${loggingInfo.DiscordId}>) has done a background check on this user:`, server)
            
           
            let color = score > 9 ? "32FC00" : score > 7 ? "E9FC00" : score > 5 ? "FC8900" : score > 3 ? "FC2A00" : "420000"
    
            embed.setColor(color);
            friendsEmbed.setColor(color);
            clothesEmbed.setColor(color);
            badgesEmbed.setColor(color);
            historyEmbed.setColor(color);
            logEmbed.setColor(color);

            scoreEmbed.setColor(color);
            
            if(friendsEmbedSrting.length)friendsEmbed.setDescription(friendsEmbedSrting.join("\n")); else friendsButton.setDisabled(true);
            if(clothesEmbedSrtring.length)clothesEmbed.setDescription(clothesEmbedSrtring.join("\n")); else clothesButton.setDisabled(true);
            if(badgesEmbedString.length)badgesEmbed.setDescription(badgesEmbedString.join("\n")); else missingBadgesButton.setDisabled(true);

            scoreEmbed.setDescription(`Current score: ${score}/10\n Score limit: ${maxScore}\n\n\n **Score calculation**\n\n\n ${scoreDeductions.join("\n")}`);
    
    
            const embedsObject = {
                log: logEmbed,
                main: embed,
                friends: friendsEmbed,
                clothes: clothesEmbed,
                badges : badgesEmbed,
                history: historyEmbed,
                score: scoreEmbed,
                all: []
            }
            for(let i of [logEmbed, embed, historyEmbed, friendsEmbed, clothesEmbed, badgesEmbed, scoreEmbed]){
                if(i.description)embedsObject.all.push(i);
            }
            
            botCache.bgcCache[id] = embedsObject;
            
    
            //sending the embed

            
            let loggingChannel = client.channels.cache.get(loggingChannelId);
            
            if(loggingChannel && loggingChannel.guild.available){
                
                loggingChannel.send({embeds:embedsObject.all}).then(async yes=>{
                    
                    
                    pendingMessage?.delete().catch(e=>e);
    
                    if(isSlash)await message?.editReply({embeds: [embed], components: [row, row2]});
                    let newMsg = !isSlash ? await message.reply({embeds:[embed], components: [row, row2]}) : await message.fetchReply();
                    
                    
                    const collector = newMsg.createMessageComponentCollector({ filter: button =>  button.user.id === author.id, time:   4 * 60 * 1000 });
    
                    collector.on('collect', async i => {
                        collector.resetTimer();
    
                        mainButton.setDisabled(false)
                        if(friendsEmbedSrting.length)friendsButton.setDisabled(false);
                        if(clothesEmbedSrtring.length)clothesButton.setDisabled(false);
                        if(badgesEmbedString)missingBadgesButton.setDisabled(false);
                        historyButton.setDisabled(false);
                        scoreButton.setDisabled(false);
                        
    
                        switch (i.customId) {
                            case "main":
                                mainButton.setDisabled(true);
                                break;
                            case "friends":
                                friendsButton.setDisabled(true);
                                break;
                            case "badges":
                                missingBadgesButton.setDisabled(true);
                                break;
                            case "clothes":
                                clothesButton.setDisabled(true);
                            case "history":
                                historyButton.setDisabled(true);
                            case "score":
                                scoreButton.setDisabled(true);
                        }
    
                        
                        
                        i.update({embeds:[embedsObject[i.customId]],  components: [row, row2]});
                        
                    }); 
                    
                    collector.on('end', collected => {
                        if(isSlash) message.editReply({components:[]}).catch(e=>e)//if e, message was deleted
                        else newMsg.edit({components:[]}).catch(e=>e)//if e, message was deleted
                    });
                    
    
                }).catch(no=>{
                    
                    console.log(no);
                    const embed = makeEmbed("Command failed", "There was an error while sending the message, contact the developer if this happens again.",server);
                    sendAndDelete(message, embed, server);
                    pendingMessage?.delete().catch(e=>e);
                    return;
                })
            } else {
                const embed = makeEmbed("Command failed", "Could not trace this action. Please try again later.",server);
                sendAndDelete(message, embed, server);
                pendingMessage?.delete().catch(e=>e);
                return;
            }
            return;
    
    
    
        } else if(isAuthor){
            const embed = makeEmbed("User not found", "**You're not verfied**\n please connect your Roblox account using `;verify`",server);
            sendAndDelete(message, embed, server);
            pendingMessage?.delete().catch(e=>e);
            return;
        } else{
            const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr an error could've occured.",server);
            sendAndDelete(message, embed, server);
            pendingMessage?.delete().catch(e=>e);
            return;
        }
    
    } catch (error) {
        console.log(error);
        reportBug(error,message,client,{name: "BGC"});
        const embed = makeEmbed("An unknown error happened", `An unknown error happened while trying to run the command, please try again.`,server);
        pendingMessage?.delete().catch(e=>e);
        sendAndDelete(message, embed, server);
        return;   
    }

    
};
