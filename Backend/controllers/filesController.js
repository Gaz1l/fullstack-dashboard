//File model from DB - Log 
const Log = require('../models/File')

//Express async functions
const asyncHandler = require('express-async-handler')

//Numerical library - numjs
var nj = require('numjs');

//File system functions
const fs = require('fs');



// Get all Files 
// @route GET /files/
const getAllFiles = asyncHandler(async (req, res) => {
    // Get all Files from MongoDB
    const Files = await Log.find({}, { network: 1 })

    // If no Files 
    if (!Files?.length) {
        return res.status(400).json({ message: 'No Files found' })
    }

    res.json(Files)
})

// Get both paths nodes info to plot map  
// @route GET /files/data/network/size/:id
const getMap = asyncHandler(async (req, res) => {

    //Network id from request parameter
    const id = req.params.id

    //Find file 
    const File = await Log.findById(id).exec()

    //If file does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }



    //reply with map data for both paths  
    const reply = {
        "id": id,
        "forward_path": File["forward_path"],
        "backward_path": File["backward_path"],
        "forward_label_plot": File["forward_label_plot"],
        "backward_label_plot": File["backward_label_plot"],
        "forward_node_type": File["forward_node_type"],
        "backward_node_type": File["backward_node_type"]
    }
    res.json(reply)


})

