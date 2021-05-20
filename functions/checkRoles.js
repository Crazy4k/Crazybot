module.exports = (message, args, num = 1) => {
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(message.guild.roles.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(message.mentions.roles.first()){
            return message.mentions.roles.first().id;
		}else if (isNaN(parseInt(args[num]) && args[num].length >= 2 && args[num].length <= 32)) {
			let Trole = message.guild.roles.cache.find(role => role.name === args.slice(num).join(' '));
			if(Trole === undefined)return "not valid";
			return Trole.id;

        }else if(message.mentions.everyone) {
            return "everyone";
        }else return "not useable";
    } else return "no args";
}



/*
switch (checkRoles(message, args, 1)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
					const embed = makeEmbed('invalid username',this.usage);
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