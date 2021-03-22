const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const { token, prefix } = require('../config.json');

module.exports = {
	name : 'prefix',
	description : 'changes the prefix of the bot',
	usage:'!preifx <new prefix>',
	whiteList:['ADMINISTRATOR'],
	execute(message, args) {
		fs.readFile('./config.json', 'utf-8', (err, config)=>{
			if(err) {
				console.log(err);
			}
			else {
				try {
					if (args.length === 0) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Missing argument : prefix')
							.setColor('#f7f7f7')
							.setDescription(this.usage);
						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : 10000 }))
							.catch(console.error);
						message.delete({ timeout: 4000 });
						return;
					}
					if (args.length > 1) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Invalid prefix\ntoo long')
							.setColor('#f7f7f7')
							.setDescription(this.usage);
						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : 10000 }))
							.catch(console.error);
						message.delete({ timeout: 4000 });
						return;
					}
					else if (args[0].length > 4) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Invalid prefix\ntoo long')
							.setColor('#f7f7f7')
							.setDescription(this.usage);
						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : 10000 }))
							.catch(console.error);
						message.delete({ timeout: 4000 });
						return;
					}
					else if(args[0] === prefix) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Invalid prefix \nSame as before')
							.setColor('#f7f7f7')
							.setDescription(this.usage);
						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : 10000 }))
							.catch(console.error);
						message.delete({ timeout: 4000 });
						return;
					}
					const prefixString = args[0];
					const database = JSON.parse(config);
					const JsonedDB = database;
					JsonedDB.prefix = prefixString;
					fs.writeFile('./config.json', JSON.stringify(JsonedDB, null, 2), err => {
						if(err) {
							message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
							console.log(err);
						}
						else {
							console.log(`The prefix was changed from  ${prefix}  to  ${args[0]}  by ${message.author.tag}`);
							const embed = new Discord.MessageEmbed()
								.setThumbnail('https://www.iconsdb.com/icons/preview/green/ok-xxl.png')
								.setTitle(`Prefix changed from ${prefix} to ${args[0]}`)
								.setColor('2EFF00')
								.setFooter('developed by crazy4K')
								.setTimestamp()
								.setDescription('The prefix has been changed succesfuly :white_check_mark:.\nThe bot needs to restart before you can use the new prefix');
							return message.channel.send(embed);
						}
					});

				}
				catch (error) {
					console.log(err);
				}
			}
		});
	} };