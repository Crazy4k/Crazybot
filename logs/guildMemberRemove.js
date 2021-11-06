const mongo = require("../mongo");
const makeEmbed = require("../functions/embed");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors = require("../config/colors.json");

module.exports = async (member, client) => {
		
	try {
		if(!member.guild)return;
		if(!member.guild.available)return;
		await member.guild.members.fetch();
		if(!member.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;
		let i = guildsCache[member.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[member.guild.id] = i = await serversSchema.findOne({_id:member.guild.id});
					if(!i.byeString || !i.hiString) {
						await serversSchema.findOneAndUpdate({_id:member.guild.id},{
							hiString: `:green_circle: {<member>} Welcome to the server, have a great time :+1:`,
							byeString: `:red_circle: {<member>} just left the server, bye bye :wave:`,
						},{upsert:true});

						i.hiString = `:green_circle: {<member>} Welcome to the server, have a great time :+1:`;
						i.byeString = `:red_circle: {<member>} just left the server, bye bye :wave:`;
						guildsCache[member.guild.id] = i;
					}
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		
		const ByeChannel = member.guild.channels.cache.get(i.hiByeChannel);
		const log = member.guild.channels.cache.get(i.logs.hiByeLog);
				
		if (log) {
			const embed = makeEmbed('member left',"",colors.failRed,true);
			embed.setAuthor(member.displayName, member.user.displayAvatarURL());
			embed.addFields(
					{ name :'account age', value : `<t:${parseInt(member.user.createdTimestamp / 1000)}:F>\n<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline : true },
					{ name :'joined at', value : `<t:${parseInt(member.joinedTimestamp / 1000)}:F>\n<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline : true },
					{ name :'ID', value : member.id, inline : true },
				
				);
			log.send({embeds: [embed]}).catch(e=> console.log(e));
					
		}
		if (ByeChannel){
			let splitString = i.byeString.split(" ");
			for(let i of splitString){
				if(i === "{<member>}"){ 
					splitString[splitString.indexOf(i)] = `${member}`
					break;
				}
			}
			let string = splitString.join(" ");

			ByeChannel.send(string).catch(e=> console.log(e));
			
		}
				
			
	}catch (err) {console.log(err);}

}