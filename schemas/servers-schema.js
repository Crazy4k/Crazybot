const mongoose = require("mongoose");

const requiredString = {
    type: String,
    required: true
}
const requiredInt = {
    type: Number,
    required: true
}
const guildSchema = mongoose.Schema({
    _id: requiredString,
    hiByeChannel:requiredString,
    hiRole:requiredString,
    hiString:{type:String,required:true},
    byeString:{type:String,required:true},
    hostRole:{type:String,required:false},
    verifiedRole:requiredString,
    forceRobloxNames:{type:Boolean,required:true},
    autoupdate: {type:Boolean, required:true},
    robloxBinds:{type:Object,required:true},
    language:requiredString,
    prefix:requiredString,
    defaultEmbedColor:requiredString,
    deleteFailedMessagedAfter:requiredInt,
    deleteMessagesInLogs:{type:Boolean,required:true},
    deleteFailedCommands:{type:Boolean,required:true},
    isSet:{type:Boolean,required:true},
    pointsEnabled:{type:Boolean,required:true},
    oPointsEnabled:{type:Boolean,required:false},
    disabledCategories:{type:Object,required: true},
    logs:{type:Object,required:true},


    
})
module.exports = mongoose.model("server-settings", guildSchema);