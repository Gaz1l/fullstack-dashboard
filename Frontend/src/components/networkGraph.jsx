//React components 
import React, { useEffect, useRef, useState, useContext } from 'react';


//Vis.js network map 
import vis from 'vis-network';

//Theme/Styles and contexts 
import { tokens, NavComContext } from "../theme";

//Icons
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

//MUI Components 
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { PopupBody } from '../features/popup/popUpBody';
import Button from '@mui/material/Button';
import { IconButton, Typography, useTheme, TextField } from "@mui/material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

//Components 
import LineChart from './LineChart';

//Dropdown Components 
import DropdownGraphComponent from './dropdown/dropdownGraph';
import DropdownEventComponent from './dropdown/dropdownEvent';

//Buttons
import TripleButton from './button/tripleButton';

//Handlers
import { handlePopUpNetworkMap, handlePopUpOperation } from '../features/popup/handlePopUp';
import { toggleText, toggleSplit, toggleGrid, handleRemoveElement } from '../features/toggles/handleToggle';
import { handleAdd, handleReset, handleSubmit } from '../features/buttons/handleClicksMap';
import { handleFirstInputChange } from '../features/dropdown/handleMapInput';
import { handleNodeClick } from '../features/networkmap/handleMapClicks';
import { handlePopNet, handlePopOverOperation, handleClosePopNet, handleClosePopNetOperation } from '../features/popover/handlePopover';
import { submitOperation } from '../features/buttons/handleOperation';

//Download graph
import download from 'downloadjs'
import { toPng } from 'html-to-image'

