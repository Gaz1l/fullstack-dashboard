//Handles add,reset and submit button for transponder component 

//Backend communication 
import { processURLs } from "../requests/requests";

//Theme and data conversor
import { tokens } from "../../theme";
import { convertData } from "../../data/dataConversor";
const colorSelector = [tokens("dark").greenAccent[500], tokens("dark").redAccent[500], tokens("dark").blueAccent[500], tokens("dark").grey[500], tokens("dark").orange[500], tokens("dark").pink[500], tokens("dark").yellow[500], tokens("dark").lavander[500], tokens("dark").indigo[500], tokens("dark").purple[500]]

//when clicking add, adds selected option to databuffer and checks for duplicates
function handleAdd(setdataBuffer, dataBuffer, mapPlot, nodeName, selectedNode, selectedVectorOption, selectedParameterOption) {


  let temp = "null"


  let i = 0;

  if (dataBuffer.length === 0) {

    dataBuffer[i] = {
      filename: mapPlot["filename"],
      direction: mapPlot["direction"],
      node: selectedNode,
      nodeName: nodeName,
      vector: selectedVectorOption,
      parameter: selectedParameterOption
    }
    setdataBuffer([...dataBuffer]);

  }
  else if (dataBuffer.length >= 11)
    temp = "limit"
  else {

    for (i = 0; i < dataBuffer.length; i++) {

      if ((dataBuffer[i]["nodeName"] === nodeName) && (dataBuffer[i]["node"] === selectedNode) && (dataBuffer[i]["filename"] === mapPlot["filename"]) && (dataBuffer[i]["direction"] === mapPlot["direction"]) && (dataBuffer[i]["vector"] === selectedVectorOption) && (dataBuffer[i]["parameter"] === selectedParameterOption)) {
        temp = "duplicate"

      }


    }
    if (temp === "null") {

      dataBuffer[i] = {
        filename: mapPlot["filename"],
        direction: mapPlot["direction"],
        node: selectedNode,
        nodeName: nodeName,
        vector: selectedVectorOption,
        parameter: selectedParameterOption
      }
      setdataBuffer([...dataBuffer]);

    }




  }
  return temp


};

//when clicking reset, clear databuffer with selected options 
function handleReset(setdataBuffer, setAnchor) {
  setdataBuffer([]);
  setAnchor(null);
}

//when clicking submit, send get requests and convertes/sets data to be plotted 
async function handleSubmit(dataBuffer, setPlot, setisLoadingSubmit) {



  setisLoadingSubmit(true)
  const plots = [];
  let url = []
  let label_vector = ""
  let label_node = ""
  let label_param = ""
  let label_unit = ""
  let label_param_array

  //creating each url to communicate 
  for (let i = 0; i < dataBuffer.length; i++) {


    url[i] = process.env.REACT_APP_BASE_URL + "/files/data/network/" + dataBuffer[i]["filename"] + "/" + dataBuffer[i]["direction"] + "/" + dataBuffer[i]["node"] + "/" + dataBuffer[i]["vector"] + "/" + dataBuffer[i]["parameter"] + "/"

    // url[i] = `http://localhost:3500/files/data/network/${dataBuffer[i]["filename"]}/${dataBuffer[i]["direction"]}/${dataBuffer[i]["node"]}/${dataBuffer[i]["vector"]}/${dataBuffer[i]["parameter"]}/`;



  }





  processURLs(url) //send multiple get messages to backend 
    .then(responseData => {    //response with data requested
      // Access the responseData after all requests have completed



      for (let i = 0; i < dataBuffer.length; i++) {



        //sets label for each graph received 
        //IN or OUT Vector - LABEL 
        if ((dataBuffer[i]["vector"]) === "InVector") {
          label_vector = "In"
        }
        else if ((dataBuffer[i]["vector"]) === "OutVector") {
          label_vector = "Out"
        }
        else {
          label_vector = "TF"
        }

        //Node - LABEL 
        if ((dataBuffer[i]["nodeName"][0]) === "N") {

          let substring = dataBuffer[i]["nodeName"].split(' ');

          if ((substring[2][0]) === "E")
            label_node = String("N".concat(substring[1], substring[2][0], substring[3][0], "-"))
          else
            label_node = String("N".concat(substring[1], substring[2][0], "-"))



        }
        ///Fiber label 
        else {
          let substring = dataBuffer[i]["nodeName"].split(' ');
          label_node = String(substring[0].concat(substring[2], "-", substring[4], "-"))
        }



        //parameter simplification - label 
        label_param = ""
        label_param_array = String(dataBuffer[i]["parameter"]).split(/(?=[A-Z])/);

        for (const substring of label_param_array) {
          label_param += substring.slice(0, 3)
        }

        // units - label 

        if (label_param === "sigPsd" || label_param === "asePsd" || label_param === "asePsdPos" || label_param === "asePsdNeg" || label_param === "nliPsd" || label_param === "nliPsdPos" || label_param === "nliPsdNeg") {

          label_unit = "(mW/GHz)"
        }
        else if (label_param === "pmd" || label_param === "pmdTF") {
          label_unit = "(ps^2)"
        }
        else if (label_param === "pdl" || label_param === "pdlTF") {
          label_unit = "(dB^2)"
        }
        else if (label_param === "dis") {
          label_unit = "(ps/nm)"
        }
        else if (label_param === "oscNsr") {
          label_unit = "(N.A.)"
        }
        else
          label_unit = "(dB)"



        //convert each graph to a required format - plot to use in Linechart - contains label , colour and data(x, y_linear, y_log) for each graph  
        plots.push(convertData(responseData[i], String(label_node).concat(label_vector, "-", label_param, " ", label_unit), colorSelector[i],label_unit)[0])

      }

      setPlot(plots) //set plots converted to use 
      setisLoadingSubmit(false)  //updates loading flag 
    });

};


export { handleReset, handleAdd, handleSubmit }




