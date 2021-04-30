module.exports = function checkUseres(message, args, num = 0) {
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(message.guild.members.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(message.mentions.members.first()){
            return message.mentions.members.first().id;
        }else if(message.mentions.everyone) {
            return "everyone";
        }else return "not useable";
    } else return "no args";
}

/*
switch (checkUseres(message, args, 0)) {
	case "not valid":
	case "everyone":	
	case "not useable":
		try {

			const embed = makeEmbed('invalid username',this.usage);
	
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			return message.delete({ timeout: faliedCommandTO });
	
		} catch (error) {
			console.error(error);
		}
		break;
	case "no args": 
		const embed = makeEmbed('Missing arguments',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			return message.delete({ timeout: faliedCommandTO });
				break;
		
	default:
        break;
}

 */