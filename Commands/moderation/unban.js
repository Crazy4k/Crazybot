
const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'unban',
	aliases: ["remove-ban","ban-remove","ban-"],
	description : 'Unbans a user who was banned before (id is used))',
	usage:'unban <user ID> [reason]',
	whiteList:'BAN_MEMBERS',
	cooldown: 3,
	category:"Moderation",
	execute(message, args, server) {

		const target = args[0];
		let reason = args.slice(1).join(' ');
		if(!reason) reason = "No reason given."

		if(!target) {	
			const embed = makeEmbed('Missing member ID',this.usage, server);
			sendAndDelete(message,embed, server);
			return false;	
		}


		try {
			message.guild.bans.fetch(target)
			.then(yes=>{
				message.guild.bans.remove(target,reason).then(yes=>{
					const embed = makeEmbed("User unbanned",`The user <@${target}> or \`${target}\` has been unbanned for \n${reason}`,"29C200");
					message.channel.send({embeds:[embed]});
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
	},

};