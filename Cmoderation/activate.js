const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
client.client;


module.exports = {
	name : 'acti',
	description : 'activates a member in the server (exclusive to MYTHIC LIFE RP)',
	usage:'!activate <user> <Playstation id> <correct answers>',
	whiteList:['MANAGE_ROLES'],
	execute(message, args) {
		fs.readFile('./mythicLife.json', 'utf-8', (err, config)=>{
			if(err) {
				console.log(err);
			}
			else {
				try {
					const stuff = JSON.parse(config);
					if(message.guild.id !== stuff.server)return;
					if(!message.guild.channels.cache.get(stuff.idChannel))return console.log('channel not found');
					if(args.length === 0) {
						try {
							const embed = new Discord.MessageEmbed()
								.setColor('#f7f7f7')
								.setTitle('نسيت تدخل اسم')
								.setDescription(this.usage);

							message.channel.send(embed)
								.then(msg => msg.delete({ timeout :10000 }))
								.catch(console.error);
							message.delete({ timeout:3000 });
							return;
						}
						catch (error) {
							console.error(error);
						}
					}
					else if(args.length === 1) {
						try {
							const embed = new Discord.MessageEmbed()
								.setColor('#f7f7f7')
								.setTitle('نسيت تدخل ايدي سوني')
								.setDescription(this.usage);

							message.channel.send(embed)
								.then(msg => msg.delete({ timeout :10000 }))
								.catch(console.error);
							message.delete({ timeout:3000 });
							return;
						}
						catch (error) {
							console.error(error);
						}
					}
					else if(args.length === 2) {
						try {
							const embed = new Discord.MessageEmbed()
								.setColor('#f7f7f7')
								.setTitle('نسيت تدخل عدد الاجوبة الصحيحة')
								.setDescription(this.usage);

							message.channel.send(embed)
								.then(msg => msg.delete({ timeout :10000 }))
								.catch(console.error);
							message.delete({ timeout:3000 });
							return;
						}
						catch (error) {
							console.error(error);
						}
					}

					if(!message.mentions.users.first()) {
						try {
							const embed = new Discord.MessageEmbed()
								.setColor('#f7f7f7')
								.setTitle('المنشن غير صالح')
								.setDescription(this.usage);

							message.channel.send(embed)
								.then(msg => msg.delete({ timeout :10000 }))
								.catch(console.error);
							message.delete({ timeout:3000 });
							return;
						}
						catch (error) {
							console.error(error);
						}
					}
					const dude = message.mentions.users.first();


					if(isNaN(args[2])) {
						try {
							const embed = new Discord.MessageEmbed()
								.setColor('#f7f7f7')
								.setTitle('عدد الاجوبة غير صالح')
								.setDescription(this.usage);

							message.channel.send(embed)
								.then(msg => msg.delete({ timeout :10000 }))
								.catch(console.error);
							message.delete({ timeout:3000 });
							return;
						}
						catch (error) {
							console.error(error);
						}
					}
					const channelo = message.guild.channels.cache.get(stuff.idChannel);
					const embed = new Discord.MessageEmbed()
						.setTitle('حالة التفعيل')
						.setColor('#29C200')
						.setAuthor(dude.tag, dude.displayAvatarURL())
						.addFields(
							{ name :'منشن:', value :dude, inline:false },
							{ name :'ايديه:', value :args[1], inline:false },
							{ name :'عدد الاجوبة الصحيحة:', value :args[2], inline:false },
							{ name :'عدد الأجوبة الخاطئة:', value :15 - args[2], inline:false },
						)
						.setFooter('Developed by crazy4k');
					stuff.memberCount++;
					if(args[2] > 12) {
						for(const e of stuff.roles) {
							const roly = message.guild.roles.cache.get(e);
							const guy = message.guild.members.cache.get(dude.id);

							if(typeof roly.id === 'string') {
								if(!guy.roles.cache.has(roly.id)) {

									guy.roles.add(roly).catch(console.error);
								}
								else {
									message.channel.send('الشخص مفعل من قبل')
										.then(msg=> msg.delete({ timeout : 10000 }))
										.catch(console.error);
									message.delete({ timeout: 5000 })
										.catch(console.error);
									return;
								}
							}
						}
						message.guild.members.cache.get(dude.id).roles.remove('796735115421417503');
						message.guild.members.cache.get(dude.id).setNickname(`${args[1]}#${stuff.memberCount}`);
						embed.addField('الحالة:', ' :white_check_mark:ناجح', false);
						embed.addField('الهوية:', stuff.memberCount, false);
						embed.addField('المفعل:', stuff.message.author, false);
						fs.writeFile('./mythicLife.json', JSON.stringify(stuff, null, 2), err => {
							if(err) {
								message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
								console.error;
							}
						});
					}


					else {
						embed.addField('الحالة:', ':x:راسب', false);
					}
					channelo.send(embed);

				}
				catch (error) {
					console.error;
				}
			}
		});

	},
};