// Create new File
// @route POST /files/
const createNewFile = asyncHandler(async (req, res) => {

    //get file from POST 
    const uploadedFile = req.file;
    const network = uploadedFile.originalname

    //Buffers 
    let data
    let forward_path
    let backward_path
    let labelBuffer
    let forward_label_plot = []
    let forward_node_type = []
    let backward_node_type = []
    let backward_label_plot = []
    let arrayx

    //read file 
    fs.readFile(uploadedFile.path, 'utf8', (err, rcv) => {
        //Error reading 
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).json({ error: 'Error reading the file' });
        } else {
            //data in the json file
            data = JSON.parse(rcv);

            //No data or file name 
            if (!network || !data) {
                return res.status(400).json({ message: 'All fields are required' })
            }

            //access and save paths (forward and backward) - containing names of the nodes 
            x = data["Tasks"]
            x = x["Signal_Propagation"]
            x = Object.entries(x)            //convert to array format 
            y = x[0][1]
            z = x[1][1]

            //Gets all node names except last one (transponder)
            forward_path = Object.keys(y).slice(0, -1);
            backward_path = Object.keys(z).slice(0, -1);






            //Get node name in appropriate format for each node  
            //Get each node type 

            //Forward path 
            x = data["Tasks"]
            x = x["Signal_Propagation"]
            x = Object.entries(x)            //convert to array 
            x = x[0][1];              // x["Node_1_to_Node_6"]
            arrayx = Object.entries(x)    //convert to array 



            for (let i = 0; i < forward_path.length; i++) {
                //Split string for each "_"
                let substring = forward_path[i].split('_');

                //Node 
                if (forward_path[i].startsWith("Node")) {

                    //Combiner
                    if (forward_path[i].includes("comb")) {
                        forward_node_type[i] = "Combiner"
                        forward_path[i] = `${substring[0]} ${substring[1]} Combiner `
                    }
                    //WSS
                    else if (forward_path[i].includes("wss")) {
                        forward_node_type[i] = "WSS"
                        forward_path[i] = `${substring[0]} ${substring[1]} WSS `
                    }
                    //Attenuator
                    else if (forward_path[i].includes("att")) {
                        forward_node_type[i] = "Attenuator"
                        forward_path[i] = `${substring[0]} ${substring[1]} Attenuator `
                    }
                    //Switch
                    else if (forward_path[i].includes("switch")) {
                        forward_node_type[i] = "Switch"
                        forward_path[i] = `${substring[0]} ${substring[1]} Switch`
                    }
                    //Raman
                    else if (forward_path[i].includes("raman")) {
                        forward_node_type[i] = "Raman"
                        forward_path[i] = `${substring[0]} ${substring[1]} Raman Amplifier`
                    }
                    //rsc
                    else if (forward_path[i].includes("rsc")) {
                        forward_node_type[i] = "rsc"
                        forward_path[i] = `${substring[0]} ${substring[1]} Attenuator`
                    }
                    //EDFA
                    else if (forward_path[i].includes("edf")) {
                        forward_node_type[i] = "EDFA"

                        //In line
                        if (forward_path[i].includes("ILA")) {
                            forward_path[i] = `${substring[0]} ${substring[1]} EDFA In Line `
                        }
                        //Add/Drop
                        else if (forward_path[i].includes("CAD")) {
                            labelBuffer = arrayx[i][1]["Generic"]["amplifierRole"]
                            //Add
                            if (labelBuffer === "add") {
                                forward_path[i] = `${substring[0]} ${substring[1]} EDFA Add `
                            }
                            //Drop
                            else if (labelBuffer === "drop") {
                                forward_path[i] = `${substring[0]} ${substring[1]} EDFA Drop `
                            }
                        }
                        //Booster
                        else if (forward_path[i].includes("edfB")) {
                            forward_path[i] = `${substring[0]} ${substring[1]} EDFA Booster `
                        }
                        //Pre-amplifier
                        else if (forward_path[i].includes("edfP")) {
                            forward_path[i] = `${substring[0]} ${substring[1]} EDFA Preamplifier `
                        }
                        //In line
                        else {
                            forward_path[i] = `${substring[0]} ${substring[1]} EDFA In Line `

                        }
                    };

                }
                //Fiber
                else {

                    forward_node_type[i] = "Fiber"

                    let subsubstring = forward_path[i].split('Node');
                    forward_path[i] = `${subsubstring[0].split('_')[0]} Node ${subsubstring[1].split('_')[1]} To ${subsubstring[2].split('_')[1]}`

                }

            }




            //Get labels - static info when hovering the node - forward path 
            for (let i = 0; i < arrayx.length - 1; i++) {

                //Access generic data of the node (static data) and convert to string 
                labelBuffer = arrayx[i][1]["Generic"]
                labelBuffer = JSON.stringify(labelBuffer)



                //Access port connections to check for other static data 
                staticBuffer = arrayx[i][1]["portConnections"]
                staticBuffer = Object.entries(staticBuffer)    //convert to array 
                staticBuffer = Object.entries(staticBuffer[0][1])
                for (const [label, obj] of staticBuffer) {

                    for (const prop in obj) {
                        //If data is static - not array - add to label buffer
                        if (!Array.isArray(obj[prop])) {
                            labelBuffer += `,${label} ${prop} : ${obj[prop]}`

                        }
                    }
                }

                //Replace " and parenthesis with spaces 
                labelBuffer = labelBuffer.replace(/"/g, ' ');
                labelBuffer = labelBuffer.replace(/{/g, '');
                labelBuffer = labelBuffer.replace(/}/g, '');

                // Replace all commas with newlines 
                labelBuffer = labelBuffer.replace(/,/g, '\n');



                //add to buffer - forward path 
                forward_label_plot.push(labelBuffer)


            }


            //Get node name in appropriate format for each node  
            //Get each node type 

            //Backward path  
            x = data["Tasks"]
            x = x["Signal_Propagation"]
            x = Object.entries(x)            //converte para array 

            x = x[1][1];              //acede a x["Node_6_to_Node_1"]
            arrayx = Object.entries(x)    //converte para array 


            for (let i = 0; i < backward_path.length; i++) {
                let substring = backward_path[i].split('_');

                if (backward_path[i].startsWith("Node")) {


                    if (backward_path[i].includes("comb")) {
                        backward_node_type[i] = "Combiner"
                        backward_path[i] = `${substring[0]} ${substring[1]} Combiner `
                    }
                    else if (backward_path[i].includes("wss")) {
                        backward_node_type[i] = "WSS"
                        backward_path[i] = `${substring[0]} ${substring[1]} WSS `
                    }
                    else if (backward_path[i].includes("att")) {
                        backward_node_type[i] = "Attenuator"
                        backward_path[i] = `${substring[0]} ${substring[1]} Attenuator `
                    }
                    else if (backward_path[i].includes("switch")) {
                        backward_node_type[i] = "Switch"
                        backward_path[i] = `${substring[0]} ${substring[1]} Switch`
                    }
                    else if (backward_path[i].includes("raman")) {
                        backward_node_type[i] = "Raman"
                        backward_path[i] = `${substring[0]} ${substring[1]} Raman Amplifier`
                    }
                    else if (backward_path[i].includes("rsc")) {
                        backward_node_type[i] = "rsc"
                        backward_path[i] = `${substring[0]} ${substring[1]} Attenuator`
                    }
                    else if (backward_path[i].includes("edf")) {
                        backward_node_type[i] = "EDFA"

                        if (backward_path[i].includes("ILA")) {
                            backward_path[i] = `${substring[0]} ${substring[1]} EDFA In Line `
                        }
                        else if (backward_path[i].includes("CAD")) {
                            labelBuffer = arrayx[i][1]["Generic"]["amplifierRole"]
                            if (labelBuffer === "add") {
                                backward_path[i] = `${substring[0]} ${substring[1]} EDFA Add `
                            }
                            else if (labelBuffer === "drop") {
                                backward_path[i] = `${substring[0]} ${substring[1]} EDFA Drop `
                            }
                        }
                        else if (backward_path[i].includes("edfB")) {
                            backward_path[i] = `${substring[0]} ${substring[1]} EDFA Booster `
                        }
                        else if (backward_path[i].includes("edfP")) {
                            backward_path[i] = `${substring[0]} ${substring[1]} EDFA Preamplifier `
                        }
                        else {
                            backward_path[i] = `${substring[0]} ${substring[1]} EDFA In Line `
                        }
                    }

                }
                else {
                    backward_node_type[i] = "Fiber"

                    let subsubstring = backward_path[i].split('Node');


                    backward_path[i] = `${subsubstring[0].split('_')[0]} Node ${subsubstring[1].split('_')[1]} To ${subsubstring[2].split('_')[1]}`

                }

            }


            //Get labels - static info when hovering the node - backward path 
            for (let i = 0; i < arrayx.length - 1; i++) {

                labelBuffer = arrayx[i][1]["Generic"]
                labelBuffer = JSON.stringify(labelBuffer)




                staticBuffer = arrayx[i][1]["portConnections"]
                staticBuffer = Object.entries(staticBuffer)
                staticBuffer = Object.entries(staticBuffer[0][1])
                for (const [label, obj] of staticBuffer) {

                    for (const prop in obj) {
                        if (!Array.isArray(obj[prop])) {
                            labelBuffer += `,${label} ${prop} : ${obj[prop]}`

                        }
                    }
                }

                labelBuffer = labelBuffer.replace(/"/g, ' ');
                labelBuffer = labelBuffer.replace(/{/g, '');
                labelBuffer = labelBuffer.replace(/}/g, '');


                labelBuffer = labelBuffer.replace(/,/g, '\n');




                backward_label_plot.push(labelBuffer)


            }




            // Delete the file after reading
            fs.unlink(uploadedFile.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });





            //Check if file already exists
            const query = Log.findOne({ network: network });


            query
                .then(result => {
                    if (result) {
                        //Error if duplicate file

                        return res.status(409).json({ message: 'Duplicate File title' })
                    } else {
                        //Creates file model if new one 

                        const File = Log.create({ network, data, forward_path, backward_path, forward_label_plot, backward_label_plot, forward_node_type, backward_node_type })

                        if (File) { // Created 
                            return res.status(201).json({ message: 'New File created' })
                        } else {    //Invalid 
                            return res.status(400).json({ message: 'Invalid File data received' })
                        }
                    }
                })






        }
    });





})


