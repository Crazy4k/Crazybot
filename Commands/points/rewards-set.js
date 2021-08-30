const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/pointsCache");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");
const colors = require("../../colors.json");
const checkRoles = require("../../functions/Response based Checkers/checkRoles")


const type0Message = "(type `cancel` to cancel / type `0` to disable this reward entirely)\n"; 
const cancerCultureMessage ="Command cancelled successfully";
const idleMessage = "Command cancelled due to the user being idle";
const type0Message2 = "(type `0` to cancel / type \"`no`\" for none)\n"; 

module.exports = {
	name : 'rewards-set',
	description : "Enables the points rewards system for the server.",
    cooldown: 5,
    whiteList : 'ADMINISTRATOR',
    unique: true,
    aliases: ["promotion-set","rewardsset","rewardset","promotionset"],
	usage:'rewards-set',
    category:"points",
	async execute(message, args, server) { 

        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;



        if(!server.pointsEnabled) await enable( message, server);
        let servery = cache[message.guild.id];
        let log = message.guild.channels.cache.get(server.logs.pointsLog);  

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
        
        if(!servery.rewards || Object.values(cache).length === 0){
            let rewards = {
                "1": [0,""],
                "2": [0,""],
                "3": [0,""],
                "4": [0,""],
                "5": [0,""],
                "6": [0,""],
                "7": [0,""],
                "8": [0,""],
                "9": [0,""],
                "10": [0,""],
                "11": [0,""],
                "12": [0,""],
                "13": [0,""],
                "14": [0,""],
                "15": [0,""],
                "16": [0,""],
                "17": [0,""],
                "18": [0,""],
                "19": [0,""],
                "20": [0,""],
                "21": [0,""],
                "22": [0,""],
                "23": [0,""],
                "24": [0,""],
                "25": [0,""],
            }
            await mongo().then(async (mongoose) =>{
                try{
                    await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                        rewards : rewards
                         
                    },{upsert:true});
                    if(log){
                        let embed = makeEmbed("Promotion system enabled","","10AE03",true);
                        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                        log.send({embeds: [embed]});
                    }
                    
                } finally{
                    console.log("WROTE TO DATABASE");
                    mongoose.connection.close();
                    cache[message.guild.id].rewards = servery.rewards = rewards;
                }
            })



            const embed1 = makeEmbed("Points promotion system",`**Introduction:**\nWelcome to the new points promotion system. The way this work is that whenever a member reaches a certain amount of points, they will automatically be rewarded with a preset role determined by an admin.\n The maximum amount of roles that can be set is 25 and the bot must be able to give/remove those role in order for it to work perfectly.`, server);
            let num = 1;
            for(let I in servery.rewards){
                let shit = `<@&${servery.rewards[I][1]}>`
                if(servery.rewards[I][1] === "" || !servery.rewards[I][1])shit ="`None`";
                embed1.addField(`**${num}) reward:**`,`Required points: ${servery.rewards[I][0]}\nRole reward: ${shit}\n Change value: \n\`${server.prefix}${this.name} ${I}\``,true)
                num++
            }
            message.channel.send({embeds:[embed1]});
            return true;
        } else {
            if(args[0]){
                let thing = args[0];
            
            
                if(servery.rewards[thing]){

                    if(args[1]){
                        let thong = args[1];
                        switch (thong.toLowerCase()) {
                            case "points":


                                let embedo6 = makeEmbed("Points rewards", `${type0Message}**Enter the amount of required points you want for this reward\n Value MUST be a number.**`, server);
                                message.channel.send({embeds:[embedo6]})
                                    .then(m => {
                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                            .then(async a => {   
                                                let content = a.first().content;
                                                
                                                switch (content) {
                                                    
                                                    case "cancel":
                                                        message.channel.send(cancerCultureMessage);
                                                        return false;
                                                        break;
                                                    default:
                                                        if(!isNaN(parseInt(content))){
                                                            servery.rewards[thing][0] = parseInt(content);
                                                        }else {
                                                            sendAndDelete(message,"Inavalid value, argument **must** be a number",server);
                                                            return false;
                                                            break;
                                                        }
                                                        
                                                        break;
                                                }
                                                await mongo().then(async (mongoose) =>{
                                                    try{ 
                                                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                            rewards: servery.rewards,
                                                        },{upsert:false});
                                                        message.channel.send(`**Required points have been successfully updated  to ${parseInt(content)}✅.**`)
                                                        
                                                    } finally{
                                                        console.log("WROTE TO DATABASE");
                                                        mongoose.connection.close();
                                                        cache[message.guild.id] = servery;
                                                    }
                                                });
                                            }).catch(e => {
                                                message.channel.send(idleMessage);
                                                return false;
                                            });
                                            
                                    });
                                    return true;
                                break;
                            case "role":
                            case "roles":
                                let embedo3 = makeEmbed("Points rewards", `${type0Message2}**Enter the role that you want to be rewarded on that tier.**`, server);
                                message.channel.send({embeds:[embedo3]})
                                    .then(m => {
                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                            .then(async a => {   
                                                let toCheck =   checkRoles(a);
                                                switch (toCheck) {
                                                    case "not valid":
                                                    case "no args": 
                                                    case "not useable":              
                                                        message.channel.send("Invalid argument, command failed.");
                                                        return false;
                                                        break;
                                                    case "cancel":
                                                        message.channel.send(cancerCultureMessage);
                                                        return false;
                                                        break;
                                                    case "no":
                                                        servery.rewards[thing][1] = "";
                                                        break;
                                                    default:
                                                        servery.rewards[thing][1] = toCheck;
                                                        break;
                                                }
                                                await mongo().then(async (mongoose) =>{
                                                    try{ 
                                                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                            rewards: servery.rewards
                                                        },{upsert:false});
                                                        message.channel.send(`**Reward role has been successfully updated  to <@&${toCheck}>✅.**`)
                                                        cache[message.guild.id] = servery;
                                                    } finally{
                                                        console.log("WROTE TO DATABASE");
                                                        mongoose.connection.close();
                                                    }
                                                });
                                            }).catch(e => {

                                                message.channel.send(idleMessage);
                                            });
                                    });

                                break;
                            default:
                                sendAndDelete(message,"Inavalid value",server);
                                return false;
                                break;
                        }
                    }else {
                        const embed = makeEmbed(`${thing}) reward`,"In order for a reward to be achievable, there must be a role to give and an amount of points preset.",server);
                        let shit = `<@&${servery.rewards[thing][1]}>`
                        let achievable = "**YES**"
                        if(servery.rewards[thing][1] === "" || !servery.rewards[thing][1]){shit ="`None`";achievable = "**NO**"}
                        if(servery.rewards[thing][0] <= 0) achievable = "**NO**"
                        embed.addFields(
                            {name:`**Required points:**`,value:`\`${thing}\`\nChange Value: \`${server.prefix}${this.name} ${thing} points\``,inline:false},
                            {name:`**Given role:**`,value:`${shit}\nChange Value: \`${server.prefix}${this.name} ${thing} role\``,inline:false},
                            {name:`**Achievable?:**`,value:`${achievable}`,inline:false},
                        );
                        message.channel.send({embeds:[embed]});
                        return false;
                    }
                }else {
                    sendAndDelete(message,"Inavalid value",server);
                    return false;
                }
            } else {
                const embed1 = makeEmbed("Points promotion system",`**Introduction:**\n The way this work is that whenever a member reaches a certain amount of points, they will automatically be rewarded with a preset role determined by an admin.\n The maximum amount of roles that can be set is 25 and the bot must be able to give/remove those role in order for it to work perfectly.`,server);
                let num = 1;
                for(let I in servery.rewards){
                    let shit = `<@&${servery.rewards[I][1]}>`
                    if(servery.rewards[I][1] === "" || !servery.rewards[I][1])shit ="`None`";
                    embed1.addField(`**${num}) reward:**`,`Required points: **${servery.rewards[I][0]}**\nRole reward: ${shit}\n Change value: \n\`${server.prefix}${this.name} ${I}\``,true)
                    num++
                }
                message.channel.send({embeds:[embed1]});
                return false;
            }

        }
      
                
        
		
	},

};
