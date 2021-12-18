const makeEmbed = require('../../functions/embed.js');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");

const Command = require("../../Classes/Command");

let kick = new Command("kick");

kick.set({
    
	aliases         : ["boot","yeet"],
	description     : "kicks a user from the servers.",
	usage           : "kick <@user or user id> [reason]",
	cooldown        : 3,
	unique          : false,
	category        : "Moderation",
	whiteList       : "KICK_MEMBERS",
	requiredPerms	: "KICK_MEMBERS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [
        {
            name : "user",
            description : "The person to kick",
            required : true,
            type: 6,
		},
		{
            name : "reason",
            description : "The reason behind the kick",
            required : true,
            type: 3,
		}
        

	],
});

kick.execute = function(message, args, server, isSlash) {

	const modLog = message.guild.channels.cache.get(server.logs.warningLog);


	let id;
	let reason;
	let author;

	if(isSlash){
		author = message.user;
		id = args[0].value;
		reason = args[1].value;
	} else{
		author = message.author;
		id = checkUseres(message,args,0);
		reason = args.slice(1).join(' ');
	}

	if(!reason)reason = `No reason given by ${author.tag}`;


	
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

			if(target.permissions.has(this.whiteList)){
				const embed1 = makeEmbed('Could not do this action on a server moderator',``, colors.failRed);
				sendAndDelete(message,embed1, server);
				return false;
			}

			
			

			if(!target.kickable){

				const embed = makeEmbed('Missing Permissions',"The bot couldn't kick that user.", server);
				sendAndDelete(message,embed, server);
				return false;

			}else {
				target.kick({ reason:reason })
					.then( e => {
						const embed = makeEmbed("User kicked.",`The user <@${target.id}> has been kicked for \n\`${reason}\`.`,"29C200",);
						message.reply({embeds:[embed]});

						const logEmbed = makeEmbed("Kick",`The user <@${author.id}>[${author.id}] has kicked the user <@${target.id}>[${target.id}]`,colors.failRed,true);
						logEmbed.setAuthor(target.user.tag, target.user.displayAvatarURL());
						logEmbed.addFields(
							{ name: 'Kicked: ', value:`<@${target.id}>[${target.id}]`, inline:false },
							{ name: 'Kicked by: ', value:`<@${author.id}>`, inline:false },
							{ name : "Reason: ", value: reason, inline:false}
						);
						if(modLog)modLog.send({embeds:[logEmbed]});
						return true;
					})
					.catch(e =>{ console.log(e)}); 
				return true;
			}
	}
}

module.exports = kick;