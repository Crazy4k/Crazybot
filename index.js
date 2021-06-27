const Discord = require('discord.js');
require("dotenv").config();
const fs = require('fs');
const client = new Discord.Client();
module.exports = client;
const token = process.env.DISCORD_BOT_TOKEN;
const checkWhiteList = require("./functions/checkWhiteList");
const keepAlive = require('./server.js');
const mongo = require("./mongo");
const pointsSchema = require("./schemas/points-schema");
const serversSchema = require("./schemas/servers-schema");
let guildsCache = require("./caches/guildsCache");

keepAlive();


client.commands = new Discord.Collection();


const bigcommandfile = fs.readdirSync("./Commands/");

for(let category of bigcommandfile){

	const smallCommandFile = fs.readdirSync(`./Commands/${category}/`).filter(file =>file.endsWith('.js'));

	for(const file of smallCommandFile) {

		const command = require(`./Commands/${category}/${file}`);

		client.commands.set(command.name, command);
	}
}

client.on('guildCreate', async (guild)  => {
		
	try {
		const serverObject = {
			guildId: guild.id,
			hiByeChannel:"",
			hiRole: "",
			language:"English",
			prefix : "!",
			muteRole:"",
			defaultEmbedColor:"#f7f7f7",
			deleteFailedMessagedAfter: 10000,
			deleteMessagesInLogs : true,
			deleteFailedCommands : false,
			isSet:false,
			pointsEnabled: false,
			logs :{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:""},
			warningRoles: {	firstwarningRole:"",secondWarningRole:"",thirdWarningRole:""}
		};

		await mongo().then(async (mongoose) =>{
			try{ 
				await serversSchema.findOneAndUpdate({_id:guild.id},{
					_id: guild.id,
					hiByeChannel:"",
					hiRole:"",
					language:"English",
					prefix:"!",
					muteRole:"",
					defaultEmbedColor:"#f7f7f7",
					deleteFailedMessagedAfter:10000,
					deleteMessagesInLogs:true,
					deleteFailedCommands:false,
					isSet:false,
					pointsEnabled:false,
					logs:{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:""},
					warningRoles:{firstwarningRole:"",secondWarningRole:"",thirdWarningRole:""},    
				},{upsert:true});
				guildsCache[guild.id] = serverObject;
			} finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});

			mongo().then(async (mongoose) =>{
				try{
					await pointsSchema.findOneAndUpdate({_id:guild.id},{
						_id:guild.id,
						whiteListedRole:"",
						members:{}   
					},{upsert:true});
				} finally{
					
					console.log("WROTE TO DATABASE");
					mongoose.connection.close();
				}
			});	
			console.log(`joined a new server. name: ${guild.name}`);
		} catch (err) {console.log(err);}
	

});


client.on('guildDelete', async (guild) => {

	guildsCache[guild.id] = null;
	try {

		await mongo().then(async (mongoose) =>{
			try{ 
				await serversSchema.findOneAndDelete({_id:guild.id});
			} finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});

		await mongo().then(async (mongoose) =>{
			try{ 
				await pointsSchema.findOneAndDelete({_id:guild.id});
			} finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});			
		
			
	} catch (err) {console.log(err);}
});

let recentlyRan = [];
// guildID-authorID-commandname
//recentlyRan handles the cooldown mechanic



//command handler|prefix based
//i like to devide this into multiple pieces since it's a bit weird
client.on('message', async (message) => {
	if(message.channel.type === "dm")return;
	if(!guildsCache[message.guild.id]){
		await mongo().then(async (mongoose) =>{
			try{ 
				guildsCache[message.guild.id] = await serversSchema.findOne({_id:message.guild.id});
			} finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
		try {
			let server = guildsCache[message.guild.id];
				if (!message.author.bot){
					if(server.deleteMessagesInLogs) {
						// if the "server.deleteMessagesInLogs" is set to true, it instantly deletes the message if it was sent inside a log channel
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
					
				}
			
		} catch (err) {console.log(err);}
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
const messageDelete = require("./logs/messageDelete");
client.on('messageDelete', (message) => {
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



	
client.once('ready', async() => {

	await mongo().then(mongoose =>{
		try{
			console.log("Connected to mongo.");
		}catch(e){
			console.log("Failed to Connect to mongo.");
		}
		finally
		{
			mongoose.connection.close();
		}
	})
	console.log('Bot succesfuly launched.');

});
client.login(token);