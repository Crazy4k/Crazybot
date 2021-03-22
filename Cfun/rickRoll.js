const Discord = require('discord.js');
const client = new Discord.Client();
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
		}
		if(!message.mentions.users.first()) {
			return message.channel.send('no one in the server is named like that');
		}

		const sender = message.author.tag;
		const reciver = message.mentions.users.first();
		// if the user is rick rolling themselves
		if(message.author.id === reciver.id) {
			message.channel.send('wtf')
				.then(msg => msg.delete({ timeout : 5000 }))
				.catch(console.error);
			const embed = new Discord.MessageEmbed()
				.setFooter('Developed by Crazy4K')
				.setTitle('imagine Rick rolling yourself')
				.setColor('#f7f7f7')
				.setDescription(pickRandom(rickRollLinks));
			message.delete({ timeout : 5250 })
				.then(msg=> msg.channel)
				.catch(console.error);
			return reciver.send(embed);
		}
		// if the reciver is the owner
		if (reciver.id === message.guild.owner.id) {
			message.channel.send('you can\'t rick roll the owner of the server')
				.then(msg => msg.delete({ timeout : 5500 }))
				.catch(console.error);
			message.delete({ timeout : 5000 })
				.then(msg => msg.channel)
				.catch(console.error);
			return;
		}

		else {
			const embedToPublic = new Discord.MessageEmbed()
				.setTitle('Rick Roll sent :white_check_mark:')
				.setColor('#f7f7f7')
				.setDescription('Imagine if they fall for that LOL')
				.setFooter('Developed by Crazy4k')
				.setTimestamp();
			const embed = new Discord.MessageEmbed()
				.setColor('#f7f7f7')
				.setTitle(`${sender}     sent you this link`)
				.setDescription(pickRandom(rickRollLinks))
				.setFooter('Developed by Crazy4k')
				.setTimestamp();

			message.channel.send(embedToPublic)
				.then(Dmsg => Dmsg.delete({ timeout : 4000 }))
				.catch(console.error);

			message.delete({ timeout : 4250 })
				.then(msg => msg.channel)
				.catch(console.error);

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
