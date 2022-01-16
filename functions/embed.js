const Discord = require('discord.js');
let creator = "developed by Crazy4k#0091";
const moment = require("moment");
if(moment().format("MMMM DD") === "July 02")creator = "developed by Crazy4k#0091 🎂🎉";

/**
 * creates and retuns a simple embed with specific settings
 * @param {string} title The title of the embed
 * @param {string} description The description of the emebed
 * @param {string} color The hex color for the embed
 * @param {boolean} timestamp Wehther or not the embed should have a timestamp at the bottom
 * @param {string} footer The footer of the embed
 * @returns {object} Discord message embed
 */
module.exports = (title, description = "", color, timestamp = false ,footer = creator, ) => {
    let embedColor = "";
    if(typeof color === "object")embedColor = color.defaultEmbedColor;
    if(typeof color === "string")embedColor = color;
    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(embedColor)
    .setFooter({text: footer});
    if (timestamp) embed.setTimestamp();

    return embed;
    

}