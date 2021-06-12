const Discord = require('discord.js');

const checkUseres = require("../../functions/checkUser");
const makeEmbed = require('../../functions/embed');

const sendAndDelete = require("../../functions/sendAndDelete");

const warnMessage = 'User has been warned:white_check_mark:';
const kickMessage = 'User has been banned because he already had 3 warnings:white_check_mark:';

// Still needs some if statements for: (no logs channel), (invalid roles), (user unbannable)

module.exports = {

	name : 'warn',
	description : 'warns a user',
	usage:'!warn <@user> <reason>',
	whiteList:'BAN_MEMBERS',
	execute(message, args, server) {
		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);			
				sendAndDelete(message,embed1, server);
				return false;
				break;
			case "no args": 
				const embed2 = makeEmbed('Missing arguments',this.usage, server);		
				sendAndDelete(message,embed2, server);
				return false;				
			default:
				if(!args[1]) {
					const embed = makeEmbed("Missing reason", this.usage, server);	
					sendAndDelete(message,embed, server);
					return false;
				}
				const target = message.guild.members.cache.get(checkUseres(message, args, 0));

								const firstWarning = server.warningRoles.firstwarningRole;
								const secondWarning = server.warningRoles.secondWarningRole;
								const thirdWarning = server.warningRoles.thirdWarningRole;
								const log = server.warningLog;
								const logging = message.guild.channels.cache.get(log);

								if(message.guild.roles.cache.get(firstWarning) === undefined || message.guild.roles.cache.get(firstWarning) === undefined || message.guild.roles.cache.get(firstWarning) === undefined){
									const embed = makeEmbed("Error: warning roles haven't been set up","No warning roles have been given, therefore the user hasn't been warned.\nDo `!server` to see your server settings and to set up the roles.","#FC0000");
									sendAndDelete(message,embed, server);
									return false;
								}
								if(!target.roles.cache.has(firstWarning) && message.guild.roles.cache.get(firstWarning) !== undefined) {
			
									target.roles.add(firstWarning).catch(console.error);
									console.log(3);
									if(logging) {
									
										const embed = new Discord.MessageEmbed()
						
											.setTitle("Warning")
											.setAuthor(target.user.tag, target.user.displayAvatarURL())
											.setColor('#FFFB00')
											.setFooter('Developed by Crazy4k')
											.addFields(
												{ name:'Warning count', value:'1', inline:true },
												{ name:'warned by: ', value:message.author, inline:true },
												{ name:'reason', value:args.slice(1), inline:true },
											);
										logging.send(embed);
									}  
									message.channel.send(warnMessage);
									return true;
								} else if(target.roles.cache.has(firstWarning) && !target.roles.cache.has(secondWarning)) {
						
									target.roles.add(secondWarning).catch(console.error);
						
									if(logging) {
						
										const embed = new Discord.MessageEmbed()
											.setTitle("Warning")
											.setAuthor(target.user.tag, target.user.displayAvatarURL())
											.setColor('#ff9700')
											.setFooter('Developed by Crazy4k')
											.addFields(
												{ name:'Warning count', value:'2', inline:true },
												{ name:"Warned by :", value:message.author, inline:true },
												{ name:'Reason', value:args.slice(1), inline:true },
											);
						
										logging.send(embed);
						
									}
									message.channel.send(warnMessage);
									return true;
						
								} else if(target.roles.cache.has(secondWarning) && !target.roles.cache.has(thirdWarning)) {
						
									target.roles.add(thirdWarning).catch(console.error);
						
									if(logging) {	
										const embed = new Discord.MessageEmbed()
						
											.setTitle('Warning')
											.setAuthor(target.user.tag, target.user.displayAvatarURL())
											.setColor('#ff0000')
											.setFooter('Developed by Crazy4k')
											.addFields(
												{ name:'Warning count', value:'3', inline:true },
												{ name:'Warned by: ', value:message.author, inline:true },
												{ name:'Reason', value:args.slice(1), inline:true },
											);
										logging.send(embed);
									}
						
									message.channel.send(warnMessage);
									return true;
						
								} else if(target.roles.cache.has(thirdWarning)) {
									if(!target.kickable){
										const embed = makeEmbed('Missing Permissions',"That user had 3 warnings already, but they unbannable by the bot.", server);
										sendAndDelete(message,embed, server);
										return false;
									}else {
										target.ban();
						
										if(message.guild.channels.cache.get(log)) {
						
											const logging = message.guild.channels.cache.get(log);
						
											const embed = new Discord.MessageEmbed()
												.setTitle("warning")
												.setAuthor(target.user.tag, target.user.displayAvatarURL())
												.setColor('#ff0000')
												.setFooter('Developed by Crazy4k')
												.addFields(
													{ name:"Warning count", value:'3', inline:true },
													{ name:'Warned by: ', value:message.author, inline:true },
													{ name:'Reason', value:args.slice(1), inline:true },
												);
											logging.send(embed);
											message.channel.send(kickMessage);
											return true;
										}
									}
								} 
							
						
				break;
		}
		return true;
		

	},

};
