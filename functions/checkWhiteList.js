const makeEmbed = require("./embed");
const sendAndDelete = require("./sendAndDelete");
const moment = require('moment');
//makeEmbed is just a function that i made which makes embeds just to make writing embeds easier 

module.exports = (command, message, args, server, recentlyRan) => {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the message is able to execute the command.
	const cooldownString = `${message.guild.id}-${message.author.id}-${command.name}`;
	let = cooldownTime = 0.5;
	if(command.cooldown) cooldownTime = command.cooldown;
	
	if(!command.whiteList) {
		try{
			if(command.cooldown && recentlyRan.includes(cooldownString)){
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nCooldown duration: ${cooldownTime} seconds`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			const booly =command.execute(message, args, server);
			if(booly) {
			recentlyRan.push(cooldownString);
			setTimeout(() =>{
				recentlyRan.splice(recentlyRan.indexOf(cooldownString), 1);
			}, cooldownTime * 1000);
			}	
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
		
		if(dude.hasPermission(command.whiteList)) {
			if(command.cooldown && recentlyRan.includes(cooldownString)){
				const embed = makeEmbed("Slow down there !", `Wait for the cooldown to end.\nCooldown duration: ${cooldownTime} seconds`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			const booly =command.execute(message, args, server);
			if(booly) {
			recentlyRan.push(cooldownString);
			setTimeout(() =>{
				recentlyRan.splice(recentlyRan.indexOf(cooldownString), 1);
			}, cooldownTime * 1000);
			}	
		}
		
	}
	catch(error) {
		console.error(error);
		const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
		message.channel.send(embed);
	}
	return;
}