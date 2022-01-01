const mongo = require("../mongo");
const serversSchema = require("../schemas/servers-schema");

const pointsSchema = require("../schemas/points-schema");
const config = require("../config/config.json");
let {guildsCache} = require("../caches/botCache");
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");
let client = require("../index.js");

module.exports = async (guild) => {
   

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
		
				
		let log = client.channels.cache.get(config.bot_info.clientLogs);
		if(log){
			const embed = makeEmbed("Left a server","", colors.failRed,true);
			embed.addField("Id",` ${guild.id}`);
			embed.addField(" member count:", ` ${guild.memberCount} `);
			embed.addField("Created at: ", `<t:${parseInt(guild.createdTimestamp / 1000)}:F>\n<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,  true,);
			

			log.send({embeds:[embed]}).catch(e=>console.log("error with line 240"))


		}	
	} catch (err) {

        console.log(err);
    }


}