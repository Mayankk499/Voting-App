const mongoose = require("mongoose");
require("dotenv").config({ debug: false });


// const mongoURL = "mongodb://localhost:27017/Voting_App";
const mongoURL = process.env.DATABASE_URL;

mongoose.connect(mongoURL, {
    
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB server");
});

db.on('error', (err) => {
    console.error('Connectoin error in DB');
    
})

db.on('disconnected', () => {
    console.log("disconnected to MongoDB server");
});

module.exports = db;