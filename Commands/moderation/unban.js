
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
	requiredPerms	: "BAN_MEMBERS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [
        {
            name : "id",
            description : "The id of the discord user to unban from this server",
            required : true,
            type: 3,
		},
		{
            name : "reason",
            description : "The reason behind the ban",
            required : true,
            type: 3,
		},
        

	],
});

unban.execute =  function(message, args, server, isSlash){
	let author;
	let target;
	let reason
	if(isSlash){
		author = message.user;
		target = args[0].value;
		reason = args[1].value;
	} else{
		author = message.author;
		target = args[0];
		reason = args.slice(1).join(' ');
	}
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
				message.reply  ({embeds:[embed]});

				const logEmbed = makeEmbed("Unban",`The user <@${author.id}>[${author.id}] has unbanned a user with the id ${target}`,colors.changeBlue,true);
					logEmbed.setAuthor(author.tag, author.displayAvatarURL());
					logEmbed.addFields(
						{ name: 'Unbanned: ', value:`<@${target}>`, inline:false },
						{ name: 'Unbanned by: ', value:`<@${author.id}>`, inline:false },
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