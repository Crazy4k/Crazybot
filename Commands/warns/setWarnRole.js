/*const makeEmbed = require("../../functions/embed");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let cache = require("../../caches/muteCache");
const warnSchema= require("../../schemas/warn-schema");


module.exports = {
	name : 'test123123123123123123123',
	description : "Sets the role for the !host command.",
    cooldown: 60 * 1,
   // aliases:["w-role"],
	usage:'!warn-role',
    whiteList:'ADMINISTRATOR',
    category:"Moderation",
	async execute(message, args, server) { 
        let warnObject = cache[message.guild.id];
    
        if(!server.hostRole || server.hostRole === ""){
            const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to use the warn people and use warn commands.\nType \`no\` for no one except admins.`, server);        
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
                           warnObject.whiteListedRole = "";
                           break;
                        default:     
                            warnObject.whiteListedRole = checkedRole;
                            break;
                    }                                        

                    await mongo().then(async (mongoose) =>{
                        try{
                            await warnSchema.findOneAndUpdate({_id:message.guild.id},{
                                whiteListedRole: warnObject.whiteListedRole
                            },{upsert:true});
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    })
                    cache[message.guild.id] = warnObject;
                    const embed = makeEmbed(`✅ Warner role has been updated.`,`Poeple with the role <@&${warnObject.hostRole}> can now use warning commands (!mute, !warn...).`, "#24D900");
                    message.channel.send(embed);
                });
            return true;
                    
        } else{
            const embed = makeEmbed(`You already have a warner role set.`,`**Type \`reset\` to reset/remove it.**`, server);
            message.channel.send(embed);
            const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
            message.channel.awaitMessages(gayFilter,{max: 1, time : 20000, errors: ['time']})
            .then(async (a) => {
                if(a.first().content === "reset"){
                    await mongo().then(async (mongoose) =>{
                        try{ 
                            await warnSchema.findOneAndUpdate({_id:message.guild.id},{
                                whiteListedRole: ""
                            },{upsert:true});
                            cache[message.guild.id] = warnObject;
                        } finally{
                            message.channel.send("Role has been reset.");
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
*/