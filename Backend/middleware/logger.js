// log middleware 
//Registers info about incoming requests 

//Date format and random number generator
const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

//file system functions and paths 
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

//register an event 
const logEvents = async (message, logFileName) => {
    //date  and log item formatting 
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {       //created dir if does not exist 
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        //adds item to the log file 
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

//logger middleware 
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }