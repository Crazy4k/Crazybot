const Discord = require('discord.js');
const { Intents } = require('discord.js');
const fs = require('fs');
const mongo = require("./mongo");
const noblox = require("noblox.js");
require("dotenv").config();

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

const makeEmbed = require("./functions/embed");
const colors = require("./config/colors.json")
const executeCommand = require("./functions/executeCommand");
const executeSlashCommand = require("./functions/executeSlashCommand");
const pointsSchema = require("./schemas/points-schema");
const serversSchema = require("./schemas/servers-schema");
const warnSchema = require("./schemas/warn-schema");
const raiderTrackerSchema = require("./schemas/raiderTracker-schema");
const officerPointsSchema = require("./schemas/officerPoints-schema");
let {guildsCache, commandCoolDownCache} = require("./caches/botCache");
let botCache = require("./caches/botCache");
const sync = require("./functions/sync");
const config = require("./config/config.json");
module.exports = client;
let isReady = false;

client.login(token);

const turnOnRoblox = async()=>{
	const currentUser = await noblox.setCookie(cookie)
	console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
	
}
turnOnRoblox();

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

const guildCreate		= require('./logs/guildCreate');
const guildDelete		= require('./logs/guildDelete');
const guildMemberAdd	= require("./logs/guildMemberAdd");	
const guildMemberUpdate	= require("./logs/guildMemberUpdate");
const guildMemberRemove	= require("./logs/guildMemberRemove");
const messageDelete		= require("./logs/messageDelete");
const channelCreate		= require("./logs/channelCreate.js");
const channelDelete		= require("./logs/channelDelete");
const channelUpdate		= require("./logs/channelUpdate");
const messageUpdate		= require("./logs/messageUpdate");
const emojiCreate		= require("./logs/emojiCreate");
const emojiDelete		= require("./logs/emojiDelete");
const emojiUpdate		= require("./logs/emojiUpdate");


//command handler|prefix based

client.on('messageCreate', async (message) => {
	if(!isReady)return
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
			if(!server)return;


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

	const testGuild = client.guilds.cache.get(config.bot_info.testGuildId);
	let commands;
	if(testGuild){
		commands = testGuild.commands;
	} else {
		commands = client.application?.commands;
	}
	client.slashCommands.each(command => {
		commands?.create(command).catch(e=>console.log(e));
	})
	

	console.log(`Bot succesfuly logged in as ${client.user.tag} [${client.user.id}]`);
	isReady = true;


});
client.on('guildCreate', async (guild)  => {
	if(!isReady)return		
	try {
		guildCreate(guild, client);
	} catch (error) {
		console.log(error);
		console.log("guildCreate error");
	}
});

client.on('guildDelete', async (guild, client) => {
	if(!isReady)return
	try {
		guildDelete(guild, client);
	} catch (error) {
		console.log(error);
		console.log("guildDelete error");
	}
});

client.on('guildMemberAdd', (member)=> {
	if(!isReady)return
	try {
		guildMemberAdd(member, client);
	} catch (error) {
		console.log(error);
	}
});

client.on('guildMemberUpdate', (oldMember, newMember)=> {
	if(!isReady)return
	try {
		guildMemberUpdate(oldMember, newMember, client);
	} catch (error) {
		console.log(error);
	}	
});

// bye message/log
client.on('guildMemberRemove', (member) => {
	if(!isReady)return
	try {
		guildMemberRemove(member, client);
	} catch (error) {
		console.log(error);
	}
});

// message deletion logs
client.on('messageDelete', (message) => {
	if(!isReady)return
	try {
		messageDelete(message, client);
	} catch (error) {
		console.log(error);
	}	
});

// server logs (roles, channels)
client.on('channelCreate', (channel) => {
	if(!isReady)return
	try {
		channelCreate(channel, client);
	} catch (error) {
		console.log(error);
	}
});

// channel delete logs
client.on('channelDelete', (channel) => {
	if(!isReady)return
	try {
		channelDelete(channel, client);	
	} catch (error) {
		console.log(error);
	}
});

//channel update log
client.on('channelUpdate', (oldChannel, newChannel)=> {
	if(!isReady)return
	try {
		channelUpdate(oldChannel,newChannel, client);
	} catch (error) {
		console.log(error);
	}
});

//message update logging
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(!isReady)return
	try {
		messageUpdate(oldMessage, newMessage, client);
	} catch (error) {
		console.log(error);
	}
});

client.on("emojiCreate", async emoji =>{
	if(!isReady)return
	try {
		emojiCreate(emoji, client);
	} catch (error) {
		console.log(error);
	}
});

client.on("emojiDelete", async emoji =>{
	if(!isReady)return
	try {
		emojiDelete(emoji, client);
	} catch (error) {
		console.log(error);
	}
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) =>{
	if(!isReady)return
	try {
		emojiUpdate(oldEmoji,newEmoji, client);
	} catch (error) {
		console.log(error);
	}
});

client.on("error", async error =>{
	console.log("cought an error sir!");
	console.log(error);
});

client.on("interactionCreate",async (interaction)=>{ 
	if(!isReady)return
	if(!interaction.isCommand())return;

	if(!interaction.guild){
		let {commandName, options} = interaction;
		let command = client.slashCommands.get(commandName);
		executeSlashCommand(command, interaction, options["_hoistedOptions"], config.bot_info.dmSettings, client, commandCoolDownCache, true);
	}

	if(!guildsCache[interaction.guildId] ){
		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await serversSchema.findOne({_id:interaction.guildId});
				guildsCache[interaction.guildId] = data;
			} catch(error){
				console.log(error);
				console.log("ERROR IN LINE 379")
			}finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
	try {
		let server = guildsCache[interaction.guildId];
		if(server === null ) {
			sync(interaction);
			return;
		}
		if(!server)return;

		let {commandName, options} = interaction;
		let command = client.slashCommands.get(commandName)
		executeSlashCommand(command, interaction, options["_hoistedOptions"], server, client, commandCoolDownCache);
		
			
	} catch (err) {console.log(err);}

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
			
	
		setInterval(async () => {
			try {
				for(let groupId in groupsObj){
					await trackCustomRaiders( noblox, botCache.customTrackedRaiders, groupId, client, botCache.raiderTrackerChannelCache.custom.channels)	
				}

			} catch (error) {
				console.log("error in line 468 bruh")
				console.log(console.log(error));
			}
			
		}, 170 * 1000);




	} catch (error) {
		console.log(error)
		console.log("line 477")
	}

	
})()


let iter = 0;


setInterval(()=>{
	client.guilds.fetch();
	let members = 0; 
	client.guilds.cache.each(guild => members += guild.memberCount);
	let servers  = client.guilds.cache.size;
	let raiderCount = botCache.trackedRaiders.length;
	

	let status = [
		{str:`${members} members in ${servers} servers `,type:{type: "WATCHING"}},
		{str:`${raiderCount} raiders`,type:{type: "WATCHING"}},
		{str:"to ;updates",type:{type: "LISTENING"}},
		{str:"to ;help",type:{type: "LISTENING"}},
		{str:"over your points",type:{type: "WATHCING"}},
		{str:"developed by crazy4k#0091",type:{type: "PLAYING"}},
		{str:`CrazyBot ${config["bot_info"].version}`,type:{type: "PLAYING"}},

	];


	let luckyWinner = status[iter];
	if(status.length - 1 === iter)iter = 0;
	else iter++;
	client.user.setActivity(luckyWinner.str,luckyWinner.type);
},1000 * 60 *15);
	

	



