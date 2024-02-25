//get result of the requested operation in the required format to be plotted with linechart 
function submitOperation(event, operationGraph, plot, handlePopOverOperation, setOpData, selectedGraph1, selectedGraph2, setIsLoadingOperation, setAnchorOp) {

  let dataConverted
  console.log(plot)
  //checks for NaN in each operation 
  //converts results to required formats 
  if (operationGraph === "Addition") {

    let buffer = []

    for (let i = 0; i < plot[selectedGraph1]["data"].length; i++) {

      buffer[i] = {
        x: '',
        y_linear: '',
        y_log: '',
      }

      //if(plot[selectedGraph1]["data"][i]["y_linear"]!== "Infinity"|| plot[selectedGraph1]["data"][i]["y_linear"]!== "Infinity" ||plot[selectedGraph2]["data"][i]["y_linear"]!== "-Infinity"|| plot[selectedGraph2]["data"][i]["y_linear"]!== "-Infinity")
     // continue


     // if (dataToPlot[j]["data"][a]["y_linear"] !== "NaN" && dataToPlot[j]["data"][a]["y_linear"] !== "Infinity" &&dataToPlot[j]["data"][a]["y_linear"] !== "-Infinity" && isFinite(dataToPlot[j]["data"][a]["y_linear"]))

      if(plot[selectedGraph1]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph1]["data"][i]["y_log"]==="NaN"){

         //summ both NaN  
        if(plot[selectedGraph2]["data"][i]["y_linear"]==="NaN"||plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          buffer[i]['y_linear'] =  0
          buffer[i]['y_log'] =  "NaN"
        }
        else
        {
            //summ first is NaN 
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          buffer[i]['y_linear'] =  plot[selectedGraph2]["data"][i]["y_linear"]
          buffer[i]['y_log'] =  plot[selectedGraph2]["data"][i]["y_log"]
  
        }
      }
      //summ second is NaN 
      else if(plot[selectedGraph2]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
        buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
        buffer[i]['y_linear'] =  plot[selectedGraph1]["data"][i]["y_linear"]
        buffer[i]['y_log'] =  plot[selectedGraph1]["data"][i]["y_log"]
      }

      //summ
      else {
      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] + plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] + plot[selectedGraph2]["data"][i]["y_log"]

    }
    }
    console.log(buffer)
    dataConverted = [{
      id: "Addition",
      color: "black",
      data: buffer,
    }]

  }
  else if (operationGraph === "Subtraction") {

    let buffer = []

    for (let i = 0; i < plot[selectedGraph1]["data"].length; i++) {

      buffer[i] = {
        x: '',
        y_linear: '',
        y_log: '',
      }
      if(plot[selectedGraph1]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph1]["data"][i]["y_log"]==="NaN"){

        //subtraction both NaN  
        if(plot[selectedGraph2]["data"][i]["y_linear"]==="NaN"||plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          buffer[i]['y_linear'] =  0
          buffer[i]['y_log'] =  "NaN"
        }
        else 
        {
           //subtraction first is NaN  
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          buffer[i]['y_linear'] =  -plot[selectedGraph2]["data"][i]["y_linear"]
          buffer[i]['y_log'] =  -plot[selectedGraph2]["data"][i]["y_log"]
          
        }
      }
      //subtraction second is NaN
      else if(plot[selectedGraph2]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
        buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
        buffer[i]['y_linear'] =  plot[selectedGraph1]["data"][i]["y_linear"]
        buffer[i]['y_log'] =  plot[selectedGraph1]["data"][i]["y_log"]
      }

      //subtraction
      else {
      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] - plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] - plot[selectedGraph2]["data"][i]["y_log"]

    }

    }
    dataConverted = [{
      id: "Subtraction",
      color: "black",
      data: buffer,
    }]

  }
  else if (operationGraph === "Multiplication") {

    let buffer = []

    for (let i = 0; i < plot[selectedGraph1]["data"].length; i++) {

      buffer[i] = {
        x: '',
        y_linear: '',
        y_log: '',
      }
      //multiply by NaN - linear 
      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      if(plot[selectedGraph1]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph2]["data"][i]["y_linear"]==="NaN"){
        buffer[i]['y_linear'] =  0
      }
      //multiply by NaN - log
      else if(plot[selectedGraph1]["data"][i]["y_log"]==="NaN" || plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
        buffer[i]['y_log'] = "NaN"
      }

      //mult
      else {
      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] * plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] * plot[selectedGraph2]["data"][i]["y_log"]

    }
    }
    dataConverted = [{
      id: "Multiplication",
      color: "black",
      data: buffer,
    }]

  }
  else if (operationGraph === "Division") {

    let buffer = []

    for (let i = 0; i < plot[selectedGraph1]["data"].length; i++) {
      let temp = {
        x: '',
        y_linear: '',
        y_log: '',
      }

      if(plot[selectedGraph1]["data"][i]["y_linear"]==="NaN" || plot[selectedGraph1]["data"][i]["y_log"]==="NaN"){


        //both num and den NaN
        if(plot[selectedGraph2]["data"][i]["y_linear"]==="NaN"||plot[selectedGraph2]["data"][i]["y_log"]==="NaN"){
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          temp['y_linear'] =  0
          temp['y_log'] =  "NaN"
        }
        else 
        {
          //numm NaN
          buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
          temp['y_linear'] =  0
          temp['y_log'] =  "NaN"
        }
      }




      else {

        //division by zero skips element 
        if(plot[selectedGraph2]["data"][i]["y_linear"]===0 || plot[selectedGraph2]["data"][i]["y_linear"]===0 ||plot[selectedGraph2]["data"][i]["y_log"]===0 ||plot[selectedGraph2]["data"][i]["y_log"]===0 )
        continue
  
        //division 
        temp['x'] = plot[selectedGraph1]["data"][i]["x"]
        temp['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] / plot[selectedGraph2]["data"][i]["y_linear"]
        temp['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] / plot[selectedGraph2]["data"][i]["y_log"]
  
       

    }

    buffer.push(temp)


    }
    dataConverted = [{
      id: "Ratio",
      color: "black",
      data: buffer,
    }]

  }

console.log(dataConverted)
  setOpData(dataConverted)    //set data in required format to be plotted

  //display popover by changing flag status
  handlePopOverOperation(event, setIsLoadingOperation, setAnchorOp)



};


export { submitOperation }