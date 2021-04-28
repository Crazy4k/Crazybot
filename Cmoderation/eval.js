const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const {bot_info} = require("../config.json");
const makeEmbed = require('../embed.js');
const authorID = bot_info.authorID;
const arrayOfData = require("../servers.json");

module.exports = {
	name : 'eval',
	description : 'makes the bot do stuff with eval();',
	usage:'!eval ``` code ``',
	whiteList : ['ADMINISTRATOR'],
	execute(message, args) {

        if (message.author.id !== authorID) return console.log(`${message.author.id} tried to use !eval`);
        if (args.length === 0) return message.channel.send("No code was given");

        const log  = item => message.channel.send(item);
        
        try {
            let evalString = args.join(" ");
            eval(evalString);
            const embed1 = makeEmbed("Succes ✅", "Command executed succesfuly.", false, "24D900");
            message.channel.send(embed1);

        } catch (error) {
            const embed2 = makeEmbed("Error!", error, false, "CF1300",);
            message.channel.send(embed2);
            console.error(error);
        }




	},
};