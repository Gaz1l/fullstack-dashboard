//React components 
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

//Theme/Styles 
import { tokens } from "../theme";
import "vis-network/styles/vis-network.css";

//Icons
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

//MUI Components 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IconButton, useTheme, TextField } from "@mui/material";
import Popover from '@mui/material/Popover';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { PopupBody } from '../features/popup/popUpBody';

//Components 
import Header from "../components/Header";
import LineChart from "../components/LineChart";


//Dropdown Components 
import DropdownNetworkComponent from "../components/dropdown/dropdownNetwork";
import DropdownEventComponent from "../components/dropdown/dropdownEvent";
import DropdownGroupedComponent from "../components/dropdown/dropdownGrouped";
import DropdownGraphComponent from './dropdown/dropdownGraph';

//Buttons 
import TripleButton from "../components/button/tripleButton";

//Handlers
import { handleAdd, handleReset, handleSubmit } from "../features/buttons/handleClicksTransponder";
import { handleTransponderInputChange } from "../features/dropdown/handleTransponderInput";
import { handlePopOverTrans, handlePopOverOperation, handleClosePopNetOperation } from '../features/popover/handlePopover';
import { submitOperation } from '../features/buttons/handleOperation';
import { toggleText, toggleSplit, toggleGrid, handleRemoveElement } from '../features/toggles/handleToggle';
import { handlePopUpTransponderBox, handlePopUpOperation } from '../features/popup/handlePopUp';

//Download graph
import download from 'downloadjs'
import { toPng } from 'html-to-image'



