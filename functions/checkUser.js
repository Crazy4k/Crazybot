module.exports = function checkUseres(message, args, num = 0) {
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
switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
					const embed = makeEmbed('invalid username',this.usage, server);
					sendAndDelete(message,embed, server);
					return;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
			try {

				const embed = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed, server);
				return;

			} catch (error) {
				console.error(error);
			}
				break;
			default:
				break;
		}

 */