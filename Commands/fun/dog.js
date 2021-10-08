const axios = require('axios');

//API USED: https://dog.ceo/dog-api/

module.exports = {
	name : 'dog',
	aliases: ["woof","puppy","doggo","doge"],
	description : 'Sends a random dog pic.',
	usage:'dog',
	cooldown: 4,
	worksInDMs: true,
	category:"fun",
	execute(message, args, server) {
		try {
			axios.get('https://dog.ceo/api/breeds/image/random')
	
				.then((res)=>{message.channel.send(res.data.message)})
				.catch((err)=>console.log(err));
				return true;
		} catch (error) {
			console.error(error);
			return false;
		}


	},
};
