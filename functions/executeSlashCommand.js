const makeEmbed = require("./embed");
const sendAndDelete = require("./sendAndDelete");
const moment = require('moment');
const reportBug = require("./reportErrorToDev");
const {Permissions} = require("discord.js");
const colors = require("../config/colors.json");
const config = require("../config/config.json");

//makeEmbed is just a function that i made which makes embeds just to make writing embeds easier 

module.exports = async (command, message, args, server, client, recentlyRan, isDM = false ) => {
	//this checks if the property "whitlist" in a command exists and if does check if the author of the message is able to execute the command.
	

	const cooldownStringInDMs = `${message.user.id}-${command.name}`;
	const selfCooldownStringInDMs = `${message.user.id}`;
	let = cooldownTime = 2;
	const globalCooldownTime = 2000;
	if(command.cooldown) cooldownTime = command.cooldown;

    if(isDM ){
		try{
			if(recentlyRan[selfCooldownStringInDMs]){
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[selfCooldownStringInDMs] - globalCooldownTime)/1000} seconds `, colors.defaultWhite);
				sendAndDelete(message, embed, server, false, true);
				return false;
			}
			else if(command.cooldown && recentlyRan[cooldownStringInDMs]){
				let seconds = cooldownTime * 1000
				const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownStringInDMs] - seconds)/1000} seconds `, colors.defaultWhite);
				sendAndDelete(message, embed, server, false, true);
				return false;
			} else{
                let booly;
				if(command.worksInDMs){
                    booly =command.execute(message, args, server, true);
                } else{
                    const embed = makeEmbed("Command failed!",  `This command isn't executable in DMs!`, colors.defaultWhite);
                    sendAndDelete(message, embed, server, false, true);
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
			reportBug(error,message,client,command);
			message.channel.send( {embeds: [embed]} );
		}
	}    
    else {
        const cooldownString = `${message.guild.id}-${message.user.id}-${command.name}`;
        const globalCooldownString = `${message.user.id}`;
        const uniqueCooldownString = `${message.guild.id}-${command.name}`;
        const botUser = message.guild.members.cache.get(client.user.id);
        if(!command.whiteList && botUser.permissions.has(command.requiredPerms)) {
            try{
                if(recentlyRan[uniqueCooldownString]){
                    let seconds = cooldownTime * 1000
                    const embed = makeEmbed("Slow down there!",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[uniqueCooldownString] - seconds)/1000} seconds `, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                else if(command.cooldown && recentlyRan[cooldownString]){
                    let seconds = cooldownTime * 1000
                    const embed = makeEmbed("Slow down there!",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds `, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                if( recentlyRan[globalCooldownString]){
                    
                    const embed = makeEmbed("Slow down there!",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                console.log(args)
                const booly =  command.execute(message, args, server);
                
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
                reportBug(error,message,client,command);
                message.reply( {embeds: [embed], ephemeral : true} );
            }
            return;
        }//ELSE {
        const dude = message.guild.members.cache.get(message.user.id);
        const bot = message.guild.members.cache.get(client.user.id);
        try{
            
            if(dude.permissions.has(command.whiteList)) {
                if(bot.permissions.has(command.requiredPerms)){
                    if(recentlyRan[uniqueCooldownString]){
                        let seconds = cooldownTime * 1000
                        const embed = makeEmbed("Slow down there!",  `This command is on a server-wide cooldown, wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[uniqueCooldownString] - seconds)/1000} seconds `, server);
                        sendAndDelete(message, embed, server);
                        return false;
                    }
                    else if(command.cooldown && recentlyRan[cooldownString]){
                        let seconds = cooldownTime * 1000
                        const embed = makeEmbed("Slow down there !", `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[cooldownString] - seconds)/1000} seconds`, server);
                        sendAndDelete(message, embed,server);
                        return false;
                    }
                    if( recentlyRan[globalCooldownString]){
                        
                        const embed = makeEmbed("Slow down there !",  `Wait for the cooldown to end.\nTime left: ${Math.abs(moment() - recentlyRan[globalCooldownString] - globalCooldownTime)/1000} seconds `, server);
                        sendAndDelete(message, embed, server);
                        return false;
                    }
                    const booly = await command.execute(message, args, server);
                    
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
                    sendAndDelete(message,embed,server);
                    return false;
                }
                
            } else{
                const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
                sendAndDelete(message,embed,server);
                return false;
            }
            
        }
        catch(error) {
            console.error(error);
            const embed = makeEmbed("ERROR 102", 'There was an issue executing the command \nThe developer has been notified about the problem.', 'FF0000');
            reportBug(error,message,client,command);
            message.channel.send( {embeds: [embed] } );
        }
        return;
    }
}