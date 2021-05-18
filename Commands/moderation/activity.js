const sendAndDelete = require("../../functions/sendAndDelete");

// all the configuraions are found in "activity.json"
const{activityCheckReactionTime, activityLogchannelID, activityCheckMessage, activityCheckEmoji}= require('./activity.json');


module.exports = {
	name : 'activity',
	description : 'sends the activity check message',
	cooldown: 60 * 10,
	usage:'!activity',
	whiteList :'ADMINISTRATOR',
	execute(message, args, server) {


	const activityLogChannel = message.guild.channels.cache.get(activityLogchannelID);
    const filter = (reaction, user) => user.bot === false;

//sends the message and reacts with ✅

	message.channel.send(activityCheckMessage)
		.then(msg => {

			msg.react(activityCheckEmoji);
			const collector = msg.createReactionCollector(filter, {time : activityCheckReactionTime });

			let = activePeople = [];

			collector.on('collect',(r, u) => activePeople.push(u.tag));

			collector.on('end', collected => {
				activityLogChannel.send(`People who reacted:\n${activePeople.join(', ')}`);
			});

		})
    .catch(console.error());

//deletes the !activity
		
	message.delete({ timeout : 10000 });
	return true;
	},
};