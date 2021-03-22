const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = require('../config.json');
client.client;
const stuff = require('../info.json');
const log = stuff.warningLog;
module.exports = {
	name : 'warn',
	description : 'warns a user',
	usage:'!warn <@user> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {


		const firstWarning = '797147248827695135';
		const secondWarning = '797147376086286356';
		const thirdWarning = '797147515869986856';

		const warnMessage = 'تم تحذير هذا الشخص بنجاح :white_check_mark:';
		const kickMessage = 'تم اعطاء هذا الشخص مخالفة لان كان معه 3 تحذيرات :white_check_mark:';


		if (!message.mentions.members.first()) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('Missing argument: user')
					.setDescription(this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout :10000 }))
					.catch(console.error);
				message.delete({ timeout:3000 });
				return;
			}
			catch (error) {
				console.error(error);
			}
		}
		else if(!args[1]) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('Missing argument: reason')
					.setDescription(this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout :10000 }))
					.catch(console.error);
				message.delete({ timeout:3000 });
				return;
			}
			catch (error) {
				console.error(error);
			}
		}
		const target = message.mentions.members.first();


		if(!target.roles.cache.has(firstWarning)) {
			target.roles.add(firstWarning).catch(console.error);
			if(message.guild.channels.cache.get(log)) {
				const logging = message.guild.channels.cache.get(log);
				const embed = new Discord.MessageEmbed()
					.setTitle('تحذير')
					.setAuthor(target.user.tag, target.user.displayAvatarURL())
					.setColor('#FFFB00')
					.setFooter('Developed by Crazy4k')
					.addFields(
						{ name:'رقم التحذير', value:'1', inline:true },
						{ name:'المحذر', value:message.author, inline:true },
						{ name:'السبب', value:args.slice(1), inline:true },
					);
				logging.send(embed);
			} message.channel.send(warnMessage);
			return;
		}

		else if(target.roles.cache.has(firstWarning) && !target.roles.cache.has(secondWarning)) {
			target.roles.add(secondWarning).catch(console.error);
			if(message.guild.channels.cache.get(log)) {
				const logging = message.guild.channels.cache.get(log);
				const embed = new Discord.MessageEmbed()
					.setTitle('تحذير')
					.setAuthor(target.user.tag, target.user.displayAvatarURL())
					.setColor('#ff9700')
					.setFooter('Developed by Crazy4k')
					.addFields(
						{ name:'رقم التحذير', value:'2', inline:true },
						{ name:'المحذر', value:message.author, inline:true },
						{ name:'السبب', value:args.slice(1), inline:true },
					);
				logging.send(embed);
			} message.channel.send(warnMessage);
			return;
		}

		else if(target.roles.cache.has(secondWarning) && !target.roles.cache.has(thirdWarning)) {
			target.roles.add(thirdWarning).catch(console.error);
			if(message.guild.channels.cache.get(log)) {
				const logging = message.guild.channels.cache.get(log);
				const embed = new Discord.MessageEmbed()
					.setTitle('تحذير')
					.setAuthor(target.user.tag, target.user.displayAvatarURL())
					.setColor('#ff0000')
					.setFooter('Developed by Crazy4k')
					.addFields(
						{ name:'رقم التحذير', value:'3', inline:true },
						{ name:'المحذر', value:message.author, inline:true },
						{ name:'السبب', value:args.slice(1), inline:true },
					);
				logging.send(embed);
			}message.channel.send(warnMessage);
			return;
		}
		else if(target.roles.cache.has(thirdWarning)) {
			target.roles.add('808745921289519164');
			if(message.guild.channels.cache.get(log)) {
				const logging = message.guild.channels.cache.get(log);
				const embed = new Discord.MessageEmbed()
					.setTitle('تحذير')
					.setAuthor(target.user.tag, target.user.displayAvatarURL())
					.setColor('#ff0000')
					.setFooter('Developed by Crazy4k')
					.addFields(
						{ name:'رقم التحذير', value:'3', inline:true },
						{ name:'المحذر', value:message.author, inline:true },
						{ name:'السبب', value:args.slice(1), inline:true },
					);
				logging.send(embed);
			}
		}message.channel.send(kickMessage);
		return;

	},

};
