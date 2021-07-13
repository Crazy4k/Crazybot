const makeEmbed = require("../../functions/embed");

let pointsCache = require("../../caches/pointsCache");
let guildsCache = require("../../caches/guildsCache");
let warnCache = require("../../caches/warnCache");


const pointsSchema = require("../../schemas/points-schema");
const guildsSchema = require("../../schemas/servers-schema");
const warnSchema = require("../../schemas/warn-schema");

const mongo = require("../../mongo");


module.exports = {
	name : 'sync',
	description : "syncs all data between the bot's cache and the data base, removes left members from the server's data base and creates some files for the server if missing.",
    cooldown: 5 * 60,
    whiteList:'ADMINISTRATOR',
	usage:'!sync',
	category:"Moderation",
	async execute(message, args, server) { 

		let embed = makeEmbed("Syncing...","",server);
		message.channel.send(embed).then(async msg =>{
			
			let data1;
			let data2;
			let data3;
			await mongo().then(async (mongoose) =>{
				try{ 
					data1 = guildsCache[message.guild.id] = await guildsSchema.findOne({_id:message.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});

			
			if(data1 === null){
				const serverObject = {
					guildId: message.guild.id,
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
						await guildsSchema.findOneAndUpdate({_id:message.guild.id},{
							_id: message.guild.id,
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
						guildsCache[message.guild.id] = serverObject;
					} finally{
						console.log("WROTE TO DATABASE");
						mongoose.connection.close();
					}
				});
				
			} 

			await mongo().then(async (mongoose) =>{
				try{ 
					data2 = pointsCache[message.guild.id] = await pointsSchema.findOne({_id:message.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});

			
			if(data2 === null){
				mongo().then(async (mongoose) =>{
					let temp = {	
						_id: message.guild.id,
						whiteListedRole:"",
						members:{}

					}
					try{
						await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
							_id:message.guild.id,
							whiteListedRole:"",
							members:{}   
						},{upsert:true});
						pointsCache[message.guild.id] = temp;
					} finally{
						
						console.log("WROTE TO DATABASE");
						mongoose.connection.close();
					}
				});	
				
			}else if(pointsCache[message.guild.id].members){
				
				let newObj ={};
				let size1 = 0;
				let size2 = 0;

				for (const key in pointsCache[message.guild.id].members) {
					size1++;
					if(message.guild.members.cache.get(key)) {
						size2++;
						newObj[key] = pointsCache[message.guild.id].members[key];
					}
				}

				if(size1 !== size2){
					await mongo().then(async (mongoose) =>{
						try{
							
							await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
								members:newObj  
							},{upsert:true});
							pointsCache[message.guild.id].members = newObj;
							
						} finally{
							
							console.log("WROTE TO DATABASE");
							mongoose.connection.close();
						}
					});
				}
			}
		
	
			await mongo().then(async (mongoose) =>{
				try{ 
					data3 = warnCache[message.guild.id] = await warnSchema.findOne({_id:message.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
			


			if(data3 === null){
				let temp = {
					_id:message.guild.id,
					whiteListedRole:"",
					members:{}
				}
				mongo().then(async (mongoose) =>{
					try{
						await warnSchema.findOneAndUpdate({_id:message.guild.id},{
							_id: message.guild.id,
							whiteListedRole:"",
							members:{}   
						},{upsert:true});
						warnCache[message.guild.id] = temp;
					} finally{
						
						console.log("WROTE TO DATABASE");
						mongoose.connection.close();
					}
				});	

			} else if(warnCache[message.guild.id].members){
				
				let newObj ={};
				let size1 = 0;
				let size2 = 0;

				for (const key in warnCache[message.guild.id].members) {
					size1;
					if(message.guild.members.cache.get(key)){
						size2++;
						newObj[key] = warnCache[message.guild.id].members[key];
					}
				}
			
				

				if(size1 !== size2) {
					await mongo().then(async (mongoose) =>{
						try{
							
							await warnSchema.findOneAndUpdate({_id:message.guild.id},{
								members:newObj  
							},{upsert:true});
							warnCache[message.guild.id].members = newObj;
							
						} finally{
							
							console.log("WROTE TO DATABASE");
							mongoose.connection.close();
						}
					});
				}
			}
			
			embed.setColor("29C200");
			embed.setTitle("synchronization complete ✅");
			msg.edit(embed);
			
		});

	},	

};
