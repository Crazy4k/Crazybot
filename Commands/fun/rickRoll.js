
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const pickRandom = require("../../functions/pickRandom");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");
const {Permissions} = require("discord.js");
const rickRollLinks = [
	"<https://www.youtube.com/watch?v=dQw4w9WgXcQ>"
];
const randomStrings =[
	"Cute kitten does a back flip",
	"puppy thinks he is a cat",
	"funny moments of cats and dogs",
	"amogus drip 1 hour",
	"OMG DRINKING WATER AT 3 AM YOU CANT BELIEVE WHAT HAPPENED!!!!!",
	"so funny 🤣😂🤣😂",
	"when the imposter is sus!!!!!!!",
	"amogus",
	"Can a Program BRICK Your PC?",
	"CAN THIS MINECRAFT NOOB KILL THE ENDERDRAGON!?!?!?!",
	"OMG THIS IS SO FUNNY OMG!!!!11!1!!1",
	"noobs getting rekt",
	"360 no scope compilation",
	"pls dont click this this is 100% a rick roll, like cmon dont click bruh"

]
const randomGreeting =[
	"sent you a friend request",
	"would like to apologize in advance...",
	"says hi 👋",
	"is acting kinda sus lately..",
	"greets you and gives you this link",
	"is trying to wave at you",
	"sent you a cool video",
	"is interested in you :flushed:"
];


let rr = new Command("rickroll");

rr.set({
    
	aliases         : ["rick-roll","rr","send-rick-roll","2008"],
	description     : "sends a dm with a Rick roll to a given user.",
	usage           : "rr <@user>",
	cooldown        : 60 * 10,
	unique          : true,
	category        : "fun",
	requiredPerms	: "MANAGE_MESSAGES",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [{
		name : "user",
		description : "The user you want to send the rickroll to",
		required : true,
		autocomplete: false,
		type: 6,
		}

	],
	
})

	
rr.execute = function(message, args, server) {

	try{
		let authorID;
		let person
		let isSlash = false;
		if(message.type === "APPLICATION_COMMAND"){
			isSlash = true;
			if(args[0])person = args[0].value;
			else person = undefined;
			authorID = message.user.id; 
		} else person = checkUseres(message, args, 0);

		switch (person) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed, server);
				return false;
				break;
			case "no args": 
				const embed2 = makeEmbed('Missing argument',this.usage, server);
				sendAndDelete(message,embed2, server);
				return false;
			break;
			default:

				let sender 
				if(isSlash) sender = message.user;
				else sender= message.author;
				let reciver = message.guild.members.cache.get(person);

		// if the user is rick rolling themselves

		if(sender.id === reciver.id) {
			message.reply('wtf');	
			const embed = makeEmbed('imagine Rick rolling yourself', `[${pickRandom(randomStrings)}](${pickRandom(rickRollLinks)} "just click bruh")`, server);

			reciver.createDM().then(dm =>{
				
				dm.send({embeds:[embed]}).catch(e=> console.log(e));
				
			}).catch(e=> console.log(e));
			return false;
		}
		// if the reciver is the owner
		else if(reciver.permissions.has(Permissions.FLAGS["ADMINISTRATOR"])) {
			sendAndDelete(message,'you can\'t rick roll an admin', server);
			return false;
		} if(reciver.user.bot){
			message.reply("Bots are too powerful to rickroll ");
			return false;
		}else {

			const embedToPublic = makeEmbed('Rick Roll sent :white_check_mark:', 'Imagine if they fall for that LOL', colors.successGreen);

			const embed = makeEmbed(`${sender.tag} ${pickRandom(randomGreeting)}`, `[${pickRandom(randomStrings)}](${pickRandom(rickRollLinks)} "just click bruh")`, server);
			embed.setAuthor(`${sender.tag}`, sender.displayAvatarURL());



			sendAndDelete(message,embedToPublic,server, true)
			reciver.createDM().then(dm =>{
				
				dm.send({embeds:[embed]}).catch(e=> console.log(e));	
			}).catch(e=> console.log(e));
			return true;
		}
		}}catch(yes){
			console.log(yes);
		}

}

module.exports = rr;

