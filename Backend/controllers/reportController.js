const { logEvents } = require('../middleware/logger');
//model and date imports
const Report = require('../models/Report')
const asyncHandler = require('express-async-handler')
const { format } = require('date-fns')



// Create new report
// @route POST /report/
const createNewReport = asyncHandler(async (req, res) => {

   
    //Gets inputs 
    const { reportMessage } = req.body

    console.log(reportMessage)
    // Confirm data
    if (!reportMessage || reportMessage.trim()==='') {
        const error = new Error('All fields are required');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        return res.status(400).json({ message: 'All fields are required' })
    }

    //get data and time 
    const date = format(new Date(), 'yyyyMMdd\tHH:mm:ss')

    const reportObject = { message:reportMessage, date }

    // Create and store new report object 
    const report = await Report.create(reportObject)

    if (report) { //created 
        res.status(201).json({ message: `New report created` })
    } else {
        const error = new Error('Invalid user data received');

        logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        console.error(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`);
        res.status(400).json({ message: 'Invalid user data received' })
    }
})



module.exports = {
    createNewReport,
}