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
			axios.get('https://api.thecatapi.com/v1/images/search?api_key=117e183e-c93e-48f3-9dc5-fa0cd1a37350')
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