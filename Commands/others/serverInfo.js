const makeEmbed = require("../../functions/embed");
const moment = require("moment");

module.exports = {
	name : 'server-info',
	description : 'Shows the all the information about the this server that are not bot related.',
	usage:'server-info',
    aliases: ["sinfo","guild-info","serverinfo", "guildinfo"],
    category:"other",
    cooldown: 5,
	execute(message, args, server) {

       try{ let {guild} = message;

        let embed = makeEmbed(guild.name,"", server);
    
            embed.addField(    "server name: ", guild.name,  true,)
            embed.addField(    "server id: ", `${guild.id}`,  true,)
            embed.addField(    "Owner: ", `<@${guild.ownerId}>`,  true,)
            embed.addField(    "default Notifications: ", `${guild.defaultMessageNotifications}`,  true,)
            embed.addField(    "Member count: ", `${guild.memberCount}`,  false,)
            embed.addField(    "Channels: ", `${guild.channels.cache.size}`,  false,)
            embed.addField(    "Roles: ", `${guild.roles.cache.size}`,  false,)
            embed.addField(    "Emojis: ", `${guild.emojis.cache.size}`,  false,)
            embed.addField(    "Created at: ", `${moment(guild.createdAt).format("LLL")}`,  true,)
        
        let banner = guild.bannerURL({format:"png"});
        if(banner) embed.addField("Banner: ",`[banner](${banner})`)
        embed.setThumbnail(guild.iconURL({format:"png"}));

		
		message.channel.send({embeds:[embed]});
        return true;
    }catch(e){console.log(e)}
	},

};
