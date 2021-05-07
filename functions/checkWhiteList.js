const makeEmbed = require("./embed");


module.exports = function checkWhiteList(command, message, args, server) {
	if(!command.whiteList) {
		try{
			command.execute(message, args, server);
		}
		catch(error) {
			console.error(error);
			const embed = makeEmbed("ERROR 101", 'There was an issue executing the command \ncontact the developer to fix this problem.', true, 'FF0000');
			message.channel.send(embed);
		}
		return;
	}
	const dude = message.guild.members.cache.get(message.author.id);
	try{
		const e = command.whiteList;
		if(dude.hasPermission(e)) {
			command.execute(message, args, server);
		}
		
	}
	catch(error) {
		console.error(error);
		const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \ncontact the developer to fix this problem.', true, 'FF0000');
		message.channel.send(embed);
	}
	return;
}