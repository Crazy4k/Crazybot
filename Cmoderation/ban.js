const Discord = require('discord.js');
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");


module.exports = {
	name : 'ban',
	description : 'permanently bans any one in the server. The number is for deleting messages from the banned user (0-7 days)',
	usage:'!ban <@user> <reason> [ delete messages 0-7]',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {

		
		const time = args[1] * 2 / 2;

		if(!message.mentions.users.first()) {
			try {
				const embed = makeEmbed('invalid username',this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : failedEmbedTO }))
					.catch(console.error);
				return message.delete({ timeout: faliedCommandTO });
			} catch (error) {
				console.error(error);
			}
		}

		const target = message.guild.members.cache.get(message.mentions.users.first().id);

		if(!target.bannable) {
			return message.channel.send('nope')

		} else if(args.length === 1) {
			try {
				const embed = makeEmbed('Missing argument : reason',this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : failedEmbedTO }))
					.catch(console.error);
				return message.delete({ timeout: faliedCommandTO });
			} catch (error) {
				console.error(error);
			}
		} else if(!isNaN(time)) {
			try {
				message.channel.send(`The user <@${target.id}> has been banned for ${args.slice(2).join(' ')}`)
					.catch(console.error);

				message.delete({ timeout:  faliedCommandTO });
				target.ban({ reason:args.slice(2).join(' '), days:time });
			} catch(error) {
				console.error(error);
				const embed = makeEmbed('ERROR 103', 'There was an issue executing the command \ncontact the developer to fix this problem.', true, 'FF0000' );
				message.channel.send(embed);
			}
			return;
		} else if(typeof args[1] === 'string' && target.bannable) {
			message.channel.send(`The user <@${target.id}> has been banned for :  ${args.slice(1).join(' ')}`);

			message.delete({ timeout: faliedCommandTO })
				.catch(console.error);
			return target.ban({ reason:args.slice(1).join(' ') });

		} message.channel.send('i couldn\'t ban that user maybe because he had a higher rank than you')
			.catch(console.error);
	},

};
