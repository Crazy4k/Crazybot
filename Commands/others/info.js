const Discord = require('discord.js');
const fs = require('fs');

const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");


/*const commandfiles01 = fs.readdirSync('./Cothers/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Cfun/').filter(file =>file.endsWith('.js'));
*/
const commandfiles01 = fs.readdirSync('./Commands/others/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Commands/fun/').filter(file =>file.endsWith('.js'));



module.exports = {
	name : 'info',
	description : 'Sends the information about any command in the bot',
	usage:'!info <command>',
	execute(message, args, server) {

		if(args.length === 0) {
			const embed = makeEmbed('Missing command',this.usage, server);
			sendAndDelete(message,embed, server);
			return false;
		}
		for(const file of commandfiles01) {

			const command = require(`../others/${file}`);

			if(command.name === args[0]) {
				try {
					const embed = makeEmbed("Info!",`Information regarding ${server.prefix}${command.name}`, server,true);
						embed.addFields(
							{ name:'usage', value:command.usage, inline: false },
							{ name:'description', value:command.description, inline:false },
						);
					message.channel.send(embed);
					return true;
				} catch (error) {
					console.error(error);
					return false;
				} 
			}
		}
		for(const file of commandfiles02) {
	
			const command = require(`../fun/${file}`);

			if(command.name === args[0]) {
	
				try {
	
					const embed = makeEmbed("Info!",`Information regarding ${server.prefix}${command.name}`, server,true);
						embed.addFields(
							{ name:'usage', value:command.usage, inline: false },
							{ name:'description', value:command.description, inline:false },
						);
					message.channel.send(embed);
					return true;
				} catch (error) {
					console.error(error);
					return false;
				} 
			}
		}
		sendAndDelete(message,'Couldn\'t find any command with that name', server);
		return false;


	},

};
