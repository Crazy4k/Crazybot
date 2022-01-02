const Command = require("../../Classes/Command");
const mongo = require("../../mongo");
const timerSchema = require("../../schemas/timer-schema");
let botCache = require("../../caches/botCache");
const sendAndDelete = require("../../functions/sendAndDelete");
const makeEmbed = require("../../functions/embed");




const remindMe = new Command("remindme");

remindMe.set({
    aliases         : [],
	description     : "reminds you if anything you want at any time",
	usage           : "remindme ( 5h, 60m or 7d) <text>",
	cooldown        : 0,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "unit",
            description : "hours, minutes, days",
            choices: [  {name:"minutes",value:"m"}, {name:"hours",value:"h"},{name:"days",value:"d"},],
            required : true,
            type: 3,
		},{
            name : "duration",
            description : "How long to wait before reminding you using the previous unit?",
            required : true,
            type: 4,
		},
		{
            name : "text",
            description : "What do you want to be reminded about?",
            required : true,
            type: 3,
		}
	],


});

remindMe.execute = async function (message, args, server, isSlash)  {

    let author;
    let duration;
    let text;

    if(isSlash){
        author = message.user;
        duration = args[1].value + args[0].value;
        text = args[2].value
    } else{
        author = message.author;
        duration = args[0];
        text = args.splice(1).join(" ");
    }


    if(!duration){
        const embed = makeEmbed('Missing time',this.usage, server);
        sendAndDelete(message,embed, server);
        return false;
    } else if(!text){
        const embed = makeEmbed('Missing reminder',this.usage, server);
        sendAndDelete(message,embed, server);
        return false;  
    }  
    let multiplier = 1000 ;
    let unit = duration.split("").pop();
    duration = duration.slice(0,duration.length-1);
    
    switch (unit.toLowerCase()) {
        case "d":
        case "day":
        case "days":
            multiplier *= 60 * 60 * 24;
            break;
        case "h":
        case "hour":
        case "hrs":
        case "hr":
            multiplier *= 60 * 60;
            break;
        case "m":
        case "minutes":
        case "minute":
        case "min":
        case "mins":
            multiplier *= 60;
            break;
            case "s":
            case "sec":
            case "seconds":
            case "secs":
                break;
        default:
            const embed = makeEmbed('Invalid time format provided',`${this.usage}\nAdd s, m, h or d after the time`, server);
            sendAndDelete(message,embed, server);
            return false;
            break;
    }
    const time = parseInt(duration)
    
    if(isNaN(time)){
        const embed = makeEmbed('Invalid time was provided',this.usage+'\nA valid format looks like this: "60s", "5m", "10h"', server);
        sendAndDelete(message,embed, server);
        return false;
    }
    if(time * multiplier > 30758400000){
        const embed = makeEmbed('Maximum time reached',"Cannot remember stuff after a year", server);
        sendAndDelete(message,embed, server);
        return false;
    }
    if(time * multiplier < 60000){
        const embed = makeEmbed('Reminder too short',"Timer duration must be at least 1 minute", server);
        sendAndDelete(message,embed, server);
        return false;
    }

    let temp;
    await mongo().then(async (mongoose) =>{
        try{
            const data = await timerSchema.findOne({_id:"remindme"});

            if(data)temp = data;
            else temp = {data:{}};
        }
        finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    })

    let remindAt = Date.now()+ time * multiplier

    temp.data[remindAt] = {
        type: "reminder",
        timeStamp: remindAt,
        authorId: author.id,
        channelId: message.channel.id,
        text,

    };

    mongo().then(async (mongoose) =>{
        try{
            await timerSchema.findOneAndUpdate({_id:"remindme"},{
                data: temp.data
            },{upsert:true});
            botCache.timeOutCache["remindme"].data = temp.data
            message.reply(`I will remind you about \`${text}\` on <t:${parseInt(remindAt / 1000)}:D> at <t:${parseInt(remindAt / 1000)}:T> or <t:${parseInt(remindAt / 1000)}:R>`);

            
        } finally{

            console.log("WROTE TO DATABASE");
            mongoose.connection.close();
        }
    });



}
module.exports = remindMe;