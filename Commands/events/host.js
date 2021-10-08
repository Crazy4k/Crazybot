const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const {eventsCache} = require("../../caches/botCache");
var { Timer } = require("easytimer.js");
const {Permissions} = require("discord.js");

const dltTime = 1000 * 60 * 60 * 2; // 2 hours
const tenMinutes = 1000 * 60 * 10; // 10 minutes
let timer = new Timer();

let max = 1;


module.exports = {
	name : 'host',
	description : "Sends a message that is formated as an event message (pings everyone).",
    cooldown: 5,
    aliases:[],
    category:"ms",
	usage:'host <event-type> <Supervised by> <link> [extra info]',

	execute(message, args, server) { 

        const role = server.hostRole;
        if(message.guild.members.cache.get(message.author.id).permissions.has(Permissions.FLAGS["ADMINISTRATOR"]) || message.guild.members.cache.get(message.author.id).roles.cache.has(role)){

            if(eventsCache[message.guild.id] === undefined || eventsCache[message.guild.id].length < max ){

                let eventType = args[0];
                let supervisor = checkUseres(message, args, 1);
                switch (supervisor) {
                    case "not valid":
                    case "everyone":	
                    case "not useable":
                        supervisor = args[1];
                        break;
                    case "no args": 
                        const embed2 = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message,embed2, server);
                        return false;		
                        break;
                }
                if(message.guild.members.cache.get(supervisor))supervisor = `<@${supervisor}>`;
                let host = message.author.id;
                let link = args[2];
                if(!link) {
                    const embed2 = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message,embed2, server);
                    return false;		
                }
                let extraInfo = args.splice(3).join(" ");
                if(!extraInfo)extraInfo = "STS once spawned | PTS is active ";
                if(link === "ms2"){ 
                    link = "https://www.roblox.com/games/4771888361/SCIENTIST-Military-Simulator-2#";
                } else if(link === "ms1"){ 
                    link = "https://www.roblox.com/games/2988554876/MAFIA-Military-Simulator";
                } else {
                
                }
                const hostString = `• Event type: ${eventType}\n• Hosted by: <@${host}>\n• Supervised by: ${supervisor}\n• Starts at: 10 minutes\n\n•  Link to the game: ${link} \n•  Extra information: ${extraInfo}\n @everyone `;
                const logID = server.logs.eventsLog;
                const eventsLog = message.guild.channels.cache.get(logID);
                message.channel.send(hostString)
                    .then(m =>{
                        if(eventsCache[message.guild.id] === undefined) eventsCache[message.guild.id] = [];
                        eventsCache[message.guild.id].push(`${eventType} ${message.channel.id} Open. ${message.author.id} ${m.url}`);
                        let indexo = eventsCache[message.guild.id].indexOf(`${eventType} ${message.channel.id} Open. ${message.author.id} ${m.url}`);
                        let startedID;
                        message.delete();
    
                        if(eventsLog){
                            let embed = makeEmbed("Event posted.","","00FF04",true);
                            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                            embed.addFields(
                                {name:`Posted by:`, value: `<@${message.author.id}>`, inline:true},
                                {name:`Posted on:`, value: `<#${message.channel.id}>`, inline:true},
                                {name:`Event name:`, value: eventType, inline:true},
                                {name:`Message link: (Will exprire)`, value: `[message](${message.url})`, inline:true},
                                
                            );
                            eventsLog.send({embeds: [embed]});
                        }
    
                        setTimeout(()=>{
                            if(!m.deleted){
    
                                timer.start();
                                eventsCache[message.guild.id][indexo] = `${eventType} ${message.channel.id} Started. ${message.author.id} ${m.url}`
                                
                                m.channel.send(`${eventType} Started.`).then(mm=>{startedID = mm.id}).catch(e=>console.log(e));
    
                                if(eventsLog){
    
                                    let embed = makeEmbed("Event started.","","FF9700",true);
    
                                    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                                    embed.addFields(
                                        {name:`Posted by:`, value: `<@${message.author.id}>`, inline:true},
                                        {name:`Posted on:`, value: `<#${message.channel.id}>`, inline:true},
                                        {name:`Message link: (Will exprire)`, value: `[message](${message.url})`, inline:true},
                                        {name:`Link to the game:`, value:`[The given link](${link})`, inline:true},
                                        {name:`Event name:`, value: eventType, inline:true},
                                    );
    
                                    eventsLog.send({embeds: [embed]});
                                }
                            }
                        }, tenMinutes );
                        setTimeout(()=>{
                            m.delete().then(e=>{
                                if(eventsLog){
                                   
                                    let embed = makeEmbed("Event Ended.","","FF0000",true);
                                    embed.setAuthor(message.guild.members.cache.get(message.author.id).nickname, message.author.displayAvatarURL());
                                    embed.addFields(
                                        {name:`Posted by:`, value: `<@${message.author.id}>`, inline:true},
                                        {name:`Posted on:`, value: `<#${message.channel.id}>` , inline:true},
                                        {name:`Event duration:`, value: `${timer.getTimeValues().hours} hours ${timer.getTimeValues().minutes} minutes ${timer.getTimeValues().seconds} seconds`, inline:true},
                                        {name:`Event name:`, value: eventType, inline:true},
                                        
                                    )
                                    eventsLog.send({embeds: [embed]});
                                }
        
                                let startedMessage =message.channel.messages.cache.get(startedID);
                                if(startedMessage && !startedMessage.deleted){
                                    startedMessage.delete();
                                }
        
                                timer.stop();
                                eventsCache[message.guild.id].splice(indexo, 1); 
        
                            }).catch(e => e);
                        },dltTime + 1000)
                        
    
                        m.react("🗑");
    
                        const filter =(reaction, user) => user.id === message.author.id && reaction.emoji.name === "🗑";
    
                        m.awaitReactions({filter,  time: dltTime , max : 1})
                            .then(collected => {
                                
                                
                                if(!m.deleted)m.delete().catch(e=>console.log(e));
    
                                let startedMessage = message.channel.messages.cache.get(startedID);
                                if(startedMessage && !startedMessage.deleted){
                                    startedMessage.delete();
                                }
    
                                if(eventsLog){
                                    let embed = makeEmbed("Event Ended.","","FF0000",true);
    
                                    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                                    embed.addFields(
                                        {name:`Posted by:`, value: `<@${message.author.id}>`, inline:true},
                                        {name:`Posted on:`, value: `<#${message.channel.id}>`, inline:true},
                                        {name:`Event duration:`, value: `${timer.getTimeValues().hours} hours ${timer.getTimeValues().minutes} minutes ${timer.getTimeValues().seconds} seconds`, inline:true},
                                        {name:`Event name:`, value: eventType, inline:true},
                                    );
    
                                    eventsLog.send({embeds: [embed]});
                                }
                                eventsCache[message.guild.id].splice(indexo, 1); 
                                timer.stop();
                            }).catch(console.error);
                        return true;
                    });
            }else{
                let embed = makeEmbed("Event already being hosted.",`You can't host an event while another event is being hosted.\nCheck \`${server.prefix}events\` for more info.`, server)
                sendAndDelete(message,embed, server);
            }
            } else return false;       
        }
};