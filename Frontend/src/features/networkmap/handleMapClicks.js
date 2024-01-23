//requests and receives mapping of the network with get request 
async function handleSubmitMap(name, setIsLoadingMap, setMapToPlot, setLabelPlot, setNodeType, selectedDirectionOption) {

  setIsLoadingMap(true);
  const fullUrl = process.env.REACT_APP_BASE_URL + "/files/data/network/size/" + name
  //const fullUrl = `http://localhost:3500/files/data/network/size/${name}`;

  fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        // Valid access token and gets data 
        return res.json();
      }
      //Access token invalid - Forbidden
      else if (res.status === 403) {

        //sends refresh token through cookies to try get new access token 
        try {
          const response = await fetch(process.env.REACT_APP_BASE_URL + "/auth/refresh", {
            method: 'GET',
            credentials: 'include', // Include credentials to send cookies
          });

          // If the refresh is successful, extract the new access token from the response
          if (response.ok) {

            const data = await response.json();
            sessionStorage.setItem('accessToken', data.accessToken);


            // Tries to get data again with new access token 
            try {
              const responses = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
              });
              if (responses.ok) {
                // Valid access token and gets data 
                const datas = await responses.json();

                return datas;
              }
              else {
                // Other error 
                alert(responses.status)
                throw new Error("Other error");

              }


            } catch (error) {
              //other errors 
              console.error('Unexpected error during get data', error);

            }
          }
          else {
            alert(response.status)
            throw new Error("Other error");
          }
        } catch (error) {
          console.error('Unexpected error during token refresh', error);

        }

      }

      else {
        // Other error 
        alert(res.status)
        throw new Error("Other error");
      }
    })
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

    let fullUrl = process.env.REACT_APP_BASE_URL + "/files/data/network/input/" + mapPlot["filename"] + "/" + mapPlot["direction"] + "/" + (clickedNode.id - 1)
    //fetch(`http://localhost:3500/files/data/network/input/${mapPlot["filename"]}/${mapPlot["direction"]}/${clickedNode.id - 1}`)
    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          // Valid access token and gets data 
          return res.json();
        }
        //Access token invalid - Forbidden
        else if (res.status === 403) {

          //sends refresh token through cookies to try get new access token 
          try {
            const response = await fetch(process.env.REACT_APP_BASE_URL + "/auth/refresh", {
              method: 'GET',
              credentials: 'include', // Include credentials to send cookies
            });

            // If the refresh is successful, extract the new access token from the response
            if (response.ok) {

              const data = await response.json();
              sessionStorage.setItem('accessToken', data.accessToken);


              // Tries to get data again with new access token 
              try {
                const responses = await fetch(fullUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                  },
                });
                if (responses.ok) {
                  // Valid access token and gets data 
                  const datas = await responses.json();

                  return datas;
                }

                else {
                  // Other error 
                  alert(responses.status)
                  throw new Error("Other error");
                }


              } catch (error) {
                //other errors 
                console.error('Unexpected error during node click', error);

              }
            }
            else {
              // Other error 
              alert(response.status)
              throw new Error("Other error");
            }
          } catch (error) {
            console.error('Unexpected error during token refresh', error);

          }

        }

        else {
          // Other error 
          alert(res.status)
          throw new Error("Other error");
        }
      })
      .then(data => {
        //sets vector options received from backend
        setFirstOption(data["data"]);

      })
      .catch(error => console.error('Error:', error));

  }
};


export { handleSubmitMap, handleNodeClick }