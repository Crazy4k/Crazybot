

const roblox = require('noblox.js');
const makeEmbed = require("../functions/embed");
const colors = require("../colors.json");
const Discord = require('discord.js');
let {raiderCache} = require("../caches/botCache");
let cache = require("../caches/botCache");

let hydraId = 2981881;
let TCId = 9723651;
let dojId = 8224374;
let orderOfValkId = 10937425;
let TDR = 8675204;
let OoTNR = 7033913;

//MS 2 = 4771888361
//MS 1 = 2988554876

//MS1 BORDER = 2988554876
//MS1 CITY = 3145176353
//MS1 APARTMENTS = 4454445210
//MS1 PALACE = 4146579025
//MS2 BORDER = 4771888361
//MS2 CITY = 5103000243
function whatPlace( id){
    let str = ""
    switch (id) {
        
        case "2988554876":
            str = "MS1 border"
            break;
        case "3145176353":
            str = "MS1 City"
            break;
        case "4454445210":
            str = "MS1 Apartments"
            break;
        case "4146579025":
            str = "MS1 Palace"
            break;
        case "4771888361":
            str = "MS2 border"
            break;
        case "5103000243":
            str = "MS2 city"
            break;
    
        default:
            str = "Unknown"
            break;
    }
    return str;

}
function splitId(string){
    return string.split(" ");
}
function findAosGroups (groups){

    let hydra = groups.find(e=>e.Id === hydraId);
    let TC = groups.find(e => e.Id === TCId);
    let doj = groups.find(e => e.Id === dojId);
    let orderOfValk = groups.find(e => e.Id === orderOfValkId);
    let Tdr =  groups.find(e => e.Id === TDR);
    let orderofninth = groups.find(e => e.Id === OoTNR);

    let cleanArry = [];
    if(hydra)cleanArry.push(hydra);
    if(TC)cleanArry.push(TC);
    if(doj)cleanArry.push(doj);
    if(orderOfValk)cleanArry.push(orderOfValk);
    if(Tdr)cleanArry.push(Tdr);
    if(orderofninth)cleanArry.push(orderofninth);

    return cleanArry;
    
}
async function createJoinEmbed(raiderCache, I,){
    let thing = splitId(raiderCache[I]);
    let rootPlaceId = thing[0];
    let placeId = thing[1];
    let instantlink = thing[2];
    let MS = "MS1"
    if(rootPlaceId === "4771888361" )MS = "MS2";
    const username = await roblox.getUsernameFromId(I);
    const groups = await roblox.getGroups(I);
    let placeString = whatPlace(placeId);
    let AosGroups =findAosGroups(groups);
    

    const embed = makeEmbed("A raider joined Military simulator!",`${username} just joined ${placeString}.`,colors.successGreen,true);
    embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
    for(let group of AosGroups){
        if(group)embed.addField(`${group.Name}`,`${group.Role}` ,true);
    }
    

    embed.addField("Game:",`[${MS}](https://www.roblox.com/games/${rootPlaceId})`,false);
    embed.addField("Place link:",`[${placeString}](https://www.roblox.com/games/${placeId})`,true);
    embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantlink})\n(Kurka's extention required: [chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc) [Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
    embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
    return embed;
}

module.exports = async function stalk( noblox, userIds, discordClient , channelId = null){
        
    let arrayOfChannels = [];
    for (let id of channelId) {
        let channel =  discordClient.channels.cache.get(id);
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
                            log.send({content:ping,embeds:[e]})
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
            
           /* console.log(1);
            console.log(raiderCache);
            console.log(2);
            console.log(newCache);*/
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
                        let thing = splitId(newCache[I]);
                        let rootPlaceId = thing[0];
                        let placeId = thing[1];
                        let instantlink = thing[2];
                        let MS = "MS1"
                        if(rootPlaceId === 4771888361 )MS = "MS2";
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await roblox.getGroups(I);
                    
                        let AosGroups =findAosGroups(groups);
                        
                    
                        const embed = makeEmbed("A raider switched servers!",`${username} is now playing ${MS}.`,colors.changeBlue,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        for(let group of AosGroups){
                            if(group)embed.addField(`${group.Name}`,`${group.Role}` ,true);
                        }
                        let placeString = whatPlace(placeId);
                    
                        embed.addField("Game:",`[${MS}](https://www.roblox.com/games/${rootPlaceId})`,false);
                        embed.addField("Place link:",`[${placeString}](https://www.roblox.com/games/${placeId})`,true);
                        embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantlink})\n(Kurka's extention required: [chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc) [Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)

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
                        let ping = "";
                        if(role)ping = `<@&${role.id}>`
                        for(let e of joins){
                            log.send({content:ping,embeds:[e]})
                        }
                    }
                    
                }

            }
            if(leaves.length){
                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log){
                        for(let e of leaves){
                            log.send({embeds:[e]})
                        }
                    }
                    
                }
            }
            raiderCache = newCache;
            cache.raiderCache = newCache;
        }


    }

        
    


}
