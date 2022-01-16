let {pointsCache, guildsCache } = require("../caches/botCache");

const pointsSchema = require("../schemas/points-schema");
const guildsSchema = require("../schemas/servers-schema");
const mongo = require("../mongo");

/**
 * Creates missing data, deletes useless/expired data, fetches stuff from discord and updates all caches with the bot.
 * @param {object} object An object that has the guild property in it 
 * @returns {object} an array of strings of what has been change
 */
module.exports = async (object) => {
    
    let {guild} = object;

    console.log(`Syncing for ${guild.name} executed.`);
    
    let whatToSay = [];

    let data1;
    let data2;

    guild.members.fetch();
    guild.channels.fetch();
    guild.roles.fetch();

    
    await mongo().then(async (mongoose) =>{
        try{ 
            data1 = guildsCache[guild.id] = await guildsSchema.findOne({_id:guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });

    
    if(data1 === null){
        whatToSay.push("\n*Created a missing file of the server on the data base.");
        const serverObject = {
            guildId: guild.id,
			hiByeChannel:"",
			hiRole: "",
            hiString:`:green_circle: {<member>} Welcome to the server, have a great time :+1:`,
			byeString:`:red_circle: {<member>} just left the server, bye bye :wave:`,
			language:"English",
			prefix : ";",
            verifiedRole:"",
            forceRobloxNames: false,
            autoupdate: false,
            robloxBinds: {},
			defaultEmbedColor:"#f7f7f7",
			deleteFailedMessagedAfter: 10000,
			deleteMessagesInLogs : true,
			deleteFailedCommands : false,
			isSet:false,
			pointsEnabled: false,
			logs :{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:"",eventsLog:"",pointsLog:""},
            
        };

        await mongo().then(async (mongoose) =>{
            try{ 
                await guildsSchema.findOneAndUpdate({_id:guild.id},{
                    _id: serverObject.guildId,
					hiByeChannel: serverObject.hiByeChannel,
					hiRole: serverObject.hiRole,
                    hiString: serverObject.hiString,
                    byeString: serverObject.byeString,
					language: serverObject.language,
					prefix: serverObject.prefix,
					verifiedRole: serverObject.verifiedRole,
                    forceRobloxNames: serverObject.forceRobloxNames,
                    autoupdate: serverObject.autoupdate,
                    robloxBinds: {},
					defaultEmbedColor: serverObject.defaultEmbedColor,
					deleteFailedMessagedAfter: serverObject.deleteFailedMessagedAfter,
					deleteMessagesInLogs: serverObject.deleteMessagesInLogs,
					deleteFailedCommands: serverObject.deleteFailedCommands,
					isSet: serverObject.isSet,
					pointsEnabled: serverObject.pointsEnabled,
					logs: serverObject.logs,  
                      
                },{upsert:true});
                guildsCache[guild.id] = serverObject;
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        
    } else if(!data1.hiString || !data1.byeString){
        whatToSay.push("\n*Created new files that didn't exist before an update.");
        let obj = {
            hiString: `:green_circle: {<member>} Welcome to the server, have a great time :+1:`,
            byeString:`:red_circle: {<member>} just left the server, bye bye :wave:`,
        }

        await mongo().then(async (mongoose) =>{
            try{ 
                if(!data1.hiString){
                    await guildsSchema.findOneAndUpdate({_id:guild.id},{
                        hiString: obj.hiString
                    },{upsert:true});
                }
                if(!data1.byeString){
                    await guildsSchema.findOneAndUpdate({_id:guild.id},{
                        byeString: obj.byeString
                    },{upsert:true});
                }
                
                guildsCache[guild.id].hiString = obj.hiString;
                guildsCache[guild.id].byeString = obj.byeString;
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });

    }

    await mongo().then(async (mongoose) =>{
        try{ 
            data2 = pointsCache[guild.id] = await pointsSchema.findOne({_id:guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });

    
    if(data2 === null){
        whatToSay.push("*\nCreated a missing file of the server on the data base.");
        mongo().then(async (mongoose) =>{
            let temp = {	
                _id: guild.id,
                whiteListedRole:"",
                members:{},
                rewards:{}

            }
            try{
                await pointsSchema.findOneAndUpdate({_id:guild.id},{
                    _id:guild.id,
                    whiteListedRole:"",
                    members:{},
                    rewards : {} 
                },{upsert:true});
                pointsCache[guild.id] = temp;
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	
        
    }else if(pointsCache[guild.id].members){
        
        let newObj ={};
        let size1 = 0;
        let size2 = 0;

        for (const key in pointsCache[guild.id].members) {
            size1++;
            if(guild.members.cache.get(key)) {
                size2++;
                newObj[key] = pointsCache[guild.id].members[key];
            }
        }

        if(size1 !== size2){
            whatToSay.push("\n*Deleted left over data from members that are no longer in the server.");
            await mongo().then(async (mongoose) =>{
                try{
                    
                    await pointsSchema.findOneAndUpdate({_id:guild.id},{
                        members:newObj  
                    },{upsert:true});
                    pointsCache[guild.id].members = newObj;
                    
                } finally{
                    
                    console.log("WROTE TO DATABASE");
                    mongoose.connection.close();
                }
            });
        }
    }


    console.log(`Syncing ended for ${guild.name}.`);
    
    return whatToSay;

}