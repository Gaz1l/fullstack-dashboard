//express and router - to define routes 
const express = require('express')
const router = express.Router()

//functions to call in the routes 
const authController = require('../controllers/authController')
const authLimiter = require('../middleware/authLimiter')
const verifyToken = require('../middleware/verifyTokens')


//Routes - /auth

// "/auth/"
router.route('/')   //already at auth
    .post(authLimiter, authController.login)

    // "/auth/verify"
// verify access token 
router.route('/verify')  
        .get(verifyToken.verifyTokenOnAccess)

// "/auth/refresh"
// refresh access token 
router.route('/refresh')  
    .get(authController.refresh)

// "/auth/logout"
// logout and clear cookies
router.route('/logout')   
    .get(authController.logout)


module.exports = router