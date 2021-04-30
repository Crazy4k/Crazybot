const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const makeEmbed = require('../functions/embed');
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
	execute(message, args) {

		if(args.length === 0) {
		
			return message.channel.send('should i rick roll you or what ?');

		} else if(!message.mentions.users.first()) {

			return message.channel.send('no one in the server is named like that');
		}

		const sender = message.author.tag;
		const reciver = message.mentions.users.first();

		// if the user is rick rolling themselves

		if(message.author.id === reciver.id) {
			message.channel.send('wtf')
				.then(msg => msg.delete({ timeout : faliedCommandTO }))
				.catch(console.error);
			const embed = makeEmbed('imagine Rick rolling yourself', pickRandom(rickRollLinks));

			message.delete({ faliedCommandTO });

			return reciver.send(embed);
		}
		// if the reciver is the owner
		else if (reciver.id === message.guild.owner.id) {
			message.channel.send('you can\'t rick roll the owner of the server')
				.then(msg => msg.delete({ timeout : faliedCommandTO }))
				.catch(console.error);
			return message.delete({ timeout : faliedCommandTO });
	
		} else {

			const embedToPublic = makeEmbed('Rick Roll sent :white_check_mark:', 'Imagine if they fall for that LOL');

			const embed = makeEmbed(`${sender}     sent you this link`, pickRandom(rickRollLinks));

			message.channel.send(embedToPublic)
				.then(Dmsg => Dmsg.delete({ timeout : faliedCommandTO }))
				.catch(console.error);

			message.delete({ timeout : faliedCommandTO });

			reciver.send(embed);
		}
	},

};


function pickRandom(argument) {
	if (typeof argument === 'number') {
		return Math.floor(Math.random() * Math.floor(argument)) + 1;
	}
	if (Array.isArray(argument)) {
		return argument[Math.floor(Math.random() * argument.length)];
	}
}
