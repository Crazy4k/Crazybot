const makeEmbed =require(".././functions/embed");
const colors = require(".././config/colors.json");
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");

module.exports = async (oldMember, newMember)=> {
	try {

		let i = guildsCache[oldMember.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[oldMember.guild.id] =i = await serversSchema.findOne({_id:oldMember.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		const log = oldMember.guild.channels.cache.get(i.logs.hiByeLog);
			//if they don't have a log channel, skip
		if (log) {
			//creates the main log
			const embed = makeEmbed("member updated","",colors.changeBlue);
			embed.setAuthor(oldMember.displayName, oldMember.user.displayAvatarURL());
			embed.addFields(
				{name: "ID: ", value: oldMember.user.id, inline: true},
				{name: "Tag: ", value: `<@${oldMember.user.id}>`,inline:true}
			);

			//size is how many things were changed at the same time
			let size = 0;
				//nickname change
			if(oldMember.nickname !== newMember.nickname){
				let before = oldMember.nickname;
				if(!before) before = "None"
				let after = newMember.nickname;
				if(!after) after = "None"
				embed.addField("Nickname before: ", before,false);
				embed.addField("Nickname after: ", after,false);
				size++;
			}
			//comparing roles before and after
			let oldDif = [];
			let newDif = [];
			oldMember.roles.cache.each((a)=>{
				if(a.id !== oldMember.guildId) oldDif.push(a.id);
			});
			newMember.roles.cache.each((a)=>{
				if(a.id !== oldMember.guildId) newDif.push(a.id)
			});
			//cool way to compare arrays in my opinion
			if(oldDif.toString() !== newDif.toString()){
				
				let objOfRoles = {};

				let twoDiffs = oldDif.concat(newDif);

				twoDiffs.forEach((item)=>{
					//converting 2 arrays into 1 object
					//if a property has the value of 1, it's a new role
					/*
					{
						role1: 2,
						role2: 2,
						role3: 1, <== difference
					}					
					*/ 
					if(objOfRoles[item])objOfRoles[item]++;
					else objOfRoles[item] = 1;
				});
				//getting the difference
				let difference = [];
				for (const I in objOfRoles) {
					//if it's been mentioned only once, then its either been added or removed
					if(objOfRoles[I] === 1)difference.push(I);
				}
				//to check if added or removed we see in which array did it exists? old or new?
				// if it was in the old one then it's not in the new one therfore removed
				// if it wasn't in the old one then it's  in the new one therfore added
				let added = [];
				let removed = [];
				for(let i of difference){
					if(oldDif.includes(i)) removed.push(i);
					else added.push(i);
				}
				//and finally add a field
				if(added.length)embed.addField(`Roles added: `, `<@&${added.join("> <@&")}>`,false);
				if(removed.length)embed.addField(`Roles removed: `, `<@&${removed.join("> <@&")}>`,false);
				size++;
			}
		if(size)log.send({embeds: [embed]});
		}
					
					
	}catch (err) {console.log(err);}

}