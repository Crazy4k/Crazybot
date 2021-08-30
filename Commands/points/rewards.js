/*const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/pointsCache");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");

module.exports = {
	name : 'rewards',
	description : "Shows the achievable points rewards for the user",
    cooldown: 3,
	usage:'rewards [@user or id]',
    category:"points",
	async execute(message, args, server) { 

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
                    else if( servery.members[target] < 0){  

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
                    if(!servery.rewards || Object.values(cache).length === 0){
                        const embed1 = makeEmbed('Points Rewards aren\'t activated.',`Automatic points rewards aren't activated on this server, ask someone with admin permissions to enable them using \`${server.prefix}rewards-set\`.`, server);
                        sendAndDelete(message,embed1, server);
                        return false;
                    } else {
                    const emb = makeEmbed("points!", `<@${target}> has ${servery.members[target]} points.`, server,false)
                    message.channel.send({embeds:[emb]});                                    
                    return true;
                }
                }
        
		
	},

};
*/