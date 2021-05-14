const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');
const client = new Discord.Client();
const {token, testGuildId} = require('./config.json');
const checkWhiteList = require("./functions/checkWhiteList");
const makeEmbed = require('./functions/embed.js');
const keepAlive = require('./server.js');




keepAlive();
client.commands = new Discord.Collection();
const commandfiles01 = fs.readdirSync('./Commands/fun/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Commands/moderation/').filter(file =>file.endsWith('.js'));
const commandfiles03 = fs.readdirSync('./Commands/others/').filter(file =>file.endsWith('.js'));
const commandfiles04 = fs.readdirSync("./Commands/Server configurations/").filter(file =>file.endsWith('.js'));

// getting all the commands.
for(const file of commandfiles01) {
	const command = require(`./Commands/fun/${file}`);
	client.commands.set(command.name, command);
}
for(const file of commandfiles02) {
	const command = require(`./Commands/moderation/${file}`);
	client.commands.set(command.name, command);
}
for(const file of commandfiles03) {
	const command = require(`./Commands/others/${file}`);
	client.commands.set(command.name, command);
}
for(const file of commandfiles04) {
	const command = require(`./Commands/Server configurations/${file}`);
	client.commands.set(command.name, command);
}
//server object creator ./servers.json
//this basically creates an object for whenever the bot joins a guild, and saves that object in an array in ./servers.json
client.on('guildCreate', guild => {

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (guild.id === i.guildId) return;
			}
			const serverObject = {
				guildId: guild.id,
				logs :{
					hiByeLog:"",
					deleteLog:"",
					serverLog:"",
					warningLog:"",
					isSet:false,
					emptyValue02:"",
					emptyValue03:"",
					emptyValue04:"",
				},
				hiByeChannel:"",
				hiRole: "",
				hiByeLog:"",
				deleteLog:"",
				serverLog:"",
				warningLog:"",
				language:"English",
				prefix : "!",
				emptyValue05:"",
				emptyValue06:"",
				emptyValue07:"",
				emptyValue08:"",
				defaultEmbedColor:"#f7f7f7",
				deleteFailedMessagedAfter: 10000,
				deleteMessagesInLogs : true,
				deleteFailedCommands : true	,
				isSet:false,
				warningRoles: {
					firstwarningRole:"",
					secondWarningRole:"",
					thirdWarningRole:""
				}
			};
			
			JsonedDB.push(serverObject);

			fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
				if(err) {
	
					console.log(err);
				} else {
					console.log(`joined a new server. name: ${guild.name}`);
				}
			});
		} catch (err) {console.log(err);}
	})//I hate running into errors and crashing the bot so you gotta spam catch() a bit
});



//serevr object destroyer servers.json
//finds the index of that server object and splices it aka deletes it
client.on('guildDelete', guild => {

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (guild.id === i.guildId) {
					JsonedDB.splice(JsonedDB.indexOf(i), 1);
					
					fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
						if(err) {
							
							console.log(err);
						} else {
							console.log(`Left a server. name: ${guild.name}`);
						}
					});
				}
			}	
		} catch (err) {console.log(err);}
	})
});




//command handler|prefix based
//i like to devide this into multiple pieces since it's a bit weird
client.on('message', message => {
	if(message.channel.type === "dm")return;

	//first step is to find the server object in the servers.json file
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			let JsonedDB = JSON.parse(config);
			for(let server of JsonedDB) {
				//once it finds the server, it checks if deleteMessagesInLogs in turned on
				if (message.guild.id === server.guildId && !message.author.bot){
					if(server.deleteMessagesInLogs) {
						// if so, it instantly deletes the message if it was sent inside a log channel
						switch (message.channel.id) {
							case server.logs.hiByeLog: 
							case server.logs.deleteLog: 
							case server.logs.serverLog: 
							case server.logs.warningLog: 
							message.delete().catch(console.error);
							message.channel.send('You can\'t send a message in the logs ❌')
								.then(msg=> msg.delete({ timeout:4000 })).catch(console.error);
								return;
							break;
						}	
					}
					// then the declaration of the most important variables
					const prefix = server.prefix;
					if (!message.content.startsWith(prefix) || message.author.bot)return;
					const args = message.content.slice(prefix.length).split(/ +/);
					const commandName = args.shift().toLowerCase();
					//break if the command given was invalid
					if (!client.commands.has(commandName)) return;
					//then finally after all of the checks, the commands executes 
					//btw checkWhiteList() is a pretty big function that does exactly what it called, but with a bunch of extra check. Path: ./functions/checkWhiteList.js
					const command = client.commands.get(commandName);
					checkWhiteList(command, message, args, server);


					break;
				}
			}
		} catch (err) {console.log(err);}
	})	
});


