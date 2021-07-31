const makeEmbed = require('../../functions/embed');
const config = require("../../config.json");

module.exports = {
	name : 'news',
	description : 'Send a sum of the latest update.',
	cooldown: 3,
	usage:'news',
    category:"other",
	execute(message, args, server) {

	const embed = makeEmbed(`CrazyBot patch ${config.bot_info.version}`)
	},

};
