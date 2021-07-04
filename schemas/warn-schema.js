const mongoose = require("mongoose");

const requiredString = {
    type: String,
    required: true
}
const warnSchema = mongoose.Schema({
    _id: requiredString,
    whiteListedRole:{
        type:String,
        required:false
    },
    members:{
        type: Object,
        required: true
    },
    



})
module.exports = mongoose.model("guild-warns", warnSchema);