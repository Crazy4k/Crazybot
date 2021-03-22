/* const Discord = require('discord.js');
const client = new Discord.Client();
const hiRole = require('../info.json');
const role = hiRole.hiRole;

module.exports = {
	name : 'start',
	description : 'starts the conversation betwenn the user and the bot',
	usage:'!start',
	async execute(message, args) {
		try {
			const questions = [
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'10',
				'11',
				'12',
				'13',
				'14',
				'15',
				'16',
				'17',
				'18',
				'19',
				'20',
			];

			message.delete({ timeout:1000 });
			if(message.channel.id !== '808635050710794251')return;
			const dude = message.guild.members.cache.get(message.author.id);
			if(!dude.roles.cache.has(role))return;

			const answers = [];
			let num = 0;
			const authorId = message.author.id;
			const filter = (m) => m.author.id === message.author.id;
			const collector = message.author.dmChannel.createMessageCollector(filter, { time:30000, max:1 });
			if (num === 0) message.author.send(questions[num]);

			collector.on('collect', async (msge)=> {
				answers.push(msge.content);
				message.author.send(questions[num]);
				console.log(answers);
				num++;
			});
		}
		catch(error) {
			console.log(error);
		}
	},

};
*/