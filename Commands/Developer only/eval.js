const Discord = require('discord.js');
const fs = require("fs");
const mongo = require("../../mongo")
const {bot_info} = require("../../config/config.json");
const makeEmbed = require('../../functions/embed');
const authorID = bot_info.authorID;
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");
const moment = require("moment");
const botCache = require("../../caches/botCache");
const noblox = require("noblox.js");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");
const Command = require("../../Classes/Command");
const serverSchema = require("../../schemas/servers-schema");
const rover = require("rover-api");

let evalCommand = new Command("eval");
evalCommand.set({
	aliases         : [],
	description     : "makes the bot do stuff with eval();",
	usage           : "eval ``` code ``",
	cooldown        : null,
	unique          : false,
	category        : null,
	whiteList       : null,
	worksInDMs      : true,
	isDevOnly       : true,
	isSlashCommand  : false
})

evalCommand.execute = async function (message, args, server) {

    if (message.author.id !== authorID) return console.log(`${message.author.id} tried to use !eval`);
    if (args.length === 0) return message.channel.send("No code was given");

    
    
    try {
        console.log(args.join(" "))
        let evalString = args.join(" ");
        let str =  eval(evalString);
        
        if(typeof str === "object") str = JSON.stringify(str); 
        else if(typeof str !== "string") str = `${str}`
        if(str.length > 4096)str = "Returned string is too long to fit in an embed."
        const embed1 = makeEmbed("Succes ✅", `\`\`\`${str}\`\`\``, "24D900");
        message.channel.send({embeds: [embed1]});
    } catch (error) {
        const embed2 = makeEmbed("Error!", `${error}`, "CF1300",);
        message.channel.send({embeds: [embed2]});
        console.error(error);
    }
}

module.exports = evalCommand;


