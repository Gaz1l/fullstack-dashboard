//Mongo db model 
const mongoose = require('mongoose')

//User Model schema - blueprint 
const userSchema = new mongoose.Schema({
    message: {   //user name 
        type: String,
        required: true
    },
    date: {         //password
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Report', userSchema)