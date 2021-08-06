const makeEmbed = require("./embed");
const sendAndDelete = require("./sendAndDelete");
const moment = require('moment');
//makeEmbed is just a function that i made which makes embeds just to make writing embeds easier 

module.exports = async (command, message, args, server, recentlyRan, uniqueCooldowns, globalCooddowns) => {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the message is able to execute the command.
	const cooldownString = `${message.guild.id}-${message.author.id}-${command.name}`;
	const globalCooldownString = `${message.guild.id}-${message.author.id}`;
	const uniqueCooldownString = `${message.guild.id}-${command.name}`;
	let = cooldownTime = 2;
	const globalCooldownTime = 2;
	if(command.cooldown) cooldownTime = command.cooldown;
	
	if(!command.whiteList) {
		try{
			if(uniqueCooldowns.includes(uniqueCooldownString)){
				const embed = makeEmbed("Slow down there !", `This command is on global cooldown, wait for it to end.`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			else
			if(command.cooldown && recentlyRan[cooldownString]){
				let seconds = command.cooldown * 1000
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			const booly = await command.execute(message, args, server);
			
			if(booly) {
				if(command.unique)uniqueCooldowns.push(uniqueCooldownString);
				

				recentlyRan[cooldownString] = moment();
				setTimeout(() =>{
					if(command.unique)uniqueCooldowns.splice(uniqueCooldowns.indexOf(uniqueCooldownString),1);
					recentlyRan[cooldownString] = null;
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
			if(uniqueCooldowns.includes(uniqueCooldownString)){
				const embed = makeEmbed("Slow down there !", `This command is on global cooldown, wait for it to end.`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			else if(command.cooldown && recentlyRan[cooldownString]){
				let seconds = command.cooldown * 1000
				const embed = makeEmbed("Slow down there !", `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			const booly = await command.execute(message, args, server);
			
			if(booly) {
				if(command.unique)uniqueCooldowns.push(uniqueCooldownString);
				recentlyRan[cooldownString] = moment();
				setTimeout(() =>{
					if(command.unique)uniqueCooldowns.splice(uniqueCooldowns.indexOf(uniqueCooldownString),1);
					recentlyRan[cooldownString] = null;
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