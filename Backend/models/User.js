//Mongo db model 
const mongoose = require('mongoose')

//User Model schema - blueprint 
const userSchema = new mongoose.Schema({
    username: {   //user name 
        type: String,
        required: true
    },
    password: {         //password
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema)
