//model and imports to decrypt password and webtoken 
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')



// Create new user
// @route POST /users
const createNewUser = asyncHandler(async (req, res) => {

    //Gets inputs 
    const { username, password,code } = req.body

    // Confirm data
    if (!username || !password || !code) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //Confirms validation code 
    if (code!==process.env.VALIDATION_CODE) {
        return res.status(409).json({ message: 'Invalid Validation Code' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // encrypts password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})



module.exports = {
    createNewUser,
}