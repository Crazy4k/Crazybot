const mongo = require("../mongo");
const serversSchema = require("../schemas/servers-schema");
const pointsSchema = require("../schemas/points-schema");
const config = require("../config/config.json");
let {guildsCache} = require("../caches/botCache");
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");

module.exports = async (guild, client) => {

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
			let log = client.channels.cache.get(config.bot_info.clientLogs);
		if(log){
			const embed = makeEmbed("Joined a server","", colors.successGreen,true);
			embed.addField("Name",`${guild.name} | ${guild.id}`);
			let owner = await guild.fetchOwner();
			embed.addField("info", `owner: ${owner.displayName} | ${owner.id}\n member count: ${guild.memberCount} `);
			embed.addField("Created at: ", `<t:${parseInt(guild.createdTimestamp / 1000)}:F>\n<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,  true,);
			embed.setThumbnail(guild.iconURL({format:"png"}));

			log.send({embeds:[embed]}).catch(e=>console.log("error with line 240"))


		}
		
	} catch (err) {
		console.log(err);
	}



}