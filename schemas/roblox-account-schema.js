const mongoose = require("mongoose");

const requiredString = {
    type: String,
    required: true
}
const robloxAccountSchema = mongoose.Schema({
    _id: requiredString,
    robloxId: requiredString,
    discordId: requiredString,
    method:requiredString,
    


})
module.exports = mongoose.model("roblox-accounts", robloxAccountSchema );
