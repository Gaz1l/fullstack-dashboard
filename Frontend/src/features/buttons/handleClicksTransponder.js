//Handles add,reset and submit button for transponder component 

//Backend communication 
import { processURLs } from "../requests/requests";

//Theme and data conversor
import { tokens } from "../../theme";
import { convertData } from "../../data/dataConversor";
const colorSelector = [tokens("dark").greenAccent[500], tokens("dark").redAccent[500], tokens("dark").blueAccent[500], tokens("dark").white[500], tokens("dark").orange[500], tokens("dark").pink[500], tokens("dark").yellow[500], tokens("dark").lavander[500], tokens("dark").indigo[500], tokens("dark").purple[500]]

//when clicking add, adds selected option to databuffer and checks for duplicates 
function handleAdd(setdataBuffer, dataBuffer, name, transponderDirection, parameter, duplicate) {

  duplicate = false

  let i = 0;


  if (dataBuffer.length === 0) {

    dataBuffer[i] = {
      filename: name,
      direction: transponderDirection,
      parameter: parameter
    }
    setdataBuffer([...dataBuffer]);


  }
  else {

    for (i = 0; i < dataBuffer.length; i++) {


      if ((dataBuffer[i]["filename"] === name) && (dataBuffer[i]["direction"] === transponderDirection) && (dataBuffer[i]["parameter"] === parameter)) {
        duplicate = true

      }


    }
    if (!duplicate) {

      dataBuffer[i] = {
        filename: name,
        direction: transponderDirection,
        parameter: parameter
      }
      setdataBuffer([...dataBuffer]);
    }




  }
  return duplicate




};

//when clicking reset, clear databuffer with selected options 
function handleReset(setdataBuffer, setAnchor) {
  setdataBuffer([]);
  setAnchor(null)
}

//when clicking submit, send get requests and convertes/sets data to be plotted 
async function handleSubmit(dataBuffer, setPlot, setisLoadingSubmit, setrlTransponder, setminTransponder, setmaxTransponder) {
  setisLoadingSubmit(true)
  const plots = [];
  let url = []
  let label_node = ""

  //creating each url to communicate 
  for (let i = 0; i < dataBuffer.length; i++) {

    url[i]= process.env.REACT_APP_BASE_URL + "/files/data/network/" + dataBuffer[i]["filename"] + "/"+ dataBuffer[i]["direction"] + "/" +dataBuffer[i]["parameter"] + "/" 

    //url[i] = `http://localhost:3500/files/data/${dataBuffer[i]["filename"]}/${dataBuffer[i]["direction"]}/${dataBuffer[i]["parameter"]}/`;



  }




  processURLs(url) //send multiple get messages to backend 
    .then(responseData => {      //response with data requested
      // Access the responseData after all requests have completed



      for (let i = 0; i < dataBuffer.length; i++) {

        //sets label for each graph received 
        if (String(dataBuffer[i]["parameter"]).includes("_")) {

          let substring = dataBuffer[i]["parameter"].split("_");

          label_node = dataBuffer[i]["direction"][0].concat("-", substring[0], " (", substring[1], ")")

        }
        else {

          label_node = dataBuffer[i]["direction"][0].concat("-", dataBuffer[i]["parameter"], " (dB)")
        }

        //convert each graph to a required format - plot to use in Linechart - contains label , colour and data(x, y_linear, y_log) for each graph  
        plots.push(convertData(responseData[i], label_node, colorSelector[i])[0])

        //sets static transponder values received
        setrlTransponder(responseData[i]["RL_McTemplate"])
        setminTransponder(responseData[i]["minEdgeFrequency_THz"])
        setmaxTransponder(responseData[i]["maxEdgeFrequency_THz"])
      }
      setPlot(plots)   //set plots converted to use 

      setisLoadingSubmit(false) //updates loading flag 
    });

};



export { handleReset, handleAdd, handleSubmit }




