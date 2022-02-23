const guildCreate		= require("../event_listeners/guildCreate");
const guildDelete		= require('../event_listeners/guildDelete');
const guildMemberAdd	= require("../event_listeners/guildMemberAdd");	
const guildMemberUpdate	= require("../event_listeners/guildMemberUpdate");
const guildMemberRemove	= require("../event_listeners/guildMemberRemove");
const messageDelete		= require("../event_listeners/messageDelete");
const channelCreate		= require("../event_listeners/channelCreate.js");
const channelDelete		= require("../event_listeners/channelDelete");
const channelUpdate		= require("../event_listeners/channelUpdate");
const messageUpdate		= require("../event_listeners/messageUpdate");
const emojiCreate		= require("../event_listeners/emojiCreate");
const emojiDelete		= require("../event_listeners/emojiDelete");
const emojiUpdate		= require("../event_listeners/emojiUpdate");
const guildBanAdd 		= require("../event_listeners/guildBanAdd");
const guildBanRemove	= require("../event_listeners/guildBanRemove");
const messageDeleteBulk = require("../event_listeners/messageDeleteBulk");
const roleCreate 		= require("../event_listeners/roleCreate");
const roleDelete		= require("../event_listeners/roleDelete");
const roleUpdate		= require("../event_listeners/roleUpdate");

const errorHandler      = require("../functions/error_handler");
const botCache = require("../caches/botCache");
let config = require("../config/config.json")


module.exports = (client, mongo) => {


    client.once('ready', async() => {

        await mongo().then(mongoose =>{
            try{
                console.log("Connected to mongo.");
            }catch(e){
                console.log("Failed to Connect to mongo.");
            }
            finally
            {
                mongoose.connection.close();
            }
        });
    
        const testGuild = client.guilds.cache.get(config.bot_info.testGuildId);
        let commands;
        if(testGuild){
            commands = testGuild.commands;
        } else {
            commands = client.application?.commands;
        }
        client.slashCommands.each(command => {
            commands?.create(command).catch(e=>console.log(e));
        })
        
    
        console.log(`Bot succesfuly logged in as ${client.user.tag} [${client.user.id}]`);
        botCache.isReady = true;
    
        errorHandler(client);

        if(client.user.id === "869954815982190632" || client.user.id === "799752849163550721"){
            console.log("Background checker folder detected!")
            const updateRaiderHistory = require("../backgroundChecker/updateRaiderHistory");
            const cache = require("../backgroundChecker/cache");
            const getMembers = require("../raiderTracker/getMembers");
            const raiderGroups = require("../backgroundChecker/allRaiderGroups.json");
            const getbadges = require("../backgroundChecker/getbadges");

            let groupsArray = [];
            for(let i in raiderGroups){
                groupsArray.push(raiderGroups[i].id);
            }

            (async()=>{
                let raiders = await getMembers(groupsArray)
                raiders = [...new Set(raiders)];
                cache.raiderMembers = raiders;
                getbadges();
                console.log("Background checker ready!")
            })()
            

        
            setInterval(async () => {
                updateRaiderHistory();

                let raiders = await getMembers(groupsArray)
                raiders = [...new Set(raiders)];
                cache.raiderMembers = raiders;
                getbadges();
                
            }, 24 * 60 * 60 * 1000);
        }



    });


    
    client.on('guildCreate', async (guild)  => {
        if(!botCache.isReady)return		
        try {
            guildCreate(guild, client);
        } catch (error) {
            console.log(error);
            console.log("guildCreate error");
        }
    });
    
    client.on('guildDelete', async (guild) => {
        if(!botCache.isReady)return
        try {
            guildDelete(guild, client);
        } catch (error) {
            console.log(error);
            console.log("guildDelete error");
        }
    });
    
    client.on('guildMemberAdd', (member)=> {
        if(!botCache.isReady)return
        try {
            guildMemberAdd(member, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on('guildMemberUpdate', (oldMember, newMember)=> {
        if(!botCache.isReady)return
        try {
            guildMemberUpdate(oldMember, newMember, client);
        } catch (error) {
            console.log(error);
        }	
    });
    
    // bye message/log
    client.on('guildMemberRemove', (member) => {
        if(!botCache.isReady)return
        try {
            guildMemberRemove(member, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    // message deletion logs
    client.on('messageDelete', (message) => {
        if(!botCache.isReady)return
        try {
            messageDelete(message, client);
        } catch (error) {
            console.log(error);
        }	
    });
    
    // server logs (roles, channels)
    client.on('channelCreate', (channel) => {
        if(!botCache.isReady)return
        try {
            channelCreate(channel, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("guildBanAdd", (ban) => {
        if(!botCache.isReady)return
        try {
            guildBanAdd(ban, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("guildBanRemove", (ban) => {
        if(!botCache.isReady)return
        try {
            guildBanRemove(ban, client);
        } catch (error) {
            console.log(error);
        }
    });
    client.on("messageDeleteBulk", (messages) => {
        if(!botCache.isReady)return
        try {
            messageDeleteBulk(messages, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("roleCreate", (role) => {
        if(!botCache.isReady)return
        try {
            roleCreate(role, client);
        } catch (error) {
            console.log(error);
        }
    });
    client.on("roleDelete", (role) => {
        if(!botCache.isReady)return
        try {
            roleDelete(role, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("roleUpdate", (oldRole, newRole) => {
        if(!botCache.isReady)return
        try {
            roleUpdate(oldRole, newRole ,client);
        } catch (error) {
            console.log(error);
        }
    });
    
    // channel delete logs
    client.on('channelDelete', (channel) => {
        if(!botCache.isReady)return
        try {
            channelDelete(channel, client);	
        } catch (error) {
            console.log(error);
        }
    });
    
    //channel update log
    client.on('channelUpdate', (oldChannel, newChannel)=> {
        if(!botCache.isReady)return
        try {
            channelUpdate(oldChannel,newChannel, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    //message update logging
    client.on('messageUpdate', (oldMessage, newMessage) => {
        if(!botCache.isReady)return
        try {
            messageUpdate(oldMessage, newMessage, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("emojiCreate", async emoji =>{
        if(!botCache.isReady)return
        try {
            emojiCreate(emoji, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("emojiDelete", async emoji =>{
        if(!botCache.isReady)return
        try {
            emojiDelete(emoji, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("emojiUpdate", async (oldEmoji, newEmoji) =>{
        if(!botCache.isReady)return
        try {
            emojiUpdate(oldEmoji,newEmoji, client);
        } catch (error) {
            console.log(error);
        }
    });
    
    client.on("error", async error =>{
        console.log("cought an error sir!");
        console.log(error);
    });

    
}