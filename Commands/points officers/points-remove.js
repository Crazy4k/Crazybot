const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const mongo = require("../../mongo");
let cache = require("../../caches/officerPointsCache");
const pointsSchema = require("../../schemas/officerPoints-schema");

const checkUseres = (message, arg) => {
    if(arg) {
        if(!isNaN(parseInt(arg)) && arg.length >= 17){
            if(message.guild.members.cache.get(arg)) {
                return arg;
            } else return "not valid";
            
        } else if(arg === "me") {			
			return message.author.id;
		}else if(message.mentions.members.first()){
            let id = arg.slice(3, arg.length-1);
            if(id.startsWith("!"))id = arg.slice(1, arg.length-1);
            return message.mentions.members.get(id).id;
        }else if(message.mentions.everyone) {
            return "everyone";
        } else return "not useable";
    } else return "no args";
}

module.exports = {
	name : 'opoints-remove',
	description : "Removes officer points from a user in a server.",
    aliases:["op-remove","op-","opoints-","opoints-delete","op-delete"],
    cooldown: 5 ,
	usage:'points-remove <@user> [@user2] [@user3]... <number>',
    async execute(message, args, server)  { 
        try{
             
        const pointsToGive= args[args.length - 1];
            
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


                if(!server.oPointsEnabled){
                    const embed =makeEmbed(`Your server officer points plugin isn't active yet.`,`Do "${server.prefix}opoints-enable" Instead.`, server)
                    sendAndDelete(message, embed, server);
                    return false;
                }
                if(!args.length){
                    const embed2 = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message,embed2, server);
                    return false;
                }
                
                let humans = [];
                
                if(!parseInt(pointsToGive)){
                    const embed1 = makeEmbed('Last argument must be a number.',this.usage, server);
                    sendAndDelete(message,embed1, server);
                    return false;
                }
                
                let bruh = [...args];
                
                const people = bruh.splice(0,args.length-1);
                

                for(let it = 0; it < people.length; it++ ){
                    const persona = checkUseres(message, people[it]);
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
                            if(!humans.includes(persona))humans.push(persona);
                    }
                }                 
                for(let e of humans){
                    if(servery.members[e]=== undefined)servery.members[e] = 0;
                    servery.members[e] -= parseInt(pointsToGive);
                }
                mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            _id:message.guild.id,
                            whiteListedRole:servery.whiteListedRole,
                            members:servery.members    
                        },{upsert:true});

                        const variable = makeEmbed("Officer points removed ✅",`Removed ${pointsToGive} officer points from <@${humans[0]}>`, server);
                        if(humans.length === 1) variable.setDescription(`Removed ${pointsToGive} officer points from <@${humans[0]}>`);
                        else variable.setDescription(`Removed ${pointsToGive} officer points from <@${humans.join(">, <@")}>`);
                        message.channel.send(variable);
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
