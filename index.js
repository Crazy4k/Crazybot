const Discord = require('discord.js');
const fs = require('fs');
const { type } = require('os');
const client = new Discord.Client();
const { prefix,authorID,
	token, devToken,
} = require('./config.json');
const moment = require('moment');


client.commands = new Discord.Collection();
const commandfiles01 = fs.readdirSync('./Cfun/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Cmoderation/').filter(file =>file.endsWith('.js'));
const commandfiles03 = fs.readdirSync('./Cothers/').filter(file =>file.endsWith('.js'));

client.once('ready', function() {
	console.log('bot succesfuly launched');
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
const { name } = require('./Cfun/rickRoll');
const logChannels = [hiByeLog, deleteLog, serverLog, warningLog];


// setting up all the commands
client.on('message', message =>{
	for (const e of logChannels) {
		if(message.channel.id === e && !message.author.bot) {
			message.delete({ timeout: 250 })
				.catch(console.error);
			message.channel.send('You can\'t send a message in the logs :x:')
				.then(msg=> msg.delete({ timeout:2000 }))
				.catch(console.error);
			return;
		}
	}



	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm' && message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	// checks if a whiteList property exists in the command and if it does check if the author is on it
	function checkWhiteList() {
		if(!command.whiteList) {
			try{
				command.execute(message, args);
			}
			catch(error) {
				console.error(error);
				const embed = new Discord.MessageEmbed()
					.setTitle('ERROR 101')
					.setColor('FF0000')
					.setDescription('There was an issue executing the command \ncontact the developer to fix this problem.')
					.setFooter('developed by crazy4K')
					.setTimestamp();
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
			const embed = new Discord.MessageEmbed()
				.setTitle('ERROR 102')
				.setColor('FF0000')
				.setDescription('There was an issue executing the command \ncontact the developer to fix this problem.')
				.setFooter('developed by crazy4K')
				.setTimestamp();
			message.channel.send(embed);
		}
		return;
	}

	checkWhiteList();
});


// a random number generator
function pickRandom(obj) {
	if(typeof obj === 'string' || obj === 'array') {
		const number = Math.floor(Math.random()) * obj.length;
		return number;
	}
	if(typeof obj === 'number') {
		const number = Math.floor(Math.random) * Math.floor(obj);
		return number;
	}

}
/*	________
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|	|
	|       |____________
	|		    |
	|		    |
	|___________________|




*/
client.on('guildMemberAdd', (member)=> {
	/*try {
		if(member.id === authorId) {
			member.roles.add('admin role id');
		}
	}
	catch (error) { console.log(error); }
	*/
	const room = member.guild.channels.cache.get(hiByeChannel);
	const role = member.guild.roles.cache.get(hiRole);
	const log = member.guild.channels.cache.get(hiByeLog);

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
	if (typeof room === 'undefined') return;
	if (typeof role !== 'undefined') {
		member.roles.add(role).catch(console.error);
	}
	room.send(`:green_circle:  Welcome <@${member.id}> to the server, have a great time :+1:`);
});


// bye message/log
client.on('guildMemberRemove', (member) => {
	const ByeChannel = client.channels.cache.get(hiByeChannel);
	const log = member.guild.channels.cache.get(hiByeLog);

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

	if (typeof ByeChannel === 'undefined') return;
	ByeChannel.send(`:red_circle:  <@${member.id}>  just left the server, bye bye :wave:`);
});


// message deletion logs


client.on('messageDelete', (message) => {
	if(message.author.bot || message.content.startsWith(prefix)) return;
	const deleteLogs = message.channel.guild.channels.cache.get(deleteLog);
	for (const e of logChannels) {
		if(message.channel.id === e && !message.author.bot)return;
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
});


// server logs (roles, channels)

client.on('channelCreate', (channel) => {
	if(channel.type === 'dm') return;
	const serverLogs = channel.guild.channels.cache.get(serverLog);
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
});


function meowify(stuff) {
	const pErmissions = new Discord.Permissions([stuff]);
	const permos = pErmissions.toArray();
	return permos;

}


// channel delete logs


client.on('channelDelete', (channel) => {
	if(channel.type === 'dm') return;
	const serverLogs = channel.guild.channels.cache.get(serverLog);
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
});

//channel update logging(still under development)
client.on('channelUpdate', (oldChannel, newChannel)=> {
	if(oldChannel.type === 'dm') return;
	const serverLogs = oldChannel.guild.channels.cache.get(serverLog);
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
	}
},
);
//message update logging
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.author.bot || oldMessage.content.startsWith(prefix)) return;
	const deleteLogs = oldMessage.channel.guild.channels.cache.get(deleteLog);
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
});

// once everything loads, the bot logs in
client.login(token);