// Delete a File from db 
// @route DELETE /files/data/delete/:filename
const deleteFile = asyncHandler(async (req, res) => {

    // Confirm data
    if (!req.params.filename) {
        return res.status(400).json({ message: 'File ID required' })
    }

    // Confirm File exists to delete 
    const File = await Log.findById(req.params.filename).exec()

    //File not found
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }

    //Delete file 
    const result = await Log.deleteOne()

    const reply = `${req.params.filename} deleted`

    res.json(reply)
})

// Get transponder data to plot in frontend  
// @route GET /files/data/:filename/:direction/:parameter
const getData = asyncHandler(async (req, res) => {
    //input parameters from get request 
    const fileName = req.params.filename
    const direction = req.params.direction
    const parameter = req.params.parameter

    //Buffers
    let y
    let RL, min, max



    // Confirm data
    if (!fileName || !direction || !parameter) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm File exists 
    const File = await Log.findById(fileName).exec()

    //File does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }

    //access data
    x = File["data"]
    x = x["Tasks"]

    x = x["Signal_Propagation"]
    x = Object.entries(x)            //convert to array 

    //Forward path 
    if (direction == "Forward") {

        x = x[0][1];              //access x["Node_1_to_Node_6"]

        const arrayx = Object.entries(x)    //convert to array 

        x = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        const arrayxx = Object.entries(x)        //convert to array 


        //Looks for parameter in "RX"
        let tempBuf = Object.entries(arrayxx[3][1])

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Looks for parameter in "Penalties_dB"
        tempBuf = Object.entries(arrayxx[4][1])   //convert to array 

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Looks for parameter in "Margins_dB"
        tempBuf = Object.entries(arrayxx[5][1])

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Gets static transponder values 
        RL = arrayxx[1][1]["RL_McTemplate"]
        min = arrayxx[1][1]["minEdgeFrequency_THz"]
        max = arrayxx[1][1]["maxEdgeFrequency_THz"]


        //Gets frequency and converts to THz 
        x = arrayxx[1][1]["Central_Samples_MHz"]

        for (let i = 0; i < x.length; i++) {
            x[i] /= 1000000;
        }


    }

    //Backward path 
    else if (direction == "Backward") {
        x = x[1][1];           //access to x["Node_6_to_Node_1"]
        const arrayx = Object.entries(x)    //convert to array 

        x = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        const arrayxx = Object.entries(x)        //convert to array 


        //Looks for parameter in "RX"
        let tempBuf = Object.entries(arrayxx[3][1])

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Looks for parameter in "Penalties_dB"
        tempBuf = Object.entries(arrayxx[4][1])

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Looks for parameter in "Margins_dB"
        tempBuf = Object.entries(arrayxx[5][1])

        for (let i = 0; i < tempBuf.length; i++) {

            if (tempBuf[i][0] == parameter)
                y = tempBuf[i][1]

        }

        //Gets static transponder values 
        RL = arrayxx[1][1]["RL_McTemplate"]
        min = arrayxx[1][1]["minEdgeFrequency_THz"]
        max = arrayxx[1][1]["maxEdgeFrequency_THz"]




        //Gets frequency and converts to THz 
        x = arrayxx[1][1]["Central_Samples_MHz"]         //acede a frequencias 
        for (let i = 0; i < x.length; i++) {
            x[i] /= 1000000;
        }

    }



    //Reply with transponder data requested to plot 
    const reply = {
        "frequency": x,
        "data": y,
        "RL_McTemplate": RL,
        "minEdgeFrequency_THz": min,
        "maxEdgeFrequency_THz": max
    }
    res.json(reply)
})

