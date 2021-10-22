const axios = require('axios');
const Command = require("../../Classes/Command");

//API USED: https://thecatapi.com

let cat = new Command("cat");
cat.set({
    
	aliases         : ["meow","pussy","furr","kitty"],
	description     : "Sends a random cat pic.",
	usage           : "cat",
	cooldown        : 4,
	unique          : false,
	category        : "fun",
	requiredPerms	: "EMBED_LINKS",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : false
})


cat.execute = async function (message, args, server) {
	try {
		axios.get('https://api.thecatapi.com/v1/images/search?api_key= key goes here ')

			.then((res)=>{message.channel.send(`${res.data[0].url}`)})
			.catch((err)=>console.log(err));
			return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

module.exports = cat;