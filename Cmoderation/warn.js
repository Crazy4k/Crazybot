const Discord = require('discord.js');
const stuff = require('../info.json');
const log = stuff.warningLog;
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const {firstWarningRole, secondWarningRole, thirdWarningRole} = require("./warn.json");



module.exports = {

	name : 'warn',
	description : 'warns a user',
	usage:'!warn <@user> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {

		//if (firstWarningRole === "" || secondWarningRole === "" || thirdWarningRole === "" ) return console.log("an attempt was made to use !warn but not all warning role IDs were given");

		

		const warnMessage = 'User has been warned:white_check_mark:';
		const kickMessage = 'User has been banned because he already had 3 warnings:white_check_mark:';


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

		if(!target.roles.cache.has(firstWarningRole)) {
	
			target.roles.add(firstWarningRole).catch(console.error);
		
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

		} else if(target.roles.cache.has(firstWarningRole) && !target.roles.cache.has(secondWarningRole)) {

			target.roles.add(secondWarningRole).catch(console.error);

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

		} else if(target.roles.cache.has(secondWarningRole) && !target.roles.cache.has(thirdWarningRole)) {

			target.roles.add(thirdWarningRole).catch(console.error);

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


		} else if(target.roles.cache.has(thirdWarningRole)) {

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
			}
		} 

		return message.channel.send(kickMessage);


	},

};
