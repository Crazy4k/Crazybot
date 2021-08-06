const makeEmbed = require("../../functions/embed");
const sync = require("../../functions/sync");
const mongo = require("../../mongo");
const serversSchema = require("../../schemas/servers-schema");
const guildsCache = require("../../caches/guildsCache");


module.exports = {
	name : 'welcome-message',
	description : 'changes what the bot would say when a members joins or leaves the server',
	aliases:["leavemessage","welcomemessage","welcome","welcomem"],
	cooldown: 10 ,
	usage:'welcome-message',
    category:"Server configurations",
	async execute(message, args, server) {
		if(!server.hiString || !server.byeString) await sync(message);

		const messageFilter = m => !m.author.bot && m.author.id === message.author.id;

		if(!args[0]){
			const embed = makeEmbed(`The join/leave message configuration.`,`The current join message is set to:\n **${server.hiString}**\n\nThe current leave message is set to:\n**${server.byeString}**\n\n\nType \`${server.prefix}${this.name} join\` to edit the join message.\nType \`${server.prefix}${this.name} leave\` to edit the leave message.`, server);
			message.channel.send(embed);
			return false;
		} else switch (args[0]) {
			case "join":
				let thing;
				let embedo = makeEmbed("Join message configuration", `**Enter what you want the bot to say when a member joins your server**\nIf you want to ping the person, you can include \`{<member>}\` and it will become a ping.\n\nType\`reset\` if you want to set the message back to default.\nType \`0\` to cancel the command.`, server);
				message.channel.send(embedo)
					.then(m => {
						message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
							.then(async a => {   
								switch (a.first().content.toLowerCase()) {
									case "0":
										message.channel.send("Command cancelled.");
										return false;
										break;
									case "reset":
										thing = `:green_circle: {<member>} Welcome to the server, have a great time :+1:`;
										break;
									default:
										thing = a.first().content;
										break;
								}
								if(thing !== server.hiString){
									await mongo().then(async (mongoose) =>{
										try{ 
											await serversSchema.findOneAndUpdate({_id:message.guild.id},{
												hiString: thing,
											},{upsert:false});
											guildsCache[message.guild.id].hiString = thing;
										} finally{
											console.log("WROTE TO DATABASE");
											mongoose.connection.close();
										}
									});
									const sus = makeEmbed("Join message changed ✅",`join message Changed to \n${guildsCache[message.guild.id].hiString}`,"29C200");
									message.channel.send(sus);
									return true;
								}else {
									const embed69 = makeEmbed("The message wasn't changed because the given message was same as before.","",server);
									message.channel.send(embed69);
									return false;
								}
								
							});
					});
					return true;
				break;
				
			case "leave":

				let thing2;
				let embedo2 = makeEmbed("Join message configuration", `**Enter what you want the bot to say when a member leaves your server**\nIf you want to ping the person, you can include \`{<member>}\` and it will become a ping.\n\nType\`reset\` if you want to set the message back to default.\nType \`0\` to cancel the command.`, server);
				message.channel.send(embedo2)
					.then(m => {
						message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
							.then(async a => {   
								switch (a.first().content.toLowerCase()) {
									case "0":
										message.channel.send("Command cancelled.");
										return false;
										break;
									case "reset":
										thing2 = `:red_circle: {<member>} just left the server, bye bye :wave:`;
										break;
									default:
										thing2 = a.first().content;
										break;
								}
								if(thing2 !== server.hiString){
									await mongo().then(async (mongoose) =>{
										try{ 
											await serversSchema.findOneAndUpdate({_id:message.guild.id},{
												byeString: thing2,
											},{upsert:false});
											guildsCache[message.guild.id].byeString = thing2;
										} finally{
											console.log("WROTE TO DATABASE");
											mongoose.connection.close();
										}
									});
									const sus2 = makeEmbed("Leave message changed ✅",`Leave message Changed to \n${guildsCache[message.guild.id].byeString}`,"29C200");
									message.channel.send(sus2);
									return true;
								}else {
									const embed69 = makeEmbed("The message wasn't changed because the given message was same as before.","",server);
									message.channel.send(embed69);
									return false;
								}
								
							});
					});

				break;

			default:
				message.channel.send("Invalid value.");
				return false;
				break;
		}


		
             
		
		
	},

};
