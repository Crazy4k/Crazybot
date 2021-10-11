const Discord = require('discord.js');
const { Intents } = require('discord.js');
const fs = require('fs');
const mongo = require("./mongo");
const noblox = require("noblox.js");
require("dotenv").config();
const moment = require("moment")

//const { REST } = require('@discordjs/rest');
//const { Routes } = require('discord-api-types/v9');
let intentArray =[
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGES,
];
const client = new Discord.Client({ intents: intentArray ,partials:["CHANNEL"]});

const token = process.env.DISCORD_BOT_TOKEN;
const cookie = process.env.NBLXJS_COOKIE;

const pickRandom = require("./functions/pickRandom");
const executeCommand = require("./functions/executeCommand");
const pointsSchema = require("./schemas/points-schema");
const serversSchema = require("./schemas/servers-schema");
const warnSchema = require("./schemas/warn-schema");
const raiderTrackerSchema = require("./schemas/raiderTracker-schema");
const officerPointsSchema = require("./schemas/officerPoints-schema");
let {guildsCache, commandCoolDownCache} = require("./caches/botCache");
let botCache = require("./caches/botCache");
const sync = require("./functions/sync");
const keepAlive = require('./server.js');
const config = require("./config.json");
module.exports = client;

client.login(token);

const turnOnRoblox = async()=>{
	const currentUser = await noblox.setCookie(cookie)
	console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
	
}
turnOnRoblox();
keepAlive();

client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();


const bigcommandfile = fs.readdirSync("./Commands/");

for(let category of bigcommandfile){
	
	const smallCommandFile = fs.readdirSync(`./Commands/${category}/`).filter(file =>file.endsWith('.js'));

	for(const file of smallCommandFile) {

		const command = require(`./Commands/${category}/${file}`);
		client.commands.set(command.name, command);
	}
}



for(let category of bigcommandfile){
	
	const smallCommandFile = fs.readdirSync(`./Commands/${category}/`).filter(file =>file.endsWith('.js'));

	for(const file of smallCommandFile) {

		const command = require(`./Commands/${category}/${file}`);
		
		if(command.isSlashCommand)client.slashCommands.set(command.name, command);
	}
}

client.on('guildCreate', async (guild)  => {
		
	try {
		const serverObject = {
			guildId: guild.id,
			hiByeChannel:"",
			hiRole: "",
			hiString:`:green_circle: {<member>} Welcome to the server, have a great time :+1:`,
			byeString:`:red_circle: {<member>} just left the server, bye bye :wave:`,
			language:"English",
			prefix : ";",
			muteRole:"",
			defaultEmbedColor:"#f7f7f7",
			deleteFailedMessagedAfter: 10000,
			deleteMessagesInLogs : true,
			deleteFailedCommands : false,
			isSet:false,
			pointsEnabled: false,
			logs :{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:"",eventsLog:"",pointsLog:""},
			
		};

		await mongo().then(async (mongoose) =>{
			try{ 
				await serversSchema.findOneAndUpdate({_id:guild.id},{
					_id: serverObject.guildId,
					hiByeChannel: serverObject.hiByeChannel,
					hiRole: serverObject.hiRole,
					hiString:serverObject.hiString,
					byeString:serverObject.byeString,
					language: serverObject.language,
					prefix: serverObject.prefix,
					muteRole: serverObject.muteRole,
					defaultEmbedColor: serverObject.defaultEmbedColor,
					deleteFailedMessagedAfter: serverObject.deleteFailedMessagedAfter,
					deleteMessagesInLogs: serverObject.deleteMessagesInLogs,
					deleteFailedCommands: serverObject.deleteFailedCommands,
					isSet: serverObject.isSet,
					pointsEnabled: serverObject.pointsEnabled,
					logs: serverObject.logs,   
				},{upsert:true});
				guildsCache[guild.id] = serverObject;
			} catch(err){
                console.log(err)
            }finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});

			await mongo().then(async (mongoose) =>{
				try{
					await pointsSchema.findOneAndUpdate({_id:guild.id},{
						_id:guild.id,
						whiteListedRole:"",
						members:{}   
					},{upsert:true});
				}catch(err){
					console.log(err)
				} finally{
					
					console.log("WROTE TO DATABASE");
					mongoose.connection.close();
				}
			});	
			await mongo().then(async (mongoose) =>{
				try{
					await officerPointsSchema.findOneAndUpdate({_id:guild.id},{
						_id:guild.id,
						whiteListedRole:"",
						members:{}   
					},{upsert:true});
				} catch(err){
					console.log(err)
				}finally{
					
					console.log("WROTE TO DATABASE");
					mongoose.connection.close();
				}
			});	
			await mongo().then(async (mongoose) =>{
				try{
					await warnSchema.findOneAndUpdate({_id:guild.id},{
						_id:guild.id,
						whiteListedRole:"",
						members:{}   
					},{upsert:true});
				} catch(err){
					console.log(err)
				}finally{
					
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
				let data = await serversSchema.findOne({_id:guild.id});
				if(data !== null) await serversSchema.findOneAndRemove({_id:guild.id});
			} catch(err){
                console.log(err)
            }finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});

		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await pointsSchema.findOne({_id:guild.id});
				if(data !== null) await pointsSchema.findOneAndRemove({_id:guild.id});

			}catch(err){
                console.log(err)
            } finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});	
		
		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await warnSchema.findOne({_id:guild.id});
				if(data !== null) await warnSchema.findOneAndRemove({_id:guild.id});
			} catch(err){
                console.log(err)
            }finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});		
		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await officerPointsSchema.findOne({_id:guild.id});
				if(data !== null) await officerPointsSchema.findOneAndRemove({_id:guild.id});
			} catch(err){
                console.log(err)
            }finally{
				console.log("WROTE TO DATABASE");
				mongoose.connection.close();
			}
		});			
		console.log(`Left a  server. name: ${guild.name}`);
			
	} catch (err) {console.log(err);}
});


