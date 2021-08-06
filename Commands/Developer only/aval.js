const Discord = require('discord.js');
const fs = require("fs");
const {bot_info} = require("../../config.json");
const makeEmbed = require('../../functions/embed');
const authorID = bot_info.authorID;
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");
const moment = require("moment");
const timerCache = require("../../caches/timerCache");
let fetchesCache = require("../../caches/fetchesCache");
const noblox = require("noblox.js");

module.exports = {
	name : 'aval',
	description : 'makes the bot do stuff with eval() (async);',
	usage:'aval ``` code ``',
	async execute(message, args, server) {

        if (message.author.id !== authorID) return console.log(`${message.author.id} tried to use !eval`);
        if (args.length === 0) return message.channel.send("No code was given");

        
        
        try {
            let evalString = args.join(" ");
            const embed1 = makeEmbed("Succes ✅", `\`\`\`${await eval("(async () => {await " + evalString + "})()")}\`\`\``, "24D900");
            message.channel.send(embed1);

        } catch (error) {
            const embed2 = makeEmbed("Error!", error, "CF1300",);
            message.channel.send(embed2);
            console.error(error);
        }
	},
};