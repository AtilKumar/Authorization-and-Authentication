const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected with db")
    })
    .catch((error) => {
        console.log("error encountered")
        console.error(error.message)
        process.exit(1)
    })
}
module.exports = connect;