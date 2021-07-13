//FIANLLY A !HELP


const client = require("../../index");
const makeEmbed = require('../../functions/embed');
let hugeObj = require("../../caches/tempCmds");


module.exports = {
	name : 'help',
	description : 'Helps',
	cooldown: 3,
	usage:'!help [value of a category]',
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
					let embed1 = makeEmbed("Help!","All of the commands in the `fun` category.",server);
					for (const i of hugeObj.fun) {
						embed1.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed1);
					return true;
					break;
				case "ms":
					let embed2 = makeEmbed("Help!","All of the commands in the `ms` category.",server);
					for (const i of hugeObj.ms) {
						embed2.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed2);
					return true;
					break;
				case "moderation":
				case "mod":
					let embed3 = makeEmbed("Help!","All of the commands in the `moderation` category.",server);
					for (const i of hugeObj.Moderation) {
						embed3.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed3);
					return true;
					break;
				case "other":
					let embed4 = makeEmbed("Help!","All of the commands in the `other` category.",server);
					for (const i of hugeObj.other) {
						embed4.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed4);
					return true;
					break;
				case "points":
					let embed5 = makeEmbed("Help!","All of the commands in the `points` category.",server);
					for (const i of hugeObj["points"]) {
						embed5.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed5);
					return true;
					break;
				case "aa":
					let embed6 = makeEmbed("Help!","All of the commands in the `admin fun` category.",server);
					for (const i of hugeObj["admin fun"]) {
						embed6.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed6);
					return true;
					break;
				case "config":
					let embed7 = makeEmbed("Help!","All of the commands in the `config` category.",server);
					for (const i of hugeObj["Server configurations"]) {
						embed7.addField(`**${server.prefix}${i.name}**`,`**Description**: ${i.description}\n\n**Usage**: \`${i.usage}\`\n\n**Cooldown time**: ${i.cooldown} seconds.\n\n`,true);						
					}
					message.channel.send(embed7);
					return true;
					break;
				default:
					message.channel.send("Invalid value.");
					return false;
					break;
			}
			console.log(args0);
		}else{
			let embed = makeEmbed("Help!", `Here are the available command categories.\nType (${server.prefix}help \`value\`) to learn about each command in \`value\`'s category.\n\nExample: \`${server.prefix}help fun\``,server);
			embed.addFields(
				{name:"**fun**", value:"Commands that are meant for fun.\nValue: `fun` ", inline:true},
				{name:"**ms**", value:"Commands that are related to Military simulator.\nValue: `ms` ", inline:true},
				{name:"**Moderation**", value:"Commands that do moderation actions.\nValue: `mod` ", inline:true},
				{name:"**points**", value:"Commands that are related to the points system.\nValue: `points` ", inline:true},
				{name:"**admin fun**", value:"Commands that only admins can use, but it's for fun.\nValue: `AA` ", inline:true},
				{name:"**Server configurations**", value:"Commands that change the way the bot deals with the server.\nValue: `config` ", inline:true},
				{name:"**other**", value:"Commands that don't fit in any other category.\nValue: `other` ", inline:true},
			);
			message.channel.send(embed);
			return true;
			
		}
		
	},

};
