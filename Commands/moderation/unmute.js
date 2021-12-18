
let {muteCache} = require("../../caches/botCache");
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let unmute = new Command("unmute");

unmute.set({
	aliases         : ["unshut","unstfu"],
	description     : "Unmutes someone.\nCancels the mute command",
	usage           : "unmute <@user>",
	cooldown        : 10,
	unique          : false,
	category        : "Moderation",
	whiteList       : "MUTE_MEMBERS",
	requiredPerms   : "MANAGE_ROLES",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [
        {
            name : "user",
            description : "The person to unmute",
            required : true,
            type: 6,
		},
        
		{
            name : "reason",
            description : "The reason behind the unmute",
            required : true,
            type: 3,
		}
        

	],
});

unmute.execute =  function(message, args, server, isSlash) {


	let author;
    let reason;
    let guy;
    
    if(isSlash){
        author = message.user;
        guy = args[0].value;
        reason = args[1].value;
        
    } else{
        author = message.author;
        guy = checkUseres(message,args,0);
        reason = args.splice(1).join(" ");
       
        
    }

    if(!reason) reason = "`No reason given`";

	try {
		const muteLog = message.guild.channels.cache.get(server.logs.warningLog);
		
		
		
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
				let hisRoles = muteCache[`${author.id}-${message.guild.id}`];
				const member = message.guild.members.cache.get(guy);
				if(!hisRoles){
					const embed = makeEmbed("The user isn't muted in the first place.","", server);
					sendAndDelete(message,embed, server);
					return false;
				} else {
					try {		
						
						member.roles.add(hisRoles).then(role=>{
							member.roles.remove(server.muteRole).then(roles=>{
								muteCache[`${author.id}-${message.guild.id}`] = null;
								
								const logEmbed = makeEmbed("Unmute","","00E7FE",true);
								logEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL());
								logEmbed.addFields(
									{ name: 'Unmuted: ', value: `<@${member.id}>-${member.id}`, inline:false },
									{ name: 'Unmuted by: ', value: `<@${author.id}>`, inline:false },
									{ name : "Reason: ", value: reason, inline:false}
								);
								if(muteLog)muteLog.send({embeds:[logEmbed]});
								const embed1 = makeEmbed("Done!",`The user <@${guy}> has been unmuted for \`${reason}\``, colors.successGreen);
								message.reply({embeds:[embed1]});
							}).catch(e=>{
								const embed1 = makeEmbed('Missing Permíssion',"Couldn't unmute that user because the bot couldn't manage their roles", server);
								sendAndDelete(message,embed1, server);
								return false;
							})
							
						}).catch(e=>{
							const embed1 = makeEmbed('Missing Permíssion',"Couldn't unmute that user because the bot couldn't manage their roles", server);
							sendAndDelete(message,embed1, server);
							return false;
						})
						
						
					}catch (error) {
						console.log(error);
						const embed1 = makeEmbed('Missing Permíssion',"Couldn't unmute that user because the bot can't perform that action on them", server);
						sendAndDelete(message,embed1, server);
						return false;	
					}
				}
		}
	} catch (error) {
		console.log(error);
		console.log("UNMUET error")
	}
	
}

module.exports = unmute;