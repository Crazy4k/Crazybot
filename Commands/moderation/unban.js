
const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let unban = new Command("unban");

unban.set({
	aliases         : ["remove-ban","ban-remove","ban-"],
	description     : "Unbans a user who was banned before (id is used)",
	usage           : "Unban <user ID> [reason]",
	cooldown        : 3,
	unique          : false,
	category        : "Moderation",
	whiteList       : "BAN_MEMBERS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});

unban.execute =  function(message, args, server){

	const target = args[0];
	let reason = args.slice(1).join(' ');
	if(!reason) reason = "No reason given."

	if(!target) {	
		const embed = makeEmbed('Missing member ID',this.usage, server);
		sendAndDelete(message,embed, server);
		return false;	
	}
	const modLog = message.guild.channels.cache.get(server.logs.warningLog);

	try {
		message.guild.bans.fetch(target)
		.then(yes=>{
			message.guild.bans.remove(target,reason).then(yes=>{
				const embed = makeEmbed("User unbanned",`The user <@${target}> or \`${target}\` has been unbanned for \n${reason}`,"29C200");
				message.channel.send({embeds:[embed]});

				const logEmbed = makeEmbed("Unban",`The user <@${message.author.id}>[${message.author.id}] has unbanned a user with the id ${target}`,colors.changeBlue,true);
					logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
					logEmbed.addFields(
						{ name: 'Unbanned: ', value:`<@${target}>`, inline:false },
						{ name: 'Unbanned by: ', value:`<@${message.author.id}>`, inline:false },
						{ name : "Reason: ", value: reason, inline:false}
					);
					if(modLog)modLog.send({embeds:[logEmbed]});
				return true;
			})
		})
		.catch(no=>{
			const embed = makeEmbed("Invalid ID","The given ID appears to be invalid or that member wasn't banned before.", server);
			sendAndDelete(message,embed, server);
			return false;
		})
		
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports = unban;