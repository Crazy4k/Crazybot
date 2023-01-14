const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let ban = new Command("ban");

ban.set({
    
	aliases         : [],
	description     : "PERMANENTLY bans a member in the server.",
	usage           : "ban <@user or user id> [reason] [ delete messages 0-7, default is 1]",
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
            name : "user",
            description : "The person to ban",
            required : true,
            type: 6,
		},
		{
            name : "reason",
            description : "The reason behind the ban",
            required : true,
            type: 3,
		},
        {
            name : "delete-messages",
            description : "How many days worth of last message of the banned user to delete",
            required : false,
			choices: [{name:1,value:1},{name:2,value:2},{name:3,value:3},{name:4,value:4},{name:5,value:5},{name:6,value:6},{name:7,value:7},],
            type: 4,
		}
        

	],
})

ban.execute = function(message, args, server, isSlash)  {
	const modLog = message.guild.channels.cache.get(server.logs.warningLog);
	let author;//message sender/interaction creator
	let id;//banned target

	
	let time = 1;
	let popped;
	let reason
	if(isSlash){
		author = message.user;
		id = args[0].value;
		reason = args[1].value;
	} else{
		author = message.author;
		id = checkUseres(message,args,0);
		let copyOfArgs = [...args];
		popped  = copyOfArgs.pop();
		if(parseInt(popped) && args.length > 2)time = parseInt(popped); 
		else{
			time = 1;
			copyOfArgs.push(popped);
		}
		if(copyOfArgs[1]) reason = copyOfArgs.slice(1).join(' ');
	}

	if(!reason)reason = `No reason given by ${author.tag}`;
	

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
			const target = message.guild.members.fetch(id);

			if(target.permissions.has(this.whiteList)){
				const embed1 = makeEmbed('Could not do this action on a server moderator',``, colors.failRed);
				sendAndDelete(message,embed1, server);
				return false;
			}
		
			if(time > 7){
				const embed = makeEmbed('Invaild value',"Time must be between 0 and 7.", server);
				sendAndDelete(message,embed, server );
				return false;
			}
			


			if(!isNaN(time)) {
				try {
					
					target.ban({ reason: reason, days:time })

					.then(a=>{
						const embed = makeEmbed("User banned.",`The user <@${target.id}> has been banned for \n\`${reason}\`\nAnd deleted messages sent by the uses in the last \`${time}\` days.`,"29C200",);
						message.reply({embeds:[embed]});

						const logEmbed = makeEmbed("Ban",`The user <@${author.id}>[${author.id}] has permanently banned the user <@${target.id}>[${target.id}] for "${reason}"`,colors.failRed,true);
						logEmbed.setAuthor({name: target.user.tag ,iconURL: target.user.displayAvatarURL()});
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
