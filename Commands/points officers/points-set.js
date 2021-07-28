const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const mongo = require("../../mongo");
let cache = require("../../caches/officerPointsCache");
const pointsSchema = require("../../schemas/officerPoints-schema");

module.exports = {
	name : 'opoints-set',
	description : "Sets a person's officer points to whatever the second arugment is.",
    cooldown: 5,
    whiteList:'ADMINISTRATOR',
	usage:'opoints-set <@user> <points>',
	async execute(message, args, server) { 

        if(!server.oPointsEnabled){
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
                const embed69 = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message,embed69, server);
                return false;
                break;
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

                let pointstoChange = args[1];
                if(!pointstoChange){
                    const embed69 = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message,embed69, server);
                    return false;
                }
                if(isNaN(pointstoChange)){
                    const embed1 = makeEmbed('Value must a number',this.usage, server);
                    sendAndDelete(message,embed1, server);
                    return false;
                }
                let before = servery.members[target]; 
                servery.members[target] = pointstoChange;

                if(servery.members[target]=== undefined)servery.members[target] = 0;
                await mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            
                            members:servery.members    
                        },{upsert:true});
                        cache[message.guild.id] = servery;
                    }
                    finally{
                            
                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                })
                const emb = makeEmbed("User's officer points have been set!", `<@${target}>'s officer points have been changed from \`${before}\` to \`${servery.members[target]}\` officer points.`, server,false)
                message.channel.send(emb);                                    
                return true;

            }
        
		
	},

};
