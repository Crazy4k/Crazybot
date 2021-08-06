const moment = require('moment');
const mongo = require("../mongo");
const makeEmbed = require("../functions/embed");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");


module.exports = async (member) => {
		
	try {
			
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
		let splitString = i.byeString.split(" ");
		for(let i of splitString){
			if(i === "{<member>}"){ 
				splitString[splitString.indexOf(i)] = `${member}`
				break;
			}
		}
		let string = splitString.join(" ");
		const ByeChannel = member.guild.channels.cache.get(i.hiByeChannel);
		const log = member.guild.channels.cache.get(i.logs.hiByeLog);
				
		if (log) {
			const embed = makeEmbed('member left',"","DB0000",true);
			embed.setAuthor(member.displayName, member.user.displayAvatarURL());
			embed.addFields(
					{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
					{ name :'joined at', value :`${moment(member.joinedAt).fromNow()} /\n${moment(member.joinedAt).format('MMM Do YY')}`, inline : true },
					{ name :'ID', value :member.id, inline : true },
				
				);
			log.send(embed);
					
		}
		if (ByeChannel){
			ByeChannel.send(string);
		}
				
			
	}catch (err) {console.log(err);}

}