// Get network data to plot in frontend  
// @route GET /files/data/network/:filename/:direction/:node/:vector/:parameter
const getNetworkData = asyncHandler(async (req, res) => {

    //input parameters from get request 
    const filename = req.params.filename
    const direction = req.params.direction
    const node = req.params.node
    const vector = req.params.vector
    const parameter = req.params.parameter

    //Buffers
    let y
    let z


    // Confirm data
    if (!filename || !direction || !node || !vector || !parameter) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm File exists
    const File = await Log.findById(filename).exec()

    //File does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }

    //access data 
    x = File["data"]
    x = x["Tasks"]

    x = x["Signal_Propagation"]
    x = Object.entries(x)            //convert to array 

    //Forward path 
    if (direction == "Forward") {

        x = x[0][1];              //access to x["Node_1_to_Node_6"]

        let arrayx = Object.entries(x)    //convert to array  





        z = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        const arrayz = Object.entries(z)        //convert to array 


        //Gets frequency and converts to THz
        z = arrayz[1][1]["Central_Samples_MHz"]
        for (let i = 0; i < z.length; i++) {
            z[i] /= 1000000;
        }







        //Access node
        x = arrayx[node][1]

        //Access vector and parameter
        arrayx = Object.entries(x)        //converts to array 


        y = arrayx[1][1]


        arrayx = Object.entries(y)        //converts to array 

        if (vector === "OutVector") {
            y = arrayx[0][1]["OutVector"][parameter]
        }
        else if (vector === "InVector") {
            y = arrayx[0][1]["InVector"][parameter]
        }
        else if (vector === "TFs") {
            y = arrayx[0][1]["TFs"][parameter]
        }



    }

    //Backward path 
    else if (direction == "Backward") {
        x = x[1][1];           //access to x["Node_6_to_Node_1"]
        let arrayx = Object.entries(x)    //convert to array 



        z = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        const arrayz = Object.entries(z)        //convert to array 



        //Gets frequency and converts to THz
        z = arrayz[1][1]["Central_Samples_MHz"]
        for (let i = 0; i < z.length; i++) {
            z[i] /= 1000000;
        }



        //Access node
        x = arrayx[node][1]

        //Access vector and parameter
        arrayx = Object.entries(x)    //converts to array 

        y = arrayx[1][1]

        arrayx = Object.entries(y)   //converts to array 
        if (vector === "OutVector") {
            y = arrayx[0][1]["OutVector"][parameter]
        }
        else if (vector === "InVector") {
            y = arrayx[0][1]["InVector"][parameter]
        }
        else if (vector === "TFs") {
            y = arrayx[0][1]["TFs"][parameter]
        }


    }



    //reply with data to plot 
    const reply = {
        "frequency": z,
        "data": y
    }
    res.json(reply)
})

