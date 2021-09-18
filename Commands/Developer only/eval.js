const Discord = require('discord.js');
const fs = require("fs");
const mongo = require("../../mongo")
const {bot_info} = require("../../config.json");
const makeEmbed = require('../../functions/embed');
const authorID = bot_info.authorID;
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");
const moment = require("moment");
const botCache = require("../../caches/botCache");
const noblox = require("noblox.js");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");

module.exports = {
	name : 'eval',
	description : 'makes the bot do stuff with eval();',
	usage:'eval ``` code ``',
    worksInDMs: true,
	async execute(message, args, server) {

        if (message.author.id !== authorID) return console.log(`${message.author.id} tried to use !eval`);
        if (args.length === 0) return message.channel.send("No code was given");

        
        
        try {
            let evalString = args.join(" ");
            let str = "```" +`${eval(evalString)}`+ "```"
            const embed1 = makeEmbed("Succes ✅", str, "24D900");
            message.channel.send({embeds: [embed1]});

        } catch (error) {
            const embed2 = makeEmbed("Error!", error, "CF1300",);
            message.channel.send({embeds: [embed2]});
            console.error(error);
        }
	},
};