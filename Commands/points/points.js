const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/botCache").pointsCache;
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");
const promote = require("../../functions/promote");
const Command = require("../../Classes/Command");

let points = new Command("points");

points.set({
    
	aliases         : ["p"],
	description     : "shows your total points",
	usage           : "points [@user]",
	cooldown        : 5,
	unique          : false,
	category        : "points",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
})

points.execute = async function(message, args, server) { 

    if(!server.pointsEnabled) await enable( message, server);

    let target = checkUseres(message, args, 0);
    
    switch (target) {
            case "not valid":
            case "everyone":	
            case "not useable":
                
                const embed1 = makeEmbed('invalid username',this.usage, server);
                sendAndDelete(message,embed1, server);
                return false;
                break;
            case "no args": 
                target = message.author.id;
            default:

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
                if(servery.members[target]=== undefined){

                    await mongo().then(async (mongoose) =>{
                        try{
                            servery.members[target] = 0;
                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                members:servery.members    
                            },{upsert:true});
                            cache[message.guild.id] = servery;
                            
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    })
                    
                }
                else if( servery.members[target] < 0 || !servery.members[target]){  

                    await mongo().then(async (mongoose) =>{
                        try{
                            servery.members[target] = 0;
                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                members:servery.members    
                            },{upsert:true});
                            cache[message.guild.id] = servery;
                            
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    })
                }
                await promote(message,target,server);
                const emb = makeEmbed("points!", `<@${target}> has ${servery.members[target]} points.`, server,false)
                message.channel.send({embeds:[emb]});                                    
                return true;

            }
    
    
}
module.exports =  points