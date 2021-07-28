//FIANLLY A !HELP


const client = require("../../index");
const makeEmbed = require('../../functions/embed');
let hugeObj = require("../../caches/tempCmds");


module.exports = {
	name : 'help',
	description : 'Helps',
	cooldown: 3,
	usage:'help [value of a category]',
    category:"other",
	execute(message, args, server) {

		if(!hugeObj){
			
			let num = 0;
			hugeObj = {};
			
			for (let e of client.commands){
				
				if(hugeObj[e[1].category]) hugeObj[e[1].category].push(e[1]);
				else {
					hugeObj[e[1].category] = [];
					hugeObj[e[1].category].push(e[1]);
				}
				num++;
			}
		}
		let args0 = args[0];

		if(args0){
			switch (args0.toLowerCase()) {
				case "fun":
					let num1 = 1;
					let embed1 = makeEmbed("Help!","All of the commands in the `fun` category.",server);
					for (const i of hugeObj.fun) {
						embed1.addField(`**${num1}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num1++;
					}

					message.channel.send(embed1);
					return true;
					break;
				case "ms":
					let num2 = 1;
					let embed2 = makeEmbed("Help!","All of the commands in the `ms` category.",server);
					for (const i of hugeObj.ms) {
						embed2.addField(`**${num2}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num2++;
					}
					message.channel.send(embed2);
					return true;
					break;
				case "moderation":
				case "mod":
					let num3 = 1;
					let embed3 = makeEmbed("Help!","All of the commands in the `moderation` category.",server);
					for (const i of hugeObj.Moderation) {
						embed3.addField(`**${num3}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num3++;
					}
					message.channel.send(embed3);
					return true;
					break;
				case "other":
					let num4 = 1;
					let embed4 = makeEmbed("Help!","All of the commands in the `other` category.",server);
					for (const i of hugeObj.other) {
						embed4.addField(`**${num4}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num4++;
					}
					message.channel.send(embed4);
					return true;
					break;
				case "points":
					let num5 = 1;
					let embed5 = makeEmbed("Help!","All of the commands in the `points` category.",server);
					for (const i of hugeObj["points"]) {
						embed5.addField(`**${num5}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num5++;
					}
					message.channel.send(embed5);
					return true;
					break;
				case "aa":
					let num6 = 1;
					let embed6 = makeEmbed("Help!","All of the commands in the `admin fun` category.",server);
					for (const i of hugeObj["admin fun"]) {
						embed6.addField(`**${num6}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num6++;
					}
					message.channel.send(embed6);
					return true;
					break;
				case "config":
					let num7 = 1;
					let embed7 = makeEmbed("Help!","All of the commands in the `config` category.",server);
					for (const i of hugeObj["Server configurations"]) {
						embed7.addField(`**${num7}- ${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${server.prefix}${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
						num7++;
					}
					message.channel.send(embed7);
					return true;
					break;
				default:
					message.channel.send("Invalid value.");
					return false;
					break;
			}
			
		}else{
			let embed = makeEmbed("Click me if you want to join our discord.", `Here are the available command categories.\nIf you have any questions or want to share your opinion, join our discord.`,server);
			embed.addFields(
				{name:"**fun**", value:`Commands that are meant for fun.\n\`${server.prefix}help fun\` `, inline:true},
				{name:"**ms**", value:`Commands that are related to Military simulator.\n\`${server.prefix}help ms\` `, inline:true},
				{name:"**Moderation**", value:`Commands that do moderation actions.\n\`${server.prefix}help mod\` `, inline:true},
				{name:"**points**", value:`Commands that are related to the points system.\n\`${server.prefix}help points\` `, inline:true},
				{name:"**admin fun**", value:`Commands that only admins can use, but it's for fun.\n\`${server.prefix}help AA\` `, inline:true},
				{name:"**Server configurations**", value:`Commands that change the way the bot deals with the server.\n\`${server.prefix}help config\``, inline:true},
				{name:"**other**", value:`Commands that don't fit in any other category.\n \`${server.prefix}help other\``, inline:true},
			);
			embed.setURL("https://discord.gg/vSFp7SjHWp");
			message.channel.send(embed);
			return true;
			
		}
		
	},

};
