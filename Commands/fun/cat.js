const axios = require('axios');



module.exports = {
	name : 'cat',
	aliases: ["meow","pussy","furr","kitty"],
	description : 'sends a random cat gif or picture',
	usage:'!cat',
	category:"fun",
	cooldown: 3,
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
