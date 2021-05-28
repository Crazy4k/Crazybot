const Discord = require('discord.js');
const fs = require("fs");
const {bot_info} = require("../../config.json");
const makeEmbed = require('../../functions/embed');
const authorID = bot_info.authorID;
const serversDotJson = require("../../servers.json");
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");

module.exports = {
	name : 'eval',
	description : 'makes the bot do stuff with eval();',
	usage:'!eval ``` code ``',
	execute(message, args, server) {

        if (message.author.id !== authorID) return console.log(`${message.author.id} tried to use !eval`);
        if (args.length === 0) return message.channel.send("No code was given");

        const log  = item => message.channel.send(item);
        
        try {
            let evalString = args.join(" ");
            eval(evalString);
            const embed1 = makeEmbed("Succes ✅", "Command executed succesfuly.", "24D900");
            message.channel.send(embed1);

        } catch (error) {
            const embed2 = makeEmbed("Error!", error, "CF1300",);
            message.channel.send(embed2);
            console.error(error);
        }




	},
};