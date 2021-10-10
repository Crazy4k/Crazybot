const makeEmbed = require("../../functions/embed");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
const enable = require("../../functions/enablePoints");
let cache = require("../../caches/botCache").pointsCache;
const pointsSchema= require("../../schemas/points-schema");
const Command = require("../../Classes/Command");

let pointsRole = new Command("points-role");

pointsRole.set({
    
	aliases         : ["p-role","pointsrole","prole"],
	description     : "Sets the role that will be able to modify other user's points.",
	usage           : "rewards-set",
	cooldown        : 5,
	unique          : true,
	category        : "points",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
})



pointsRole.execute = async function(message, args, server) { 

    
    let whiteListedRole;
        

    let servery = cache[message.guild.id];

    if(!servery){
        await mongo().then(async (mongoose) =>{
            try{
                const data = await pointsSchema.findOne({_id:message.guild.id});
                cache[message.guild.id] = servery = data;
            }
            finally{
                    
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        })
    }
    if(!server.pointsEnabled) await enable(message, server);
    if(!servery.whiteListedRole || servery.whiteListedRole === ""){

    
        const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to modify points.\nThis role will be able to view,remove,add and change the points of all users.\nType \`no\` for no one except admins.`, server);
    
        message.channel.send({embeds:[embed]});
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        message.channel.awaitMessages({filter: messageFilter, max: 1, time : 120000, errors: ['time']})
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
                        whiteListedRole = "";
                        break;
                    default:     
                        whiteListedRole = checkedRole;
                        break;
                    }                                        

                    await mongo().then(async (mongoose) =>{
                        try{
                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                whiteListedRole: whiteListedRole
                            },{upsert:true});
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    })
                    cache[message.guild.id].whiteListedRole = whiteListedRole;

                    const embed = makeEmbed(`✅ officer role has been updated.`,`Poeple with the role <@&${whiteListedRole}> can now modify other user's points.`, "#24D900");
                    message.channel.send({embeds:[embed]});
                    return true;
            });
    } else{
        
        const embed = makeEmbed(`You already have an officer role set.`,`Current officer role: <@&${servery.whiteListedRole}>**\nType \`reset\` to reset it..**`, server);
        message.channel.send({embeds:[embed]});

        const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
        message.channel.awaitMessages({filter: gayFilter, max: 1, time : 20000, errors: ['time']})
        .then(async (a) => {
            if(a.first().content === "reset"){
                await mongo().then(async (mongoose) =>{
                    try{ 
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            whiteListedRole: ""
                        },{upsert:true});
                        cache[message.guild.id].whiteListedRole = "";
                    } finally{
                        message.channel.send("Role has been reset");
                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                });
                return true;
                
            }else return false;
        }).catch(e=>e);
        
    }           
}

module.exports =pointsRole;