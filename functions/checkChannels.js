
/**
 * 	takes a string like <#12345678916501112> and converts it into a channel id
 * @param {object} message The message object
 * @param {object} args an array of strings that is split by space bar
 * @param {number} num index number of the args array to check for
 * @returns {string} Channel id or "not valid"
 */
module.exports = (message, args, num = 0) => {
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(message.guild.channels.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(message.mentions.channels.first()){
            return message.mentions.channels.first().id;
		}else if(args[num].toLowerCase() === "here"){
            return message.channel.id;
        
        }else return "not useable";
    } else return "no args";
}



/*
switch (checkChannels(message, args, 1)) {
			case "not valid":
			case "not useable":
				
				break;
			case "no args": 
			
				break;
			default:
				break;
		}



*/ 