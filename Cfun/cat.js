const Discord = require('discord.js');
const client = new Discord.Client();
client.client;
const axios = require('axios');
module.exports = {
	name : 'cat',
	description : 'sends a random cat gif or picture',
	usage:'!cat',
	execute(message, args) {
		try {
			axios.get('https://api.thecatapi.com/v1/images/search?api_key= key goes here ')
				.then((res)=>{
					message.channel.send(`${res.data[0].url}`);
				})
				.catch((err)=>{
					console.log(err);
				});
		}
		catch (error) {
			console.error(error);
		}


	},
};
