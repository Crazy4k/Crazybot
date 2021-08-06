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
    muteRole:requiredString,
    language:requiredString,
    prefix:requiredString,
    defaultEmbedColor:requiredString,
    deleteFailedMessagedAfter:requiredInt,
    deleteMessagesInLogs:{type:Boolean,required:true},
    deleteFailedCommands:{type:Boolean,required:true},
    isSet:{type:Boolean,required:true},
    pointsEnabled:{type:Boolean,required:true},
    oPointsEnabled:{type:Boolean,required:false},
    logs:{type:Object,required:true},


    
})
module.exports = mongoose.model("server-settings", guildSchema);