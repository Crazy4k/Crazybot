
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const pickRandom = require("../../functions/pickRandom");
const colors = require("../../colors.json");
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
// those are links that end up here ==> https://www.youtube.com/watch?v=dQw4w9WgXcQ

module.exports = {
	name : 'rr',
	aliases: ["rick-roll","rickroll","send-rick-roll","2008"],
	description : 'sends a dm with a Rick roll to a given user.',
	cooldown: 60 * 10,
	usage:'rr <@user>',
	category:"fun",
	execute(message, args, server) {

		try{let id = checkUseres(message,args,0);
		switch (id) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed, server);
				return false;
				break;
			case "no args": 
		
				message.channel.send('should i rick roll you or what ?');
				return false;
			break;
			default:

				const sender = message.author;
				const reciver = message.guild.members.cache.get(id);

		// if the user is rick rolling themselves

		if(message.author.id === reciver.id) {
			message.channel.send('wtf');	
			const embed = makeEmbed('imagine Rick rolling yourself', `[${pickRandom(randomStrings)}](${pickRandom(rickRollLinks)} "just click bruh")`, server);

			reciver.send({embeds:[embed]});
			return false;
		}
		// if the reciver is the owner
		else if (reciver.id === message.guild.ownerId) {
			sendAndDelete(message,'you can\'t rick roll the owner of the server', server);
			return false;
		} if(reciver.user.bot){
			message.channel.send("Bots are too powerful to rickrool ");
			return false;
		}else {

			const embedToPublic = makeEmbed('Rick Roll sent :white_check_mark:', 'Imagine if they fall for that LOL', colors.successGreen);

			const embed = makeEmbed(`${sender.tag} ${pickRandom(randomGreeting)}`, `[${pickRandom(randomStrings)}](${pickRandom(rickRollLinks)} "just click bruh")`, server);
			embed.setAuthor(`${message.author.tag}`, message.author.displayAvatarURL());



			sendAndDelete(message,embedToPublic,server, true)
			reciver.send({embeds: [embed]});
			return true;
		}
		}}catch(yes){
			console.log(yes);
		}

	},

};