// Get node vector options  - network map 
// @route GET /files/data/network/input/:id/:direction/:node
const getFirstInput = asyncHandler(async (req, res) => {

    //input parameters from get request 
    const fileName = req.params.id
    const direction = req.params.direction
    const node = req.params.node

    //Buffers
    let y
    let options = []



    // Confirm data
    if (!fileName || !direction) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm File exists
    const File = await Log.findById(fileName).exec()

    //File does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }


    //access data 
    x = File["data"]
    x = x["Tasks"]

    x = x["Signal_Propagation"]
    x = Object.entries(x)            //converts to array 

    //forward path 
    if (direction == "Forward") {

        x = x[0][1];              //access to x["Node_1_to_Node_6"]

        let arrayx = Object.entries(x)    //converts to array 

        //access node 
        x = arrayx[node][1]
        arrayx = Object.entries(x)        //converts to array 


        y = arrayx[1][1]


        arrayx = Object.entries(y)        //converts to array 
        arrayx = Object.entries(arrayx[0][1])        //converts to array 

        //Get  vector options 
        for (let i = 0; i < arrayx.length; i++) {



            options.push(arrayx[i][0])
        }




    }

    //backward path
    else if (direction == "Backward") {
        x = x[1][1];           //access to x["Node_6_to_Node_1"]
        let arrayx = Object.entries(x)    //convert to array 


        x = arrayx[node][1]
        arrayx = Object.entries(x)


        y = arrayx[1][1]


        arrayx = Object.entries(y)         //convert to array 
        arrayx = Object.entries(arrayx[0][1])        //convert to array 

        for (let i = 0; i < arrayx.length; i++) {

            options.push(arrayx[i][0])
        }

    }



    //response with options  
    const reply = {
        "data": options
    }
    res.json(reply)
})

