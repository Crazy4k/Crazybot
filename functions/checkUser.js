

/**
 * 	takes a string like <@123456789101112312> and converts it into a user id
 * @param {object} message The message object
 * @param {object} args an array of strings that is split by space bar
 * @param {number} num index number of the args array to check for
 * @returns {string} user id or "not valid"
 */
module.exports = (message, args, num = 0) => {
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(message.guild.members.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(message.mentions.members.first()){
            return message.mentions.members.first().id;
        }else if(args[num] === "me") {			
			return message.author.id;
		}else if(message.mentions.everyone) {
			return "everyone";
		} else return "not useable";
		
    } else return "no args";
}

/*
const target = checkUseres(message, args, 0);
switch (target) {
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
				return true;
				break;
		}

 */