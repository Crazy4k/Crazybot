
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");


module.exports = {
	name : 'unban',
	description : 'unbans any one who was banned before (id is used))',
	usage:'!unban <ID> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {

		const target = args[0];

		if(isNaN(parseInt(target))) {
			try {

				const embed = makeEmbed('invalid ID',this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : failedEmbedTO }))
					.catch(console.error);

				message.delete({ timeout: faliedCommandTO });
				return;
			} catch (error) {
				console.error(error);
			} return;
		}
		if(args.length === 1) {
			try {
				const embed = makeEmbed('Missing reason',thsi.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : failedEmbedTO }))
					.catch(console.error);
				message.delete({ timeout: faliedCommandTO });

				return;
			} catch (error) {
				console.error(error);
			} return;
		}
		if(typeof args[1] === 'string') {

			try {

				message.guild.fetchBans().then( bans => message.guild.members.unban(target) );

				return message.channel.send(`The user <@${target}> has been unbanned for ${args.slice(1).join(' ')}`);
			} catch(error) {
				return console.error(error);
			}
		} return message.channel.send('i couldn\'t unban that user maybe because he had a higher rank than you');
	},

};