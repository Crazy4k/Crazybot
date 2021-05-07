const makeEmbed = require('../../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../../config.json");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'sudo',
	description : 'makes the bot say whatever you want wherever you want',
	usage:'!sudo <Channel ID or name> <Message>',
	whiteList :'ADMINISTRATOR',

	execute(message, args, server) {


		const sudoStuff = args.slice(1).join(' ');


		if (args.length === 0) {

			const embed = makeEmbed("Missing channel name", this.usage);
	
			sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
			return;
		} else if(args.legth === 1) {

			const embed = makeEmbed("Missing message", this.usage);
			sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
			return;
		} else if(!sudoStuff.length) {

			const embed = makeEmbed('Can\'t send an empty message', this.usage);
			sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
			return;
		} else if(isNaN(message.guild.channels.cache.get(args[0]) * 1) && args[0] === 'here') {

			const location = message.channel;

			if (typeof location === 'undefined') {

				const embed = makeEmbed('Invalid channel name',this.usage);
				sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
				return;
			}
			message.delete();

			location.send(sudoStuff);

			return;
		} else if(isNaN(message.guild.channels.cache.get(args[0]) * 1)) {

			const location = message.guild.channels.cache.find(channel=>channel.name === args[0]);
	
			if (typeof location === 'undefined') {

				const embed =makeEmbed ('Invalid channel name',this.usage);

				sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
				return;
			}

			location.send(sudoStuff);

			message.delete();

		} else if(!isNaN(message.guild.channels.cache.get(args[0]) * 1)) {

			const location = message.guild.channels.cache.get((args[0]));

			if (typeof location === 'undefined') {

				const embed = makeEmbed('Invalid channel id',this.usage);

				sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
					return;
			}

			location.send(sudoStuff);

			message.delete();
		}
		return;

	},
};