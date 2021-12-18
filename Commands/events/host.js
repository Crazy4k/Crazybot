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
const Command = require("../../Classes/Command");

let host = new Command("host");
host.set({
	aliases         : [],
	description     : "Sends a message that is formated as an event message (pings everyone & requires role).",
	usage           : "host <event-type> <Supervised by> <link> [extra info]",
	cooldown        : 5,
	unique          : false,
	category        : "events",
	whiteList       : "MENTION_EVERYONE",
    requiredPerms   : "MENTION_EVERYONE",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "event-type",
            description : "The type of the event you want to host. Example: combat training",
            required : true,
            type: 3,
		},
		{
            name : "supervisor",
            description : "The person who is supervising your event. If no one, leave as N/A ",
            required : true,
            type: 3,
		},
        {
            name : "link",
            description : "Link to your event",
            required : true,
            type: 3,
		},
        {
            name : "extra-info",
            description : "Any extra info. Example: PTS is active",
            required : false,
            type: 3,
		},
        

	],
})



host.execute = function(message, args, server) { 
    console.log(args)
    let isSlash = false;

    let author;
    if(message.type === "APPLICATION_COMMAND"){
        author = message.user
        isSlash = true;
    } else {
        author = message.author
    }

    const role = server.hostRole;
    if(message.guild.members.cache.get(author.id).permissions.has(Permissions.FLAGS["ADMINISTRATOR"]) || message.guild.members.cache.get(author.id).roles.cache.has(role)){

        if(eventsCache[message.guild.id] === undefined || eventsCache[message.guild.id].length < max ){

            let eventType;
            let supervisor; 
            let link;
            let extraInfo;
            let location = message.channel.id;

            if(isSlash){
                eventType = args[0].value;
                supervisor = args[1].value;
                link = args[2].value;
                if(args[3])extraInfo = args[3].value
            } else{
                eventType = args[0];
                supervisor = args[1];
                link = args[2];
                extraInfo = args.splice(3).join(" ");
            }


            if(!link) {
                const embed2 = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message,embed2, server);
                return false;		
            }
            
            if(!extraInfo)extraInfo = "STS once spawned | PTS is active ";
            if(link === "ms2"){ 
                link = "https://www.roblox.com/games/4771888361/SCIENTIST-Military-Simulator-2#";
            } else if(link === "ms1"){ 
                link = "https://www.roblox.com/games/2988554876/MAFIA-Military-Simulator";
            } else {
            
            }
            const hostString = `• Event type: ${eventType}\n• Hosted by: <@${author.id}>\n• Supervised by: ${supervisor}\n• Starts at: 10 minutes\n\n•  Link to the game: ${link} \n•  Extra information: ${extraInfo}\n @everyone `;
            const logID = server.logs.eventsLog;
            const eventsLog = message.guild.channels.cache.get(logID);
            message.channel.send(hostString)
                .then(m =>{
                    if(eventsCache[message.guild.id] === undefined) eventsCache[message.guild.id] = [];
                    eventsCache[message.guild.id].push(`${eventType} ${message.channel.id} Open. ${author.id} ${m.url}`);
                    let indexo = eventsCache[message.guild.id].indexOf(`${eventType} ${message.channel.id} Open. ${author.id} ${m.url}`);
                    let startedID;
                    if(isSlash){
                        sendAndDelete(message,"Done ✅\n\n*React to 🗑 to cancel and delete the event at any time\n*The event will be automatically deleted in 2 hours\n*The event can be found using the ;events or /events command",server)
                    }else message.delete();

                    if(eventsLog){
                        let embed = makeEmbed("Event posted.","","00FF04",true);
                        embed.setAuthor(author.tag, author.displayAvatarURL());
                        embed.addFields(
                            {name:`Posted by:`, value: `<@${author.id}>`, inline:true},
                            {name:`Posted on:`, value: `<#${m.channel.id}>`, inline:true},
                            {name:`Event name:`, value: eventType, inline:true},
                            {name:`Message link: (Will exprire)`, value: `[message](${m.url})`, inline:true},
                            
                        );
                        eventsLog.send({embeds: [embed]});
                    }

                    setTimeout(()=>{
                        if(!m.deleted){

                            timer.start();
                            eventsCache[message.guild.id][indexo] = `${eventType} ${message.channel.id} Started. ${author.id} ${m.url}`
                            
                            m.channel.send(`${eventType} Started.`).then(mm=>{startedID = mm.id}).catch(e=>console.log(e));

                            if(eventsLog){

                                let embed = makeEmbed("Event started.","","FF9700",true);

                                embed.setAuthor(author.tag, author.displayAvatarURL());
                                embed.addFields(
                                    {name:`Posted by:`, value: `<@${author.id}>`, inline:true},
                                    {name:`Posted on:`, value: `<#${m.channel.id}>`, inline:true},
                                    {name:`Message link: (Will exprire)`, value: `[message](${m.url})`, inline:true},
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
                                embed.setAuthor(message.guild.members.cache.get(author.id).nickname, author.displayAvatarURL());
                                embed.addFields(
                                    {name:`Posted by:`, value: `<@${author.id}>`, inline:true},
                                    {name:`Posted on:`, value: `<#${m.channel.id}>` , inline:true},
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

                    const filter =(reaction, user) => user.id === author.id && reaction.emoji.name === "🗑";

                    m.awaitReactions({filter,  time: dltTime , max : 1})
                        .then(collected => {
                            
                            
                            if(!m.deleted)m.delete().catch(e=>console.log(e));

                            let startedMessage = message.channel.messages.cache.get(startedID);
                            if(startedMessage && !startedMessage.deleted){
                                startedMessage.delete();
                            }

                            if(eventsLog){
                                let embed = makeEmbed("Event Ended.","","FF0000",true);

                                embed.setAuthor(author.tag, author.displayAvatarURL());
                                embed.addFields(
                                    {name:`Posted by:`, value: `<@${author.id}>`, inline:true},
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
    } else {
        const embed = makeEmbed("Missing permission",`The bot doesn't have the required permission to execute this command.\nMissing special role`,"FF0000",);
        sendAndDelete(message,embed,server);
        return false;
    }
}

module.exports = host;
