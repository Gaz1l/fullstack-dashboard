//functions to handle popover and popups when submiting and closing while checking for possible erros

//transponder component submit and popup in case of error 
function handlePopOverTrans(event, dataBuffer, setTextPop, setAnchor, setSplitGraphs, handleSubmit, setPlot, setisLoadingSubmit, setrlTransponder, setminTransponder, setmaxTransponder, setGraph1, setGraph2, setOperation) {
  if (dataBuffer.length === 0) {
    setTextPop("Nothing Selected")
    setAnchor(event.currentTarget);
  }
  else {

    setAnchor(null);
    setSplitGraphs("split")
    setGraph1("")
    setGraph2("")
    setOperation("")
    handleSubmit(dataBuffer, setPlot, setisLoadingSubmit, setrlTransponder, setminTransponder, setmaxTransponder)

  }
};


//component popover when submiting operation 
function handlePopOverOperation(event, setIsLoadingOperation, setAnchorOp) {

  setIsLoadingOperation(false)
  setAnchorOp(event.currentTarget);

};

//network map component submit and popup in case of error 
function handlePopNet(event, dataBuffer, setTextPop, setAnchor, handleSubmit, setAnchorEl, setPlot, setisLoadingSubmit) {
  if (dataBuffer.length === 0) {
    setTextPop("Nothing Selected")
    setAnchor(event.currentTarget);
  }
  else {

    setAnchor(null);
    handleSubmit(dataBuffer, setPlot, setisLoadingSubmit)
    setAnchorEl(event.currentTarget);
  }
};

// close popover - reset flags 
function handleClosePopNet(setSplitGraphs, setisLoadingSubmit, setLimitFlag, setAnchorEl, setGraph1, setGraph2, setOperation) {
  setSplitGraphs("split")
  setisLoadingSubmit(true)
  setLimitFlag(false)
  setAnchorEl("");
  setGraph1("")
  setGraph2("")
  setOperation("")
};

// close operation popover - reset flags 
function handleClosePopNetOperation(setisLoadingSubmit, setAnchorEl) {
  setisLoadingSubmit(true)
  setAnchorEl(null);



};

export { handlePopOverTrans, handlePopOverOperation, handlePopNet, handleClosePopNet, handleClosePopNetOperation }

