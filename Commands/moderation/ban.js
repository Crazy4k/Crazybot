const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let ban = new Command("ban");

ban.set({
    
	aliases         : [],
	description     : "permanently bans any one in the server. The number is to delete the last messages send by the banned user (max is 7).",
	usage           : "ban <@user or user id> [reason] [ delete messages 0-7, default is 1]",
	cooldown        : 3,
	unique          : false,
	category        : "Moderation",
	whiteList       : "BAN_MEMBERS",
	requiredPerms	: "BAN_MEMBERS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
})

ban.execute = function(message, args, server)  {
	const modLog = message.guild.channels.cache.get(server.logs.warningLog);
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

			if(target.permissions.has(this.whiteList)){
				const embed1 = makeEmbed('Could not do this action on a server moderator',``, colors.failRed);
				sendAndDelete(message,embed1, server);
				return false;
			}
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

						const logEmbed = makeEmbed("Ban",`The user <@${message.author.id}>[${message.author.id}] has banned the user <@${target.id}>[${target.id}]`,colors.failRed,true);
						logEmbed.setAuthor(target.user.tag, target.user.displayAvatarURL());
						logEmbed.addFields(
							{ name: 'Banned: ', value:`<@${target.id}>[${target.id}]`, inline:false },
							{ name: 'Banned by: ', value:`<@${message.author.id}>`, inline:false },
							{ name : "Reason: ", value: reason, inline:false}
						);
						if(modLog)modLog.send({embeds:[logEmbed]});
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
	
	
}

module.exports = ban;
