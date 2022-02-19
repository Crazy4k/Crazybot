const makeEmbed = require("./embed");
const sendAndDelete = require("./sendAndDelete");
const moment = require('moment');
const reportBug = require("./reportErrorToDev");
const colors = require("../config/colors.json");
const botCache = require("../caches/botCache");

//makeEmbed is just a function that i made which makes embeds just to make writing embeds easier 
/**
 * Slashcommand-based Command handlder: adds/check cooldown, checks for permission, checks if the bot has enough permission, catches some execution errors and executes the command
 * @param {object} command The Command object that is defined in each command folder. Includes name, description, whiteList, etc 
 * @param {object} interaction The interaction object that executed this command
 * @param {object} args The interaction options
 * @param {object} server The mongoDB-stored server data 
 * @param {object} client Discord bot client object
 * @param {object} recentlyRan An object to store the cooldowns in
 * @param {boolean} isDM Whether or not this message is in a DM
 * @returns {void} 
 */
module.exports = async (command, interaction, args, server, client, recentlyRan, isDM = false ) => {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the interaction is able to execute the command.
	

	const cooldownStringInDMs = `${interaction.user.id}-${command.name}`;
	const selfCooldownStringInDMs = `${interaction.user.id}`;
	let = cooldownTime = 2;
	const globalCooldownTime = 2000;
	if(command.cooldown) cooldownTime = command.cooldown;

    if(isDM ){
		try{
			if(recentlyRan[selfCooldownStringInDMs]){
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[selfCooldownStringInDMs] - globalCooldownTime)/1000} seconds `, colors.defaultWhite);
				sendAndDelete(interaction, embed, server, false, true);
				return false;
			}
			else if(command.cooldown && recentlyRan[cooldownStringInDMs]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownStringInDMs] - seconds)/1000} seconds `, colors.defaultWhite);
				sendAndDelete(interaction, embed, server, false, true);
				return false;
			} else{
                let booly;
				if(command.worksInDMs){
                    booly = command.execute(interaction, args, server, true);
                    botCache.executes.slash[command.name]++
				if(!botCache.executes.slash[command.name])botCache.executes.slash[command.name] = 1
                } else{
                    const embed = makeEmbed("Command failed!",  `This command isn't executable in DMs!`, colors.defaultWhite);
                    sendAndDelete(interaction, embed, server, false, true);
                    return false;
                }
				
			
			if(booly){
				recentlyRan[cooldownStringInDMs] = moment();
				setTimeout(()=>{
					recentlyRan[cooldownStringInDMs] = null;
				},cooldownTime * 1000);
			}

			recentlyRan[selfCooldownStringInDMs] = moment();
			setTimeout(()=>{
				recentlyRan[selfCooldownStringInDMs] = null;
			},globalCooldownTime);
			}
		}catch(error) {
			console.error(error);
			const embed = makeEmbed("ERROR 101", 'There was an issue executing the command \nThe developer has been notified about the problem.', 'FF0000');
			reportBug(error, interaction,client,command);
			interaction.channel.send( {embeds: [embed]} );
		}
	}    
    else {
        const cooldownString = `${interaction.guild.id}-${interaction.user.id}-${command.name}`;
        const globalCooldownString = `${interaction.user.id}`;
        const uniqueCooldownString = `${interaction.guild.id}-${command.name}`;
        const botUser = interaction.guild.members.cache.get(client.user.id);
        if(!command.whiteList && botUser.permissions.has(command.requiredPerms)) {
            try{
                if(server?.disabledCategories?.[command.category]){
                    const embed = makeEmbed("",  `This command is disabled in this server.`, server);
                    sendAndDelete(interaction, embed, server);
                    return false;
                }
                if(recentlyRan[uniqueCooldownString]){
                    let seconds = cooldownTime * 1000
                    const embed = makeEmbed("Slow down there!",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[uniqueCooldownString] - seconds)/1000} seconds `, server);
                    sendAndDelete(interaction, embed, server);
                    return false;
                }
                else if(command.cooldown && recentlyRan[cooldownString]){
                    let seconds = cooldownTime * 1000
                    const embed = makeEmbed("Slow down there!",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds `, server);
                    sendAndDelete(interaction, embed, server);
                    return false;
                }
                if( recentlyRan[globalCooldownString]){
                    
                    const embed = makeEmbed("Slow down there!",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
                    sendAndDelete(interaction, embed, server);
                    return false;
                }
                
                const booly =  command.execute(interaction, args, server, true);
                botCache.executes.slash[command.name]++
				if(!botCache.executes.slash[command.name])botCache.executes.slash[command.name] = 1
                if(booly) {
                    if(command.unique)recentlyRan[uniqueCooldownString] = moment();
                    recentlyRan[cooldownString] = moment();

                    setTimeout(() =>{
                        if(command.unique)recentlyRan[uniqueCooldownString] = null;
                        recentlyRan[cooldownString] = null;
            
                    }, cooldownTime * 1000);
                }	
                recentlyRan[globalCooldownString] = moment();
                setTimeout(()=>{
                    recentlyRan[globalCooldownString] = null;
                },globalCooldownTime);
            }
            catch(error) {
                console.error(error);
                const embed = makeEmbed("ERROR 101", 'There was an issue executing the command \nThe developer has been notified about the problem', 'FF0000');
                reportBug(error,interaction,client,command);
                interaction.reply( {embeds: [embed], ephemeral : true} );
            }
            return;
        }//ELSE {
        const dude = interaction.guild.members.cache.get(interaction.user.id);
        const bot = interaction.guild.members.cache.get(client.user.id);
        try{
            if(server?.disabledCategories?.[command.category]){
                const embed = makeEmbed("",  `This command is disabled in this server.`, server);
                sendAndDelete(interaction, embed, server);
                return false;
            }
            if(dude.permissions.has(command.whiteList)) {
                if(bot.permissions.has(command.requiredPerms)){
                    
                    if(recentlyRan[uniqueCooldownString]){
                        let seconds = cooldownTime * 1000
                        const embed = makeEmbed("Slow down there!",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[uniqueCooldownString] - seconds)/1000} seconds `, server);
                        sendAndDelete(interaction, embed, server);
                        return false;
                    }
                    else if(command.cooldown && recentlyRan[cooldownString]){
                        let seconds = cooldownTime * 1000
                        const embed = makeEmbed("Slow down there !", `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds`, server);
                        sendAndDelete(interaction, embed,server);
                        return false;
                    }
                    if( recentlyRan[globalCooldownString]){
                        
                        const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
                        sendAndDelete(interaction, embed, server);
                        return false;
                    }
                    const booly = await command.execute(interaction, args, server, true);
                    botCache.executes.slash[command.name]++
                    if(!botCache.executes.slash[command.name])botCache.executes.slash[command.name] = 1
                    if(booly) {
                        if(command.unique)recentlyRan[uniqueCooldownString ]= moment();
                        recentlyRan[cooldownString] = moment();

                        setTimeout(() =>{
                            if(command.unique)recentlyRan[uniqueCooldownString] = null;
                            recentlyRan[cooldownString] = null;
                        }, cooldownTime * 1000);
                    }	
                    recentlyRan[globalCooldownString] = moment();
                    setTimeout(()=>{
                        recentlyRan[globalCooldownString] = null;
                    },globalCooldownTime);

                } else{
                    const embed = makeEmbed("Missing permission",`The bot doesn't have the required permission to execute this command.\nMissing permission: ${command.requiredPerms}`,"FF0000",);
                    sendAndDelete(interaction,embed,server);
                    return false;
                }
                
            } else{
                const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
                sendAndDelete(interaction,embed,server);
                return false;
            }
            
        }
        catch(error) {
            console.error(error);
            const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \nThe developer has been notified about the problem.', 'FF0000');
            reportBug(error,interaction,client,command);
            interaction.channel.send( {embeds: [embed] } );
        }
        return;
    }
}