/*	 ________						_________________________			_________________________________		
	|		|						|						|           |								|
	|		|						|	________________	|			|		_________________		|
	|	  	|						|	|				|	|			|		|				|		|
	|		|						|	|				|	|			|		|				|_______|
	|	  	|						|	|				|	|			|		|						
	|		|						|	|				|	|			|		|
	|		|						|	|				|	|			|		|
	|		|						|	|				|	|			|		|						
	|		|						|	|				|	|			|		|		_________________
	|	  	|						|	|				|	|			|		|		|				|
	|		|						|	|				|	|			|		|		|___________	|
	|       |____________			|	|				|	|			|		|					|	|
	|					|			|	|_______________|	|			|		|___________________|	|
	|					|			|						|			|								|
	|___________________|			|_______________________|			|_______________________________|			S




*/
client.on('guildMemberAdd', (member)=> {

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (member.guild.id === i.guildId) {

					const room = member.guild.channels.cache.get(i.logs.hiByeChannel);
					const role = member.guild.roles.cache.get(i.hiRole);
					const log = member.guild.channels.cache.get(i.logs.hiByeLog);
			
					if (typeof log !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setTitle('member joined')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#29C200')
							.setAuthor(member.displayName, member.user.displayAvatarURL())
							.addFields(
								{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
								{ name :'member count', value :'#' + member.guild.memberCount, inline : true },
								{ name :'ID', value :member.id, inline : true },
				
							);
				
						log.send(embed);
					}
					if(!member.bot){
						if (typeof role !== 'undefined' ) {
							member.roles.add(role).catch(console.error);
						}
						if (typeof room !== 'undefined'){
							room.send(`:green_circle:  Welcome <@${member.id}> to the server, have a great time :+1:`);
						}
					}
					break;
				}
			}
		}catch (err) {console.log(err);}
	})
})

	



// bye message/log
client.on('guildMemberRemove', (member) => {


	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (member.guild.id === i.guildId) {

					const ByeChannel = client.channels.cache.get(i.hiByeChannel);
					const log = member.guild.channels.cache.get(i.logs.hiByeLog);
				
					if (typeof log !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setTitle('member left')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#DB0000')
							.setAuthor(member.displayName, member.user.displayAvatarURL())
							.addFields(
								{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
								{ name :'joined at', value :`${moment(member.joinedAt).fromNow()} /\n${moment(member.joinedAt).format('MMM Do YY')}`, inline : true },
								{ name :'ID', value :member.id, inline : true },
				
							);
						log.send(embed);
					
					}
					if (typeof ByeChannel !== 'undefined'){
						ByeChannel.send(`:red_circle:  <@${member.id}>  just left the server, bye bye :wave:`);
					}
					break;
				}
			}
		}catch (err) {console.log(err);}
	})
});


// message deletion logs


client.on('messageDelete', (message) => {
	

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId) {

					const deleteLogs = message.channel.guild.channels.cache.get(i.logs.deleteLog);
					switch (message.channel.id) {
						case i.logs.hiByeLog: 
						case i.logs.deleteLog: 
						case i.logs.serverLog: 
						case i.logs.warningLog: return;	
					}	
					if(message.author.bot || message.content.startsWith(i.prefix)) return;	
					if(typeof deleteLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setAuthor(message.author.username, message.author.displayAvatarURL())
							.setTitle('Message deleted')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#DB0000')
							.addFields(
								{ name:'deleted from', value:message.channel, inline:true },
								{ name:'Message content', value:message.content, inline: false },
							);
						deleteLogs.send(embed);
				
					}
					if (typeof ByeChannel !== 'undefined'){
						ByeChannel.send(`:red_circle:  <@${member.id}>  just left the server, bye bye :wave:`);
					}
					break;
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
});




// server logs (roles, channels)
client.on('channelCreate', (channel) => {
	if(channel.type === 'dm') return;



	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (channel.guild.id === i.guildId) {
					const serverLogs = channel.guild.channels.cache.get(i.logs.serverLog);
					if (typeof serverLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setColor('#29C200')
							.setFooter('Developed by Crazy4k')
							.setTimestamp()
							.setTitle('Channel created')
							.addFields(
								{ name:'name', value:channel.name, inline: false },
								{ name:'Category', value:channel.parent, inline: false },
								{ name:'created at', value:`${moment(channel.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: false },
								{ name:'ID', value: channel.id, inline: false },
							);
						serverLogs.send(embed);
					}
					break;
					//statments here
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
});




// channel delete logs
client.on('channelDelete', (channel) => {
	if(channel.type === 'dm') return;
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
			try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (channel.guild.id === i.guildId) {
					const serverLogs = channel.guild.channels.cache.get(i.logs.serverLog);
					if (typeof serverLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setColor('#DB0000')
							.setFooter('Developed by Crazy4k')
							.setTimestamp()
							.setTitle('Channel Deleted')
							.addFields(
								{ name:'name', value:channel.name, inline: false },
								{ name:'Category', value:channel.parent, inline: false },
								{ name:'created at', value:`${moment(channel.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: false },
								{ name:'ID', value: channel.id, inline: false },
							);
						serverLogs.send(embed);
					}
					break;
				}
				
			}	
		}catch (err) {console.log(err);}
	})
	
	
});




