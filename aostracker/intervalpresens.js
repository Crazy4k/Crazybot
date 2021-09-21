

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
                    raiderCache[user.userId] = `${user.rootPlaceId}`;
                }
            }
            

            if(Object.values(raiderCache).length){
                for(let I in raiderCache){
                    if(raiderCache[I]){
                        let MS = "MS1"
                        if(raiderCache[I] === 4771888361 )MS = "MS2";
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);
                        let Tdr =  groups.find(e => e.Id === TDR);
                        let orderofninth = groups.find(e => e.Id === OoTNR);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing ${MS}.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        if(Tdr)embed.addField(`[TDR] The Dark Resistance`, `${Tdr.Role}`, true);
                        if(orderofninth)embed.addField(`Order of The Ninth's Revenge`, `${orderofninth.Role}`, true);
                        
                        embed.addField("Quick travel",`[${MS}](https://www.roblox.com/games/${raiderCache[I]})`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
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
                        let ping = "";
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
                
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876 ){
                    newCache[user.userId] = `${user.rootPlaceId}`;
                }
            }
           /* console.log(1);
            console.log(raiderCache);
            console.log(2);
            console.log(newCache);*/
            if(!Object.values(raiderCache).length  && Object.values(newCache).length ) {
                for(let I in newCache){
                    if(!raiderCache[I] && newCache[I]){
                        let MS = "MS1"
                        if(raiderCache[I] === 4771888361 )MS = "MS2";
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);
                        let Tdr =  groups.find(e => e.Id === TDR);
                        let orderofninth = groups.find(e => e.Id === OoTNR);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing ${MS}.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        if(Tdr)embed.addField(`[TDR] The Dark Resistance`, `${Tdr.Role}`, true);
                        if(orderofninth)embed.addField(`Order of The Ninth's Revenge`, `${orderofninth.Role}`, true);
                        
                        embed.addField("Quick travel",`[${MS}](https://www.roblox.com/games/${raiderCache[I]})`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
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
                    if(!raiderCache[I] && newCache[I]){
                        let MS = "MS1"
                        if(raiderCache[I] === 4771888361 )MS = "MS2";
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);
                        let Tdr =  groups.find(e => e.Id === TDR);
                        let orderofninth = groups.find(e => e.Id === OoTNR);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing ${MS}.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        if(Tdr)embed.addField(`[TDR] The Dark Resistance`, `${Tdr.Role}`, true);
                        if(orderofninth)embed.addField(`Order of The Ninth's Revenge`, `${orderofninth.Role}`, true);
                        
                        embed.addField("Quick travel",`[${MS}](https://www.roblox.com/games/${raiderCache[I]})`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
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
                            let MS = "MS1"
                            if(raiderCache[I] === 4771888361 )MS = "MS2";
                            const username = await roblox.getUsernameFromId(I);
                            const groups = await noblox.getGroups(I);
                            let hydra = groups.find(e=>e.Id === hydraId);
                            let TC = groups.find(e => e.Id === TCId);
                            let doj = groups.find(e => e.Id === dojId);
                            let orderOfValk = groups.find(e => e.Id === orderOfValkId);
                            let Tdr =  groups.find(e => e.Id === TDR);
                            let orderofninth = groups.find(e => e.Id === OoTNR);
    
                            const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing ${MS}.`,colors.successGreen,true);
                            embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                            if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                            if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                            if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                            if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                            if(Tdr)embed.addField(`[TDR] The Dark Resistance`, `${Tdr.Role}`, true);
                            if(orderofninth)embed.addField(`Order of The Ninth's Revenge`, `${orderofninth.Role}`, true);
                            
                            embed.addField("Quick travel",`[${MS}](https://www.roblox.com/games/${raiderCache[I]})`,true);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
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
