require('dotenv').config();
const mongoose = require('mongoose');

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDatabase;
