const makeEmbed = require('../../functions/embed.js');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../colors.json");

module.exports = {
	name : 'kick',
	description : 'kicks a user from the servers.',
	usage:'kick <@user or user id> [reason]',
	whiteList:'KICK_MEMBERS',
	cooldown: 3,
	category:"Moderation",
	execute(message, args, server) {

		const modLog = message.guild.channels.cache.get(server.logs.warningLog);
		let id = checkUseres(message,args,0);
		switch (id) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed1, server );
				return false;	
				break;
			case "no args": 
				const embed2 = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message, embed2, server );
				return false;	
				break;
			default:

				const target = message.guild.members.cache.get(id);
				let reason = args.slice(1).join(' ');
				if(!reason)reason = "No reason given.";

				 if(!target.kickable){
					const embed = makeEmbed('Missing Permissions',"The bot couldn't kick that user.", server);
					sendAndDelete(message,embed, server);
					return false;
				}else {
					target.kick({ reason:reason })
						.then( e => {
							const embed = makeEmbed("User kicked.",`The user <@${target.id}> has been kicked for \n\`${reason}\`.`,"29C200",);
							message.channel.send({embeds:[embed]});

							const logEmbed = makeEmbed("Kick",`The user <@${message.author.id}>[${message.author.id}] has kicked the user <@${target.id}>[${target.id}]`,colors.failRed,true);
							logEmbed.setAuthor(target.user.tag, target.user.displayAvatarURL());
							logEmbed.addFields(
								{ name: 'Kicked: ', value:`<@${target.id}>[${target.id}]`, inline:false },
								{ name: 'Kicked by: ', value:`<@${message.author.id}>`, inline:false },
								{ name : "Reason: ", value: reason, inline:false}
							);
							if(modLog)modLog.send({embeds:[logEmbed]});
							return true;
						})
						.catch(e =>{ console.log(e)}); 
						return true;
					}
		}
	},

};