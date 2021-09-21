const makeEmbed = require("../../functions/embed");
const botCache = require("../../caches/botCache");
const noblox = require("noblox.js");




module.exports = {
	name : 'raiders',
	description : "Shows you the current trackalbe raiders that are playing MS.",
    cooldown: 5,
    aliases:["trackraiders"],
    category:"ms",
	usage:'events',
    
	async execute(message, args, server) { 

        if(Object.values(botCache.raiderCache).length){

            const embed = makeEmbed("Raider tracker.","", server);
            
            
            let shittyStr = [];
            for( let e in botCache.raiderCache){
                let shit = botCache.raiderCache[e];
                
                if(shit){
                    let name = await noblox.getUsernameFromId(e)
                    shittyStr.push(`[${name}](https://www.roblox.com/users/${e}/profile) is playing [MS](https://www.roblox.com/games/${shit}).`);
                }

            }
            if(shittyStr.length){
                embed.setDescription(`**These are the trackable raiders that are playing MS right now.**\n\n${shittyStr.join("\n")}`);
                message.channel.send({embeds: [embed]});
                return true;
            }else {
                const embed = makeEmbed("No raiders.","These are currently no trackable raiders playing ms.", server);
                message.channel.send({embeds: [embed]});
                return true;
            }
            
        
        } else {
            const embed = makeEmbed("No raiders.","These are currently no trackable raiders playing ms.", server);
            message.channel.send({embeds: [embed]});
            return true;

        }
        

        



    }
};