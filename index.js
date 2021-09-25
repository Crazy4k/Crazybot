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
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.DIRECT_MESSAGES,
];
const client = new Discord.Client({ intents: intentArray ,partials:["CHANNEL"]});

const token = process.env.DISCORD_BOT_TOKEN;
const cookie = process.env.NBLXJS_COOKIE;

const pickRandom = require("./functions/pickRandom");
const checkWhiteList = require("./functions/checkWhiteList");
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


const turnOnRoblox = async()=>{
	const currentUser = await noblox.setCookie(cookie)
	console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
	
}
turnOnRoblox();
keepAlive();

client.commands = new Discord.Collection();
const slashCommands = new Discord.Collection();


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
//i like to devide this into multiple pieces since it's a bit weird
client.on('messageCreate', async (message) => {
	if(message.channel.type === "DM" || message.channel.type === "GROUP_DM"){
		const prefix = config.bot_info.dmSettings.prefix;
			if (!message.content.startsWith(prefix) || message.author.bot)return;
			let bootLegArgs = message.content.slice(prefix.length).split(/\n/).join(" ");
			const args = bootLegArgs.split(/ +/);
			let commandName = args.shift().toLowerCase();
			const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName));
			if(command){
				if(command.worksInDMs){
					checkWhiteList(command, message, args, config.bot_info.dmSettings, client,commandCoolDownCache, true);
				} else return;
			} else return;
			
			
		}
	if(!message.guild)return;
	//retrive guild data from data base (only once then it will be saved in a cache)

	if(!guildsCache[message.guildId]){
		await mongo().then(async (mongoose) =>{
			try{ 
				guildsCache[message.guildId] = await serversSchema.findOne({_id:message.guildId});
			} finally{
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
							message.delete().catch(console.error);
							message.channel.send('You can\'t send a message in the logs ❌')
								.then(msg=>{
									setTimeout(()=>{
										msg.delete();
									},4000) 
								}).catch(console.error);
								return;
							break;
						}	
					}
					// then the declaration of the most important variables
					const prefix = server.prefix;
					if (!message.content.startsWith(prefix) || message.author.bot)return;
					let bootLegArgs = message.content.slice(prefix.length).split(/\n/).join(" ");
					const args = bootLegArgs.split(/ +/);
					//creating an array of arguments. New line is treated as space bar.
					let commandName = args.shift().toLowerCase();
					//break if the command given was invalid
					//if (!client.commands.has(commandName)) return;
					//then finally after all of the checks, the commands executes 
					//btw checkWhiteList() is a pretty big function that does exactly what it called, but with a bunch of extra check. Path: ./functions/checkWhiteList.js
					const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName));
					if(command)checkWhiteList(command, message, args, server,client ,commandCoolDownCache);
					
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
	console.log(`Bot succesfuly logged in as ${client.user.tag} [${client.user.id}]`);

});
client.login(token);



const getAosRanks = require("./aostracker/getRanks");
const checkAoss = require("./aostracker/intervalpresens");

(async () => {

	await mongo().then(async (mongoose) =>{
		try{
			let data = await raiderTrackerSchema.findOne({_id:"69"});
			botCache.raiderTrackerChannelCache = data;

		} finally{
			console.log("FETCHED TRACKER CHANNELS");
			mongoose.connection.close();
		}
	})
	const comandos = await getAosRanks(9723651);
	const doj = await getAosRanks(8224374);
	const hydra = await getAosRanks(2981881);
	const tic = await getAosRanks(10937425);
	const TDR =  await getAosRanks(8675204);
	const OoTNR =  await getAosRanks(7033913);

	let prototype = [ ... comandos, ...doj, ...hydra, ...tic,...TDR,...OoTNR];
	let poop = [...new Set(prototype)];
	botCache.trackedRaiders = poop//[941751145];
	//poop.push(941751145)


	setInterval(async () => {
		try {
			await checkAoss( noblox, botCache.trackedRaiders, client, botCache.raiderTrackerChannelCache.channels)	
		} catch (error) {
			console.log(console.log(error));
		}
		
	}, 120 * 1000);
		

	
})()




setTimeout(()=>{
	setInterval(()=>{
		let members = 0;
		client.guilds.cache.each(e=>{members += e.memberCount;})
		let servers  = client.guilds.cache.size;
		
	
		let status = [
			{str:` ${members} member in ${servers} servers `,type:{type: "WATCHING"}},
			{str:` ${members} member in ${servers} servers `,type:{type: "WATCHING"}},
			{str:"to ;updates",type:{type: "LISTENING"}},
			{str:"to ;help",type:{type: "LISTENING"}},
			{str:"over your points",type:{type: "WATHCING"}},
			{str:`CrazyBot ${config["bot_info"].version}`,type:{type: "PLAYING"}},
	
		];
	
	
		let luckyWinner = pickRandom(status)
		client.user.setActivity(luckyWinner.str,luckyWinner.type);
	},1000 * 60 * 20)
	

	
},3000)





