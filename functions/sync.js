let pointsCache = require("../caches/pointsCache");
let guildsCache = require("../caches/guildsCache");
let warnCache = require("../caches/warnCache");
let officerPointsCache = require("../caches/officerPointsCache");

const pointsSchema = require("../schemas/points-schema");
const guildsSchema = require("../schemas/servers-schema");
const warnSchema = require("../schemas/warn-schema");
const officerPointsSchema = require("../schemas/officerPoints-schema");

const mongo = require("../mongo");


module.exports = async (message,) => {
    
    
    console.log(`Syncing for ${message.guild.name} executed.`);
    
    let whatToSay = [];

    let data1;
    let data2;
    let data3;
    let data4;
    await mongo().then(async (mongoose) =>{
        try{ 
            data1 = guildsCache[message.guild.id] = await guildsSchema.findOne({_id:message.guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });

    
    if(data1 === null){
        whatToSay.push("\n*Created a missing file of the server on the data base.");
        const serverObject = {
            guildId: message.guild.id,
            hiByeChannel:"",
            hiRole: "",
            language:"English",
            prefix : ";",
            muteRole:"",
            defaultEmbedColor:"#f7f7f7",
            deleteFailedMessagedAfter: 10000,
            deleteMessagesInLogs : true,
            deleteFailedCommands : false,
            isSet:false,
            pointsEnabled: false,
            logs :{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:""},
            warningRoles: {	firstwarningRole:"",secondWarningRole:"",thirdWarningRole:""}
        };

        await mongo().then(async (mongoose) =>{
            try{ 
                await guildsSchema.findOneAndUpdate({_id:message.guild.id},{
                    _id: message.guild.id,
                    hiByeChannel:"",
                    hiRole:"",
                    language:"English",
                    prefix:";",
                    muteRole:"",
                    defaultEmbedColor:"#f7f7f7",
                    deleteFailedMessagedAfter:10000,
                    deleteMessagesInLogs:true,
                    deleteFailedCommands:false,
                    isSet:false,
                    pointsEnabled:false,
                    logs:{hiByeLog:"",deleteLog:"",serverLog:"",warningLog:"",isSet:false,adminLog:""},
                    warningRoles:{firstwarningRole:"",secondWarningRole:"",thirdWarningRole:""},    
                },{upsert:true});
                guildsCache[message.guild.id] = serverObject;
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        
    } 

    await mongo().then(async (mongoose) =>{
        try{ 
            data2 = pointsCache[message.guild.id] = await pointsSchema.findOne({_id:message.guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });

    
    if(data2 === null){
        whatToSay.push("*\nCreated a missing file of the server on the data base.");
        mongo().then(async (mongoose) =>{
            let temp = {	
                _id: message.guild.id,
                whiteListedRole:"",
                members:{}

            }
            try{
                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    _id:message.guild.id,
                    whiteListedRole:"",
                    members:{}   
                },{upsert:true});
                pointsCache[message.guild.id] = temp;
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	
        
    }else if(pointsCache[message.guild.id].members){
        
        let newObj ={};
        let size1 = 0;
        let size2 = 0;

        for (const key in pointsCache[message.guild.id].members) {
            size1++;
            if(message.guild.members.cache.get(key)) {
                size2++;
                newObj[key] = pointsCache[message.guild.id].members[key];
            }
        }

        if(size1 !== size2){
            whatToSay.push("\n*Deleted left over data from members that are no longer in the server.");
            await mongo().then(async (mongoose) =>{
                try{
                    
                    await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                        members:newObj  
                    },{upsert:true});
                    pointsCache[message.guild.id].members = newObj;
                    
                } finally{
                    
                    console.log("WROTE TO DATABASE");
                    mongoose.connection.close();
                }
            });
        }
    }


    await mongo().then(async (mongoose) =>{
        try{ 
            data3 = warnCache[message.guild.id] = await warnSchema.findOne({_id:message.guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });
    


    if(data3 === null){
        whatToSay.push("\n*Created a missing file of the server on the data base.");
        let temp = {
            _id:message.guild.id,
            whiteListedRole:"",
            members:{}
        }
        mongo().then(async (mongoose) =>{
            try{
                await warnSchema.findOneAndUpdate({_id:message.guild.id},{
                    _id: message.guild.id,
                    whiteListedRole:"",
                    members:{}   
                },{upsert:true});
                warnCache[message.guild.id] = temp;
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	

    } else if(warnCache[message.guild.id].members){
        
        let newObj ={};
        let size1 = 0;
        let size2 = 0;

        for (const key in warnCache[message.guild.id].members) {
            size1;
            if(message.guild.members.cache.get(key)){
                size2++;
                newObj[key] = warnCache[message.guild.id].members[key];
            }
        }
    
        

        if(size1 !== size2) {
            whatToSay.push("\n*Deleted left over data from members that are no longer in the server.");
            await mongo().then(async (mongoose) =>{
                try{
                    
                    await warnSchema.findOneAndUpdate({_id:message.guild.id},{
                        members:newObj  
                    },{upsert:true});
                    warnCache[message.guild.id].members = newObj;
                    
                } finally{
                    
                    console.log("WROTE TO DATABASE");
                    mongoose.connection.close();
                }
            });
        }
    }
    await mongo().then(async (mongoose) =>{
        try{ 
            data4 = officerPointsCache[message.guild.id] = await officerPointsSchema.findOne({_id:message.guild.id});
        } finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    });

    
    if(data4 === null){
        whatToSay.push("\n*Created a missing file of the server on the data base.");
            let temp = {	
                _id: message.guild.id,
                whiteListedRole:"",
                members:{}

            }
        mongo().then(async (mongoose) =>{
            try{
                await officerPointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    _id:message.guild.id,
                    whiteListedRole:"",
                    members:{}   
                },{upsert:true});
                officerPointsCache[message.guild.id] = temp;
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	
        
    }else if(officerPointsCache[message.guild.id].members){
        
        let newObj ={};
        let size1 = 0;
        let size2 = 0;

        for (const key in officerPointsCache[message.guild.id].members) {
            size1++;
            if(message.guild.members.cache.get(key)) {
                size2++;
                newObj[key] = officerPointsCache[message.guild.id].members[key];
            }
        }

        if(size1 !== size2){
            whatToSay.push("\n*Deleted left over data from members that are no longer in the server.");
            await mongo().then(async (mongoose) =>{
                try{
                    
                    await officerPointsSchema.findOneAndUpdate({_id:message.guild.id},{
                        members:newObj  
                    },{upsert:true});
                    officerPointsCache[message.guild.id].members = newObj;
                    
                } finally{
                    
                    console.log("WROTE TO DATABASE");
                    mongoose.connection.close();
                }
            });
        }
    }

    console.log(`Syncing ended for ${message.guild.name}.`);
    
    return whatToSay;

}