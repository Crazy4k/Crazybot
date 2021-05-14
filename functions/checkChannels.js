module.exports = function checkChannels(message, args, num = 0) {
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
				try {
					const embed = makeEmbed('invalid Channel',this.usage);
					sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
					return;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
			try {

				const embed = makeEmbed('Missing arguments',this.usage);
				sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
				return;

			} catch (error) {
				console.error(error);
			}
				break;
			default:
				break;
		}



*/ 