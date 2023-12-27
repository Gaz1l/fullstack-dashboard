//requests and receives mapping of the network with get request 
async function handleSubmitMap(name, setIsLoadingMap, setMapToPlot, setLabelPlot, setNodeType, selectedDirectionOption) {

  setIsLoadingMap(true);
  const fullUrl = `http://localhost:3500/files/data/network/size/${name}`;

  fetch(fullUrl)
    .then((res) => res.json())
    .then((data) => {





      //Set node name, static info and node type in order to the path 
      if (selectedDirectionOption === "Forward") {
        setMapToPlot(data["forward_path"])
        setLabelPlot(data["forward_label_plot"])
        setNodeType(data["forward_node_type"])
      }
      else if (selectedDirectionOption === "Backward") {
        setMapToPlot(data["backward_path"])
        setLabelPlot(data["backward_label_plot"])
        setNodeType(data["backward_node_type"])
      }


    })
    .catch((err) => {
      console.log(err.message);
    }).finally(() => {
      setIsLoadingMap(false);      //loading flag updated
    })

};


//whenever a node is clicked save its values (id and name/label) and get from backend the vector options list
async function handleNodeClick(params, nodesTemp, setNodeName, setSelectedNode,
  setSelectedVectorOption, setSelectedParameterOption, setFirstOption, setSecondOption, mapPlot) {


  if (params.nodes.length > 0) {
    //gets and sets node clicked values 
    const clickedNodeId = params.nodes[0];
    const clickedNode = nodesTemp.find(node => node.id === clickedNodeId);
    setSelectedNode(clickedNode.id - 1);
    setNodeName(clickedNode.label)
    //resets other options - vector and parameter 
    setSelectedVectorOption("")
    setSelectedParameterOption("")
    setFirstOption([])
    setSecondOption([])

    fetch(`http://localhost:3500/files/data/network/input/${mapPlot["filename"]}/${mapPlot["direction"]}/${clickedNode.id - 1}`)
      .then(response => response.json())
      .then(data => {
        //sets vector options received from backend
        setFirstOption(data["data"]);

      })
      .catch(error => console.error('Error:', error));

  }
};


export { handleSubmitMap, handleNodeClick }