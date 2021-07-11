const makeEmbed = require("../../functions/embed");
const moment = require("moment");

module.exports = {
	name : 'server-info',
	description : 'Shows the all the information about the this server that are not bot related.',
	usage:'!server-info',
    aliases: ["sinfo","guild-info","serverinfo", "guildinfo"],
    category:"other",
    cooldown: 60 * 3,
	execute(message, args, server) {

        let {guild} = message;

        let embed = makeEmbed(guild.name,"", server);
    

        embed.addFields(
            {name:"server name: ", value:guild.name, inline: true},
            {name:"server id: ", value:guild.id, inline: true},
            {name:"server region: ", value:guild.region, inline: true},
            {name:"Owner: ", value:guild.owner, inline: true},
            {name:"default Notifications: ", value:guild.defaultMessageNotifications
            , inline: true},
            {name:"Member count: ", value:guild.memberCount, inline: false},
            {name:"Chennels: ", value:guild.channels.cache.size, inline: false},
            {name:"Roles: ", value:guild.roles.cache.size, inline: false},
            {name:"Emojis: ", value:guild.emojis.cache.size, inline: false},
            {name:"Created at: ", value:moment(guild.createdAt).format("LLL"), inline: true},
        );
        let banner = guild.bannerURL({format:"png"});
        if(banner) embed.addField("Banner: ",`[banner](${banner})`)
        embed.setThumbnail(guild.iconURL({format:"png"}));

		
		message.channel.send(embed);
	},

};
