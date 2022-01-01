const {clientLogs, authorID} = require("../config/config.json").bot_info;
const makeEmbed = require("./embed");
const consoleURL = "[console](https://cp.something.host/services/7205)";



module.exports = async (client) => {

    
    const errorChannel = client.channels.cache.get(clientLogs) ?? await client.users.fetch(authorID);


    process.on("unhandledRejection",(reason, p)=>{
        console.log("ANTI CRASH SYSTEM :: Unhandled rejection/Catch");
        console.log(reason, p);

        const embed = makeEmbed("⚠ Anti crash system :: Unhandled rejection/Catch",`**An error just occured in the bot's console**\n${consoleURL}\n\n\nError: \`\`\`${reason} \n\n ${p} \`\`\``,"RED");
        if(errorChannel)errorChannel.send({content: `<@${authorID}>`,embeds : [embed]}).catch(err=>console.log("failed to report error in anti crash"));

    });


    process.on("uncaughtException",(err, origin)=>{
        console.log("ANTI CRASH SYSTEM :: Uncought exception/Catch");
        console.log(err, origin);

        const embed = makeEmbed("⚠ Anti crash system :: Uncought exception/Catch",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${err} \n\n ${origin} \`\`\``,"RED");
        if(errorChannel)errorChannel.send({content: `<@${authorID}>`,embeds : [embed]}).catch(err=>console.log("failed to report error in anti crash"));

    });


    process.on("uncaughtExceptionMonitor",(err, origin)=>{
        console.log("ANTI CRASH SYSTEM :: Uncought exception/Catch (monitor)");
        console.log(err, origin);

        const embed = makeEmbed("⚠ Anti crash system :: Uncought exception/Catch (monitor)",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${err} \n\n ${origin} \`\`\``,"RED");
        if(errorChannel)errorChannel.send({content: `<@${authorID}>`,embeds : [embed]}).catch(err=>console.log("failed to report error in anti crash"));

    });

    process.on("multipleResolves",(type, promise, reason)=>{
        console.log("ANTI CRASH SYSTEM :: multiple Resolves");
        console.log(type, promise, reason);

        const embed = makeEmbed("⚠ Anti crash system :: multiple Resolves",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${type} \n\n ${promise}  \n\n ${reason} \`\`\``,"RED");
        if(errorChannel)errorChannel.send({content: `<@${authorID}>`,embeds : [embed]}).catch(err=>console.log("failed to report error in anti crash"));

    });

}