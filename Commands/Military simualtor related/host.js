const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");


const dltTime = 1000 * 60 * 60 * 2; // 2 hours
const tenMinutes = 1000 * 60 * 10; // 10 minutes


module.exports = {
	name : 'host',
	description : "Sends the host message",
    cooldown: 5,
    aliases:[],
	usage:'!host <event-type> [Supervised by] <link can be "ms1", "ms2"> [extra info]',

	execute(message, args, server) { 

        const role = server.hostRole;
        if(message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR") || message.guild.members.cache.get(message.author.id).roles.cache.has(role)){
            let eventType = args[0];
            let supervisor = checkUseres(message, args, 1);
            switch (supervisor) {
			    case "not valid":
    			case "everyone":	
	    		case "not useable":
		    		supervisor = args[1];
                    break;
    			case "no args": 
	    		    const embed2 = makeEmbed('Missing arguments',this.usage, server);
    	    		sendAndDelete(message,embed2, server);
	    	    	return false;		
				    break;
	    	}
            if(message.guild.members.cache.get(supervisor))supervisor = `<@${supervisor}>`;
            let host = message.author.id;
            let link = args[2];
            let extraInfo = args.splice(3).join(" ");
            if(!extraInfo)extraInfo = "STS once spawned | PTS is active ";
            if(link === "ms2"){ 
                link = "https://www.roblox.com/games/4771888361/SCIENTIST-Military-Simulator-2#";
            } else if(link === "ms1"){ 
                link = "https://www.roblox.com/games/2988554876/MAFIA-Military-Simulator";
            } else {
            
        }
            const hostString = `• Event type: ${eventType}\n• Hosted by: <@${host}>\n• Supervised by: ${supervisor}\n• Starts at: 20 minutes\n\n•  Link to the game: ${link} \n•  Extra information: ${extraInfo}\n @everyone `;
            message.channel.send(hostString)
                .then(m =>{
                    message.delete();
                    setTimeout(()=>{
                        if(!m.deleted){
                            m.channel.send("^^ Started.").then(mm=>mm.delete({timeout:dltTime - tenMinutes}))
                        }
                    }, tenMinutes )
                    m.delete({timeout: dltTime + 1000}).catch(e => e);
                    m.react("🗑");
                    const filter =(reaction, user) => user.id === message.author.id && reaction.emoji.name === "🗑";
                    m.awaitReactions(filter, { time: dltTime , max : 1})
                        .then(collected => m.delete().catch(e=>console.log(e)))
                        .catch(console.error);
                });
            } else return false;       
        }
};