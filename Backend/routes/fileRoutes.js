//express and router - to define routes 
const express = require('express')
const router = express.Router()

//functions to call in the routes 
const filesController = require('../controllers/filesController')

//Routes - /files

// "/files/"
// GET - get all files 
// POST - upload/create a new db file model 
router.route('/')
    .get(filesController.getAllFiles)
    .post(filesController.createNewFile)

// "/files/data/delete/:filename"
//DELETE - delete a file from db 
router.route('/data/delete/:filename')
    .delete(filesController.deleteFile)

// "/files/data/network/size/:id"
//GET - get both paths nodes info to plot map   
router.route('/data/network/size/:id')
    .get(filesController.getMap)

//  "/files/data/network/input/:id/:direction/:node"
// GET-  Get node vector options  - network map   
router.route('/data/network/input/:id/:direction/:node')
    .get(filesController.getFirstInput)

//  "/files/data/network/input/:id/:direction/:node/:option"
// GET-  Get parameter options  - network map 
router.route('/data/network/input/:id/:direction/:node/:option')
    .get(filesController.getParams)

//  "/files/data/network/transponder/:filename/:direction/"
// GET-  Get parameter options  - transponder 
router.route('/data/network/transponder/:filename/:direction/')
    .get(filesController.getTransponderParams)

//  "/files/data/network/:filename/:direction/:node/:vector/:parameter"
// GET- Get network data to plot in frontend  
router.route('/data/network/:filename/:direction/:node/:vector/:parameter')
    .get(filesController.getNetworkData)

// "/files/data/:filename/:direction/:parameter"
//GET-  Get transponder data to plot in frontend  
router.route('/data/:filename/:direction/:parameter')
    .get(filesController.getData)



module.exports = router