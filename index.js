const Discord = require('discord.js');
const { Intents } = require('discord.js');
const fs = require('fs');
const mongo = require("./mongo");
const noblox = require("noblox.js");
require("dotenv").config();

var { Timer } = require("easytimer.js");
let timer = new Timer();
timer.start();

let intentArray =[
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_MESSAGES,
];
const client = new Discord.Client({ intents: intentArray ,partials:["CHANNEL"]});

const token = process.env.DISCORD_BOT_TOKEN;
const cookie = process.env.NBLXJS_COOKIE;

const executeCommand 					= require("./functions/executeCommand");
const executeSlashCommand 				= require("./functions/executeSlashCommand");
const serversSchema 					= require("./schemas/servers-schema");
const raiderTrackerSchema				= require("./schemas/raiderTracker-schema");
const timerSchema						= require("./schemas/timer-schema");
let {guildsCache, commandCoolDownCache} = require("./caches/botCache");
let botCache 							= require("./caches/botCache");
const sync 								= require("./functions/sync");
const config 							= require("./config/config.json");
const listenToEvents 					= require("./event_listeners/listenToEvents");

module.exports = client;

client.login(token);

const turnOnRoblox = async()=>{
	const currentUser = await noblox.setCookie(cookie)
	console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
	
}
turnOnRoblox();
listenToEvents(client, mongo)

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


//command handler|prefix based

client.on('messageCreate', async (message) => {
	if(!botCache.isReady)return
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



client.on("interactionCreate",async (interaction)=>{ 
	if(!botCache.isReady)return
	if(!interaction.isCommand())return;

	if(!interaction.guild){
		let {commandName, options} = interaction;
		let command = client.slashCommands.get(commandName);
		executeSlashCommand(command, interaction, options["_hoistedOptions"], config.bot_info.dmSettings, client, commandCoolDownCache, true);
		return;
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

		if(server.deleteMessagesInLogs) {
			
			switch (interaction.channel.id) {
				case server.logs.hiByeLog: 
				case server.logs.deleteLog: 
				case server.logs.serverLog: 
				case server.logs.warningLog: 
				case server.logs.eventsLog:
				case server.logs.pointsLog:
					
					interaction.reply({content: "You can't execute commands in logs ❌", ephemeral : true})
					return;
			}	
		}


		let {commandName, options} = interaction;
		let command = client.slashCommands.get(commandName)
		executeSlashCommand(command, interaction, options["_hoistedOptions"], server, client, commandCoolDownCache);
		
			
	} catch (err) {console.log(err);}

});
//handle timeouts

const remind = require("./functions/time-outs/remind");
mongo().then(async (mongoose) =>{
	try{
		const data = await timerSchema.findOne({_id:"remindme"});
		data ? botCache.timeOutCache["remindme"] = data : botCache.timeOutCache["remindme"] = {};
	} catch{
		console.log("e")
	}
	finally{
		console.log("FETCHED FROM DATABASE");
		mongoose.connection.close();
	}
})

timer.addEventListener("minutesUpdated",()=>{
	for(let timeStamp in botCache.timeOutCache["remindme"].data){
		if(parseInt(timeStamp) <= Date.now()){
			
			remind(client,botCache.timeOutCache["remindme"].data[timeStamp]);
			delete botCache.timeOutCache["remindme"].data[timeStamp];

			mongo().then(async (mongoose) =>{
				try{
					await timerSchema.findOneAndUpdate({_id:"remindme"},{
						data:botCache.timeOutCache["remindme"].data
					},{upsert:true});
				} finally{
		
					console.log("WROTE TO DATABASE");
					mongoose.connection.close();
				}
			});
		}
		
	}
	
});



// TSU raider tracker

const getMembers = require("./raiderTracker/getMembers");
const trackRaiders = require("./raiderTracker/getOnlineRaiders");
const raiderGroupsJSON = require("./raiderTracker/raiderGroups.json");

(async () => {
	try {
		await mongo().then(async (mongoose) =>{
			try{
				let data = await raiderTrackerSchema.findOne({_id:"raiders"});
				botCache.raiderTrackerChannelCache.raiders = data;
	
			} finally{
				console.log("FETCHED TRACKER CHANNELS");
				mongoose.connection.close();
	
			}
		});
		await mongo().then(async (mongoose) =>{
			try{
				let data = await raiderTrackerSchema.findOne({_id:"raids"});
				botCache.raiderTrackerChannelCache.raids = data;
	
			} finally{
				console.log("FETCHED RAIDS CHANNELS");
				mongoose.connection.close();
	
			}
		});

		let groupsArray =  []
		for(let group of raiderGroupsJSON){
			groupsArray.push(group.id)
		}
		let groups = await getMembers(groupsArray);
	
		groups = [...new Set(groups)];
		//groups = [941751145];
		botCache.trackedRaiders = groups;
	
		setInterval(async () => {
			try {

				let groupsArray =  []
				for(let group of raiderGroupsJSON){
					groupsArray.push(group.id)
				}
				let groups = await getMembers(groupsArray);

				console.log("UPDATED THE RAIDER CACHE")
				groups = [...new Set(groups)];
				botCache.trackedRaiders.raiders = groups
			} catch (error) {
				console.error(); 
				console.log("Error in line 457")
			}
			
		}, 6 * 60 * 60 * 1000);
		
	
		setInterval(async () => {
			try {
				await trackRaiders( noblox, botCache.trackedRaiders, client, botCache.raiderTrackerChannelCache.raiders.channels, botCache.raiderTrackerChannelCache.raids.channels)	
			} catch (error) {
				console.log("error in the raider tracker")
				console.log(console.log(error));
			}
			
		}, 270 * 1000);


	} catch (error) {
		console.log(error)
		console.log("line 477")
	}

	
})()


let iter = 0;

//update the status of the bot every 15 mins
setInterval(()=>{
	client.guilds.fetch();
	let members = 0; 
	client.guilds.cache.each(guild => members += guild.memberCount);
	let servers  = client.guilds.cache.size;

	

	let status = [
		{str:`${members} members in ${servers} servers `,type:{type: "WATCHING"}},
		{str:"to /help",type:{type: "LISTENING"}},
		{str:`CrazyBot ${config["bot_info"].version}`,type:{type: "PLAYING"}},

	];


	let luckyWinner = status[iter];
	if(status.length - 1 === iter)iter = 0;
	else iter++;
	client.user.setActivity(luckyWinner.str,luckyWinner.type);
},1000 * 60 *15);
