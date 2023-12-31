//middleware to verify tokens when accessing endpoints 
const jwt = require('jsonwebtoken')

//middleware to protect endpoints 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    //checks for valid authorization header with "Bearer "
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid Message' })
    }

    //take access token from authorization header 
    const token = authHeader.split(' ')[1]

    //verify token 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            //error - not valid 
            if (err) return res.status(403).json({ message: 'Forbidden' })
            
            //valid - decodes data and proceeds 
            req.user = decoded.UserInfo.username
            next()
        }
    )
}

//when accessing a page - persistent login - 200 exit status in success 
const verifyTokenOnAccess = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    //checks for valid authorization header with "Bearer "
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid Message' })
    }

    //take access token from authorization header 
    const token = authHeader.split(' ')[1]

    //verify token 
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            //error - not valid 
            if (err) return res.status(403).json({ message: 'Forbidden' })
            if(!err)    res.status(200).json({ message: 'Endpoint accessed successfully' });
            //valid - decodes data and proceeds 
            req.user = decoded.UserInfo.username
            next()
        }
    )
}

module.exports = {verifyToken , verifyTokenOnAccess}