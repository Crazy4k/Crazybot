const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../../config.json");
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const pickRandom = require("../../functions/pickRandom");
const rickRollLinks = [
	'<http://www.5z8.info/launchexe_ocym>',
	'<http://www.5z8.info/xxx_i6d6dg_horse-slaughter>',
	'<http://www.5z8.info/linked-in-of-sex_i3s9ri_best-russian-sites-for-bootleg-everything>',
	'<http://www.5z8.info/nazi_lido>',

];
// those are links that end up here ==> https://www.youtube.com/watch?v=dQw4w9WgXcQ

module.exports = {
	name : 'rr',
	description : 'sends a dm with a Rick roll',
	usage:'!rr <@user>',
	execute(message, args, server) {


		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
					const embed = makeEmbed('invalid username',this.usage);
					sendAndDelete(message,embed, server, faliedCommandTO, failedEmbedTO);
					return;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
		
				return message.channel.send('should i rick roll you or what ?');

			default:

				const sender = message.author.tag;
				const reciver =message.guild.members.cache.get(checkUseres(message, args, 0));

		// if the user is rick rolling themselves

		if(message.author.id === reciver.id) {
			message.channel.send('wtf');	
			const embed = makeEmbed('imagine Rick rolling yourself', pickRandom(rickRollLinks));

			return reciver.send(embed);
		}
		// if the reciver is the owner
		else if (reciver.id === message.guild.owner.id) {
			sendAndDelete(message,'you can\'t rick roll the owner of the server', server, faliedCommandTO, failedEmbedTO);
			return 
		} else {

			const embedToPublic = makeEmbed('Rick Roll sent :white_check_mark:', 'Imagine if they fall for that LOL');

			const embed = makeEmbed(`${sender}     sent you this link`, pickRandom(rickRollLinks));

			message.channel.send(embedToPublic)
				.then(Dmsg => Dmsg.delete({ timeout : faliedCommandTO }))
				.catch(console.error);

			message.delete({ timeout : faliedCommandTO });

			reciver.send(embed);
		}
				break;
		}


		

		
	},

};

