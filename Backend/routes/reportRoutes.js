//express and router - to define routes
const express = require('express')
const router = express.Router()

//functions to call in the routes
const reportController = require('../controllers/reportController')



//Routes - /users
// create new user
router.route('/')   //already at users
    .post(reportController.createNewReport)


module.exports = router