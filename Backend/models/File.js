//Mongo db model 
const mongoose = require('mongoose')

//File Model schema - blueprint 
const fileSchema = new mongoose.Schema(
    {
        network: {      //filename
            type: String,
            required: true
        },
        data: {         //file data 
            type: Object,
            required: true
        },
        forward_path: {   //Nodes names in forward path - correct format
            type: Array,
            required: true
        },
        backward_path: {  //Nodes names in backward path - correct format 
            type: Array,
            required: true
        },
        forward_label_plot: {   //Static info for hover in forward path 
            type: Array,
            required: true
        },
        backward_label_plot: {     //Static info for hover in backward path 
            type: Array,
            required: true
        }
        ,
        forward_node_type: {    //forward path node types 
            type: Array,
            required: true
        },
        backward_node_type: { //backward path node types 
            type: Array,
            required: true
        }
    }
)

module.exports = mongoose.model('File', fileSchema)
