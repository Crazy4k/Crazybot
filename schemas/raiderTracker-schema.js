const mongoose = require("mongoose");


const raiderTrackerSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    channels:{
        type: Object,
        required: true
    }
})
module.exports = mongoose.model("raiderTracker-channels", raiderTrackerSchema);
