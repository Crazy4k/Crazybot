const {guildsCache} = require("../caches/botCache");
const mongo = require("../mongo");
const serversSchema = require("../schemas/servers-schema");
let cache = require("../caches/botCache").pointsCache;
const pointsSchema = require("../schemas/points-schema");
/**
 * creates the points storage object in the mongoDB cluster
 * @param {object} message Message object 
 * @param {object} server The server's mongoDB-stroed data
 * @returns {void}
 */
module.exports = async (message, server) => { 

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
                    members:{},
                    
                },{upsert:true});
                servery = cache[message.guild.id] = {
                    _id:message.guild.id,
                    whiteListedRole:"",
                    members:{},
                    
                }
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	
    }
    if(!server.pointsEnabled){

        let arrayOfIds = [];
        message.guild.members.cache.each(user => (arrayOfIds.push(user.id)));

        servery.members = {};
        arrayOfIds.forEach(i => servery.members[i] = 0);
        

        mongo().then(async (mongoose) =>{
            try{
                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    
                    
                    members:servery.members    
                },{upsert:true});
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        cache[message.guild.id] = servery;

        await mongo().then(async (mongoose) =>{
            try{ 
                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                    pointsEnabled:true,  
                },{upsert:false});
                guildsCache[message.guild.id].pointsEnabled = true;
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        
            
    } else return;         
}