export default function GraphView(mapPlot) {


  //Context 
  const navMode = useContext(NavComContext);

  //Theme and colors 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  //nodes and edges received and formatted to create map 
  let nodesTemp = mapPlot["mapPlot"][0]
  let edgesTemp = mapPlot["mapPlot"][1]


  //Options selected - node clicked name/label and id , vector selected and parameter selected
  const [nodeName, setNodeName] = useState("")
  const [selectedNode, setSelectedNode] = useState("");
  const [selectedVectorOption, setSelectedVectorOption] = useState("");
  const [selectedParameterOption, setSelectedParameterOption] = useState("");

  //array with options received from backend 
  const [firstOption, setFirstOption] = useState([])
  const [secondOption, setSecondOption] = useState([])

  //Loading/Submitting flags 
  const [isLoadingSubmit, setisLoadingSubmit] = useState(true);
  const [isLoadingOperation, setIsLoadingOperation] = useState(true);

  //selected graphs and operation between them 
  const [selectedGraph1, setSelectedGraph1] = useState("");
  const [selectedGraph2, setSelectedGraph2] = useState("");
  const [operationGraph, setOperationGraph] = useState("");

  //limit in graph value and state 
  const [limitGraph, setLimitGraph] = useState("");
  const [limitFlag, setLimitFlag] = useState(false);

  //text displayed and state of linear/log, split and grid buttons 
  const [splitgraphs, setSplitGraphs] = useState("split");
  const [displayText, setDisplayText] = useState("linear");
  const [gridText, setGridText] = useState("grid");


  const [plot, setPlot] = useState([]);  //Plots to use in Linechart - contains label , colour and data(x, y_linear, y_log) for each plot 
  const [opData, setOpData] = useState([]); //operation data to plot in Linechart - contains label , colour and data(x, y_linear, y_log) 



  const [dataBuffer, setdataBuffer] = useState([]); //Array with data selected to send to server when clicking add - contains id (name), direction (transponderdirection) and parameter


  //first popup error - network inputs
  const [textPop, setTextPop] = useState("");
  const [anchor, setAnchor] = React.useState(null);
  const openT = Boolean(anchor);
  const idT = openT ? 'simple-popper' : undefined;



  //popover - element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  //popover - operation 
  const [anchorOp, setAnchorOp] = React.useState(null);
  const openOp = Boolean(anchorOp);
  const idOp = openOp ? 'simple-popover' : undefined;

  //Network reference to create map  
  const networkRef = useRef(null);

  //Graphs and map references to link with download button 
  const mapDown = useRef(null);
  const chart = useRef(null);
  const chartOp = useRef(null);

  //create map with nodes, edges and navmode received when initizalizing component
  //detect when a node is clicked and get vector options list 
  useEffect(() => {

    const graph = {
      nodes: nodesTemp,
      edges: edgesTemp
    }

    //get element by id where the map will be ploted 
    const networkContainer = document.getElementById('your-network-container-id');

    let flag

    //nav mode received from context 
    if (navMode.mode === "on")
      flag = true
    else if (navMode.mode === "off")
      flag = false

    //map options 
    var options = {
      physics: {
        enabled: false
      },
      interaction: {
        navigationButtons: flag
      },
      nodes: {
        borderWidth: 2,
        size: 40,
        color: {
          border: "#222222",
          background: "#666666"
        },
        font: { color: "black" }
      },
      edges: {
        color: "black", shadow: true,
        smooth: true
      },
      height: "930px",
      width: '100%'
    }


    //network/map creation with options,nodes,edges and position 
    const network = new vis.Network(networkContainer, graph, options);

    networkRef.current = network; // Store the network object in the ref

    //function to call everytime a node is clicked to save its values and get parameter options from backend 
    network.on('click', (params) => handleNodeClick(params, nodesTemp, setNodeName, setSelectedNode,
      setSelectedVectorOption, setSelectedParameterOption, setFirstOption, setSecondOption, mapPlot));

    return () => {
      network.off('click', (params) => handleNodeClick(params, nodesTemp, setNodeName, setSelectedNode,
        setSelectedVectorOption, setSelectedParameterOption, setFirstOption, setSecondOption, mapPlot));
    };

  }, [navMode.mode, nodesTemp, edgesTemp, mapPlot]);




  /*ONE COLUMN GRID BOX - COINTAINING DROPDOWNS, BUTTONS, LIST OF ELEMENTS ADDED, POPUP, MAP AND POPOVER*/
  return (

    <Box
      sx={{
        display: "grid",
      }}
    >





      {/*FIRST ROW - FLEX BOX WITH DROPDOWNS, BUTTONS AND POPUP*/}
      <Box sx={{

        display: 'flex',
        justifyContent: 'flex-start',

      }}>
        {/* VECTOR DROPDOWN - lists and sets vector option selected and gets parameter options from backend */}
        <DropdownEventComponent name="In/Out Vector" id="vectorDropdown" value={selectedVectorOption} label="In/Out Vector"
          onChange={(e) => handleFirstInputChange(e.target.value, setSelectedVectorOption, mapPlot, selectedNode, setSecondOption)}
          emptyArray={false} posts={firstOption} />
        {/* PARAMETER DROPDOWN - lists parameter options received from backend and sets parameter selected in parameter*/}
        <DropdownEventComponent name="Parameter" id="parameterDropdown" value={selectedParameterOption} label="Parameter" onChange={(e) => setSelectedParameterOption(e.target.value)} emptyArray={false} posts={secondOption} />

        {/* ADD/RESET/SUBMIT BUTTONS - adds selected options to databuffer,
          resets databuffer,
          requests data with backend and plots with popover,
          while displaying errors with popup */}
        <TripleButton firstClick={(event) => handlePopUpNetworkMap(event, selectedNode, selectedVectorOption, selectedParameterOption, setTextPop, setAnchor, handleAdd, setdataBuffer, dataBuffer, mapPlot, nodeName)}
          secondClick={() => handleReset(setdataBuffer, setAnchor)}
          thirdClick={(event) => handlePopNet(event, dataBuffer, setTextPop, setAnchor, handleSubmit, setAnchorEl, setPlot, setisLoadingSubmit)} />

        {/* POPUP ERROR MESSAGE */}
        <BasePopup id={idT} open={openT} anchor={anchor} placement={"bottom-start"}>
          <PopupBody>   <Box style={{ marginLeft: '1vw', marginRight: '1vw' }}>{textPop}</Box></PopupBody>
        </BasePopup>

        {/* DOWNLOAD BUTTON*/}
        <Button

          sx={{ marginLeft: '0.5vw' }}
          startIcon={<DownloadIcon />}
          component="label" variant="contained"
          onClick={async () => {

            if (!mapDown.current) {
              return
            }

            const dataUrl = await toPng(mapDown.current)

            download(dataUrl, 'map.png')
          }}
        >
          Download Map
        </Button>

      </Box>

      <Box
        sx={{
          display: "grid",
          paddingTop: "1vh",
        }}
      >
        <Typography>
          Added Elements:

          </Typography>

          {dataBuffer.map((element, index) => (
            <Box key={index} >
          <Typography>
                {element["nodeName"]} {element["vector"]} {element["parameter"]}
            
              <IconButton onClick={() => handleRemoveElement(index, setdataBuffer)}>
                <ClearIcon />
              </IconButton>
              </Typography>
            </Box>
          ))}
        
      </Box>

      {/* THIRD ROW - GREY BOX -  CONTAINING NETWORK MAP - position with data to be created  */}
      <Box id="your-network-container-id"
        sx={{
          m: "3vh 5vw 0 5vw",
          backgroundColor: colors.primary[400],
        }}
        ref={mapDown}
      >

      </Box>






      {/* GRAPHS POP OVER  */}
      {!isLoadingSubmit &&

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => handleClosePopNet(setSplitGraphs, setisLoadingSubmit, setLimitFlag, setAnchorEl, setSelectedGraph1, setSelectedGraph2, setOperationGraph)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >


          {/* GREY BOX - COINTAINING BUTTONS,DROPDOWNS AND GRAPH*/}
          <Box overflow="hidden" backgroundColor={colors.primary[400]} paddingTop={"1vh"} ref={chart}>

            {/*POPOVER CLOSE BUTTON - reset flags*/}
            <Button onClick={() => handleClosePopNet(setSplitGraphs, setisLoadingSubmit, setLimitFlag, setAnchorEl, setSelectedGraph1, setSelectedGraph2, setOperationGraph)} sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }} variant="contained" size="medium">Close</Button>

            {/* LINEAR/LOG BUTTON */}
            <Button variant="contained" onClick={() => toggleText(setDisplayText)} sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }}>
              {displayText}
            </Button>

            {/* GRID BUTTON */}
            <Button sx={{ marginLeft: '0.5vw', marginRight: '3vw' }} variant="contained" onClick={() => toggleGrid(setGridText)}>
              {gridText}
            </Button>







            {/* GRAPH 1 DROPDOWN - id selected and set from databuffer*/}
            <DropdownGraphComponent name="Graph1" id="Graph1Dropdown" value={selectedGraph1} label="Graph1" onChange={(e) => setSelectedGraph1(e.target.value)} emptyArray={false} posts={dataBuffer} />

            {/* GRAPH 2 DROPDOWN - id selected and set from databuffer*/}
            <DropdownGraphComponent name="Graph2" id="Graph2Dropdown" value={selectedGraph2} label="Graph2" onChange={(e) => setSelectedGraph2(e.target.value)} emptyArray={false} posts={dataBuffer} />


            {/* OPERATION DROPDOWN - operation selected and set */}
            <DropdownEventComponent name="Operation" id="OperationDropdown" value={operationGraph} label="Operation"
              onChange={(e) => setOperationGraph(e.target.value)}
              posts={["Addition", "Subtraction", "Multiplication", "Division"]} />

            {/* SUBMIT OPERATION BUTTON - check if inputs are valid then get result in required format and change flag to display popover with graph*/}
            <Button onClick={(event) => handlePopUpOperation(event, selectedGraph1, selectedGraph2, operationGraph, submitOperation, plot, handlePopOverOperation, setOpData, setIsLoadingOperation, setAnchorOp)} variant="contained" size="medium" sx={{ marginLeft: '0.25vw', marginRight: '3vw' }}>Submit</Button>



            {/* OPERATION GRAPH POPOVER */}
            {!isLoadingOperation &&
              <Box>
                <Popover
                  id={idOp}
                  open={openOp}
                  anchorEl={anchorOp}
                  onClose={() => handleClosePopNetOperation(setIsLoadingOperation, setAnchorOp, setSelectedGraph1, setSelectedGraph2, setOperationGraph)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}


                >
                  {/* GREY BOX - COINTAINING BUTTONS AND GRAPH*/}
                  <Box overflow="hidden" backgroundColor={colors.primary[400]} paddingTop={"1vh"} ref={chartOp}>

                    {/* POPOVER CLOSE BUTTON - resets flags  */}
                    <Button onClick={() => handleClosePopNetOperation(setIsLoadingOperation, setAnchorOp, setSelectedGraph1, setSelectedGraph2, setOperationGraph)} sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }} variant="contained" size="medium">Close</Button>

                    {/* LINEAR/LOG BUTTON */}

                    <Button variant="contained" onClick={() => toggleText(setDisplayText)} sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }}>
                      {displayText}
                    </Button>


                    {/* GRID BUTTON */}
                    <Button sx={{ marginLeft: '0.5vw', marginRight: '3vw' }} variant="contained" onClick={() => toggleGrid(setGridText)}>
                      {gridText}
                    </Button>


                    {/* LIMIT INPUT */}
                    <TextField
                      label="Define a Limit"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={limitGraph}
                      onChange={(e) => setLimitGraph(e.target.value)}

                    />

                    {/* SUBMIT LIMIT BUTTON */}
                    <Button sx={{ marginLeft: '0.5vw', marginRight: '0.25vw' }} onClick={() => setLimitFlag(true)} variant="contained" size="medium">Submit</Button>
                    {/* REMOVE LIMIT BUTTON */}
                    <Button sx={{ marginLeft: '0.25vw', marginRight: '3vw' }} onClick={() => setLimitFlag(false)} variant="contained" size="medium">Remove</Button>


                    {/* DOWNLOAD BUTTON */}
                    <Button


                      sx={{ marginLeft: '0.5vw' }}
                      startIcon={<DownloadIcon />}
                      component="label" variant="contained"
                      onClick={async () => {

                        if (!chartOp.current) {
                          return
                        }

                        const dataUrl = await toPng(chartOp.current)

                        download(dataUrl, 'chartOp.png')
                      }}
                    >
                      Download Chart
                    </Button>


                    {/* OPERATION GRAPH */}
                    <Box sx={{
                      height: "93vh",
                      width: "100vw"
                    }}>


                      {/*OPERATION GRAPH */}
                      <LineChart isDashboard={true} dataToPlot={opData} log_linear={displayText} gridValue={gridText} mRight={150} mLeft={120} xLegends={-190} yLegends={500} itemW={130} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={operationGraph} />






                    </Box>

                  </Box>
                </Popover>
              </Box>
            }












            {/* LIMIT INPUT */}
            <TextField
              label="Define a Limit"
              variant="outlined"
              size="small"
              type="number"
              value={limitGraph}
              onChange={(e) => setLimitGraph(e.target.value)}

            />


            {/* SUBMIT LIMIT BUTTON */}
            <Button sx={{ marginLeft: '0.5vw', marginRight: '0.25vw' }} onClick={() => setLimitFlag(true)} variant="contained" size="medium">Submit</Button>
            {/* REMOVE LIMIT BUTTON */}
            <Button sx={{ marginLeft: '0.25vw', marginRight: '3vw' }} onClick={() => setLimitFlag(false)} variant="contained" size="medium">Remove</Button>

            {/* DOWNLOAD BUTTON */}
            <Button

              sx={{ marginLeft: '1vw' }}
              startIcon={<DownloadIcon />}
              component="label" variant="contained"
              onClick={async () => {

                if (!chart.current) {
                  return
                }

                const dataUrl = await toPng(chart.current)

                download(dataUrl, 'chart.png')
              }}
            >
              Download Chart
            </Button>

            {/* SPLIT GRAPHS BUTTON - WHEN 2 GRAPHS EXIST*/}
            {plot.length === 2 &&
              <Button sx={{ marginLeft: '1vw', marginRight: '0.25vw' }} onClick={() => toggleSplit(setSplitGraphs)} variant="contained" size="medium">{splitgraphs} Graphs</Button>
            }


            {/*UNSPLITTED GRAPH */}
            {splitgraphs === "split" &&
              <Box sx={{
                height: "90vh",
                width: "100vw",
                backgroundColor: colors.primary[400],
              }}
                ref={chart}>


                {/* GRAPH */}
                <LineChart isDashboard={true} dataToPlot={plot} log_linear={displayText} gridValue={gridText} mRight={200} mLeft={290} xLegends={-285} yLegends={350} itemW={130} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />






              </Box>
            }
            {/*SPLITTED GRAPHS */}
            {splitgraphs === "unsplit" &&
              <Box sx={{
                height: "90vh",
                width: "100vw",
                backgroundColor: colors.primary[400],
              }}
                ref={chart}>

                <Box sx={{
                  height: "45vh",
                  width: "100vw"
                }}>
                  {/*GRAPH 1 */}
                  <LineChart isDashboard={true} dataToPlot={[plot[0]]} log_linear={displayText} gridValue={gridText} mRight={200} mLeft={290} xLegends={-285} yLegends={150} itemW={130} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />
                </Box>


                <Box sx={{
                  height: "45vh",
                  width: "100vw"
                }}>
                  {/*GRAPH 2 */}
                  <LineChart isDashboard={true} dataToPlot={[plot[1]]} log_linear={displayText} gridValue={gridText} mRight={200} mLeft={290} xLegends={-285} yLegends={150} itemW={130} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />

                </Box>



              </Box>


            }


          </Box>

        </Popover>


      }

    </Box>





  )
}

