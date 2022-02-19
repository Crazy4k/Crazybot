const roblox = require('noblox.js');//noblox.js
const makeEmbed = require("../functions/embed");// a function that creats embeds
const colors = require("../config/colors.json");//colors.... 
const Discord = require('discord.js');//Discord.js
let {raiderCache, trackedMassRaids} = require("../caches/botCache");//an empty object that stores who is in-game
let cache = require("../caches/botCache");//an object of objects that can be read from different files. same as above
let gamepasses = require("./gamepasses.json");//a list of gamepasses and how strong they are
const getRaiderPower = require("./calculategamepasses") //a function that calculates the sum of gamepasses
const {findAosGroups, whatPlace} = require("./functions")//other functions
const pickRandom = require("../functions/pickRandom")//RNG
const pictureLinks = require("./pictures.json");

let gamepassIdsMS1 = [];
for (const i in gamepasses["MS1"]) gamepassIdsMS1.push(gamepasses["MS1"][i].id);
let gamepassIdsMS2 = [];
for (const i in gamepasses["MS2"]) gamepassIdsMS2.push(gamepasses["MS2"][i].id);//split the gamepasses from the gamepasses.json file into 2 catefogies. ms1 and 2
    

//MS 2 = 4771888361
//MS 1 = 2988554876

