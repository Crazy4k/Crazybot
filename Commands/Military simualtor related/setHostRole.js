const makeEmbed = require("../../functions/embed");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let cache = require("../../caches/guildsCache");
const serversSchema= require("../../schemas/servers-schema");


module.exports = {
	name : 'host-role',
	description : "Sets the role for the !host command.",
    cooldown: 60 * 1,
    aliases:["h-role"],
	usage:'!host-role',
    category:"ms",
    whiteList:'ADMINISTRATOR',
	async execute(message, args, server) { 

            let servery = cache[message.guild.id];

            
            
                    if(!server.hostRole || server.hostRole === ""){

                    
                        const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to use the host command.\nType \`no\` for no one except admins.`, server);
                    
                        message.channel.send(embed)
                            const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                            .then(async (a) => {
                                let checkedRole = checkRoles(a);
                                switch (checkedRole) {
                                    case "not valid":
                                    case "not useable":
                                    case "no args":               
                                        message.channel.send("Invalid argument, command failed.");
                                        return false;
                                        break;
                                    case "cancel":
                                    case "no":
                                       servery.hostRole = "";
                                       break;
                                    default:     
                                        servery.hostRole = checkedRole;
                                        break;
                                    }                                        

                                    await mongo().then(async (mongoose) =>{
                                        try{
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                hostRole: servery.hostRole
                                            },{upsert:true});
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    })
                                    cache[message.guild.id] = servery;

                                    const embed = makeEmbed(`✅ Host role has been updated.`,`Poeple with the role <@&${servery.hostRole}> can now use the command !host`, "#24D900");
                                    message.channel.send(embed);
                            });
                        return true;
                    
                    } else{
                        const embed = makeEmbed(`You already have a host role set.`,`**Type \`reset\` to reset it..**`, server);
                        message.channel.send(embed);
                        const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
                        message.channel.awaitMessages(gayFilter,{max: 1, time : 20000, errors: ['time']})
                        .then(async (a) => {
                            if(a.first().content === "reset"){
                                await mongo().then(async (mongoose) =>{
                                    try{ 
                                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                            hostRole: ""
                                        },{upsert:true});
                                        cache[message.guild.id] = servery;
                                    } finally{
                                        message.channel.send("Role has been reset");
                                        console.log("WROTE TO DATABASE");
                                        mongoose.connection.close();
                                    }
                                });
                                
                            }
                        })
                        return false;
                    }           
    }
};
