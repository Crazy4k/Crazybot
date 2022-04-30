const client = require("../index");
const rover = require("rover-api");
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
const {usernamesCache} = require("../caches/botCache");
const reportBug = require("../functions/reportErrorToDev");

const token = process.env.TRELLO_TOKEN;
const key = process.env.TRELLO_KEY;

let trelloInfo = {
    key,
    token,
    blackListBoardId : "5f5240eb7d10715ed708c8ae",
    kgbTrelloId: "60239dcea166e18eca0f89ea"

}
let loggingChannelId = "936338228192100372";
//let loggingChannelId = "930527323260866671"


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



module.exports = async (message, args, server, isSlash, res, status, id, username, args0, author, isAuthor, pendingMessage, queueTime) =>{
    try {
        let benchMarkOne = Date.now();
    
        //interactive buttons
        const mainButton = new MessageButton()
        .setCustomId('main')
        .setLabel('Main Info')
        .setStyle("SECONDARY");
        const friendsButton = new MessageButton()
        .setCustomId('friends')
        .setLabel('Friends')
        .setStyle("SECONDARY");
        const clothesButton =  new MessageButton()
        .setCustomId('clothes')
        .setLabel('Clothes')
        .setStyle("SECONDARY")
        .setDisabled(true);
        const missingBadgesButton = new MessageButton()
        .setCustomId('badges')
        .setLabel('Missing badges')
        .setStyle("SECONDARY");
        const row = new MessageActionRow().addComponents(mainButton, friendsButton, clothesButton, missingBadgesButton);
    
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
                        console.log(usernamesCache);
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
                res = await rover(username).catch(err => status = 0);
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
        if(res.status === "ok" || id ){
            
            //resort the variables
            let erroredOut = false;
            let {robloxUsername, robloxId} = res;
            if(!id)id = robloxId;
            if(!robloxUsername) robloxUsername = args0;
    
            //info to be used for the archive. if user isnt verifed, abort
            let loggingInfo = {};
            if(isAuthor){
                loggingInfo.username = robloxUsername;
                loggingInfo.DiscordId = author.id;
            } else {
                let status = 1;
                res = await rover(author.id).catch(err => status = 0);
                if(!status){
                    
                    const embed = makeEmbed("Verification required", `**You're not verfied**\n please connect your Roblox account using \`${server.prefix}verify\``,server);
                    pendingMessage?.delete().catch(e=>e);
                    sendAndDelete(message, embed, server);
                    return;                
                } else {
                    loggingInfo.username = res.robloxUsername; 
                    loggingInfo.DiscordId = author.id;
                }
            }
    
            
            //GET DATA
    
            let notes = [];
            let isBanned = false;
            let score = 3;
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
            
           
            let raiderClothesOwnerShip = await Promise.all(raiderClothes.map(asset => noblox.getOwnership(id, asset, "Asset").catch(e=> erroredOut = true))).catch(e=>erroredOut = true);
            let earlyBadges = information.isbanned ? [] : await noblox.getPlayerBadges(id,30,"Asc").catch(e=>{hasPublicInventory = false;erroredOut = true}).catch(e=>erroredOut = true);
    
            
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
            
            const resolve = await Promise.all([groups, friends]).catch(e=>erroredOut = true);
            groups = resolve[0];
            friends = resolve[1];
            
    
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
    
            
            if(!hasPublicInventory){
                earlyBadges = [];
                maxScore = 8;
            }
    
            for(let badge of earlyBadges){
                if(cache.badges.Ids.includes(badge.id))notes.push("User has an MS badge very early on. An alt account?")
            }
    
            let raiderHistory = await getRaiderHistory(id);
            let raiderFriendsData = information.isBanned ? {notes: [],raiderFriends: [], susFriends : [] } : await friendShipChecker(friends);
    
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
                
            } else score += 1.5;
    
    
            // GET BLACKLISTS
            const trelloData = await axios.get(`https://api.trello.com/1/search?query=${robloxUsername}&idBoards=${trelloInfo.blackListBoardId}&modelTypes=cards&key=${trelloInfo.key}&token=${trelloInfo.token}`).catch(e=>erroredOut = true);
            
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
    
            let blacklistCards = [];
            if(trelloData)for(let card of trelloData?.data?.cards){
                if(card?.name?.toLowerCase() === robloxUsername.toLowerCase()){
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
            let badgeOwnderShip = await Promise.all(cache.badges.Ids.map(badgeId => noblox.getOwnership(id,badgeId,"Badge").catch(e=> erroredOut = true))).catch(e=>erroredOut = true)
            
            if(erroredOut){
                const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Roblox, try again later`,server);
                pendingMessage?.delete().catch(e=>e);
                sendAndDelete(message, embed, server);
                return;                
            }
            
            let ownerShipObject = {};
            for (let i = 0; i < badgeOwnderShip.length; i++) {
                const badge = cache.badges.Ids[i];
                const isOwned = badgeOwnderShip[i];
                ownerShipObject[badge] = isOwned;
                
            }
            const notOwnedBadges = {MS1: [], MS2: []};
            for(let badgeId in ownerShipObject){
                
                if(cache.badges.MS1[badgeId] && !ownerShipObject[badgeId])notOwnedBadges.MS1.push(cache.badges.MS1[badgeId]);
                else if(cache.badges.MS2[badgeId] && !ownerShipObject[badgeId])notOwnedBadges.MS2.push(cache.badges.MS2[badgeId]);
            }
    
            let amountOfUnownedBadgesBadges = notOwnedBadges.MS1.length + notOwnedBadges.MS2.length; 
            let amountOfTotalBadges = cache.badges.MS2Length + cache.badges.MS1Length;
    
            if(notOwnedBadges.MS1.length === cache.badges.MS1Length) notOwnedBadges.MS1 = ["All badges"];
            if(notOwnedBadges.MS2.length === cache.badges.MS2Length) notOwnedBadges.MS2 = ["All badges"];
    
            
            notes.push(`User owns ${amountOfTotalBadges - amountOfUnownedBadgesBadges } out of ${cache.badges.Ids.length} TSU badges.`);
            
    
            if(!ownerShipObject[2124474041] && notOwnedBadges.MS1.length > 1){
                notes.push("User deleted the MS1 welcome badge.")
                score -= 1.75;
            }
            if(!ownerShipObject[2124518225] && notOwnedBadges.MS2.length > 1){
                notes.push("User deleted the MS2 welcome badge.")
                score -= 1.75;
            }
    
            //GET RAIDER CLOTHES OWNERSHIP
            
    
            const ownedRaiderAssets = [];
    
            if(hasPublicInventory && !information.isBanned){
                
                for (let i = 0; i < raiderClothesOwnerShip.length; i++) {
                    const bool = raiderClothesOwnerShip[i];
                    const asset = raiderClothes[i];
                    if(bool)ownedRaiderAssets.push(asset)
                    
                }
    
            }
    
            
                
            //BUILD THE EMBED(s)
            let ping = Date.now() - benchMarkOne
    
            const embed = makeEmbed(`${robloxUsername}'s background check`,`Data retrieved in ${ping}ms\n Time spent in queue: ${queueTime} seconds`,server,false,"Do not completely rely on this. Use it only as a tool.");
            embed.addField(`Username:`,`${robloxUsername}`,true);
            embed.addField(`ID:`,`${id}`,true);
            embed.addField(`Profile link`,`[CLICK HERE](https://www.roblox.com/users/${id})`,true);
            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
    
            const friendsEmbed = makeEmbed(`${robloxUsername}'s suspicious friends`, ``, server);
            friendsEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let friendsEmbedSrting = [];
    
            const clothesEmbed = makeEmbed(`${robloxUsername}'s suspicious clothes`, ``, server);
            clothesEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let clothesEmbedSrtring = [];
    
            const badgesEmbed = makeEmbed(`${robloxUsername}'s badges`, ``, server);
            badgesEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            let badgesEmbedString = [];
            
    
            // STATS
            embed.addField(`Stats`,`${information.friendCount ? "*Friends: " + information.friendCount : ""}${information.followerCount ? "\n*Followers: " + information.followerCount : ""} ${information.followingCount ? "\n*Following: " + information.followingCount : ""} ${information.age ? "\n*Account age: " + information.age + " days": ""} ${information.isBanned ? "\n*Is terminated: ✅": ""}`,false);
            if(information?.friendCount > 30)score += 0.5;
            if(information?.followerCount > 30 && information?.followerCount < 1000) score +=0.5;
            if(information?.age > 300)score += 0.5; else if(information?.age > 600) score++; else if(information?.age > 900) score += 2;
            if(information?.age < 365)notes.push("Account is a bit young.")
    
            // past names
            if(information.oldNames?.length){ 
                score++;
                embed.addField("Past usernames: ", information.oldNames.join(", "));
            }
    
            //groups
            if(notableTSU.length || globalGroups.length || raiderGroups.length){
                if(notableTSU.length && !raiderGroups.length)score+=0.5;
                if(notableTSU.length > 4)score++;
                embed.addField("Groups",`${notableTSU.length ? "**The Soviet Union Groups**:\n\n"+notableTSU.join("\n")+"\n\n" : ""}${globalGroups.length ? "**Notable Groups**:\n\n"+globalGroups.join("\n")+"\n\n" : ""}${raiderGroups.length ? "**Raider Groups**:\n\n"+raiderGroups.join("\n")+"\n\n" : ""}`,false);
            }
    
            //blacklists
            if(blacklistCards.length){
                let strings = [];
                for(let obj of blacklistCards){
                    strings.push(`${obj.div}: [${obj.name}](${obj.url})   ${obj.assigner}`);
                }
                embed.addField("Blacklists",strings.join("\n"), false);
            } else score++
    
            //ex rading groups
    
            if(exRaidingGroups.length){
                
                score -= 0.5;
                if(exRaidingGroups.length > 3)score--;
                embed.addField("\u200b","**Raiding history**", false);
                exRaidingGroups.forEach(f=>embed.addField("\u200b",f.join("\n"), false));
                
                if(raiderGroups.length)notes.push("User is in a raiding group.");
                else notes.push("User is an ex-raider."); 
            } else score++;
    
            // sus friends
            if(raiderFriendsData.notes.length)notes.push(raiderFriendsData.notes);
            if(raiderFriendsData.raiderFriends.length || raiderFriendsData.susFriends.length){
                if(information?.friendCount / raiderFriendsData.raiderFriends.length < 0.3)score+=0.3;
                if(information?.friendCount / raiderFriendsData.susFriends.length < 0.4)score+=0.4;
    
                friendsEmbedSrting.push("\n**Raider friends**\n");
                friendsEmbedSrting.push(raiderFriendsData.raiderFriends.length ? raiderFriendsData.raiderFriends.join(",  ") : "-");
                friendsEmbedSrting.push("\n**ex-raider friends**\n");
                friendsEmbedSrting.push(raiderFriendsData.susFriends.length ? raiderFriendsData.susFriends.join(",  ") : "-");
                
            } else score += 1;
    
            
    
            //badges
            if(notOwnedBadges.MS1.length || notOwnedBadges.MS2.length){
                let string = [];
                badgesEmbedString.push("**Missing Badges:**\n\n")
                badgesEmbedString.push("\n**MS1:**\n");
                
                if(notOwnedBadges.MS1.length){
                    badgesEmbedString.push(notOwnedBadges.MS1.join(",    "));
                } else badgesEmbedString.push("**-**");
    
                badgesEmbedString.push("\n**MS2:**\n");
    
                if(notOwnedBadges.MS2.length){
                    badgesEmbedString.push(notOwnedBadges.MS2.join(",    "));
                } else badgesEmbedString.push("**-**");
                
                
                
            }
    
         //raider clothes
            if(hasPublicInventory){
                clothesButton.setDisabled(false);
                if(ownedRaiderAssets.length){
                    score -= 1.5;
                    if(ownedRaiderAssets.length > 20) score -= 5;
                    else if(ownedRaiderAssets.length > 10) score -= 3;
                    else if(ownedRaiderAssets.length > 5) score -= 1;
                    
                    let string = [];
                    ownedRaiderAssets.forEach(assetId=>string.push(`[asset](https://www.roblox.com/catalog/${assetId})`));
                    
                    
                    if(string.length){
                        clothesEmbedSrtring.push("**Owned raiding groups clothing**");
                        clothesEmbedSrtring.push(string.length ? string.join(", ") : "**-**");
                    }
    
                } else score += 1;
    
            } else notes.push("User has a private inventory.");
    
    
            //notes
            if(score > maxScore) score = maxScore;
            embed.addField("Score", `${score}`, true);
            notes = [...new Set(notes)]; 
            if(notes.length)embed.addField("Extra notes", notes.join("\n"), true);
            
           
            let color = score > 9 ? "32FC00" : score > 7 ? "E9FC00" : score > 5 ? "FC8900" : score > 3 ? "FC2A00" : "420000"
    
            embed.setColor(color);
            friendsEmbed.setColor(color);
            clothesEmbed.setColor(color);
            badgesEmbed.setColor(color);
            
            if(friendsEmbedSrting.length)friendsEmbed.setDescription(friendsEmbedSrting.join("\n")); else friendsButton.setDisabled(true)
            if(clothesEmbedSrtring.length)clothesEmbed.setDescription(clothesEmbedSrtring.join("\n")); else clothesButton.setDisabled(true);
            if(badgesEmbedString.length)badgesEmbed.setDescription(badgesEmbedString.join("\n"));
    
    
            const embedsObject = {
                main: embed,
                friends: friendsEmbed,
                clothes: clothesEmbed,
                badges : badgesEmbed,
                all: []
            }
            for(let i of [embed, friendsEmbed, clothesEmbed, badgesEmbed]){
                if(i.description)embedsObject.all.push(i);
            }
            
            
    
            //sending the embed
            let loggingChannel = client.channels.cache.get(loggingChannelId);
            if(loggingChannel && loggingChannel.guild.available){
                
                loggingChannel.send({embeds:embedsObject.all, content: `${loggingInfo.username} (<@${loggingInfo.DiscordId}>) has done a background check on this user:`}).then(async yes=>{
                    
                    
                    pendingMessage?.delete().catch(e=>e);
    
                    if(isSlash)message?.editReply({embeds: [embed], components: [row]});
                    let newMsg = !isSlash ? await message.reply({embeds:[embed], components: [row]}) : await message.fetchReply();
                    
                    
                    const collector = newMsg.createMessageComponentCollector({ filter: button =>  button.user.id === author.id, time:   4 * 60 * 1000 });
    
                    collector.on('collect', async i => {
                        collector.resetTimer();
    
                        mainButton.setDisabled(false)
                        if(friendsEmbedSrting.length)friendsButton.setDisabled(false);
                        if(clothesEmbedSrtring.length)clothesButton.setDisabled(false);
                        missingBadgesButton.setDisabled(false);
                        
                        
    
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
                        }
    
                        
                        
                        i.update({embeds:[embedsObject[i.customId]],  components: [row]});
                        
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