const Transponder = () => {

  //Use effect 
  const [networks, setNetworks] = useState([]);           //array with ids and names of nws in db 

  const [updateFlag, setUpdateFlag] = useState(false);    //update flag - delete or upload 
  const [emptyArray, setEmptyArray] = useState(true);     //no files in db flag 


  //First dropdowns options 
  const [name, setName] = useState('');           //dropdown selected nw id 
  const [transponderDirection, setTransponderDirection] = useState(''); //dropdown selected direction 
  const [parameter, setParameter] = useState('');  //dropdown selected parameter 



  const [plot, setPlot] = useState([]);        //Plots to use in Linechart - contains label , colour and data(x, y_linear, y_log) for each plot 

  //arrays with parameters options received from backend 
  const [transponderRLOptions, setTransponderRLOptions] = useState([]);
  const [transponderPenOptions, setTransponderPenOptions] = useState([]);
  const [transponderMarOptions, setTransponderMarOptions] = useState([]);

  const [dataBuffer, setdataBuffer] = useState([]);    //Array with data selected to send to server when clicking add - contains id (name), direction (transponderdirection) and parameter

  //loading/submiting flags
  const [isLoadingSubmit, setisLoadingSubmit] = useState(true);
  const [isLoadingOperation, setIsLoadingOperation] = useState(true);

  //static transponder values received
  const [rlTransponder, setrlTransponder] = useState("");
  const [minTransponder, setminTransponder] = useState("");
  const [maxTransponder, setmaxTransponder] = useState("");

  //limit in graph value and state 
  const [limitGraph, setLimitGraph] = useState("");
  const [limitFlag, setLimitFlag] = useState(false);

  //selected graphs and operation between them 
  const [selectedGraph1, setSelectedGraph1] = useState("");
  const [selectedGraph2, setSelectedGraph2] = useState("");
  const [operationGraph, setOperationGraph] = useState("");


  const [opData, setOpData] = useState([]);  //operation data to plot in Linechart - contains label , colour and data(x, y_linear, y_log) 

  //text displayed and state of linear/log, split and grid buttons 
  const [displayText, setDisplayText] = useState("linear");
  const [splitgraphs, setSplitGraphs] = useState("split");
  const [gridText, setGridText] = useState("grid");



  //theme and colors
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //first popup error - transponder inputs
  const [textPop, setTextPop] = useState("");
  const [anchor, setAnchor] = React.useState(null);
  const openT = Boolean(anchor);
  const idT = openT ? 'simple-popper' : undefined;

  //popover - operation 
  const [anchorOp, setAnchorOp] = React.useState(null);
  const openOp = Boolean(anchorOp);
  const idOp = openOp ? 'simple-popover' : undefined;


  //Graphs reference to link with download button 
  const chart = useRef(null);
  const chartOp = useRef(null);

  function transponderChange(selected) {
    setName(selected)
    setTransponderDirection('')
    setParameter('')
  
  }


  //get nws names when initilializing , deleting or uploading through get request (fetch)
  useEffect(() => {
    fetch(process.env.REACT_APP_BASE_URL + "/files/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
    })
    .then(async (res) => {
      if (res.ok) {
        // If the response status is OK, proceed with parsing the JSON
        return res.json();
      } else if (res.status === 403) {
        // Unauthorized: Access token is likely expired
        // refresh token
        console.log("Token expired, initiate token refresh");
        try {
          const response = await fetch(process.env.REACT_APP_BASE_URL+ "/auth/refresh", {
            method: 'GET',
            credentials: 'include', // Include credentials to send cookies
          });
          if (response.ok) {
            // If the refresh is successful, extract the new access token from the response
            const data = await response.json();
            sessionStorage.setItem('accessToken', data.accessToken);
            console.log('Access token refreshed successfully',data);
           
           
            try {
              const responses = await fetch(process.env.REACT_APP_BASE_URL + "/files/", {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
              });
              if (responses.ok) {
                // If the refresh is successful, extract the new access token from the response
                const datas = await responses.json();
  
                return datas;
               
               
  
               
              }} catch (error) {
                // Handle unexpected errors during token refresh
                console.error('Unexpected error during token refresh', error);
                // Handle logout or redirect to login page
              }
              }
            }catch (error) {
              // Handle unexpected errors during token refresh
              console.error('Unexpected error during token refresh', error);
              // Handle logout or redirect to login page
            } 

          }
          

      
     
       
       else {
        // Handle other HTTP status codes as needed
        console.log("Other error:", res.status);
        throw new Error("Other error");
      }
    })
      .then((data) => {
        
        //sets ids and names of nws in db received from backend
        setNetworks(data);

        //Check if there are no files in db and sets flag
        if (data.length !== 0 && data.length !== undefined)
          setEmptyArray(false)
        else
          setEmptyArray(true)

        //Reset update flag 
        setUpdateFlag(false)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [updateFlag]);




  /*MAIN BOX - CONTAINS ALL TRANSPONDER DATA COMPONENTS */
  let content = (


    <Box sx={{
      ml: "1vw",
      overflow: "hidden",
    }} >


      {/*ONE COLUMN GRID BOX - COINTAINING HEADER, DROPDOWNS, BUTTONS, POPUP AND LIST OF ELEMENTS ADDED*/}
      <Box
        sx={{
          ml: "1vw",
          display: "grid",
        }}
      >

        {/* HEADER */}
        <Header title="Transponder" subtitle="Visualize Each Parameter" />



        {/*FIRST ROW - FLEX BOX WITH DROPDOWNS, BUTTONS AND POPUP*/}
        <Box sx={{

          display: 'flex',
          justifyContent: 'flex-start',

        }}>

          {/* FILE DROPDOWN - sets id of nw selected in name */}
          <DropdownNetworkComponent name="Filename" id="networkDropdown" value={name} label="FileName"
            onChange={(e) => transponderChange(e.target.value)} emptyArray={emptyArray} posts={networks} />

          {/* DIRECTION DROPDOWN - sets direction selected in transponderDirection and gets parameter options from backend */}
          <DropdownEventComponent name="Direction" id="directionDropdown" value={transponderDirection} label="Direction"
            onChange={(e) => handleTransponderInputChange(e.target.value, name, setTransponderDirection, setTransponderRLOptions, setTransponderPenOptions, setTransponderMarOptions)}
            posts={["Forward", "Backward"]} />

          {/* PARAMETER DROPDOWN - lists parameter options received from backend and sets parameter selected in parameter*/}
          <DropdownGroupedComponent name="Parameter" id="parameterDropdwon" value={parameter} label="Parameter"
            onChange={(e) => setParameter(e.target.value)}
            posts={[transponderRLOptions, transponderPenOptions, transponderMarOptions]} />

          {/* ADD/RESET/SUBMIT BUTTONS - adds selected options to databuffer,
          resets databuffer,
          requests data with backend and plots with popover,
          while displaying errors with popup */}
          <TripleButton
            firstClick={(event) => handlePopUpTransponderBox(event, name, transponderDirection, parameter, setTextPop, setAnchor, handleAdd, setdataBuffer, dataBuffer)}
            secondClick={() => handleReset(setdataBuffer, setAnchor)}
            thirdClick={(event) => handlePopOverTrans(event, dataBuffer, setTextPop, setAnchor, setSplitGraphs, handleSubmit, setPlot, setisLoadingSubmit, setrlTransponder, setminTransponder, setmaxTransponder, setSelectedGraph1, setSelectedGraph2, setOperationGraph)} />

          {/* POPUP ERROR MESSAGE */}
          <BasePopup id={idT} open={openT} anchor={anchor} placement={"bottom-start"}>
            <PopupBody>   <Box style={{ marginLeft: '1vw', marginRight: '1vw' }}>{textPop}</Box> </PopupBody>
          </BasePopup>
        </Box>


        {/*SECOND ROW - ONE COLUMN GRID BOX CONTAINING LIST OF ELEMENTS ADDED*/}
        <Box
          sx={{
            display: "grid",
            paddingTop: "1vh"
          }}
        >

          {/* LIST OF ADDED ELEMENTS - located in databuffer and allows to remove them */}
          <Typography>
          Added Elements:

          </Typography>
            {dataBuffer.map((element, index) => (
              <Box  key={index}>

<Typography>
                {element["direction"]} {element["parameter"]}
                <IconButton onClick={() => handleRemoveElement(index, setdataBuffer)}>
                  <ClearIcon />
                </IconButton>
                </Typography>
              </Box>
            ))}
          
        </Box>
      </Box>



      {/*ONE COLUMN GRID - GREY BOX - COINTAINING INFO, BUTTONS AND GRAPH*/}

      {!isLoadingSubmit &&



        <Box
          sx={{
            ml: "1vw",
            display: "grid",
            backgroundColor: colors.primary[400],

          }}
        >







          {/* FIRST ROW - FLEX BOX - CONTAINING TRANSPONDER INFO AND LINEAR/GRID/DOWNLOAD BUTTONS */}
          <Box
            sx={{
              p: "2vh 0vw 2vh 2vw",
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >

            {/* LINEAR/LOG BUTTON */}
            <Box>
              <Button sx={{ marginLeft: '0.5vw', marginRight: '1vw' }} variant="contained" onClick={() => toggleText(setDisplayText)}>
                {displayText}
              </Button>
              {/* GRID BUTTON */}
              <Button sx={{ marginLeft: '0.5vw' }} variant="contained" onClick={() => toggleGrid(setGridText)}>
                {gridText}
              </Button>

            </Box>

            {/* TRANSPONDER INFO*/}
            <Box >RL_McTemplate: {rlTransponder}</Box>


            <Box >minEdgeFrequency: {minTransponder} THz</Box>


            <Box >maxEdgeFrequency: {maxTransponder} THz</Box>


            {/* DOWNLOAD BUTTON  */}
            <Button
              sx={{ marginRight: '1vw' }}
              startIcon={<DownloadIcon />}
              variant="contained"
              onClick={async () => {

                if (!chart.current) {
                  return
                }

                const dataUrl = await toPng(chart.current)

                download(dataUrl, 'chart.png')
              }}
            >
              Download Graph
            </Button>


          </Box>




          {/* SECOND ROW - FLEX BOX - CONTAINING BUTTONS AND DROPDOWNS  */}
          <Box
            sx={{
              p: "1vh 0vw 0vh 2.5vw",
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start'
            }}


          >




            {/* GRAPH 1 DROPDOWN - id selected and set from databuffer*/}

            <DropdownGraphComponent name="Graph1" id="Graph1Dropdown" value={selectedGraph1} label="Graph1" onChange={(e) => setSelectedGraph1(e.target.value)} emptyArray={false} posts={dataBuffer} />

            {/* GRAPH 2 DROPDOWN - id selected and set from databuffer*/}
            <DropdownGraphComponent name="Graph2" id="Graph2Dropdown" value={selectedGraph2} label="Graph2" onChange={(e) => setSelectedGraph2(e.target.value)} emptyArray={false} posts={dataBuffer} />

            {/* OPERATION DROPDOWN - operation selected and set*/}
            <DropdownEventComponent name="Operation" id="OperationDropdown" value={operationGraph} label="Operation"
              onChange={(e) => setOperationGraph(e.target.value)}
              posts={["Addition", "Subtraction", "Multiplication", "Division"]} />

            {/* SUBMIT OPERATION BUTTON - check if inputs are valid then get result in required format and change flag to display popover with graph */}
            <Button sx={{ marginLeft: '0.25vw', marginRight: '3vw' }} onClick={(event) => handlePopUpOperation(event, selectedGraph1, selectedGraph2, operationGraph, submitOperation, plot, handlePopOverOperation, setOpData, setIsLoadingOperation, setAnchorOp)} variant="contained" size="medium">Submit</Button>











            {/* OPERATION GRAPH POPOVER */}
            {!isLoadingOperation &&
              <Box >
                <Popover
                  id={idOp}
                  open={openOp}
                  anchorEl={anchorOp}
                  onClose={() => handleClosePopNetOperation(setIsLoadingOperation, setAnchorOp)}
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
                  <Box overflow="hidden" backgroundColor={colors.primary[400]} paddingTop={"1vh"}>

                    {/* POPOVER CLOSE BUTTON - resets flag */}


                    <Button onClick={() => handleClosePopNetOperation(setIsLoadingOperation, setAnchorOp)} sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }} variant="contained" size="medium">Close</Button>

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

                    <Button sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }} onClick={() => setLimitFlag(true)} variant="contained" size="medium">Submit</Button>

                    {/* REMOVE LIMIT BUTTON */}
                    <Button sx={{ marginLeft: '0vw', marginRight: '3vw' }} onClick={() => setLimitFlag(false)} variant="contained" size="medium">Remove</Button>



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
                      Download Graph
                    </Button>



                    {/* OPERATION GRAPH */}
                    <Box sx={{

                      height: "93vh",
                      width: "100vw"
                    }}
                      backgroundColor={colors.primary[400]}
                      ref={chartOp}
                    >


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

            <Button sx={{ marginLeft: '0.25vw', marginRight: '0.25vw' }} onClick={() => setLimitFlag(true)} variant="contained" size="medium">Submit</Button>

            {/* REMOVE LIMIT BUTTON */}
            <Button sx={{ marginLeft: '0vw', marginRight: '0.25vw' }} onClick={() => setLimitFlag(false)} variant="contained" size="medium">Remove</Button>

            {/* SPLIT GRAPHS BUTTON - WHEN 2 GRAPHS EXIST*/}
            {plot.length === 2 &&
              <Button sx={{ marginLeft: '3vw', marginRight: '0.25vw' }} onClick={() => toggleSplit(setSplitGraphs)} variant="contained" size="medium">{splitgraphs} Graphs</Button>
            }





          </Box>









        </Box>



      }



      {/* SECOND ROW - BOX - CONTAINING GRAPHIC */}

      {/*UNSPLITTED GRAPH */}
      {!isLoadingSubmit && splitgraphs === "split" &&

        <Box sx={{
          ml: "1vw",
          height: "60vh",
          width: "100vw",

          backgroundColor: colors.primary[400],
        }}
          ref={chart}>



          {/* GRAPH */}
          <LineChart isDashboard={true} dataToPlot={plot} log_linear={displayText} gridValue={gridText} mRight={300} mLeft={240} xLegends={-235} yLegends={200} itemW={10} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />

        </Box>
      }


      {/*SPLITTED GRAPHS */}
      {!isLoadingSubmit && splitgraphs === "unsplit" &&






        <Box sx={{
          ml: "1vw",
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
            <LineChart isDashboard={true} dataToPlot={[plot[0]]} log_linear={displayText} gridValue={gridText} mRight={300} mLeft={240} xLegends={-235} yLegends={150} itemW={10} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />
          </Box>

          <Box sx={{
            height: "45vh",
            width: "100vw",
          }}>
            {/*GRAPH 2 */}
            <LineChart isDashboard={true} dataToPlot={[plot[1]]} log_linear={displayText} gridValue={gridText} mRight={300} mLeft={240} xLegends={-235} yLegends={150} itemW={10} limitFlag={limitFlag} limitValue={limitGraph} titleGraph={"Parameter Values"} />
          </Box>

        </Box>
      }









    </Box>










  );

  return content

};

export default Transponder;