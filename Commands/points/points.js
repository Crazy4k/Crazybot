const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/pointsCache");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");

module.exports = {
	name : 'points',
	description : "shows your total points",
    aliases:["p"],
    cooldown: 5,
	usage:'points [@user]',
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
                    const emb = makeEmbed("points!", `<@${target}> has ${servery.members[target]} points.`, server,false)
                    message.channel.send({embeds:[emb]});                                    
                    return true;
 
                }
        
		
	},

};
