const Discord = require('discord.js');
const fs = require("fs");
const stuff = require('../info.json');
const log = stuff.warningLog;
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");


// Still needs some if statements for: (no logs channel), (invalid roles), (user unbannable)

module.exports = {

	name : 'warn',
	description : 'warns a user',
	usage:'!warn <@user> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {

		if (!message.mentions.members.first()) {

			const embed = makeEmbed('Missing argument: user', this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);

			return message.delete({ timeout:faliedCommandTO });

		} else if(!args[1]) {

			const embed = makeEmbed("Missing reason", this.usage);
			
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			
			return message.delete({ timeout: faliedCommandTO });
		}

		const target = message.mentions.members.first();
		const warnMessage = 'User has been warned:white_check_mark:';
		const kickMessage = 'User has been banned because he already had 3 warnings:white_check_mark:';

		fs.readFile("./servers.json", 'utf-8', (err, config)=>{
			try {
				const JsonedDB = JSON.parse(config);	
				for( i of JsonedDB) {

					if (message.guild.id === i.guildId) {
	
						const firstWarning = i.warningRoles.firstwarningRole;
						const secondWarning = i.warningRoles.sencondWWanringRole;
						const thirdWarning = i.warningRoles.thirdWarningRole;
						const log = i.warningLog;



						if(message.guild.roles.cache.get(firstWarning) === undefined || message.guild.roles.cache.get(firstWarning) === undefined || message.guild.roles.cache.get(firstWarning) === undefined){
							const embed = makeEmbed("Error: warning roles haven't been set up","No warning roles have been given, therefore the user hasn't been warned.", false, "#FC0000");
							message.channel.send(embed)
								.then(msg => msg.delete({ timeout : failedEmbedTO }))
								.catch(console.error);
							return message.delete({ timeout:faliedCommandTO });
						}
						if(!target.roles.cache.has(firstWarning) && message.guild.roles.cache.get(firstWarning) !== undefined) {
	
							target.roles.add(firstWarning).catch(console.error);
							console.log(3);
							if(message.guild.channels.cache.get(log)) {
							
								const logging = message.guild.channels.cache.get(log);
				
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
							} return message.channel.send(warnMessage);
				
						} else if(target.roles.cache.has(firstWarning) && !target.roles.cache.has(secondWarning)) {
				
							target.roles.add(secondWarning).catch(console.error);
				
							if(message.guild.channels.cache.get(log)) {
				
								const logging = message.guild.channels.cache.get(log);
				
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
				
							} return message.channel.send(warnMessage);
				
						} else if(target.roles.cache.has(secondWarning) && !target.roles.cache.has(thirdWarning)) {
				
							target.roles.add(thirdWarning).catch(console.error);
				
							if(message.guild.channels.cache.get(log)) {
				
								const logging = message.guild.channels.cache.get(log);
				
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
				
							return message.channel.send(warnMessage);
				
				
						} else if(target.roles.cache.has(thirdWarning)) {
				
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
								return message.channel.send(kickMessage);
							}
						} 
					}
				}
				
				
			}catch (err) {console.log(err);}
		})


		

		

		

		


	},

};
