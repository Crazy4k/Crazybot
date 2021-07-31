const mongoose = require("mongoose");
require("dotenv").config();
const mongoPath = process.env.MONGO_PATH;
let fetchesCache = require("./caches/fetchesCache");

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
    });
    fetchesCache.totalFetches++;
    return mongoose;
}