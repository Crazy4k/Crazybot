const mongoose = require("mongoose");
require("dotenv").config();
const mongoPath = process.env.MONGO_PATH;


module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
    });
    return mongoose;
}