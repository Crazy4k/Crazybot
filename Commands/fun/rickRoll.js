
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const pickRandom = require("../../functions/pickRandom");
const rickRollLinks = [
	"<https://www.youtube.com/watch?v=dQw4w9WgXcQ>"

];
// those are links that end up here ==> https://www.youtube.com/watch?v=dQw4w9WgXcQ

module.exports = {
	name : 'rr',
	aliases: ["rick-roll","rickroll","send-rick-roll","2008"],
	description : 'sends a dm with a Rick roll',
	cooldown: 60 * 1,
	usage:'!rr <@user>',
	execute(message, args, server) {


		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
					const embed = makeEmbed('invalid username',this.usage, server);
					sendAndDelete(message,embed, server);
					return false;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
		
				message.channel.send('should i rick roll you or what ?');
				return false;

			default:

				const sender = message.author.tag;
				const reciver =message.guild.members.cache.get(checkUseres(message, args, 0));

		// if the user is rick rolling themselves

		if(message.author.id === reciver.id) {
			message.channel.send('wtf');	
			const embed = makeEmbed('imagine Rick rolling yourself', pickRandom(rickRollLinks), server);

			reciver.send(embed);
			return true;
		}
		// if the reciver is the owner
		else if (reciver.id === message.guild.owner.id) {
			sendAndDelete(message,'you can\'t rick roll the owner of the server', server);
			return false;
		} else {

			const embedToPublic = makeEmbed('Rick Roll sent :white_check_mark:', 'Imagine if they fall for that LOL', server);

			const embed = makeEmbed(`${sender}  sent you this link`, pickRandom(rickRollLinks), server);

			message.channel.send(embedToPublic)
				.then(Dmsg => Dmsg.delete({ timeout :  server.deleteFailedMessagedAfter}))
				.catch(console.error);

			message.delete({ timeout : server.deleteFailedMessagedAfter });

			reciver.send(embed);
			return true;
		}
		}

	},

};

