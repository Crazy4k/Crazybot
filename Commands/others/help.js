//FIANLLY A !HELP
const client = require("../../index");
const makeEmbed = require('../../functions/embed');
const Command = require("../../Classes/Command");
const sendAndDelete = require("../../functions/sendAndDelete");

let categories;
let commandsObject;

let help = new Command("help");

help.set({
	aliases         : ["cmds","commands"],
	description     : "Shows you the list of commands the bot has in categories",
	usage           : "help [name of a category]",
	cooldown        : 3,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true,
	options			: [{
		name : "category",
		description : "The name of the command category.",
		required : false,
		autocomplete: true,
		choices: [{name: "Fun", value: "fun"}, {name: "Events", value: "events"}, {name: "Roblox", value: "roblox"}, {name: "Moderation", value: "mod"}, {name: "Points", value: "points"}, {name: "Admin fun", value: "aa"}, {name: "Server configurations", value: "config"}, {name: "Other", value: "other"}],
		type: 3,
		},
		{
			name : "command",
			description : "The name of the command without a prefix. example: help ",
			required : false,
			type: 3,
		}

	],
});

help.execute =  function(message, args, server) {

	if(!commandsObject){		
		commandsObject = {};
		client.commands.each(command =>commandsObject[command.name] = command)
	}
	if(!categories){
		categories = {};
		client.commands.each(command => {
			if(categories[command.category]) categories[command.category].push(command);
			else {
				categories[command.category] = [];
				categories[command.category].push(command);
			}
	
		})
	}
	
	let args0 = args[0];
	if(message.type === "APPLICATION_COMMAND"){
		if(args[0])args0 = args[0].value;
		else args0 = undefined;
	}
	let index = "";
	let isCategory = true;

	if(args0){
		switch (args0.toLowerCase()) {
			case "fun":
				index = "fun";
				break
			case "events":
				index = "events";
				break;
			case "moderation":
			case "mod":
				index = "Moderation";
				break;
			case "other":
				index = "other";
				break;
			case "points":
				index = "points";
				break;
			case "aa":
				index = "admin fun";	
				break;
			case "config":
				index = "config";
				break;
				case "roblox":
				index = "roblox";
				break;
			default:
				let lowerCaseArgument = args0.toLowerCase();
				if(lowerCaseArgument.startsWith(`${server.prefix}`)){
					let temp = lowerCaseArgument.split("");
					temp.shift()
					lowerCaseArgument = temp.join("");
				}
				if(commandsObject[lowerCaseArgument]){
					index = lowerCaseArgument
					isCategory = false;
					break;
				}else {
					sendAndDelete(message,"Invalid value.",server);
					return false;
				}
			}
			if(isCategory){
				let num = 1;
				let embed = makeEmbed("Help!",`All of the commands in the \`${index}\` category.`,server);
				for (const command of categories[index]) {
					let perms = command.whiteList;
				if(!perms) perms = "**-**"
				let alis = "**-**";
					if(command.aliases)alis = `${server.prefix}${command.aliases.join(`, ${server.prefix}`)}`
					embed.addField(`**${num}- ${server.prefix}${command.name}**`,`**Description**: ${command.description}\n\n**Usage**: \`${server.prefix}${command.usage}\`\n\n**Cooldown time**: ${command.cooldown} seconds.\n\n**Required permissions**: ${perms}\n\n**Aliases**: ${alis}\n\n`,true);						
					num++;
				}
				message.reply({embeds:[embed]}).catch(err=>console.log(err));
				return true;
			} else{
				
				let embed = makeEmbed("Help!",`All of the info about the \`${index}\` command.`,server);
				let command = commandsObject[index];

				let perms = command.whiteList;
				if(!perms) perms = "**-**"
				let alis = "**-**";
				if(command.aliases)alis = `${server.prefix}${command.aliases.join(`, ${server.prefix}`)}`
				let worksInDMs = "❌"
				if(command.worksInDMs)worksInDMs = "✅"
				let isSlashCommand = "❌"
				if(command.isSlashCommand) isSlashCommand = "✅"
				let cooldownType = "Normal"
				if(command.unique) cooldownType = "Server-wide"

				embed.addField(`Name`,`${server.prefix}${command.name}`, true);
				embed.addField(`Description`,`${command.description}`, true);
				embed.addField(`Category`,`${command.category}`, true);
				embed.addField(`Usage`,`${command.usage}`, true);
				embed.addField(`Does is work in DMs?`,`${worksInDMs}`, true);
				embed.addField(`Is it a slash command?`,`${isSlashCommand}`, true);
				embed.addField(`Cooldown timer`,`${command.cooldown} seconds`, true);
				embed.addField(`Cooldown type`,`${cooldownType}`);
				embed.addField(`Required permissions`,`${perms}`, true);
				embed.addField(`Aliases`,`${alis}`, true);
				message.reply({embeds:[embed]}).catch(err=>console.log(err));
				return true;
			}
		
		
	}else{
		let embed = makeEmbed("Click me if you want to join our discord.", `Here are the available command categories.\nIf you have any questions or want to share your opinion, join our discord.`,server);
		embed.addFields(
			{name:"**fun**", value:`Commands that are meant for fun.\n\`${server.prefix}${this.name} fun\` `, inline:true},
			{name:"**events**", value:`Commands that are related to hosting events using the bot.\n\`${server.prefix}${this.name} events\` `, inline:true},
			{name:"**Roblox**", value:`Commands that are related to Roblox and TSU.\n\`${server.prefix}${this.name} roblox\` `, inline:true},
			{name:"**Moderation**", value:`Commands that do moderation actions.\n\`${server.prefix}${this.name} mod\` `, inline:true},
			{name:"**points**", value:`Commands that are related to the points system.\n\`${server.prefix}${this.name} points\` `, inline:true},
			{name:"**admin fun**", value:`Commands that only admins can use, but it's for fun.\n\`${server.prefix}${this.name} AA\` `, inline:true},
			{name:"**Server configurations**", value:`Commands that change the way the bot deals with the server.\n\`${server.prefix}${this.name} config\``, inline:true},
			{name:"**other**", value:`Commands that don't fit in any other category.\n \`${server.prefix}${this.name} other\``, inline:true},
			{name:"TIP:",value: `You can also do (${server.prefix}help <command name>) and get more info about a specific command!\n Example: ;help points `}
		);
		embed.setURL("https://discord.gg/vSFp7SjHWp");
		message.reply( {embeds:[embed]} ).catch(err=>console.log(err));
		return true;
		
	}
	
}
module.exports = help;