async function createJoinEmbed(raiderCache, userId){//this function uses all the data given to it to create the embed to send and returns it (skip to line 87)
    let cacheDataArray = raiderCache[userId].split(" ");//split the string in the cache with a space 
    let rootPlaceId = cacheDataArray[0];//root place id (border)
    let placeId = cacheDataArray[1];// place id (border, city, place, apartments)
    let instantlink = cacheDataArray[2];// link used by the extension 
    let tag = "N/A";//if the user isn't in a kos/aos group then his status is N/A
    const username = await roblox.getUsernameFromId(userId).catch(e=>console.log(e));//get his username
    const groups = await roblox.getGroups(userId).catch(e=>console.log(e));//get his groups
    let placeString = whatPlace(placeId);//use the whatPlace() function to determine where the user is (border,city, etc..)
    let raiderStatus = findAosGroups(groups, tag);//this returns the user status (kos aos) and group
    tag = raiderStatus[1]
    let AosGroups = raiderStatus[0]

    let ownedGamepasses = {};
    let gamepassOwnership;
    if(rootPlaceId === "4771888361" ){//if he is in ms1, get ms1 gamepasses else ms2
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
    embed.addField("Joined at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);
    embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantlink})\n(Extention required:[chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc),[Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
    embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`)
    return embed;
}

module.exports = async function stalk( noblox, userIds, discordClient , trackerChannelIds, raidsChannelIds = trackerChannelIds){// this function will look for the online players and send message notifying that they're online
    //noblox = noblox
    //userIds = an array of roblox player ids to check the Presences of
    //discordClient = the disord client object
    // an array of discord channel ids to send message in
        
    let arrayOfChannels = [];
    let arrayOfOtherChannels = [];
    for (let id in trackerChannelIds) {//this will itererate through trackerChannelIds whether it was an object or array
        let channel =  discordClient.channels.cache.get(trackerChannelIds[id]);//if the channel exists,
        if(channel)arrayOfChannels.push(channel.id);//push it to the arrayOfChannels array which is the the one including the valid ones
    }
    for (let id in raidsChannelIds) {
        let channel =  discordClient.channels.cache.get(raidsChannelIds[id]);
        if(channel)arrayOfOtherChannels.push(channel.id);
    }

    if(arrayOfChannels.length){//if there is at least 1 valid channel id

        let iter = userIds.length / 100;
        let data = [];
        for (let i = 0; i < iter; i++) {
            let shit = userIds;
            let poopArray = shit.slice(i * 100, i*100+100);
            let smolData = await noblox.getPresences(poopArray).catch(e=>console.log(e))
            if(!smolData)return;
            data.push(...smolData.userPresences);         
        }//this part is a bit messy, but what it does is that it uses noblox.getPresences() around 18 times and pushes the returned data them into the (data) array
        //this part is the most important and if it fails, the whole thing fails
        

        
        /*there are roughly 4 if statements like this one where they check how many properties are in the (raiderCache) object.
        This is to determine whether or not this is the first time running the tracker or if there is no one online  
        
        if(no users are in the cache before){
            filter(ms1,ms2)bla bla bla
            make embeds that new users joined
            send the embed
        } else if(there are already users in the cache before){
            make a new object with the newly fetched users
            filter ms1 and ms2

            if(the old cache has no users(empty) and the new one has new users){
                find the difference(loop through the 2 objects and if a property doesnt exist in the old object, then a user joined. If the property doesnt exist in the new object, then a user left)
            }
        }
        
        */
        if(!Object.values(raiderCache).length){
            let changes = new Discord.Collection();
            let joins = [];
            for(let user of data){
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876  || user.rootPlaceId === 4771888361){
                    raiderCache[user.userId] = `${user.rootPlaceId} ${user.placeId} placeId=${user.placeId}&gameId=${user.gameId}`;//This is how data is stored in the caches: cache = {"userId" :`${rootplaceId} ${placeId} ${link for the quick join feature}` <= separated by a space
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
                let iter = joins.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = joins;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }

                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);//check again if the channel is deleted or something then send the embed in it

                    if(log && log.guild.available){//if the log channel is defined (exists)
                        let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");//look for a role called "@raider_pings"
                        let ping = "@raider_pings";//if the role doesn't exist, it only says @raider_pings in the message to give a hint to the user that the role can be created
                        if(role)ping = `<@&${role.id}>`//if the role does exist, ping it instead

                        for(let embedsArray of embeds){
                            log.send({content:ping,embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
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
                
                if(user.userPresenceType === 2 && user.rootPlaceId === 2988554876  || user.rootPlaceId === 4771888361){//user.userPresenceType === 2 means a user is playing a game and these 2 ids are MS 1 and 2
                    newCache[user.userId] = `${user.rootPlaceId} ${user.placeId} placeId=${user.placeId}&gameId=${user.gameId}`;
                }
            }
            
            
            if(!Object.values(raiderCache).length  && Object.values(newCache).length ) {
                for(let I in newCache){
                    if(!raiderCache[I] && newCache[I]){

                        let embed = await createJoinEmbed(newCache,I)//the function i talked about earlier
                        
                        changes.set(`${I}-${raiderCache[I]}`,embed);
                        joins.push(embed);
                    }
                    
                }


            } else if(Object.values(raiderCache).length && !Object.values(newCache).length ) {
                for(let I in raiderCache){
                        if(raiderCache[I] && !newCache[I]){
                            let isValid = 1;
                            const username = await roblox.getUsernameFromId(I).catch(err=>isValid = 0);
                            if(!isValid)continue;
                            const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
                            changes.set(`${I}-${raiderCache[I]}`,embed);
                            leaves.push(embed);
                        
                    }
                }
            } else if(Object.values(raiderCache).length && Object.values(newCache).length ) {//comparing the (raiderCache) aka old object with (newCache) aka the new object
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
                        let username;
                        username = await roblox.getUsernameFromId(I).catch(e=>username = "/")
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
                            
                            let username;
                            username = await roblox.getUsernameFromId(I).catch(e=>username = "/")
                            const embed = makeEmbed("A raider  left MS!",`${username} just left the game.`,colors.failRed,true);
                            embed.addField("Left at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);
                            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${I}&width=420&height=420&format=png`)
                            
                            changes.set(`${I}-${raiderCache[I]}`,embed);
                            leaves.push(embed);
                        }
                    }
                    
                }

            }
            raiderCache = newCache;//assign the new cache object to the old one
            cache.raiderCache = newCache;//assign it to the bot's cache so that it can be read again later in the next iteration or in other commands

            if(joins.length){
                
                let iter = joins.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = joins;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }
                
                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log && log.guild.available){
                        
                        let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");
                        let ping = "@raider_pings";
                        if(role)ping = `<@&${role.id}>`

                        for(let embedsArray of embeds){
                            log.send({content:ping,embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                        }
                    }
                    
                }

            }
            if(leaves.length){

                let iter = leaves.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = leaves;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }

                for(let id of arrayOfChannels){
                    let log = discordClient.channels.cache.get(id);
                    if(log && log.guild.available){
                        
                        for(let embedsArray of embeds){
                            log.send({embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                        }
                    }
                    
                }
            }
            raiderCache = newCache;//do it again cuz why not
            cache.raiderCache = newCache;

            let priorities = [12, 10 , 8, 5];
            if(Object.values(raiderCache).length > 0){//This is the "big raids detector" is check if there are a lot of people in the same server
                let differentServers = {};
                for(let i in raiderCache){
                    let cacheDataArray = raiderCache[i].split(" ");
                    
                    let instantlink = cacheDataArray[2];
                    if(differentServers[instantlink] === undefined  || differentServers[instantlink] === null)differentServers[instantlink] = 0;
                    differentServers[instantlink]++;
                }
                
                for(let instantLink in differentServers){
                    
                    let property = differentServers[instantLink];
                    if(property >= 3){
                        let placeId = instantLink.split("&")[0].replace("placeId=","");
                        let place = whatPlace(placeId);

                        if(trackedMassRaids[instantLink])return;
                        trackedMassRaids[instantLink] = property;
                        
                        let severity = property >= 12 ? "**EXTREMELY HIGH**" : property >= 10 ? "**Very high**" : property >= 8 ? "High" : property >= 5 ? "Dangerous" : "Normal";


                        const embed = makeEmbed("⚠ Big raid detected ⚠",`There is a big raid going on in ${place}! They need your help!!`,colors.orange);
                        embed.addField("Amount of raiders:",`${property}`,true);
                        embed.addField("severity",severity,true);
                        embed.addField("Place",`[${place}](https://www.roblox.com/games/${placeId})`)
                        embed.addField("Detected at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);
                        embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantLink})\n(Extention required:[chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc),[Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
                        embed.setImage(pickRandom(pictureLinks[place]));


                    
                        for(let id of arrayOfOtherChannels){
                            let log = discordClient.channels.cache.get(id);
                            if(log && log.guild.available){
                                let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");
                                let ping = "@raider_pings";
                                if(role)ping = `<@&${role.id}>`
                                log.send({content:ping,embeds:[embed]}).catch(e=> console.log(e));
                            }
                            
                        }
                        

                    } else  if(property <= 1 && trackedMassRaids[instantLink] > 1){
                        
                        
                        let placeId = instantLink.split("&")[0].replace("placeId=","");
                        let place = whatPlace(placeId);

                        const embed = makeEmbed(`The Big ${place} raid has cooled down`,`All of the raiders left the ${place} server`,colors.failRed);
                        embed.addField("Last amount of raider recorded",`${property}`,true);
                        embed.addField("Ended at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);

                        delete trackedMassRaids[instantLink]
                        cache.trackedMassRaids = trackedMassRaids;

                        for(let id of arrayOfOtherChannels){
                        let log = discordClient.channels.cache.get(id);
                        if(log && log.guild.available){
                            
                            log.send({embeds:[embed]}).catch(e=> console.log(e));
                            
                        }
                       }
                        

                    } if(priorities.includes(property) && property > trackedMassRaids[instantLink]){
                        let placeId = instantLink.split("&")[0].replace("placeId=","");
                        let place = whatPlace(placeId);

                        trackedMassRaids[instantLink] = property;
                        
                        let severity = property >= 12 ? "**EXTREMELY HIGH**" : property >= 10 ? "**Very high**" : property >= 8 ? "High" : property >= 5 ? "Dangerous" : "Normal";


                        const embed = makeEmbed("⚠ Severity increased ⚠",`There are more people joining the ${place} raid!`,colors.changeBlue);
                        embed.addField("Amount of raiders:",`${property}`,true);
                        embed.addField("severity",severity, true);
                        embed.addField("Place",`[${place}](https://www.roblox.com/games/${placeId})`)
                        embed.addField("**Instant travel:**",`[join instantly](https://www.roblox.com/home?${instantLink})\n(Extention required:[chrome](https://chrome.google.com/webstore/detail/roblox-url-launcher/lcefjaknjehbafdeacjbjnfpfldjdlcc),[Firefox](https://addons.mozilla.org/en-US/android/addon/roblox-url-launcher/))`,true);
                        embed.setImage(pickRandom(pictureLinks[place]));



                        for(let id of arrayOfOtherChannels){
                            let log = discordClient.channels.cache.get(id);
                            if(log && log.guild.available){
                                let role = log.guild.roles.cache.find(e=>e.name === "raider_pings");
                                let ping = "@raider_pings";
                                if(role)ping = `<@&${role.id}>`
                                log.send({content:ping,embeds:[embed]}).catch(e=> console.log(e));
                            }
                            
                        }
                    }
                }
                
                for(let instantLink in trackedMassRaids){

                    if(trackedMassRaids[instantLink] && !differentServers[instantLink]){

                        

                        let placeId = instantLink.split("&")[0].replace("placeId=","");
                        let place = whatPlace(placeId);

                        const embed = makeEmbed(`The Big ${place} raid has cooled down`,`All of the raiders left the ${place} server`,colors.failRed);
                        embed.addField("Last amount of raider recorded",`${trackedMassRaids[instantLink]}`,true);
                        embed.addField("Ended  at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);


                        for(let id of arrayOfOtherChannels){
                            
                            let log = discordClient.channels.cache.get(id);
                            if(log && log.guild.available)log.send({embeds:[embed]}).catch(e=> console.log(e));   
                        }

                       delete trackedMassRaids[instantLink];
                    }

                }
                cache.trackedMassRaids = trackedMassRaids;

            } else if(Object.values(trackedMassRaids).length){
                for(let instantLink in trackedMassRaids){
                    if(trackedMassRaids[instantLink] <= 1){
                        
                        let link = instantLink;
                        let placeId = instantLink.split("&")[0].replace("placeId=","");
                        let place = whatPlace(placeId);

                        const embed = makeEmbed(`The Big ${place} raid has cooled down`,`All of the raiders left the ${place} server`,colors.failRed);
                        embed.addField("Last amount of raider recorded",`${trackedMassRaids[link]}`,true);
                        embed.addField("Ended  at:",`<t:${parseInt(Date.now() / 1000)}:T> or <t:${parseInt(Date.now() / 1000)}:R>`);

                        delete trackedMassRaids[link];
                        

                        for(let id of arrayOfOtherChannels){
                        let log = discordClient.channels.cache.get(id);
                        if(log && log.guild.available){
                            
                            log.send({embeds:[embed]}).catch(e=> console.log(e));
                            
                        }
                       }

                    }
                }
                cache.trackedMassRaids = trackedMassRaids;

            }

        }


    }

        
    


}
/* If you want to copy this or change it in a way, here's how:
1. copy this entire folder into your bot
2. ./raiderGroups.json are the tracked groups, you can change it
3. getMember.js is a very important function that gets the userIds of the members of a group
4. paste this into your index.js:

(async () => {
	try {
		

		let trackedRaiders = [Roblox Id to "track"]
		let channels = [Discord channel ids....]
	
		setInterval(async () => {
			try {
				await trackRaiders( noblox, trackedRaiders, client, channels)	
			} catch (error) {
				console.log("error in the raider tracker")
				console.log(console.log(error));
			}
			
		}, 180 * 1000);


	} catch (error) {
		console.log(error)
		console.log("line 477")
	}

	
})()








*/ 