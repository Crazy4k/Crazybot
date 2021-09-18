
let {muteCache} = require("../../caches/botCache");
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../colors.json");




module.exports = {
	name : 'unmute',
	aliases: ["unshut","unstfu"],
	description : 'unmutes someone.\nCancels the !mute command',
	cooldown: 10,
	usage:'unmute <@user> ',
	whiteList:'MUTE_MEMBERS',
	category:"Moderation",
	execute(message, args, server) {

		const muteLog = message.guild.channels.cache.get(server.logs.warningLog);
		const guy = checkUseres(message,args,0);
		let reason = args.splice(1).join(" ");
		if(!reason) reason = "`No reason given`";
		switch (guy) {
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
				let hisRoles = muteCache[`${message.author.id}-${message.guild.id}`];
				const member = message.guild.members.cache.get(guy);
				if(!hisRoles){
					const embed = makeEmbed("The user isn't muted in the first place.","", server);
					sendAndDelete(message,embed, server);
					return false;
				} else {
					try {		
						const embed1 = makeEmbed("Done!",`The user <@${guy}> has been unmuted for \`${reason}\``, colors.successGreen);
                        message.channel.send({embeds:[embed1]});
						member.roles.add(hisRoles);
						member.roles.remove(server.muteRole);
						muteCache[`${message.author.id}-${message.guild.id}`] = null;
							
						const logEmbed = makeEmbed("Unmute","","00E7FE",true);
						logEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL());
						logEmbed.addFields(
							{ name: 'Unmuted: ', value: `<@${member.id}>-${member.id}`, inline:false },
							{ name: 'Unmuted by: ', value: `<@${message.author.id}>`, inline:false },
							{ name : "Reason: ", value: reason, inline:false}
						);
						if(muteLog)muteLog.send({embeds:[logEmbed]});
						
					}catch (error) {
						console.log(error);
						const embed1 = makeEmbed('Missing Permíssion',"Couldn't unmute that user because the bot can't perform that action on them", server);
						sendAndDelete(message,embed1, server);
						return false;	
					}
				}
		}








    }






}