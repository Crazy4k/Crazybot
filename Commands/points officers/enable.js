const makeEmbed = require("../../functions/embed");
const client = require("../.././index");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/officerPoints-schema");
let cache = require("../../caches/officerPointsCache");
let guildsCache = require("../../caches/guildsCache");
const serversSchema= require("../../schemas/servers-schema");


module.exports = {
	name : 'opoints-enable',
	description : "Enables the ~officer points~ plugin.",
    cooldown: 60 * 2,
    aliases:["op-enable","enable-opoints","enable-opoints"],
	usage:'opoints-enable',
    whiteList:'ADMINISTRATOR',
	async execute(message, args, server) { 

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
            if(servery === null){
                await mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            _id:message.guild.id,
                            whiteListedRole:"",
                            members:{}   
                        },{upsert:true});
                        servery = cache[message.guild.id] = {
                            _id:message.guild.id,
                            whiteListedRole:"",
                            members:{}  
                        }
                    } finally{
                        
                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                });	
            }
                    if(!server.oPointsEnabled){

                        let arrayOfIds = [];
                        client.guilds.cache.get(message.guild.id).members.cache.each(user => (arrayOfIds.push(user.id)));

                        servery.members = {};
                        arrayOfIds.forEach(i => servery.members[i] = 0);
                        const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to modify officer points.\nThis role will be able to view,remove,add and change the officer points of all users.\nType \`no\` for no one except admins.`, server);
                    
                        message.channel.send(embed)
                            const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                            .then(async (a) => {
                                let checkedRole = checkRoles(a);
                                switch (checkedRole) {
                                    case "not valid":
                                    case "not useable":
                                    case "no args":               
                                        message.channel.send("Invalid argument, command failed.");
                                        return false;
                                        break;
                                    case "cancel":
                                    case "no":
                                       servery.whiteListedRole = "";
                                    default:     
                                        servery.whiteListedRole = checkedRole;
                                        break;
                                    }                                        


                                    mongo().then(async (mongoose) =>{
                                        try{
                                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                _id:message.guild.id,
                                                whiteListedRole:servery.whiteListedRole,
                                                members:servery.members    
                                            },{upsert:true});
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    })
                                    cache[message.guild.id] = servery;

                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                oPointsEnabled:true,  
                                            },{upsert:false});
                                            guildsCache[message.guild.id].oPointsEnabled = true;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                    const embed = makeEmbed(`✅ Your server  officer points plugin has been activated.`,`People with that role can access all of the officer points commands`, "#24D900");
                                    message.channel.send(embed);
                            });
                        return true;
                    
                    } else{
                        const embed = makeEmbed(`Your server officer points plugin has already been activated.`,`Do "${server.prefix}opoints" instead.`, server);
                        message.channel.send(embed);
                        return false;
                    }           
    }
};
