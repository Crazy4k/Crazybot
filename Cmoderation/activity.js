const Discord = require('discord.js');
const client = new Discord.Client();
const {activityLog} = require('../info.json');

module.exports = {
	name : 'activity',
	description : 'sends the activity check message',
	usage:'!activity',
	whiteList : ['ADMINISTRATOR'],
	execute(message, args) {


	const activityLogChannel = message.guild.channels.cache.get(activityLog);
    const filter = (reaction, user) => user.bot === false;



//sends the message and reacts with ✅
	message.channel.send(" activity-check do:white_check_mark: if your online.")
		.then(msg => {
			msg.react('✅');
			const collector = msg.createReactionCollector(filter, {time : 7200000 });

			let = activePeople = [];

			collector.on('collect',(r, u) => activePeople.push(u.tag));

			collector.on('end', collected => {
				activityLogChannel.send(`People who reacted:\n${activePeople}`);
			});

		})
    .catch(console.error());

//deletes the !activity
		
	message.delete({ timeout : 4250 })
		.then(msg => msg.channel)
		.catch(console.error);


        


	},
};