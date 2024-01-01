//express and router - to define routes
const express = require('express')
const router = express.Router()

//functions to call in the routes
const reportController = require('../controllers/reportController')



//Routes - /report
// create new user
router.route('/')   //already at report
    .post(reportController.createNewReport)


module.exports = router