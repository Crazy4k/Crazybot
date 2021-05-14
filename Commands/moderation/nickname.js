
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'nick',
	description : 'Changes the nickname of the user.',
	usage:'!nick <user> "name"',
	whiteList:'MANAGE_NICKNAMES',
	execute(message, args, server) {
        switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed, server);
				return;
				break;
			case "no args": 
				const embed1 = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed1, server);
				return;			
				break;
			default:
				if(args[1]){
                	const user = message.guild.members.cache.get(checkUseres(message, args, 0));
                	const nicky = args.join(" ").slice(args[0].length + 1);
                	if(nicky !== user.nickname){
						user.setNickname(nicky).then(s => {
							message.channel.send("Done.")
						}).catch(e => {
							
							if(!Tmember.manageable){
								message.channel.send("There was a problem.\nThis is probably because of a missing permission.");
								}else {
									const embed = makeEmbed("ERROR 104", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
									message.channel.send(embed);
							}
						});
						return;
					}else {
						const embed = makeEmbed('Missing Permissions',"I couldn't change that user's nickname.", server);
						sendAndDelete(message,embed, server);
					}

				} else {
					const embed2 = makeEmbed('Missing argument',this.usage, server);
					sendAndDelete(message,embed2, server);
				return;
				}
				break;
		}

		
	},

};
