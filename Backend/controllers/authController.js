const { logEvents } = require('../middleware/logger');
//model and imports to decrypt password and webtoken 
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// Login
// @route POST /auth
const login = async (req, res) => {
    const { username, password } = req.body

    //checks inputs 
    if (!username || !password) {
        const error = new Error('All fields are required');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);

        return res.status(400).json({ message: 'All fields are required' })
    }

    //checks if user exists 
    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        const error = new Error('User does not Exist!');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);

        return res.status(401).json({ message: 'User does not Exist!' })
    }

    //decrypts password and checks if is valid 
    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        const error = new Error('Wrong Password!');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        return res.status(401).json({ message: 'Wrong Password!' })

    }
    //Create both access and refresh tokens 
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username
            }
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '10m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN,
        { expiresIn: '1d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 24 * 60 * 60 * 1000 //cookie expiry: set to match  (refresh token)
    })

    // Send accessToken containing username  
    res.json({ accessToken })
}

// Refresh access token with cookie (refresh token)
// @route GET /auth/refresh
const refresh = (req, res) => {

    const cookies = req.cookies

    //checks if cookie is received/exists
    if (!cookies?.jwt) {
        const error = new Error('Invalid Cookie');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        return res.status(401).json({ message: 'Invalid Cookie' })
    }
    //set refresh token from cookie 
    const refreshToken = cookies.jwt

    //verify refresh token token with jwt verify 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {

            //error - not valid 
            if (err) {
                const error = new Error('Forbidden');

                logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
                console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
                return res.status(403).json({ message: 'Forbidden' })
            }
            //checks for user 
            const foundUser = await User.findOne({ username: decoded.username }).exec()

            //user does not exist 
            if (!foundUser){
                const error = new Error('User does not Exist!');

                logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
                console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
                 return res.status(401).json({ message: 'User does not Exist!' })

            }
            //new access token if user exists 
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username
                    }
                },
                process.env.ACCESS_TOKEN,
                { expiresIn: '10m' }
            )
            //new access token sent 
            res.json({ accessToken })
        }
    )
}

// Logout and clear cookies 
// @route POST /auth/logout
const logout = (req, res) => {


    const cookies = req.cookies

    //checks if cookie is received/exists
    if (!cookies?.jwt) {
        const error = new Error('No Cookies To Logout!');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        return res.sendStatus(204)
    }
    //clears cookie with tokens 
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared and logout successfull!' })
}

module.exports = {
    login,
    refresh,
    logout
}