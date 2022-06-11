const mongoose = require("mongoose");


const bgcschema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    lastScore: {
        type: Number,
        required: true
    },
    stagnatedBefore: {
        type: Boolean,
        required: true
    }
    
})
module.exports = mongoose.model("bgc", bgcschema);