//command handler|prefix based

client.on('messageCreate', async (message) => {
	if(message.author.bot)return;
	if(message.channel.type === "DM" || message.channel.type === "GROUP_DM"){//handle DM commands
		const prefix = config.bot_info.dmSettings.prefix;//universal prefix is ;
			if (!message.content.startsWith(prefix))return;//if not command, return
			let bootLegArgs = message.content.slice(prefix.length).split(/\n/).join(" ");//every "new line" aka "/n" will be treated like a space bar
			const args = bootLegArgs.split(/ +/);// more than one space will be treated like one space bar
			let commandName = args.shift().toLowerCase();//remove command name and lowercase everything (if the message was ";command arg1 arg2" then Command name = ";command" and args= ["arg1", "arg2"] 
			const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName));//get the command from its name or aliases
			if(command){//check if command exists
				if(command.worksInDMs){//check if command works in dms
					executeCommand(command, message, args, config.bot_info.dmSettings, client,commandCoolDownCache, true);//execute command
				} else return;
			} else return;
			
			
		}
	if(!message.guild)return;
	//retrive guild data from data base (only once then it will be saved in a cache)

	if(!guildsCache[message.guildId] ){
		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await serversSchema.findOne({_id:message.guildId});
				guildsCache[message.guildId] = data;
			} catch(error){
				console.log(error);
				console.log("ERROR IN LINE 257")
			}finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
		try {
			let server = guildsCache[message.guildId];
			

			if(server === null ) {
				sync(message);
				return;
			}


				if (!message.author.bot){
					if(server.deleteMessagesInLogs) {
						// if the "server.deleteMessagesInLogs" is set to true, it instantly deletes the message if it was sent inside a log channel
						switch (message.channel.id) {
							case server.logs.hiByeLog: 
							case server.logs.deleteLog: 
							case server.logs.serverLog: 
							case server.logs.warningLog: 
							case server.logs.eventsLog:
							case server.logs.pointsLog:
							message.delete().catch(err=>console.log(err));
							message.channel.send('You can\'t send a message in the logs ❌')
								.then(msg=>{
									setTimeout(()=>{
										if(msg.channel.messages.cache.get(msg.id));msg.delete().catch(err=>console.log(err));
									},4000) 
								}).catch(console.error);
								return;
							break;
						}	
					}
					// then the declaration of the most important variables
					const prefix = server.prefix;
					if (!message.content.startsWith(prefix))return;
					let bootLegArgs = message.content.slice(prefix.length).split(/\n/).join(" ");
					const args = bootLegArgs.split(/ +/);
					//creating an array of arguments. New line is treated as space bar.
					let commandName = args.shift().toLowerCase();
					//break if the command given was invalid
					//if (!client.commands.has(commandName)) return;
					//then finally after all of the checks, the commands executes 
					//btw executeCommand() is a pretty big function that does exactly what it called, but with a bunch of extra check. Path: ./functions/executeCommand.js
					const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName));
					if(command)executeCommand(command, message, args, server,client ,commandCoolDownCache);
					
				}
			
		} catch (err) {console.log(err);}
});


