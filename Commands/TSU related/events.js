const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const eventsCache = require("../../caches/eventsCache");





module.exports = {
	name : 'events',
	description : "Shows you the current hosted events that were hosted using the `;host` command.",
    cooldown: 5,
    aliases:["event", "hosted"],
    category:"ms",
	usage:'events',

	execute(message, args, server) { 
        console.log(eventsCache);


        if(eventsCache[message.guild.id]){
            let cache = eventsCache[message.guild.id];
            const embed = makeEmbed("Current events.","These are the current events that are being hosted.", server);
            
            
            let shittyNumber = 1;
            for( let e of cache){
                let shit = e.split(/ +/);
                embed.addField(`${shittyNumber}-event:`, `**Event name**: ${shit[0]}\n **Hosted in**: <#${shit[1]}>\n **Hosted by**: <@${shit[3]}>\n **Status**: ${shit[2]}\n **Link to the event**: [Quick travel](${shit[4]})`);
                shittyNumber++;
            }
            message.channel.send({embeds: [embed]});
            return true;
        
        } else {
            const embed = makeEmbed("No events.","These are current no events being hosted at the moment.", server);
            message.channel.send({embeds: [embed]});
            return true;

        }
        

        



    }
};