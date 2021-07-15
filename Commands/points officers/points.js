const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const mongo = require("../../mongo");
let cache = require("../../caches/officerPointsCache");
const pointsSchema = require("../../schemas/officerPoints-schema");

module.exports = {
	name : 'opoints',
	description : "shows your total officer points",
    aliases:["op","officerpoints","officer-points"],
    cooldown: 5,
	usage:'!points [@user]',
	async execute(message, args, server) { 

        if(!server.pointsEnabled){
            const embed =makeEmbed(`Your server officer points plugin isn't active yet.`,`Do "${server.prefix}opoints-enable" Instead.`, server)
            sendAndDelete(message, embed, server);
            return false;
        }

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
                    

                    if(target !== message.author.id && !message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")){
                        const embed1 = makeEmbed("You don't have permission to view other people's officer points","Do `!opints me` instead", server);
                        sendAndDelete(message,embed1, server);
                        return false;
                    }
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
                    const emb = makeEmbed("officer points!", `<@${target}> has ${servery.members[target]} officer points.`, server,false)
                    message.channel.send(emb);                                    
                    return true;
 
                }
        
		
	},

};
