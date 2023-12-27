//get result of the requested operation in the required format to be plotted with linechart 
function submitOperation(event, operationGraph, plot, handlePopOverOperation, setOpData, selectedGraph1, selectedGraph2, setIsLoadingOperation, setAnchorOp) {

  let dataConverted
  if (operationGraph === "Addition") {

    let buffer = []

    for (let i = 0; i < plot[selectedGraph1]["data"].length; i++) {

      buffer[i] = {
        x: '',
        y: '',
      }

      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] + plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = Math.log10(buffer[i]['y_linear'])


    }
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
        y: '',
      }

      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] - plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = Math.log10(buffer[i]['y_linear'])


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
        y: '',
      }

      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] * plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] + plot[selectedGraph2]["data"][i]["y_log"]


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

      buffer[i] = {
        x: '',
        y: '',
      }

      buffer[i]['x'] = plot[selectedGraph1]["data"][i]["x"]
      buffer[i]['y_linear'] = plot[selectedGraph1]["data"][i]["y_linear"] / plot[selectedGraph2]["data"][i]["y_linear"]
      buffer[i]['y_log'] = plot[selectedGraph1]["data"][i]["y_log"] - plot[selectedGraph2]["data"][i]["y_log"]


    }
    dataConverted = [{
      id: "Ratio",
      color: "black",
      data: buffer,
    }]

  }


  setOpData(dataConverted)    //set data in required format to be plotted

  //display popover by changing flag status
  handlePopOverOperation(event, setIsLoadingOperation, setAnchorOp)



};


export { submitOperation }