const moment = require('moment');
const makeEmbed = require("../functions/embed");
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors = require("../config/colors.json");

module.exports = async (member)=> {
	try {
		let i = guildsCache[member.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[member.guild.id] =i = await serversSchema.findOne({_id:member.guild.id});
					if(!i.byeString || !i.hiString) {
						await serversSchema.findOneAndUpdate({_id:member.guild.id},{
							hiString: `:green_circle: {<member>} Welcome to the server, have a great time :+1:`,
							byeString: `:red_circle: {member} just left the server, bye bye :wave:`,
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

		const room = member.guild.channels.cache.get(i.hiByeChannel);
		const role = member.guild.roles.cache.get(i.hiRole);
		const log = member.guild.channels.cache.get(i.logs.hiByeLog);
			
		if (log) {
			const embed = makeEmbed("member joined","",colors.successGreen,true);
			embed.setAuthor(member.displayName, member.user.displayAvatarURL())
			embed.addFields(
				{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
				{ name :'member count', value :'#' + member.guild.memberCount, inline : true },
				{ name :'ID', value :member.id, inline : true },
			);
			log.send({embeds: [embed]});
		}
		if(!member.bot){
			if (role) {
				member.roles.add(role).catch(e=>console.log(e));
			}
			if (room){
				let splitString = i.hiString.split(" ");
				for(let i of splitString){
					if(i === "{<member>}"){ 
						splitString[splitString.indexOf(i)] = `${member}`
						break;
					}
				}
				let string = splitString.join(" ");

				room.send(string).catch(e=> console.log(e));
			}
		}
		
}catch (err) {console.log(err);}

}