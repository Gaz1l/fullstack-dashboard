// error middleware 
//Registers info about incoming errors with requests from client (front end)
const { logEvents } = require('./logger')

//middleware for error 
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler 