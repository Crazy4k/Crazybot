const mongoose = require("mongoose");


const timerSchema = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    data:{
        type: Object,
        required: true
    },
   

})
module.exports = mongoose.model("timers", timerSchema);
