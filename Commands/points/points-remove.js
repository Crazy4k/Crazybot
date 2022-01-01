const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/botCache").pointsCache;
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const checkUseres = require("../../functions/checkUser");
const enable = require("../../functions/enablePoints");
const {Permissions} = require("discord.js");
const promote = require("../../functions/promote");
const Command = require("../../Classes/Command");

let pointsRemove = new Command("points-remove");

pointsRemove.set({
    
	aliases         : ["p-remove","p-","points-","points-delete","p-delete"],
	description     : "Removes points from a user in a server.",
	usage           : "points-remove <@user> <points> [reason]",
	cooldown        : 7,
	unique          : false,
	category        : "points",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [{
		name : "user",
		description : "The user to remove points from",
		required : true,
		type: 6,
		},
        {
            name : "number",
            description : "The amount of points to remove",
            required : true,
            type: 4,
        },
        {
            name : "reason",
            description : "The reason behind removing points",
            required : false,
            type: 3,
        },

	],
})

    pointsRemove.execute = async function(message, args, server, isSlash) { 
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

        let author;
        let persona;
        let pointsToGive;
        let reason;
        if(isSlash){
            author = message.user
            persona = args[0].value;
            pointsToGive = args[1].value
            if(args[2])reason = args[2].value;
        } else{
            author = message.author;
            persona = checkUseres(message, args, 0);
            pointsToGive = args[1];
            reason = args.splice(2).join(" ");  
        }
        if(!reason) reason = "`No reason given.`";


        if(message.guild.members.cache.get(author.id).permissions.has(Permissions.FLAGS["ADMINISTRATOR"]) || message.guild.members.cache.get(author.id).roles.cache.has(servery.whiteListedRole)){

            //0 = tag
            //1 = number
            //2+ = reason      
           
            let log = message.guild.channels.cache.get(server.logs.pointsLog);    

            if(!server.pointsEnabled) await enable(message, server);
                
            if(!args.length){
                const embed2 = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message,embed2, server);
                return false;
            }
            if(!parseInt(pointsToGive)){
                const embed1 = makeEmbed('Second argument must be a number.',this.usage, server);
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
                    if( servery.members[persona] < 0 || !servery.members[persona])  servery.members[persona] = 0;
            }
                mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            _id:message.guild.id,
                            whiteListedRole:servery.whiteListedRole,
                            members:servery.members    
                        },{upsert:true});
                        await promote(message,persona,server);

                        const variable = makeEmbed("points Removed ✅",`Removed ${pointsToGive} points from <@${persona}>`, server);
                        message.reply({embeds:[variable]}).catch(e=> console.log(e));
                        if(log){
                            let embed = makeEmbed("Points Removed.","","FF4040",true);
                            embed.setAuthor({name: author.tag, iconURL : author.displayAvatarURL()});
                            embed.addFields(
                                {name: "Removed by:", value: `<@${author.id}>`, inline:true},  
                                {name: "Removed from:", value: `<@${persona}>`, inline:true},
                                {name: "Amount removed:", value: `${pointsToGive}`, inline:true},
                                {name: "Reason:", value: reason, inline:true},      
                            );
                            log.send({embeds:[embed]}).catch(e=> console.log(e));
                        }

                    } finally{

                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                })
                cache[message.guild.id] = servery;
            
            } else {
                const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
                sendAndDelete(message,embed,server);
                return false;
            } return true;
            
        
        } catch (error) {
            console.log(error);
        
        }
        
    
}
module.exports = pointsRemove;
