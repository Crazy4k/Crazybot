const {clientLogs, authorID} = require("../config/config.json").bot_info;
const makeEmbed = require("./embed");
const consoleURL = "[console](https://cp.something.host/services/7205)";

let errors = [];
/**
 * catches errors and sends them in the clientLogs channel
 * @param {object} client Bot client object 
 */
module.exports = async (client) => {

    
    const errorChannel = client.channels.cache.get(clientLogs) ?? await client.users.fetch(authorID);


    process.on("unhandledRejection",(reason, p)=>{
        console.log("ANTI CRASH SYSTEM :: Unhandled rejection/Catch");
        console.log(reason, p);

        const embed = makeEmbed("⚠ Anti crash system :: Unhandled rejection/Catch",`**An error just occured in the bot's console**\n${consoleURL}\n\n\nError: \`\`\`${reason} \n\n ${p} \`\`\``,"RED");
        errors.push(embed);
        if(errorChannel){

            if(errors.length > 8) {

                errorChannel.send({content: `<@${authorID}>`,embeds : errors}).catch(err=>console.log("failed to report error in anti crash"));
                errors = []

            } else if(errors.length > 10){
                
                
                let iter = errors.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = errors;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }
                
                for(let embedsArray of embeds){
                    log.send({content:`<@${authorID}>`, embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                }
                errors = []  
                        
            }
           
        }

    });


    process.on("uncaughtException",(err, origin)=>{
        console.log("ANTI CRASH SYSTEM :: Uncought exception/Catch");
        console.log(err, origin);

        const embed = makeEmbed("⚠ Anti crash system :: Uncought exception/Catch",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${err} \n\n ${origin} \`\`\``,"RED");
        errors.push(embed);
        if(errorChannel){

            if(errors.length > 8) {

                errorChannel.send({content: `<@${authorID}>`,embeds : errors}).catch(err=>console.log("failed to report error in anti crash"));
                errors = []

            } else if(errors.length > 10){
                
                
                let iter = errors.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = errors;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }
                
                for(let embedsArray of embeds){
                    log.send({content:`<@${authorID}>`, embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                }
                errors = []  
                        
            }
           
        }

    });


    process.on("uncaughtExceptionMonitor",(err, origin)=>{
        console.log("ANTI CRASH SYSTEM :: Uncought exception/Catch (monitor)");
        console.log(err, origin);

        const embed = makeEmbed("⚠ Anti crash system :: Uncought exception/Catch (monitor)",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${err} \n\n ${origin} \`\`\``,"RED");
        errors.push(embed);
        if(errorChannel){

            if(errors.length > 8) {

                errorChannel.send({content: `<@${authorID}>`,embeds : errors}).catch(err=>console.log("failed to report error in anti crash"));
                errors = []

            } else if(errors.length > 10){
                
                
                let iter = errors.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = errors;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }
                
                for(let embedsArray of embeds){
                    log.send({content:`<@${authorID}>`, embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                }
                errors = []  
                        
            }
           
        }

    });

    process.on("multipleResolves",(type, promise, reason)=>{
        console.log("ANTI CRASH SYSTEM :: multiple Resolves");
        console.log(type, promise, reason);

        const embed = makeEmbed("⚠ Anti crash system :: multiple Resolves",`**An error just occured in the bot's console**\n\n${consoleURL}\n\nError: \`\`\`${type} \n\n ${promise}  \n\n ${reason} \`\`\``,"RED");
        errors.push(embed);
        if(errorChannel){

            if(errors.length > 8) {

                errorChannel.send({content: `<@${authorID}>`,embeds : errors}).catch(err=>console.log("failed to report error in anti crash"));
                errors = []

            } else if(errors.length > 10){
                
                
                let iter = errors.length / 10;
                let embeds = [];
                for (let i = 0; i < iter; i++) {
                    let copyOfArray = errors;
                    let poopArray = copyOfArray.slice(i * 10, i * 10 + 10);
                    embeds.push(poopArray);         
                }
                
                for(let embedsArray of embeds){
                    log.send({content:`<@${authorID}>`, embeds:embedsArray}).catch(e=> console.log(e));//send the embed(s)
                }
                errors = []  
                        
            }
           
        }


    });

}