//channel update logging(still under development and will probably still be for ever lol. It's just i cant figure this shit out)
client.on('channelUpdate', (oldChannel, newChannel)=> {
	if(oldChannel.type === 'dm') return;

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (oldChannel.guild.id === i.guildId) {
					const serverLogs = oldChannel.guild.channels.cache.get(i.logs.serverLog);		
					if(typeof serverLogs !== 'undefined') {
						try {
							const tur = [];
							if(oldChannel.permissionOverwrites.array()[0].deny.bitfield !== newChannel.permissionOverwrites.array()[0].deny.bitfield || oldChannel.permissionOverwrites.array()[0].allow.bitfield !== newChannel.permissionOverwrites.array()[0].allow.bitfield)tur.push('permissionss');
							if(oldChannel.name !== newChannel.name)tur.push('name');
							if(oldChannel.parentID !== newChannel.parentID)tur.push('category');
							if(oldChannel.nsfw === true && newChannel.nsfw === false || oldChannel.nsfw === false && newChannel.nsfw === true)tur.push('NSFW');
							if(!tur.length)return;
							let embed = new Discord.MessageEmbed()
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#02A3F4')
								.setTitle('Channel edited')
								.addFields(
									{ name:'Channel', value:`<#${oldChannel.id}>`, inline:true },
									{ name:'ID', value:oldChannel.id, inline:true },
								);

							for (const e of tur) {
								if(e === 'name') {
									embed.addField('Channel name changed :eye:', `before: ${oldChannel.name} \nafter: ${newChannel.name}`, false);
								}
								if(e === 'NSFW') {
									embed.addField('NSFW status changed :underage:', `before: ${oldChannel.nsfw} \nafter: ${newChannel.nsfw}`, false);
								}
								if(e === 'category') {
									embed.addField('Category changed :arrow_double_up:', `before: ${oldChannel.parent} \nafter: ${newChannel.parent}`, false);
								}
							}
							serverLogs.send(embed);
						} catch(error) {
							console.error;
						}
					}
					break;
				}
			}
		}catch (err) {console.log(err);}
	});
	
});






//message update logging
client.on('messageUpdate', (oldMessage, newMessage) => {

	

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (oldMessage.guild.id === i.guildId) {
					if(oldMessage.author.bot || oldMessage.content.startsWith(i.prefix)) return;
					const deleteLogs = oldMessage.channel.guild.channels.cache.get(i.logs.deleteLog);
					if(typeof deleteLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
							.setTitle('Message edited')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#02A3F4')
							.addFields(
								{ name:'edited on', value:oldMessage.channel, inline:true },
								{ name:'Before', value:oldMessage.content, inline: false },
								{ name:'After', value:newMessage.content, inline: false },
							);
						deleteLogs.send(embed);
					}
					break;
					//statments here
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
	
	
});
client.on("emojiCreate", async emoji =>{
	const maker = await emoji.fetchAuthor();
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (emoji.guild.id === i.guildId) {
					const log = emoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji created", "", "3EFF00", true);
						embed.addFields(
							{name:"Emoji name:", value:`${emoji.name}`, inline:true},
							{name:"Emoji ID:", value:`${emoji.id}`, inline:true},
							{name:"Created by:", value:`<@${maker.id}>`, inline:true},
							{name:"Created at:", value:`${emoji.createdAt}`, inline:true},
						);
						log.send(embed).then(m=>m.react(emoji.id));
					}
					break;					
				}
			}		
		}catch (err) {console.log(err)}
	})
});
client.on("emojiDelete", async emoji =>{
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (emoji.guild.id === i.guildId) {
					const log = emoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji deleted", "", "FF0000", true);
						embed.addFields(
							{name:"Emoji name:", value:`${emoji.name}`, inline:true},
							{name:"Emoji ID:", value:`${emoji.id}`, inline:true},
							{name:"Created at:", value:`${moment(emoji.createdAt).fromNow()} /\n${moment(emoji.createdAt).format('MMM Do YY')}`, inline:true},
						);
						log.send(embed);
					}
					break;					
				}
			}		
		}catch (err) {console.log(err)}
	})
});



client.on("emojiUpdate", async (oldEmoji, newEmoji) =>{

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (oldEmoji.guild.id === i.guildId) {
					const log = oldEmoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji edited", "", "02A3F4", true);
						embed.addFields(
							{name:"Old emoji name:", value:`${oldEmoji.name}`, inline:true},
							{name:"New emoji name:", value:`${newEmoji.name}`, inline:true},
							{name:"Created at:", value:`${moment(oldEmoji.createdAt).fromNow()} /\n${moment(oldEmoji.createdAt).format('MMM Do YY')}`, inline:true},
						);
						log.send(embed).then(m=>m.react(newEmoji.id));
					}	
					break;				
				}
			}		
		}catch (err) {console.log(err)}
	})
});








client.login(token);
client.once('ready', async() => {
	console.log('Bot succesfuly launched.');

});