const makeEmbed = require("./embed");
//makeEmbed is just a function that i made that makes embeds just to make writing embeds easier 

module.exports = function checkWhiteList(command, message, args, server) {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the message is able to execute the command.
	if(!command.whiteList) {
		try{
			command.execute(message, args, server);
		}
		catch(error) {
			console.error(error);
			const embed = makeEmbed("ERROR 101", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
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
		const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
		message.channel.send(embed);
	}
	return;
}