// Get parameter options  - network map 
// @route GET /files/data/network/input/:id/:direction/:node
const getParams = asyncHandler(async (req, res) => {
    //input parameters from get request 
    const fileName = req.params.id
    const direction = req.params.direction
    const node = req.params.node
    const input = req.params.option

    //Buffers
    let y
    let options = []


    // Confirm data
    if (!fileName || !direction) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm File exists 
    const File = await Log.findById(fileName).exec()

    //File does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }

    //access data 
    x = File["data"]
    x = x["Tasks"]

    x = x["Signal_Propagation"]
    x = Object.entries(x)            //converts to array 

    //forward path 
    if (direction == "Forward") {

        x = x[0][1];              //access to x["Node_1_to_Node_6"]

        let arrayx = Object.entries(x)    //converts to array 

        //access node
        x = arrayx[node][1]

        arrayx = Object.entries(x)        //converts to array 


        y = arrayx[1][1]


        arrayx = Object.entries(y)         //converts to array 
        arrayx = Object.entries(arrayx[0][1])       //converts to array  

        //access vector option - "input"
        for (let i = 0; i < arrayx.length; i++) {

            if (arrayx[i][0] === input) {
                y = arrayx[i][1]
                break;
            }
        }

        //get parameter options - non static (arrays)
        for (let key in y) {
            if (Array.isArray(y[key])) {
                options.push(key);
            }
        }




    }

    //backward path 
    else if (direction == "Backward") {
        x = x[1][1];           //access to x["Node_6_to_Node_1"]
        let arrayx = Object.entries(x)    //converts to array 


        //access node 
        x = arrayx[node][1]

        arrayx = Object.entries(x)        //converts to array 


        y = arrayx[1][1]


        arrayx = Object.entries(y)       //converts to array 
        arrayx = Object.entries(arrayx[0][1])        //converts to array 


        //access vector option - "input"
        for (let i = 0; i < arrayx.length; i++) {

            if (arrayx[i][0] === input) {
                y = arrayx[i][1]
                break;
            }
        }

        //get parameter options - non static (arrays)
        for (let key in y) {
            if (Array.isArray(y[key])) {
                options.push(key);
            }
        }




    }

    //response with parameter options 
    const reply = {
        "data": options
    }
    res.json(reply)
})

// Get parameter options  - transponder 
// @route GET /files/data/network/transponder/:filename/:direction/
const getTransponderParams = asyncHandler(async (req, res) => {
    //input parameters from get request 
    const fileName = req.params.filename
    const direction = req.params.direction

    //Buffers
    let y
    let tempBuffer
    let RLBuffer = []
    let PenaltiesBuffer = []
    let MarginsBuffer = []


    // Confirm data
    if (!fileName || !direction) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm File exists
    const File = await Log.findById(fileName).exec()

    //File does not exist 
    if (!File) {
        return res.status(400).json({ message: 'File not found' })
    }


    //access data 
    x = File["data"]
    x = x["Tasks"]

    x = x["Signal_Propagation"]
    x = Object.entries(x)            //converts to array 

    //forward path 
    if (direction == "Forward") {

        x = x[0][1];              //access to x["Node_1_to_Node_6"]

        let arrayx = Object.entries(x)    //converts to array 

        x = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        arrayx = Object.entries(x)         //converts to array 


        //Parameter Options 

        //RL options 
        tempBuffer = Object.entries(arrayx[3][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                RLBuffer.push(tempBuffer[i][0])
            }

        }

        //Penalties options 
        tempBuffer = Object.entries(arrayx[4][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                PenaltiesBuffer.push(tempBuffer[i][0])
            }

        }

        //Margins Options 
        tempBuffer = Object.entries(arrayx[5][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                MarginsBuffer.push(tempBuffer[i][0])
            }

        }


    }

    //backward path 
    else if (direction == "Backward") {
        x = x[1][1];           //access to x["Node_6_to_Node_1"]
        const arrayx = Object.entries(x)    //converts to array 

        x = arrayx[arrayx.length - 1][1]     // access to ["RxTransponder_Node_1_Node_6"]

        const arrayxx = Object.entries(x)        //converts to array 







        //Parameter Options 

        //RL options 
        tempBuffer = Object.entries(arrayxx[3][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                RLBuffer.push(tempBuffer[i][0])
            }

        }

        //Penalties options 
        tempBuffer = Object.entries(arrayxx[4][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                PenaltiesBuffer.push(tempBuffer[i][0])
            }

        }


        //Margins Options 
        tempBuffer = Object.entries(arrayxx[5][1])
        for (let i = 0; i < tempBuffer.length; i++) {
            if (Array.isArray(tempBuffer[i][1])) {
                MarginsBuffer.push(tempBuffer[i][0])
            }

        }

    }


    //Reply with parameter options 
    const reply = {
        "RL": RLBuffer,
        "Penalties_dB": PenaltiesBuffer,
        "Margins_dB": MarginsBuffer
    }
    res.json(reply)
})



module.exports = {
    getAllFiles,
    createNewFile,
    deleteFile,
    getData,
    getMap,
    getNetworkData,
    getFirstInput,
    getParams,
    getTransponderParams
}