const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const mongo = require("../../mongo");
let cache = require("../../caches/officerPointsCache");
const pointsSchema = require("../../schemas/officerPoints-schema");
const checkUseres = require("../../functions/checkUser");
const enable = require("../../functions/enableOPoints");

module.exports = {
	name : 'opoints-remove',
	description : "Removes officer points from a user in a server.",
    aliases:["op-remove","op-","opoints-","opoints-delete","op-delete"],
    cooldown: 5 ,
	usage:'points-remove <@user> <number> [reason]',
    async execute(message, args, server)  { 
        try {
               
            let servery = cache[message.guild.id];
    
            if(!servery){
                await mongo().then(async (mongoose) =>{
                    try{
                        const data = await pointsSchema.findOne({_id:message.guild.id});
                        servery = data;
                    }
                    finally{
                            
                        console.log("FETCHED FROM DATABASE");
                        mongoose.connection.close();
                    }
                })
            }
    
            if(message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR") || message.guild.members.cache.get(message.author.id).roles.cache.has(servery.whiteListedRole)){
    
                //0 = tag
                //1 = number
                //2+ = reason      
                const persona = checkUseres(message,args,0);      
                const pointsToGive= args[1]
                let reason = args.splice(2).join(" ");   
                if(!reason) reason = "`No reason given.`"
                let log = message.guild.channels.cache.get(server.logs.pointsLog);    
    
    
                    if(!server.oPointsEnabled) await enable(message, server);
                    if(!args.length){
                        const embed2 = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message,embed2, server);
                        return false;
                    }
                    if(!parseInt(pointsToGive)){
                        const embed1 = makeEmbed('Last argument must be a number.',this.usage, server);
                        sendAndDelete(message,embed1, server);
                        return false;
                    }
    
      
                        switch (persona) {
                            case "not valid":
                            case "everyone":	
                            case "not useable":
                                
                                const embed1 = makeEmbed('invalid username',this.usage, server);
                                sendAndDelete(message,embed1, server);
                                return false;
                                break;
        
                            case "no args": 
        
                                const embed2 = makeEmbed('Missing arguments',this.usage, server);
                                sendAndDelete(message,embed2, server);
                                return false;		
                                break;
        
                            default:
                                if(servery.members[persona]=== undefined)servery.members[persona] = 0;
                                servery.members[persona] -= parseInt(pointsToGive);
                        }
                                    
                    
                    mongo().then(async (mongoose) =>{
                        try{
                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                _id:message.guild.id,
                                whiteListedRole:servery.whiteListedRole,
                                members:servery.members    
                            },{upsert:true});
    
                            const variable = makeEmbed("Officer points removed ✅",`Removed ${pointsToGive} officer from <@${persona}>`, server);
                            message.channel.send(variable);
                            if(log){
                                let embed = makeEmbed("Officer points removed.","","FF4040",true);
                                embed.setAuthor(message.guild.members.cache.get(message.author.id).nickname, message.author.displayAvatarURL());
                                embed.addFields(
                                  {name: "Removed by:", value: message.author, inline:true},  
                                  {name: "Removed from:", value: `<@${persona}>`, inline:true},
                                  {name: "Amount removed:", value: pointsToGive, inline:true},
                                  {name: "Reason:", value: reason, inline:true},      
                                );
                                log.send(embed);
                            }
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    })
                    cache[message.guild.id] = servery;
             
                } return true;
                
            
            } catch (error) {
                console.log(error);
            
            }
		
	},

};
