

const roblox = require('noblox.js');
const makeEmbed = require("../functions/embed");
const colors = require("../colors.json");
const Discord = require('discord.js');

let cache = {};

let hydraId = 2981881;
let TCId = 9723651;
let dojId = 8224374;
let orderOfValkId = 10937425;

module.exports = async function stalk( noblox, userIds, discordClient ,guildId = null, channelId = null, roleID = null ){
        
        
    let log =  discordClient.guilds.cache.get(guildId).channels.cache.get(channelId);

    if(log){
        let iter = userIds.length / 100;
        let data = [];
        for (let i = 0; i < iter; i++) {
            let shit = userIds;
            let poopArray = shit.slice(i * 100, i*100+100);
            let smolData = await noblox.getPresences(poopArray); 
            
            data.push(...smolData.userPresences);              
        }
        

        

        if(!Object.values(cache).length){
            let changes = new Discord.Collection();
            let joins = [];
            for(let user of data){
                
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876 ){
                    cache[user.userId] = `${user.rootPlaceId}`;
                }
            }
            

            if(Object.values(cache).length){
                for(let I in cache){
                    if(cache[I]){
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing MS1.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        
                        embed.addField("Quick travel",`[Link](https://www.roblox.com/games/2988554876)`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${cache[I]}`,embed);
                        joins.push(embed);
                    }
                    
                }

            }
            if(joins.length){
                if(log){
                    
                    for(let e of joins){
                        log.send({content:`<@&${roleID}>`,embeds:[e]})
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
            console.log(1);
            console.log(cache);
            console.log(2);
            console.log(newCache);
            //if(0 && 1)
            if(!Object.values(cache).length  && Object.values(newCache).length ) {
                for(let I in newCache){
                    if(!cache[I] && newCache[I]){
                            
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing MS1.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        
                        embed.addField("Quick travel",`[Link](https://www.roblox.com/games/2988554876)`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${cache[I]}`,embed);
                        joins.push(embed);
                    }
                    
                }


            } else if(Object.values(cache).length && !Object.values(newCache).length ) {
                for(let I in cache){
                        if(cache[I] && !newCache[I]){
                        const username = await roblox.getUsernameFromId(I);
                        const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${cache[I]}`,embed);
                        leaves.push(embed);
                    }
                }
            } else if(Object.values(cache).length && Object.values(newCache).length ) {
                for(let I in cache){
                    if(!cache[I] && newCache[I]){
                            
                        const username = await roblox.getUsernameFromId(I);
                        const groups = await noblox.getGroups(I);
                        let hydra = groups.find(e=>e.Id === hydraId);
                        let TC = groups.find(e => e.Id === TCId);
                        let doj = groups.find(e => e.Id === dojId);
                        let orderOfValk = groups.find(e => e.Id === orderOfValkId);

                        const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing MS1.`,colors.successGreen,true);
                        embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                        if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                        if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                        if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                        if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                        
                        embed.addField("Quick travel",`[Link](https://www.roblox.com/games/2988554876)`,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${cache[I]}`,embed);
                        joins.push(embed);
                    }
                    else if(cache[I] && !newCache[I]){
                        const username = await roblox.getUsernameFromId(I);
                        const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                        
                        changes.set(`${I}-${cache[I]}`,embed);
                        leaves.push(embed);
                    }
                }
                for(let I in newCache){
                    if(!changes.has(`${I}-${newCache[I]}`)){
                        if(!cache[I] && newCache[I]){
                            
                            const username = await roblox.getUsernameFromId(I);
                            const groups = await noblox.getGroups(I);
                            let hydra = groups.find(e=>e.Id === hydraId);
                            let TC = groups.find(e => e.Id === TCId);
                            let doj = groups.find(e => e.Id === dojId);
                            let orderOfValk = groups.find(e => e.Id === orderOfValkId);
    
                            const embed = makeEmbed("A raider joined Military simulator!",`${username} is now playing MS1.`,colors.successGreen,true);
                            embed.addField("Profile link:",`[${username}](https://www.roblox.com/users/${I}/profile)`)
                            if(hydra)embed.addField(`Hydra International`,`${hydra.Role}` ,true);
                            if(TC)embed.addField(`[TC] The Commandos`, `${TC.Role}`, true);
                            if(doj)embed.addField(`[DoJ] Department of Justice`, `${doj.Role}`, true);
                            if(orderOfValk)embed.addField(`Οrder of the Valkyrie`, `${orderOfValk.Role}`, true);
                            
                            embed.addField("Quick travel",`[Link](https://www.roblox.com/games/2988554876)`,true);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
                            changes.set(`${I}-${cache[I]}`,embed);
                            joins.push(embed);

                        }
                        else if(cache[I] && !newCache[I]){
                            const username = await roblox.getUsernameFromId(I);
                            const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
                            changes.set(`${I}-${cache[I]}`,embed);
                            leaves.push(embed);
                        }
                    }
                    
                }

            }
            cache = newCache;

            if(joins.length){
                if(log){
                    for(let e of joins){
                        log.send({content:`<@&${roleID}>`,embeds:[e]})
                    }
                }

            }
            if(leaves.length){
                if(log){
                    for(let e of leaves){
                        log.send({embeds:[e]})
                    }
                }

            }
            cache = newCache;
        }


    }

        
    


}
