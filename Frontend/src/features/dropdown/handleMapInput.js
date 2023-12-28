//whenever a vector option is selected, get from backend the parameters list 
async function handleFirstInputChange(event, setSelectedVectorOption, mapPlot, selectedNode, setSecondOption) {

  setSelectedVectorOption(event); //sets vector option selected

  let fullUrl= process.env.REACT_APP_BASE_URL + "/files/data/network/input/" + mapPlot["filename"] + "/"+ mapPlot["direction"] + "/" +selectedNode + "/" + event 
  //fetch(`http://localhost:3500/files/data/network/input/${mapPlot["filename"]}/${mapPlot["direction"]}/${selectedNode}/${event}`)
  fetch(fullUrl)
    .then(response => response.json())
    .then(data => {
      //sets parameter options received from backend 
      setSecondOption(data["data"]);

    })
    .catch(error => console.error('Error:', error));


};


export { handleFirstInputChange }