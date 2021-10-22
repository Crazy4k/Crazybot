const axios = require('axios');
const Command = require("../../Classes/Command");

//API USED: https://dog.ceo/dog-api/


let dog = new Command("dog");

dog.set({
    
	aliases         : ["woof","puppy","doggo","doge"],
	description     : "Sends a random dog pic.",
	usage           : "dog",
	cooldown        : 4,
	unique          : false,
	category        : "fun",
	requiredPerms	: "EMBED_LINKS",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : false
})

dog.execute = function(message, args, server) {
	try {
		axios.get('https://dog.ceo/api/breeds/image/random')

			.then((res)=>{message.channel.send(res.data.message)})
			.catch((err)=>console.log(err));
			return true;
	} catch (error) {
		console.error(error);
		return false;
	}


}
module.exports = dog;