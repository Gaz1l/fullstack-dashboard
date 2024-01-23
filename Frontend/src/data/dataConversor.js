//Function to convert received data into a required format in order to plot the graphs with linechart
export const convertData = (dataToConvert, filename, colorselected) => {

  let frequencyToConvert = dataToConvert["frequency"]
  let valuesToConvert = dataToConvert["data"]
  let buffer = []
  let i

  //logaritmic conversion 
  let logarithmicData = valuesToConvert.map(value => Math.log10(value));


  for (i = 0; i < frequencyToConvert.length; i++) {
    //required format
    buffer[i] = {
      x: '',
      y_linear: '',
      y_log: '',
    }

    buffer[i]['x'] = frequencyToConvert[i]
    buffer[i]['y_linear'] = valuesToConvert[i]
    buffer[i]['y_log'] = logarithmicData[i]


  }

  //data into required format to plot 
  let dataConverted = [{
    id: filename,
    color: colorselected,
    data: buffer,
  }]


  return dataConverted

}



//Function to create node map containing nodes and edges based on data received from backend 
export const convertMapData = (path_data, label_data, node_type, nodesPerRow) => {


  

  let tempNodes = []
  let tempEdges = []
  let dataConverted = []
  let tempN
  let color
  let new_y = 0
  let new_x = 0
  let node_tot = 0
  let y_counter = 0
  let dir = 0
  for (let i = 0; i < path_data.length; i++) {
    //map layout - node position - S format creation 

    //reaches last node allowed per row
    // creates two ghost nodes and goes on to the next row  
    if (y_counter === Number(nodesPerRow)) {

      //ghost nodes when going from left to rigth  
      if (dir === 0) {
        //first ghost node  
        tempN = {
          id: node_tot + 1,
          x: new_x + 100,
          y: new_y,
          shape: "text",

          layout: {
            hierarchical: false // Disable automatic layout
          },
          physics: {
            enabled: false // Disable physics simulation
          }

        }
        //add to nodes buffer 
        tempNodes.push(tempN)

        node_tot++;

        //first ghost node edge 
        tempN =
        {
          from: node_tot,
          to: node_tot + 1,
          smooth: {
            "type": "discrete",
            "forceDirection": "vertical",
            "roundness": 0
          },
          color: "grey"

        }


        //add to edges buffer 
        tempEdges.push(tempN)



        //second ghost node 
        tempN = {
          id: node_tot + 1,
          x: new_x + 100,
          y: new_y + 200,
          shape: "text",

          layout: {
            hierarchical: false // Disable automatic layout
          },
          physics: {
            enabled: false // Disable physics simulation
          }

        }
        //add to nodes buffer 
        tempNodes.push(tempN)


        node_tot++;

        //second ghost node edge 
        tempN =
        {
          from: node_tot,
          to: node_tot + 1,
          smooth: {
            "type": "discrete",
            "forceDirection": "vertical",
            "roundness": 0
          },
          color: "grey",

          arrows: {
            to: {
              enabled: true,
              type: "arrow",
              scaleFactor: 0.5
            },
          },

        }


        //add to edge buffer 
        tempEdges.push(tempN)

        //opposite direction after
        dir = 1
      }
      else {         //ghost nodes when going from right to left 

        //first ghost node  
        tempN = {
          id: node_tot + 1,
          x: new_x - 100,
          y: new_y,
          shape: "text",
          layout: {
            hierarchical: false // Disable automatic layout
          },
          physics: {
            enabled: false // Disable physics simulation
          }

        }
        //adds to nodes buffer
        tempNodes.push(tempN)

        node_tot++;

        //first ghost node edge
        tempN =
        {
          from: node_tot,
          to: node_tot + 1,
          smooth: {
            "type": "discrete",
            "forceDirection": "vertical",
            "roundness": 0
          },
          color: "grey",


        }


        //adds to edges buffer 
        tempEdges.push(tempN)



        //second ghost node  
        tempN = {
          id: node_tot + 1,
          x: new_x - 100,
          y: new_y + 200,
          shape: "text",

          layout: {
            hierarchical: false // Disable automatic layout
          },
          physics: {
            enabled: false // Disable physics simulation
          }

        }
        //adds to nodes buffer
        tempNodes.push(tempN)


        node_tot++;

        //second ghost node edge 
        tempN =
        {
          from: node_tot,
          to: node_tot + 1,
          smooth: {
            "type": "discrete",
            "forceDirection": "vertical",
            "roundness": 0
          },
          color: "grey",
          arrows: {
            to: {
              enabled: true,
              type: "arrow",
              scaleFactor: 0.5,
            },
          },

        }


        //adds to edges buffer
        tempEdges.push(tempN)

        //opposite direction after
        dir = 0
      }




      //resets counter and next row coordinates 
      new_y += 200
      y_counter = 0
    }
    else {   //next node in same line coordinates according to direction 
      if (dir === 0)
        new_x += 200
      else
        new_x -= 200
    }

    //define node type and color for Components:
    //Combiner, WSS, Switch, Attenuator and rsc 
    if ((node_type[i] === "Combiner") || (node_type[i] === "WSS") || (node_type[i] === "Switch") || (node_type[i] === "Attenuator") || (node_type[i] === "rsc")) {
      tempN = {
        id: node_tot + 1,
        label: path_data[i],
        title: label_data[i],
        shape: 'box',
        color: "cyan",
        x: new_x,
        y: new_y,

        layout: {
          hierarchical: false // Disable automatic layout
        },
        physics: {
          enabled: false // Disable physics simulation
        }

      }
      //adds to node buffer
      tempNodes.push(tempN)
    }
    //EDFA 
    else if (node_type[i] === "EDFA") {
      //triangle orientation according to direction 
      let side
      if (dir === 0)
        side = 1
      if (dir === 1)
        side = -1


      tempN = {
        id: node_tot + 1,
        label: path_data[i],
        title: label_data[i],
        shape: "custom",
        ctxRenderer: ({ ctx, id, x, y, state: { selected, hover }, style }) => {

          //triangle renderer 
          const r = style.size * 1;
          const drawNode = () => {

            ctx.beginPath();
            ctx.moveTo(75, 50);
            ctx.lineTo(100, 75);

            ctx.fill();

            ctx.beginPath();
            const sides = 3;
            const a = (Math.PI * 1.5 * side) / sides;
            ctx.moveTo(x, y + r);
            for (let i = 1; i < sides; i++) {
              ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
            }
            ctx.closePath();
            ctx.save();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.font = "normal 13px sans-serif";
            ctx.fillStyle = "black";
            ctx.fillText(path_data[i], x - r - 20, y + 60);
          };
          return {
            drawNode,
            nodeDimensions: { width: 2 * r, height: 2 * r },
          };
        },
        color: color,
        x: new_x,
        y: new_y,

        layout: {
          hierarchical: false // Disable automatic layout
        },
        physics: {
          enabled: false // Disable physics simulation
        }

      }
      //adds to node buffer 
      tempNodes.push(tempN)

    }
    //Raman amplifier 
    else if (node_type[i] === "Raman") {
      //triangle orientation according to direction 
      let side
      if (dir === 0)
        side = 1
      if (dir === 1)
        side = -1


      tempN = {
        id: node_tot + 1,
        label: path_data[i],
        title: label_data[i],
        shape: "custom",
        ctxRenderer: ({ ctx, id, x, y, state: { selected, hover }, style }) => {
          //triangle renderer - opposite 
          const r = style.size * -1;
          const drawNode = () => {

            ctx.beginPath();
            ctx.moveTo(75, 50);
            ctx.lineTo(100, 75);

            ctx.fill();

            ctx.beginPath();
            const sides = 3;
            const a = (Math.PI * 1.5 * side) / sides;
            ctx.moveTo(x, y + r);
            for (let i = 1; i < sides; i++) {
              ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
            }
            ctx.closePath();
            ctx.save();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.font = "normal 13px sans-serif";
            ctx.fillStyle = "black";
            ctx.fillText(path_data[i], x + r - 20, y + 60);
          };
          return {
            drawNode,
            nodeDimensions: { width: 2 * r, height: 2 * r },
          };
        },
        color: color,
        x: new_x,
        y: new_y,

        layout: {
          hierarchical: false // Disable automatic layout
        },
        physics: {
          enabled: false // Disable physics simulation
        }

      }
      //adds to nodes buffer 
      tempNodes.push(tempN)
    }
    //Fiber 
    else if (node_type[i] === "Fiber") {
      tempN = {
        id: node_tot + 1,
        label: path_data[i],
        title: label_data[i],
        shape: 'elipse',
        color: "#70d8bd",
        x: new_x,
        y: new_y,

        layout: {
          hierarchical: false // Disable automatic layout
        },
        physics: {
          enabled: false // Disable physics simulation
        }

      }
      //adds to nodes buffer 
      tempNodes.push(tempN)


    }
    else{
      tempN = {
        id: node_tot + 1,
        label: path_data[i],
        title: label_data[i],
        shape: 'box',
        color: "red",
        x: new_x,
        y: new_y,

        layout: {
          hierarchical: false // Disable automatic layout
        },
        physics: {
          enabled: false // Disable physics simulation
        }

      }
      //adds to node buffer
      tempNodes.push(tempN)
    }

    //updates counters 
    node_tot++;
    y_counter++;


    //creates edges 
    if (i !== path_data.length - 1) {

      tempN =
      {
        from: node_tot,
        to: node_tot + 1,
        smooth: {
          "type": "discrete",
          "forceDirection": "vertical",
          "roundness": 0
        },
        color: "grey",
        arrows: {
          to: {
            enabled: true,
            type: "arrow",
            scaleFactor: 0.5,
          },
        },

      }


      //add edge to buffer 
      tempEdges.push(tempN)

    }


  }

  //nodes and edges converted to vis js map format 
  dataConverted = [tempNodes, tempEdges]


  return dataConverted

}


