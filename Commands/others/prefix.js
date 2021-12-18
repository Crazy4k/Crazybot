const Command = require("../../Classes/Command");

let prefix = new Command("prefix");

prefix.set({
	aliases         : [],
	description     : "Shows you the prefix of this server",
	usage           : "prefix",
	cooldown        : 0,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true
});


prefix.execute = async function (message, args, server) {


	message.reply(`The prefix for this server is ${server.prefix}`);

}

module.exports = prefix; 