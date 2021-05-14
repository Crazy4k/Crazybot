const Discord = require('discord.js');
const fs = require('fs');
const makeEmbed = require('../../functions/embed');
const {} = require("../../config.json");
const sendAndDelete = require("../../functions/sendAndDelete");


module.exports = {
	name : 'prefix',
	description : 'changes the prefix of the bot',
	usage:'!preifx <new prefix>',
	whiteList:'ADMINISTRATOR',
	execute(message, args, server) {


		if (args.length === 0) {
			const embed = makeEmbed('Missing argument : prefix',this.usage, server);
			sendAndDelete(message,embed, server);
			return;
		} else if (args.length > 1) {
			const embed = makeEmbed('Prefix too long',this.usage, server);
			sendAndDelete(message,embed, server);
			return;
		} else if (args[0].length > 4) {
			const embed = makeEmbed('Prefix too long',this.usage, server);
			sendAndDelete(message,embed, server);
			return;
		} else if(args[0] === server.prefix) {
			const embed = makeEmbed('Invalid prefix \nSame as before',this.usage, server);
			sendAndDelete(message,embed, server);
			return;
		}

		fs.readFile("./servers.json", 'utf-8', (err, config)=>{
			if(err) return console.log(err);
			try {
				let JsonedDB = JSON.parse(config);
				for(let servero of JsonedDB) {
					if (message.guild.id === servero.guildId && !message.author.bot){
						const prefixString = args[0];
						
						servero.prefix = prefixString;

						fs.writeFile('./servers.json', JSON.stringify(JsonedDB, null, 2), err => {
					
							if(err) {
								message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
								console.log(err);
							} else {

								

								const embed = new Discord.MessageEmbed()
									.setThumbnail('https://www.iconsdb.com/icons/preview/green/ok-xxl.png')
									.setTitle(`Prefix changed from ${server.prefix} to ${args[0]}`)
									.setColor('2EFF00')
									.setFooter('developed by crazy4K')
									.setTimestamp()
									.setDescription('The prefix has been changed succesfuly :white_check_mark:.');

								return message.channel.send(embed);
							}
						});

				
						
	
	
					}
				}
			} catch (err) {console.log(err);}
			
			
		});
	} };