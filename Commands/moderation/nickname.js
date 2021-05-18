
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'nick',
	description : 'Changes the nickname of the user.',
	cooldown: 1,
	usage:'!nick <user> "name"',
	whiteList:'MANAGE_NICKNAMES',
	execute(message, args, server) {
        switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed, server);
				return false;
				break;
			case "no args": 
				const embed1 = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed1, server);
				return false;		
				break;
			default:
				if(args[1]){
                	const user = message.guild.members.cache.get(checkUseres(message, args, 0));
                	const nicky = args.join(" ").slice(args[0].length + 1);

                	if(nicky !== user.nickname){
						user.setNickname(nicky)
							.then(m => {
								message.channel.send('Done.');
								return true;
							})
							.catch( e => {
								if(!Tmember.manageable){
									const embed = makeEmbed('Missing Permissions',"Try making the bot's rank above the rank you are trying to manage.", server);
									sendAndDelete(message,embed, server);
									return false;
								}else {
									const embed = makeEmbed("ERROR 104", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
									message.channel.send(embed);
									return false;
								}
							});
					}else {
						const embed = makeEmbed("Couldn't change nickname","The nickname of that user is identical to what you entered.", server);
						sendAndDelete(message,embed, server);
						return false;
					}
				} else {
					const embed2 = makeEmbed('Missing argument',this.usage, server);
					sendAndDelete(message,embed2, server);
					return false;
				}
				return true;
		}

		
	},

};
