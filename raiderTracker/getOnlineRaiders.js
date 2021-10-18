const roblox = require('noblox.js');
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");
const Discord = require('discord.js');
let {raiderCache} = require("../caches/botCache");
let cache = require("../caches/botCache");
let gamepasses = require("./gamepasses.json");
const getRaiderPower = require("./calculategamepasses")


let gamepassIdsMS1 = [];
for (const i in gamepasses["MS1"]) gamepassIdsMS1.push(gamepasses["MS1"][i].id);
let gamepassIdsMS2 = [];
for (const i in gamepasses["MS2"]) gamepassIdsMS2.push(gamepasses["MS2"][i].id);
    
const {findAosGroups, whatPlace} = require("./functions")

//MS 2 = 4771888361
//MS 1 = 2988554876

async function createJoinEmbed(raiderCache, userId){
    let thing = raiderCache[userId].split(" ");
    let rootPlaceId = thing[0];
    let placeId = thing[1];
    let instantlink = thing[2];
    let tag = "N/A";
    const username = await roblox.getUsernameFromId(userId);
    const groups = await roblox.getGroups(userId);
    let placeString = whatPlace(placeId);
    let wtfDoICallThisVar = findAosGroups(groups, tag);
    tag = wtfDoICallThisVar[1]
    let AosGroups = wtfDoICallThisVar[0]

    let ownedGamepasses = {};
    let gamepassOwnership;
    if(rootPlaceId === "4771888361" ){
        gamepassOwnership = await Promise.all(gamepassIdsMS2.map(gamepassId => roblox.getOwnership(userId, gamepassId, "GamePass")));
        let i = 0;

        for(let gamepassName in gamepasses["MS2"]){

            ownedGamepasses[gamepassName] = gamepassOwnership[i];
            i++;
        }
    }else{
        gamepassOwnership = await Promise.all(gamepassIdsMS1.map(gamepassId => roblox.getOwnership(userId, gamepassId, "GamePass")));
        let i = 0;
        
        for(let gamepassName in gamepasses["MS1"]){

            ownedGamepasses[gamepassName] = gamepassOwnership[i];
            i++;
        }
    }

    let ownedGamepassesArray = [];
    for(let gamepass in ownedGamepasses)if(ownedGamepasses[gamepass])ownedGamepassesArray.push(gamepass);

    let raiderPower = getRaiderPower(ownedGamepassesArray);
    let raiderPowerComment = "N/A";

    if(raiderPower <= 10)raiderPowerComment = "**Extremely annoying!!!!**";
    if(raiderPower <= 8)raiderPowerComment = "Very annoying";
    if(raiderPower <= 6)raiderPowerComment = "Annoying";
    if(raiderPower <= 4)raiderPowerComment = "Average";
    if(raiderPower <= 2)raiderPowerComment = "Below average";
    
    

    const embed = makeEmbed("A raider joined Military simulator!",`[${tag}]${username} just joined ${placeString}.`,colors.successGreen,true);
    embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${userId}/profile)`)

    let grps = [];
    for(let group of AosGroups)if(group)grps.push(`**${group.Name}** (${group.Role})`);
    
    if(grps.length)embed.addField("Groups:",`${grps.join("\n")}`);
    embed.addField("Status:",`${tag}`,false);
    if(ownedGamepassesArray.length)embed.addField("Gamepasses:",`${ownedGamepassesArray.join(", ")}`,false);
    embed.addField("Raiding power",`${raiderPower} ${raiderPowerComment}`,false);
    embed.addField("Place:",`[${placeString}](https://www.roblox.com/games/${placeId})`,true);
    embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantlink})\n(Extention required:[chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc),[Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
    embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`)
    return embed;
}

module.exports = async function stalk( noblox, userIds, discordClient , channelId = null){
        
    let arrayOfChannels = [];
    for (let id in channelId) {
        let channel =  discordClient.channels.cache.get(channelId[id]);
        if(channel)arrayOfChannels.push(channel.id);
    }

    if(arrayOfChannels.length){
        let iter = userIds.length / 100;
        let data = [];
        for (let i = 0; i < iter; i++) {
            let shit = userIds;
            let poopArray = shit.slice(i * 100, i*100+100);
            let smolData = await noblox.getPresences(poopArray).catch(e=>console.log(e))
            
            data.push(...smolData.userPresences);              
        }
        

        

        if(!Object.values(raiderCache).length){
            let changes = new Discord.Collection();
            let joins = [];
            for(let user of data){
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876  || user.rootPlaceId === 4771888361){
                    raiderCache[user.userId] = `${user.rootPlaceId} ${user.placeId} placeId=${user.placeId}&gameId=${user.gameId}`;
                }
            }
            

            if(Object.values(raiderCache).length){
                for(let I in raiderCache){
                    if(raiderCache[I]){
                        
                        let embed = await createJoinEmbed(raiderCache,I)

                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        joins.push(embed);
                    }
                    
                }

            }
            if(joins.length){
                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log){
                        let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");
                        let ping = "@raider_pings";
                        if(role)ping = `<@&${role.id}>`
                        for(let e of joins){
                            log.send({content:ping,embeds:[e]}).catch(e=> console.log(e));
                        }
                    }
                    
                }

            }
            
        } else{







            let newCache = {};
            let changes = new Discord.Collection();
            let joins = [];
            let leaves = [];
            for(let user of data){
                
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876  || user.rootPlaceId === 4771888361){
                    newCache[user.userId] = `${user.rootPlaceId} ${user.placeId} placeId=${user.placeId}&gameId=${user.gameId}`;
                }
            }
            
            if(!Object.values(raiderCache).length  && Object.values(newCache).length ) {
                for(let I in newCache){
                    if(!raiderCache[I] && newCache[I]){

                        let embed = await createJoinEmbed(newCache,I)
                        
                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        joins.push(embed);
                    }
                    
                }


            } else if(Object.values(raiderCache).length && !Object.values(newCache).length ) {
                for(let I in raiderCache){
                    
                        if(raiderCache[I] && !newCache[I]){
                        const username = await roblox.getUsernameFromId(I);
                        const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        leaves.push(embed);
                        
                    }
                }
            } else if(Object.values(raiderCache).length && Object.values(newCache).length ) {
                for(let I in raiderCache){
                    if(raiderCache[I] && newCache[I] && raiderCache[I] !== newCache[I] ){

                        let embed = await createJoinEmbed(newCache,I)
                        embed.setColor(colors.changeBlue);
                        embed.setTitle("A raider switched servers!");

                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        joins.push(embed);
                    }
                    else if(!raiderCache[I] && newCache[I]){

                        let embed = await createJoinEmbed(newCache,I)
                        
                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        joins.push(embed);
                    }
                    else if(raiderCache[I] && !newCache[I]){
                        const username = await roblox.getUsernameFromId(I);
                        const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        leaves.push(embed);
                    }
                }
                for(let I in newCache){
                    if(!changes.has(`${I}-${newCache[I]}`)){
                        if(!raiderCache[I] && newCache[I]){

                           let embed = await createJoinEmbed(newCache,I)
                            changes.set(`${I}-${raiderCache[I]}`,embed);
                            joins.push(embed);

                        }
                        else if(raiderCache[I] && !newCache[I]){
                            
                            const username = await roblox.getUsernameFromId(I);
                            const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
                            changes.set(`${I}-${raiderCache[I]}`,embed);
                            leaves.push(embed);
                        }
                    }
                    
                }

            }
            raiderCache = newCache;
            cache.raiderCache = newCache;

            if(joins.length){
                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log){
                        let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");
                        let ping = "@raider_pings";
                        if(role)ping = `<@&${role.id}>`
                        for(let e of joins){
                            log.send({content:ping,embeds:[e]}).catch(e=> console.log(e));
                        }
                    }
                    
                }

            }
            if(leaves.length){
                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log){
                        for(let e of leaves){
                            log.send({embeds:[e]}).catch(e=> console.log(e));
                        }
                    }
                    
                }
            }
            raiderCache = newCache;
            cache.raiderCache = newCache;
        }


    }

        
    


}
