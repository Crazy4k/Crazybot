const Discord = require('discord.js');

module.exports = function makeEmbed(title, description, server, timestamp = false ,footer = "developed by Crazy4k", ) {
    let color;
    if(typeof server === "object")color =server.defaultEmbedColor;
    if(typeof server === "string")color = server;
    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter(footer);
    if (timestamp) embed.setTimestamp();

    return embed;
    

}