const mongoose = require("mongoose");

const requiredString = {
    type: String,
    required: true
}
const pointsSchema = mongoose.Schema({
    _id: requiredString,
    whiteListedRole:{
        type:String,
        required:false
    },
    members:{
        type: Object,
        required: true
    },
    rewards:{
        type: Object,
        required: false
    }
    



})
module.exports = mongoose.model("guild-points", pointsSchema);