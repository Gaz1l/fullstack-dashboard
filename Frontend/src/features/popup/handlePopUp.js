//Popup handlers for errors when submiting or adding options/inputs selected


const handlePopUpNetworkBox = (event, name, selectedDirectionOption, nodesPerRow, setTextPop, setIsLoadingMap, setAnchor, handleSubmitMap, setLabelPlot, setNodeType, setMapToPlot) => {
  //when submiting checks for errors (popups) before asking backend for map 
  if (name === "") {

    if (selectedDirectionOption === "") {
      if (nodesPerRow < 1 || nodesPerRow === "" || Number.isInteger(nodesPerRow)) {
        setTextPop("Missing File, Direction and Valid Number")
      }
      else {
        setTextPop("Missing File and Direction")
      }
    }
    else if (nodesPerRow < 1 || nodesPerRow === "" || Number.isInteger(nodesPerRow)) {
      setTextPop("Missing File and Valid Number")
    }
    else {
      setTextPop("Missing File")
    }

    setAnchor(event.currentTarget);
  }
  else if (selectedDirectionOption === "") {
    if (nodesPerRow < 1 || nodesPerRow === "" || Number.isInteger(nodesPerRow)) {
      setTextPop("Missing Direction and Valid Number")
    }
    else {
      setTextPop("Missing Direction")
    }
    setAnchor(event.currentTarget);
  }
  else if (nodesPerRow < 1 || nodesPerRow === "" || Number.isInteger(nodesPerRow)) {
    setTextPop("Missing Valid Number")
    setAnchor(event.currentTarget);
  }
  else { //no errors asks backend for map
    setAnchor(null);
    handleSubmitMap(name, setIsLoadingMap, setMapToPlot, setLabelPlot, setNodeType, selectedDirectionOption)
  }

};




const handlePopUpNetworkMap = (event, selectedNode, selectedVectorOption, selectedParameterOption, setTextPop, setAnchor, handleAdd, setdataBuffer, dataBuffer, mapPlot, nodeName) => {
  //when adding checks for errors (popups) before adding options selected to databuffer
  //when submiting checks for errors (popups) before asking backend for map 
  let duplicate
  if (selectedNode === "") {

    if (selectedVectorOption === "") {
      if (selectedParameterOption === "") {
        setTextPop("Missing Node, Vector and Parameter")
      }
      else {
        setTextPop("Missing Node and Vector")
      }
    }
    else if (selectedParameterOption === "") {
      setTextPop("Missing Node and Parameter")
    }
    else {
      setTextPop("Missing Node")
    }

    setAnchor(event.currentTarget);
  }
  else if (selectedVectorOption === "") {
    if (selectedParameterOption === "") {
      setTextPop("Missing Vector and Parameter")
    }
    else {
      setTextPop("Missing Vector")
    }
    setAnchor(event.currentTarget);
  }
  else if (selectedParameterOption === "") {
    setTextPop("Missing Parameter")
    setAnchor(event.currentTarget);
  }
  else {

    duplicate = handleAdd(setdataBuffer, dataBuffer, mapPlot, nodeName, selectedNode, selectedVectorOption, selectedParameterOption, duplicate)
    if (duplicate) {
      setTextPop("Duplicate")
      setAnchor(event.currentTarget);
    }
    else {
      setAnchor(null);
    }

  };
}




const handlePopUpTransponderBox = (event, name, transponderDirection, parameter, setTextPop, setAnchor, handleAdd, setdataBuffer, dataBuffer) => {
  //when adding checks for errors (popups) before adding options selected to databuffer
  //DataBuffer - Array with data selected to send to server when clicking add - contains id (name), direction (transponderdirection) and parameter

  let duplicate
  if (name === "") {

    if (transponderDirection === "") {
      if (parameter === "") {
        setTextPop("Missing File, Direction and Parameter")
      }
      else {
        setTextPop("Missing File and Direction")
      }
    }
    else if (parameter === "") {
      setTextPop("Missing File and Parameter")
    }
    else {
      setTextPop("Missing File")
    }

    setAnchor(event.currentTarget);
  }
  else if (transponderDirection === "") {
    if (parameter === "") {
      setTextPop("Missing Direction and Parameter")
    }
    else {
      setTextPop("Missing Direction")
    }
    setAnchor(event.currentTarget);
  }
  else if (parameter === "") {
    setTextPop("Missing Parameter")
    setAnchor(event.currentTarget);
  }
  else {

    //add and checks for duplicate 
    duplicate = handleAdd(setdataBuffer, dataBuffer, name, transponderDirection, parameter, duplicate)
    if (duplicate) {
      setTextPop("Duplicate")
      setAnchor(event.currentTarget);
    }
    else {
      setAnchor(null);
    }

  };
}


const handlePopUpOperation = (event, graph1, graph2, operation, submitOperation, plot, handlePopOverOperation, setOpData, setIsLoadingOperation, setAnchorOpPopover) => {
  //when submiting an operation checks if all inputs exist before proceeding 
  if (graph1 === "") {
    if (graph2 === "") {
      if (operation === "") {
        alert("Missing Graphs and Operation")
      }
      else
        alert("Missing Graphs")
    }
    else if (operation === "")
      alert("Missing Graph 1 and Operation")
    else
      alert("Missing Graph 1")


  }
  else if (graph2 === "") {
    if (operation === "")
      alert("Missing Graph 2 and Operation")
    else
      alert("Missing Graph 2")


  }
  else if (operation === "") {
    alert("Missing Operation")

  }
  else {

    submitOperation(event, operation, plot, handlePopOverOperation, setOpData, graph1, graph2, setIsLoadingOperation, setAnchorOpPopover)
  }


}


export { handlePopUpTransponderBox, handlePopUpNetworkMap, handlePopUpNetworkBox, handlePopUpOperation }