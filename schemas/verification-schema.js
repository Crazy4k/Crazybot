const mongoose = require("mongoose");


const verification = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    robloxId: {
        type: Number,
        required: false
    },
    cachedUsername: {
        type: String,
        required: false
    },
    firstVerified: {
        type: String,
        required: false
    },
    
})

module.exports = mongoose.model("verification", verification);