/* 
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers 
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
Event handlers Event handlers Event handlers Event handlers
*/ 
//
const guildMemberAdd = require("./logs/guildMemberAdd");
client.on('guildMemberAdd', (member)=> {
	guildMemberAdd(member);
	
});

	
const guildMemberUpdate = require("./logs/guildMemberUpdate");
client.on('guildMemberUpdate', (oldMember, newMember)=> {
	guildMemberUpdate(oldMember, newMember);
	
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

client.on("error", async error =>{
	console.log("cought an error sir!");
	console.log(error);
});


client.on("interactionCreate",async (interaction)=>{ 
	if(!interaction.isCommand())return;
	console.log("uwu"); 
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
	});

	/*const testGuild = client.guilds.cache.get(config.bot_info.testGuildId);
	let commands;
	if(testGuild){
		commands = testGuild.commands;
	} else {
		commands = client.application?.commands;
	}
	commands?.create(client.slashCommands.get("ping"));*/

	console.log(`Bot succesfuly logged in as ${client.user.tag} [${client.user.id}]`);

});


const getMembers = require("./raiderTracker/getMembers");
const trackRaiders = require("./raiderTracker/getOnlineRaiders");
const raiderGroupsJSON = require("./raiderTracker/raiderGroups.json");
const trackCustomRaiders = require("./raiderTracker/raiderTrackerCustom/getOnlineGroup");

(async () => {
	try {
		await mongo().then(async (mongoose) =>{
			try{
				let data = await raiderTrackerSchema.findOne({_id:"69"});
				botCache.raiderTrackerChannelCache.raiders = data;
	
			} finally{
				console.log("FETCHED TRACKER CHANNELS");
				mongoose.connection.close();
	
			}
		})

		let groupsArray =  []
		for(let group of raiderGroupsJSON){
			groupsArray.push(group.id)
		}
		const groups = await getMembers(groupsArray);
	
		let poop = [...new Set(groups)];
		botCache.trackedRaiders = poop//[941751145,925533746];
	
		setInterval(async () => {
			try {

				let groupsArray =  []
				for(let group of raiderGroupsJSON){
					groupsArray.push(group.id)
				}
				const groups = await getMembers(groupsArray);

				console.log("UPDATED THE RAIDER CACHE")
				let poop = [...new Set(groups)];
				botCache.trackedRaiders.raiders = poop
			} catch (error) {
				console.error(); 
				console.log("Error in line 457")
			}
			
		}, 6 * 60 * 60 * 1000);
		
	
		setInterval(async () => {
			try {
				await trackRaiders( noblox, botCache.trackedRaiders, client, botCache.raiderTrackerChannelCache.raiders.channels)	
			} catch (error) {
				console.log("error in line 468 bruh")
				console.log(console.log(error));
			}
			
		}, 150 * 1000);

		//CUSTOM TRACKER
		
		await mongo().then(async (mongoose) =>{
			try{
				let data = await raiderTrackerSchema.findOne({_id:"420"});
				botCache.raiderTrackerChannelCache.custom = data;
			} finally{
				console.log("FETCHED CUSTOM TRACKER CHANNELS");
				mongoose.connection.close();
	
			}
		})

		let groupsObj =  {};
		for(let group of raiderGroupsJSON){
			const groups = await getMembers(group.id);

			groupsObj[group.id] = (groups);
		}
		botCache.customTrackedRaiders = groupsObj

	
		setInterval(async () => {
			try {

				let groupsObj =  {};
				for(let group of raiderGroupsJSON){
					const groups = await getMembers(group.id);
					groupsObj[group.id] = (groups);
				}
				botCache.customTrackedRaiders = groupsObj;
				console.log("UPDATED THE CUSTOM RAIDER CACHE")
				
			} catch (error) {
				console.log(error)
			}
			
		}, 6* 60 * 60 * 1000); 
			
	
		/*setInterval(async () => {
			try {
				for(let groupId in groupsObj){
					await trackCustomRaiders( noblox, botCache.customTrackedRaiders, groupId, client, botCache.raiderTrackerChannelCache.custom.channels)	
				}

			} catch (error) {
				console.log("error in line 468 bruh")
				console.log(console.log(error));
			}
			
		}, 150 * 1000);*/




	} catch (error) {
		console.log(error)
		console.log("line 477")
	}

	
})()




setTimeout(()=>{
	setInterval(()=>{
		let members = client.users.cache.size;
		let servers  = client.guilds.cache.size;
		let raiderCount = botCache.trackedRaiders.length;
		
	
		let status = [
			{str:` ${members} member in ${servers} servers `,type:{type: "WATCHING"}},
			{str:`over ${raiderCount} raiders`,type:{type: "WATCHING"}},
			{str:"to ;updates",type:{type: "LISTENING"}},
			{str:"to ;help",type:{type: "LISTENING"}},
			{str:"over your points",type:{type: "WATHCING"}},
			{str:"developed by crazy4k#0091",type:{type: "PLAYING"}},
			{str:`CrazyBot ${config["bot_info"].version}`,type:{type: "PLAYING"}},
	
		];
	
	
		let luckyWinner = pickRandom(status)
		client.user.setActivity(luckyWinner.str,luckyWinner.type);
	},1000 * 60 * 15)
	

	
},3000)



