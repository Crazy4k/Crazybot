const Discord = require('discord.js');

module.exports = function makeEmbed(title, description, timestamp = false, color = "#f7f7f7",footer = "developed by Crazy4k", ) {
    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter(footer);
    if (timestamp) embed.setTimestamp();

    return embed;
    

}