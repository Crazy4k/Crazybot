const mongoose = require("mongoose");

const requiredString = {
    type: String,
    required: true
}
const susSchema = mongoose.Schema({
    _id: requiredString,
    whiteListedRole:{
        type: String,
        required:false
    },
    links:{
        type: Array,
        required: true
    }

})
module.exports = mongoose.model("sus", susSchema);
