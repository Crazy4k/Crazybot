const axios = require('axios');



module.exports = {
	name : 'cat',
	aliases: ["meow","pussy","furr","kitty"],
	description : 'Sends a random cat pic.',
	usage:'cat',
	cooldown: 5,
	category:"fun",
	execute(message, args, server) {
		try {
			axios.get('https://api.thecatapi.com/v1/images/search?api_key= key goes here ')
	
				.then((res)=>{message.channel.send(`${res.data[0].url}`)})
				.catch((err)=>console.log(err));
				return true;
		} catch (error) {
			console.error(error);
			return false;
		}


	},
};
