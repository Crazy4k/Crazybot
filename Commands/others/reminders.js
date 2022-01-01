const Command = require("../../Classes/Command");
const mongo = require("../../mongo");
const timerSchema = require("../../schemas/timer-schema");
const botCache = require("../../caches/botCache");
const remind = require("../../functions/time-outs/remind");
const sendAndDelete = require("../../functions/sendAndDelete");
const makeEmbed = require("../../functions/embed");




const reminders = new Command("reminders");

reminders.set({
    aliases         : [],
	description     : "shows you the current reminders you have",
	usage           : "reminders",
	cooldown        : 3,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    


});

reminders.execute = async function (message, args, server, isSlash)  {

    let author = isSlash? message.user : message.author; 

   
    await mongo().then(async (mongoose) =>{
        try{
            const data = await timerSchema.findOne({_id:"remindme"});
            data ? botCache.timeOutCache["remindme"] = data : botCache.timeOutCache["remindme"] = {};
        }
        finally{
            console.log("FETCHED FROM DATABASE");
            mongoose.connection.close();
        }
    })

   /*let remindAt = Date.now()+ time * multiplier
    botCache.timeOutCache["remindme"][remindAt] = {
        type: "reminder",
        timeStamp: remindAt,
        authorId: author.id,
        channelId: message.channel.id,
        text,

    };*/

    const embed = makeEmbed("Reminders!","",server,false);
    let stringArray = [];
    for(let timeStamp in botCache.timeOutCache["remindme"].data){
        let reminderObject =botCache.timeOutCache["remindme"].data[timeStamp];
        if(reminderObject.authorId === author.id){
            stringArray.push(`*In <#${reminderObject.channelId}>: \`${reminderObject.text}\` on <t:${parseInt(reminderObject.timeStamp / 1000)}:D> at <t:${parseInt(reminderObject.timeStamp / 1000)}:T> or <t:${parseInt(reminderObject.timeStamp / 1000)}:R>`)
        }
    }
    if(stringArray.length)embed.setDescription(stringArray.join("\n"));
    else embed.setDescription("You don't have any reminders at the moment, try adding some using `;remindme`")
    message.reply({embeds:[embed]});
    return true;



}
module.exports = reminders;