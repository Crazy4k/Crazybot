const Command = require("../../Classes/Command");
const makeOwO = require("owofy");

let owofy = new Command("owofy");
owofy.set({
    
	aliases         : ["owo","uwu","weebify","owoify"],
	description     : "takes text and owofies it OwO",
	usage           : "owoify <text>",
	cooldown        : null,
	unique          : false,
	category        : "fun",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true,
    options: [
        {
            name : "text",
            description : "text to put through the owofication process",
            required : true,
            type: 3,
		}
    ]
})
owofy.execute = function (message, args, server, isSlash) {

    let sentence = isSlash ? args[0].value :args.join(' ');
    if (!sentence) return message.reply('I can\'t owo-fy an empty message! uwu');
    
	sentence = sentence.split("@").join("")
    message.reply(makeOwO(sentence));
}

module.exports = owofy;
