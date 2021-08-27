const makeEmbed = require("./embed");
const sendAndDelete = require("./sendAndDelete");
const moment = require('moment');
const {Permissions} = require("discord.js");
//makeEmbed is just a function that i made which makes embeds just to make writing embeds easier 

module.exports = async (command, message, args, server, recentlyRan, uniqueCooldowns, globalCooddowns) => {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the message is able to execute the command.
	const cooldownString = `${message.guild.id}-${message.author.id}-${command.name}`;
	const globalCooldownString = `${message.guild.id}-${message.author.id}`;
	const uniqueCooldownString = `${message.guild.id}-${command.name}`;
	let = cooldownTime = 2;
	const globalCooldownTime = 2000;
	if(command.cooldown) cooldownTime = command.cooldown;
	
	if(!command.whiteList) {
		try{
			if(uniqueCooldowns[uniqueCooldownString]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - uniqueCooldowns[uniqueCooldownString] - seconds)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			else if(command.cooldown && recentlyRan[cooldownString]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			if( globalCooddowns[globalCooldownString]){
				
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - globalCooddowns[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			const booly = await command.execute(message, args, server);
			
			if(booly) {
				if(command.unique)uniqueCooldowns[uniqueCooldownString] = moment();
				recentlyRan[cooldownString] = moment();

				setTimeout(() =>{
					if(command.unique)uniqueCooldowns[uniqueCooldownString] = null;
					recentlyRan[cooldownString] = null;
		
				}, cooldownTime * 1000);
			}	
			globalCooddowns[globalCooldownString] = moment();
			setTimeout(()=>{
				globalCooddowns[globalCooldownString] = null;
			},globalCooldownTime);
		}
		catch(error) {
			console.error(error);
			const embed = makeEmbed("ERROR 101", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
			message.channel.send( {embeds: [embed]} );
		}
		return;
	}
	const dude = message.guild.members.cache.get(message.author.id);
	try{
		
		if(dude.permissions.has(Permissions.FLAGS[command.whiteList])) {

			if(uniqueCooldowns[uniqueCooldownString]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - uniqueCooldowns[uniqueCooldownString] - seconds)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			else if(command.cooldown && recentlyRan[cooldownString]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !", `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds`, server);
				sendAndDelete(message, embed,server);
				return false;
			}
			if( globalCooddowns[globalCooldownString]){
				
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - globalCooddowns[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
				sendAndDelete(message, embed, server);
				return false;
			}
			const booly = await command.execute(message, args, server);
			
			if(booly) {
				if(command.unique)uniqueCooldowns[uniqueCooldownString ]= moment();
				recentlyRan[cooldownString] = moment();

				setTimeout(() =>{
					if(command.unique)uniqueCooldowns[uniqueCooldownString] = null;
					recentlyRan[cooldownString] = null;
				}, cooldownTime * 1000);
			}	
			globalCooddowns[globalCooldownString] = moment();
			setTimeout(()=>{
				globalCooddowns[globalCooldownString] = null;
			},globalCooldownTime);

		} else{
			const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
			sendAndDelete(message,embed,server);
			return false;
		}
		
	}
	catch(error) {
		console.error(error);
		const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \ncontact the developer to fix this problem.', 'FF0000');
		message.channel.send( {embeds: [embed] } );
	}
	return;
}