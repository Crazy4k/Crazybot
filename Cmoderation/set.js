const Discord = require("discord.js");
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");

/*
    "guildId": "834734044729704508",
    "hiByeChannel": "",
    "hiRole": "",
    "hiByeLog": "834765334895525899",
    "deleteLog": "834763484155215883",
    "serverLog": "",
    "warningLog": "",
    "deleteMessagesInLogs": true,
    "deleteFailedCommands": true
 */
module.exports = {
	name : 'set',
	description : 'modifies the settings of the server',
	usage:'!set',
	whiteList:['ADMINISTRATOR'],
	execute(message, args) {


        message.channel.send("Enter the welcome channel id(type 0 if none)")
        const filter = m => m;
        message.channel.awaitMessage(filter,{max: 1, time : 60, errors: ['time']})
            .then(c => c)
	},

};