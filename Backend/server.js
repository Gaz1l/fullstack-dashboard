const { rateLimit } = require( 'express-rate-limit')
//Environment variables configuration 
require('dotenv').config()

//Express to create server and communication 
const express = require('express');
const app = express()

//Module to work with path and directories 
const path = require(`path`)

//Middlewares for logger and error handler
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

//Middleware for passing cookies 
const cookieParser = require('cookie-parser')

//Middleware for Cross-Origin Resource Sharing and option configuration 
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

//MongoDB setup - Databases 
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));

//Middleware for file uploading and destination folder 
const multer = require('multer');
const upload = multer({ dest: './files' });

// const limiter = rateLimit({
// 	validate: {
// 		xForwardedForHeader: false,
// 	}
// })

// app.use(limiter)
//console.log(process.env.NODE_ENV)
//app.set('trust proxy', false);

app.set('trust proxy', 3)
app.get('/ip', (request, response) => response.send(request.ip))
app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))

//Server port - 3500 
const PORT = process.env.PORT



//Database connection 
connectDB()

app.use(logger)   // log middleware 

app.use(cors(corsOptions))  //cors middleware - only allow certain origins 

//allow json and url requests with a limit of 50mb 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(cookieParser())         //cookie parser middleware 

app.use(errorHandler)  //error middleware 
//routes/endpoints 
app.use('/auth', require('./routes/authRoutes')) //authentication routes 
app.use('/users', require('./routes/userRoutes')) //user routes
app.use('/report', require('./routes/reportRoutes')) //report routes 
app.use('/files', upload.single('file'), require('./routes/fileRoutes'))  //files routes allows uploads 


//error/ not found  routes 
app.all('*', (req, res) => {
    res.status(404)     //not found 
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})



//connection to mongo db - database
//starts express application 
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

//error on connection - log
mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
