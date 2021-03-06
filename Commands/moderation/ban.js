const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'ban',
	description : 'permanently bans any one in the server. The number is to delete the last messages send by the banned user (max is 7).',
	usage:'ban <@user or user id> [reason] [ delete messages 0-7, default is 1]',
	whiteList:'BAN_MEMBERS',
	cooldown: 3,
	category:"Moderation",
	execute(message, args, server) {

		let id = checkUseres(message,args,0);
		switch (id) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed1, server);
				return false;
				break;
			case "no args": 
				const embed = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed, server );
				return false;
				break;
			default:
				const target = message.guild.members.cache.get(id);

				let copyOfArgs = [...args];

				let time = 1;
				let popped = copyOfArgs.pop()
				if(parseInt(popped))time = parseInt(popped); 
				else{
					time = 1;
					copyOfArgs.push(popped);
				}
				if(time > 7){
					const embed = makeEmbed('Invaild value',"Time must be between 0 and 7.", server);
					sendAndDelete(message,embed, server );
					return false;
				}
				

				let reason = `No reason given by ${message.author.tag}`;
				if(copyOfArgs[1]) reason = copyOfArgs.slice(1).join(' ');

				if(!isNaN(time)) {
					try {
						
						target.ban({ reason: reason, days:time })

						.then(a=>{
							const embed = makeEmbed("User banned.",`The user <@${target.id}> has been banned for \n\`${reason}\`\nAnd deleted messages sent by the uses in the last \`${time}\` days.`,"29C200",);
							message.channel.send({embeds:[embed]});
							return true;
						}).catch(e => {
							
							if(!target.bannable) {
								const embed = makeEmbed('Missing Permission',"The bot can't ban that user.", server);
								sendAndDelete(message,embed, server );
								return false;
					
							}
						})
					} catch(error) {
						
						const embed = makeEmbed('Missing Permission',"The bot can't ban that user.", server);
						sendAndDelete(message,embed, server );
						console.log(error);
						return false;
					}

			}
			break;
		}
		
		
	},

};
