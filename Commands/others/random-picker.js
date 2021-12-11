const pickRandom = require("../../functions/pickRandom");
const Command = require("../../Classes/Command");

let dice = new Command("dice");

dice.set({
	aliases         : [],
	description     : "Chooses randomly from 1 to 6. You can provide other argument to choose randomly from.",
	usage           : "dice [option 1] [option 2] [option 3..4..5..]",
	cooldown        : 2,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [{
		name : "option1",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},{
		name : "option2",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},{
		name : "option3",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},{
		name : "option4",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},{
		name : "option5",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},{
		name : "option6",
		description : "A custom argument to choose from",
		required : false,
		type: 3,
		},

	],
});

dice.execute = function(message, args, server) {

	
	let arguemnts = []
	for(let i of args)arguemnts.push(i.value);
	args = arguemnts;
	console.log(args);
	if(!args[0]){
		message.reply(`You rolled a ${pickRandom(6)}`);
		return true;
	}
	else if(args[0] && !args[1]){
		message.reply(`A minimum of 2 arguments is required.`);
		return false;
	}
	else if(args[1]){
		message.reply(`You rolled "${pickRandom(args)}"`);
		return true;
	}
	
}

module.exports = dice;
