
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/pointsCache");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
//const checkUseres = require("../../functions/checkUser");
const enable = require("../../functions/enablePoints");
const {Permissions} = require("discord.js");
const colors = require("../../colors.json");
const promote = require("../../functions/promote");
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
            let thing = message.mentions.members.get(id);
            if(thing)return thing.id;
            else return "not valid";
        }else if(message.mentions.everyone) {
            return "everyone";
        } else return "not useable";
    } else return "no args";
}

module.exports = {
	name : 'pointsbatch-add',
	description : "Adds points to members in the server in batch mode",
    aliases:["pb-add","pb+","pointsbatch+","pointsbatch-give","pbatch-give", "pbatch+"],
    cooldown: 20,
	usage:'pointsbatch-add <@user or id> <number> <reason> | <@user or id> <number> <reason> |.......',
    category:"points",
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

        if(message.guild.members.cache.get(message.author.id).permissions.has( Permissions.FLAGS["ADMINISTRATOR"] ) || message.guild.members.cache.get(message.author.id).roles.cache.has(servery.whiteListedRole)){


            let log = message.guild.channels.cache.get(server.logs.pointsLog);     
            if(!server.pointsEnabled) await enable(message, server);

            //0 = tag
            //1 = number
            //2+ = reason   
            const batchArray = args.join(" "). split("|");
            
            const embed = makeEmbed("**Batch results**","",server,true);
            let edited = {}

            if(batchArray.length > 25){
                const embed2 = makeEmbed('Batch too long',"The maximum amount of units in a batch must be below or equal to 25.", colors.failRed);
                sendAndDelete(message,embed2, server);
                return false;
            } 


            for (let index = 1; index < batchArray.length + 1; index++) {
                const i = batchArray[index - 1];
                
                let smolArgs = i.split(/ +/);
                
                for (let i = 0; i < smolArgs.length; i++) {
                    if(smolArgs[i] === '')smolArgs.splice(i,1);  
                }
              
                const persona = checkUseres(message,smolArgs[0]); 
                
                const pointsToGive = smolArgs[1];
                let reason = smolArgs.splice(2).join(" ");
               
                switch (persona) {
                    case "not valid":
                    case "everyone":	
                    case "not useable":
                        embed.addField( `**${index}) ❌ Fail**`,`Invalid user.`, false);
                        
                        continue;
                        break;
                    case "no args": 
                        embed.addField( `**${index}) ❌ Fail**`,`Missing arguments.`, false);
                        continue;
                        break;
    
                    default:
                        if(!reason) {
                            embed.addField( `**${index}) ❌ Fail**`,`Enter a reason.`, false);
                            continue;
                            break;
                        }
                        if(!smolArgs.length){
                            embed.addField( `**${index}) ❌ Fail**`,`Missing arguments.`, false);
                            continue;
                            break;
                        }
                        if(!parseInt(pointsToGive)){
                            embed.addField( `**${index}) ❌ Fail**`,`Second argument must be a number.`, false);
                            continue;
                            break;
                        }
                        if(servery.members[persona] === undefined)servery.members[persona] = 0;
                        servery.members[persona] += parseInt(pointsToGive);
                        if( servery.members[persona] < 0 || !servery.members[persona])  servery.members[persona] = 0;

                        const usero = message.guild.members.cache.get(persona);
                        embed.addField( `**${index}) ✅ Success**`,`Successfully added ${pointsToGive} points to ${usero.displayName}!`, false);
                        if( typeof edited[persona] === "object" ) edited[persona][0] = parseInt(edited[persona][0]) + parseInt(pointsToGive);
                        else if (typeof edited[persona] === "undefined") edited[persona] = [parseInt(pointsToGive), reason];
                        await promote(message,persona,server);
                }

            }
            
            
           
                mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            _id:message.guild.id,
                            members:servery.members    
                        },{upsert:true});

                        message.channel.send({embeds:[embed]});

                        if(log){
                            
                            if(Object.values(edited).length){ 

                                let logEmbed = makeEmbed("Points added.","","10AE03",true);
                                logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    
                                for(let e in edited){
                                    logEmbed.addField(`Modified: `,`Added **${edited[e][0]}** points to <@${e}> for \`${edited[e][1]}\` `, false);
                                }
                                log.send({embeds: [logEmbed]});
                            }
                            
                            
                        }
                        
                    } finally{

                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                })
                cache[message.guild.id] = servery;
         
            }else {
                const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
                sendAndDelete(message,embed,server);
                return false;
            } 
            return true;
            
        
		} catch (error) {
            console.log(error);
        
        }
		
	},

};
