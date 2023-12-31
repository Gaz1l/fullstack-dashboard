//express and router - to define routes
const express = require('express')
const router = express.Router()

//functions to call in the routes
const usersController = require('../controllers/usersController')



//Routes - /users
// create new user
router.route('/')   //already at users
    .post(usersController.createNewUser)


module.exports = router