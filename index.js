const Discord = require('discord.js');
const fs = require('fs');
const { type } = require('os');
const client = new Discord.Client();
const {token,} = require('./config.json');
const moment = require('moment');
const keepAlive = require('./server.js');
const makeEmbed = require('./embed.js');
const {prefix} = require('./config.json');


keepAlive();
client.commands = new Discord.Collection();
const commandfiles01 = fs.readdirSync('./Cfun/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Cmoderation/').filter(file =>file.endsWith('.js'));
const commandfiles03 = fs.readdirSync('./Cothers/').filter(file =>file.endsWith('.js'));

client.once('ready', function() {
	console.log('Bot succesfuly launched.');
});


// getting all the commands.
for(const file of commandfiles01) {
	const command = require(`./Cfun/${file}`);
	client.commands.set(command.name, command);
}
for(const file of commandfiles02) {
	const command = require(`./Cmoderation/${file}`);
	client.commands.set(command.name, command);
}
for(const file of commandfiles03) {
	const command = require(`./Cothers/${file}`);
	client.commands.set(command.name, command);
}

const { hiByeChannel, hiRole, hiByeLog, deleteLog, serverLog, warningLog } = require('./info.json');
const logChannels = [hiByeLog, deleteLog, serverLog, warningLog];

client.on('guildCreate', guild => {

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (guild.id === i.guildId) return;
			}
			const serverObject = {
				guildId: guild.id,
				hiByeChannel:"",
				hiRole: "",
				hiByeLog:"",
				deleteLog:"",
				serverLog:"",
				warningLog:"",
				deleteMessagesInLogs : true,
				deleteFailedCommands : true	
			};
			
			JsonedDB.push(serverObject);

			fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
				if(err) {
					message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
					console.log(err);
				} else {

					return console.log(`joined a new server. name: ${guild.name}`);
				}
			});
		} catch (err) {console.log(err);}
	})
});


// setting up all the commands
client.on('message', message =>{

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId && !message.author.bot){

					switch (message.channel.id) {
						case i.hiByeLog: 
						case i.deleteLog: 
						case i.serverLog: 
						case i.warningLog: 
						message.delete().catch(console.error);
						message.channel.send('You can\'t send a message in the logs :x:')
							.then(msg=> msg.delete({ timeout:2000 })).catch(console.error);
						break;
					}		
				}
			}
		} catch (err) {console.log(err);}
	})

	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm' && message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	// checks if a whiteList property exists in the command, and if it does, it checks if the author has the permission
	function checkWhiteList() {
		if(!command.whiteList) {
			try{
				command.execute(message, args);
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
			for(const e of command.whiteList) {
				if(dude.hasPermission(e)) {
					command.execute(message, args);
				}
			}
		}
		catch(error) {
			console.error(error);
			const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \ncontact the developer to fix this problem.', true, 'FF0000');
			message.channel.send(embed);
		}
		return;
	}

	checkWhiteList();
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

					const room = member.guild.channels.cache.get(i.hiByeChannel);
					const role = member.guild.roles.cache.get(i.hiRole);
					const log = member.guild.channels.cache.get(i.hiByeLog);
			
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
				
					if (typeof role !== 'undefined' ) {
						member.roles.add(role).catch(console.error);
					}
					if (typeof room !== 'undefined'){
						room.send(`:green_circle:  Welcome <@${member.id}> to the server, have a great time :+1:`);
					}
			}}
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
					const log = member.guild.channels.cache.get(i.hiByeLog);
				
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
			}}
		}catch (err) {console.log(err);}
	})
});


// message deletion logs


client.on('messageDelete', (message) => {
	if(message.author.bot || message.content.startsWith(prefix)) return;

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId) {

					const deleteLogs = message.channel.guild.channels.cache.get(i.deleteLog);
					switch (message.channel.id) {
						case i.hiByeLog: 
						case i.deleteLog: 
						case i.serverLog: 
						case i.warningLog: return;	
					}		
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
				if (message.guild.id === i.guildId) {
					const serverLogs = channel.guild.channels.cache.get(i.serverLog);
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
				if (message.guild.id === i.guildId) {
					const serverLogs = channel.guild.channels.cache.get(i.serverLog);
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
					
					}
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
	
	
});




//channel update logging(still under development)
client.on('channelUpdate', (oldChannel, newChannel)=> {
	if(oldChannel.type === 'dm') return;

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId) {

					const serverLogs = channel.guild.channels.cache.get(i.serverLog);
					if(typeof serverLogs !== 'undefined') {
						try {
							const tur = [];
							if(oldChannel.permissionOverwrites.array()[0].deny.bitfield !== newChannel.permissionOverwrites.array()[0].deny.bitfield || oldChannel.permissionOverwrites.array()[0].allow.bitfield !== newChannel.permissionOverwrites.array()[0].allow.bitfield)tur.push('permissionss');
							if(oldChannel.name !== newChannel.name)tur.push('name');
							if(oldChannel.parentID !== newChannel.parentID)tur.push('category');
							// console.log(oldChannel.parentID);
							// console.log(newChannel.parentID);
							if(oldChannel.nsfw === true && newChannel.nsfw === false || oldChannel.nsfw === false && newChannel.nsfw === true)tur.push('NSFW');
							if(!tur.length)return;
							const embed = new Discord.MessageEmbed()
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#02A3F4')
								.setTitle('Channel edited')
								.addFields(
									{ name:'ID', value:oldChannel.id, inline:true },
									{ name:'', value:oldChannel.id, inline:true },
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
						}
						catch(error) {
							console.error;
						}
					//statments here
				}
				}
			
			
		}}catch (err) {console.log(err);}
	})
	
	}
);






//message update logging
client.on('messageUpdate', (oldMessage, newMessage) => {

	if(oldMessage.author.bot || oldMessage.content.startsWith(prefix)) return;

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId) {

					const deleteLogs = oldMessage.channel.guild.channels.cache.get(i.deleteLog);
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
					//statments here
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
	
	
});

// once everything loads, the bot logs in
client.login(token);
