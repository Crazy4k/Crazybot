const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
module.exports = client;
const {token} = require('./config.json');
const checkWhiteList = require("./functions/checkWhiteList");
const keepAlive = require('./server.js');


keepAlive();



client.commands = new Discord.Collection();

const commandfiles01 = fs.readdirSync('./Commands/fun/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Commands/moderation/').filter(file =>file.endsWith('.js'));
const commandfiles03 = fs.readdirSync('./Commands/others/').filter(file =>file.endsWith('.js'));
const commandfiles04 = fs.readdirSync("./Commands/Server configurations/").filter(file =>file.endsWith('.js'));
const commandfiles05 = fs.readdirSync("./Commands/points/").filter(file =>file.endsWith('.js'));

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
for(const file of commandfiles05) {
	const command = require(`./Commands/points/${file}`);
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
				pointsEnabled: false,
				defaultEmbedColor:"#f7f7f7",
				deleteFailedMessagedAfter: 10000,
				deleteMessagesInLogs : true,
				deleteFailedCommands : false,
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
			const lol = { 
				guildID: guild.id,
				isSet: false,
				whiteListedRole:"",
				members:{},
			}
			fs.readFile("./Commands/points/points.json", 'utf-8', (err, e)=>{
				if(err){
					console.log(err);
					return false;
				}
				const readable = JSON.parse(e);
				readable.push(lol);
				fs.writeFile("./Commands/points/points.json", JSON.stringify(readable, null, 2), err => {				
					if(err) console.log(err);					
				});
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
			
			for(let i of JsonedDB) {
				if (guild.id === i.guildId) {
					JsonedDB.splice(JsonedDB.indexOf(i), 1);
					
					fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
						if(err) {
							
							console.log(err);
						} else {
							console.log(`Left a server. name: ${guild.name}`);
						}
					});
					break;
				}
				fs.readFile("./Commands/points/points.json", 'utf-8', (err, e)=>{
					if(err){
						console.log(err);
						return false;
					}
					const readable = JSON.parse(e);
					for(const server1 of readable){
						if(guild.id === server1.guildID){
							readable.splice(readable.indexOf(server1), 1);

							fs.writeFile("./Commands/points/points.json", JSON.stringify(readable, null, 2), err => {
								if(err) console.log(err);
							});
							break;
						}
					}
					
					
				});
			}	
		} catch (err) {console.log(err);}
	})
});

let recentlyRan = [];
// guildID-authorID-commandname


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
					//if (!client.commands.has(commandName)) return;
					//then finally after all of the checks, the commands executes 
					//btw checkWhiteList() is a pretty big function that does exactly what it called, but with a bunch of extra check. Path: ./functions/checkWhiteList.js
					const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName));
					if(command)checkWhiteList(command, message, args, server, recentlyRan);
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

const guildMemberAdd = require("./logs/guildMemberAdd");
client.on('guildMemberAdd', (member)=> {
	guildMemberAdd(member);
	
});

	


// bye message/log
const guildMemberRemove = require("./logs/guildMemberRemove");
client.on('guildMemberRemove', (member) => {
	guildMemberRemove(member);
});


// message deletion logs
const checkGhostPing = require("./Features/ghostPingDetector");
const messageDelete = require("./logs/messageDelete");
client.on('messageDelete', (message) => {
	checkGhostPing(message);
	messageDelete(message);
});



// server logs (roles, channels)
const channelCreate = require("./logs/channelCreate.js");
client.on('channelCreate', (channel) => {
	channelCreate(channel);
});



// channel delete logs
const channelDelete = require("./logs/channelDelete");
client.on('channelDelete', (channel) => {
	channelDelete(channel);	
});


//channel update logging(still under development and will probably still be for ever lol. It's just i cant figure this shit out)
const channelUpdate = require("./logs/channelUpdate");
client.on('channelUpdate', (oldChannel, newChannel)=> {
	channelUpdate(oldChannel,newChannel);
});


//message update logging
const messageUpdate = require("./logs/messageUpdate");
client.on('messageUpdate', (oldMessage, newMessage) => {
	messageUpdate(oldMessage, newMessage);
});


const emojiCreate = require("./logs/emojiCreate");
client.on("emojiCreate", async emoji =>{
	emojiCreate(emoji);
});


const emojiDelete = require("./logs/emojiDelete");
client.on("emojiDelete", async emoji =>{
	emojiDelete(emoji);
	
});


const emojiUpdate = require("./logs/emojiUpdate");
client.on("emojiUpdate", async (oldEmoji, newEmoji) =>{
	emojiUpdate(oldEmoji,newEmoji);
});



client.login(token);
client.once('ready', async() => {
	console.log('Bot succesfuly launched.');

});