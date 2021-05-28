const fs = require("fs");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");

const checkUseres = (message, arg) => {
    if(arg) {
        if(!isNaN(parseInt(arg)) && arg.length >= 17){
            if(message.guild.members.cache.get(arg)) {
                return arg;
            } else return "not valid";
            
        } else if(arg === "me") {			
			return message.author.id;
		}else if(message.mentions.members.first()){
            let id = arg.slice(3, arg.length-1);
            return message.mentions.members.get(id).id;
        }else if(message.mentions.everyone) {
            return "everyone";
        } else return "not useable";
    } else return "no args";
}

module.exports = {
	name : 'points-remove',
	description : "Removes points from a user in a server.",
    aliases:["p-remove","p-","points-","points-delete","p-delete"],
    cooldown: 60 * 1,
	usage:'!points-remove <@user> [@user2] [@user3]... <number>',
    whiteList:'ADMINISTRATOR',
	execute(message, args, server) { 
        
        
        fs.readFile("./Commands/points/points.json", (err,response) =>{
            if(err){
                console.log(err);
                return false;
            }
            if(!args.length){
                const embed2 = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message,embed2, server);
                return false;
            }
            const readableRespnse = JSON.parse(response);
            const pointsToGive= args[args.length - 1];
            
            let humans = [];
            
            if(!parseInt(pointsToGive)){
                const embed1 = makeEmbed('Last argument must be a number.',this.usage, server);
                sendAndDelete(message,embed1, server);
                return false;
            }
            
            let bruh = [...args];
            
            const people = bruh.splice(0,args.length-1);
            
            
            for(let it = 0; it < people.length; it++ ){
                const persona = checkUseres(message, people[it]);
                switch (persona) {
                    case "not valid":
                    case "everyone":	
                    case "not useable":
                        
                        const embed1 = makeEmbed('invalid username',this.usage, server);
                        sendAndDelete(message,embed1, server);
                        return false;
                        break;

                    case "no args": 

                        const embed2 = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message,embed2, server);
                        return false;		
                        break;

                    default:
                        if(!humans.includes(persona))humans.push(persona);
                }
            }     

            for(let servery of readableRespnse){               
                if(servery.guildID === message.guild.id){
                           
                    if(message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR") || message.guild.members.cache.get(message.author.id).roles.cache.has(servery.whiteListedRole)){
                    for(let e of humans){
                        servery.members[e] -= parseInt(pointsToGive);
                    }
                    if(server.pointsEnabled){
                        fs.writeFile("./Commands/points/points.json", JSON.stringify(readableRespnse, null, 2), err => {
                            if(err){
                                console.log(err);
                                return false;
                            }else  {
                                const variable = makeEmbed("points Removed ✅",`Removed ${pointsToGive} points from <@${humans[0]}>`, server);
                                if(humans.length === 1) variable.setDescription(`Removed ${pointsToGive} points from <@${humans[0]}>`);
                                else variable.setDescription(`Removed ${pointsToGive} points from <@${humans[0]}> and other people`);
                                message.channel.send(variable);
                                return true;                  

                            }
                            return true;
                        });
                        return true;
                    } else{
                        const embed =makeEmbed(`Your server points plugin isn't active yet.`,`Do "${server.prefix}points-enable" Instead.`, server)
                        sendAndDelete(message, embed, server);
                        return false;
                    }
                } else return false;
                }
            } return true;
        });
        return false;
            
        
		
	},

};
