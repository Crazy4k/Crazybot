const Discord = require('discord.js');
let creator = "developed by Crazy4k";
const moment = require("moment");
if(moment().format("MMMM DD") === "July 02")creator = "developed by Crazy4k 🎂🎉";
module.exports = (title, description, server, timestamp = false ,footer = creator, ) => {
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