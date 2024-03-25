//React components 
import * as React from 'react';
import { useState, useEffect } from 'react';

//Theme/Styles 
import "vis-network/styles/vis-network.css";

//MUI Components 
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { PopupBody } from '../features/popup/popUpBody';

//Components
import Header from "../components/Header";
import GraphView from "./networkGraph";

//Dropdown Components 
import DropdownNetworkComponent from "../components/dropdown/dropdownNetwork";
import DropdownEventComponent from "../components/dropdown/dropdownEvent";

//Handlers
import { handleSubmitMap } from "../features/networkmap/handleMapClicks";
import { handlePopUpNetworkBox } from "../features/popup/handlePopUp";

//Data conversor 
import { convertMapData } from "../data/dataConversor";





const Network = () => {

  //Use effect
  const [networks, setNetworks] = useState([]);          //array with ids and names of nws in db

  //First dropdowns options 
  const [name, setName] = useState('');           //dropdown selected nw id 
  const [nodesPerRow, setNodesPerRow] = useState('');   //nodes per row selected
  const [selectedDirectionOption, setSelectedDirectionOption] = useState(''); //dropdown selected direction 

  const [isLoadingMap, setIsLoadingMap] = useState(true);       //loading/submiting flag 
  const [updateFlag, setUpdateFlag] = useState(false);    //update flag - delete or upload 
  const [emptyArray, setEmptyArray] = useState(true);     //no files in db flag 




  //mapping of the network - node name, static info and node type 
  const [mapToPlot, setMapToPlot] = useState([]);
  const [labelPlot, setLabelPlot] = useState([]);
  const [nodeType, setNodeType] = useState([]);
  let mapPlot = []


  //popup error - network  
  const [textPop, setTextPop] = useState("");
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;










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
        if (data.length !== 0 && data.length !== undefined) {


          setEmptyArray(false)
        }
        else
          setEmptyArray(true)

        //Reset update flag 
        setUpdateFlag(false)

      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [updateFlag]);




  if (!isLoadingMap) {  //when submitting 

    mapPlot = convertMapData(mapToPlot, labelPlot, nodeType, nodesPerRow)    //data conversion to required and requested map format


  }


  let content = (


    /*MAIN BOX - CONTAINS ALL NETWORK MAP COMPONENTS */
    <Box sx={{
      ml: "2vw",
      mr: "1vw",
      overflow: "hidden"
    }} >


      {/* HEADER */}
      <Header title="Network Map" subtitle="Visualize and Filter Data" />



      {/*FLEX BOX WITH DROPDOWNS, BUTTONS AND POPUP*/}
      <Box sx={{

        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '2vh'

      }}>

        {/* FILE DROPDOWN-sets id of nw selected in name */}
        <DropdownNetworkComponent name="Filename" id="networkDropdown" value={name} label="FileName"
          onChange={(e) => setName(e.target.value)} emptyArray={emptyArray} posts={networks} />

        {/* DIRECTION DROPDOWN - sets selected direction in selectedDirectionOption  */}
        <DropdownEventComponent name="Direction" id="directionDropdown" value={selectedDirectionOption} label="Direction" onChange={(e) => setSelectedDirectionOption(e.target.value)} posts={["Forward", "Backward"]} />

        {/* NODES PER ROW INPUT - sets nodes per row variable   */}
        <Box sx={{


          marginRight: '0.5vw'

        }}>
          <TextField
            label="Nodes Per Row"
            variant="outlined"
            size="small"
            type="number"
            value={nodesPerRow}
            onChange={(e) => setNodesPerRow(e.target.value)}

          />
        </Box>


        {/* SUBMIT BUTTON- asks backend for map and saves in MapToPlot, LabelPlot and Nodetype to then be converted,
        while displaying errors with popup*/}
        <Button onClick={(event) => handlePopUpNetworkBox(event, name, selectedDirectionOption, nodesPerRow, setTextPop, setIsLoadingMap, setAnchor, handleSubmitMap, setLabelPlot, setNodeType, setMapToPlot)}
          variant="contained" size="medium" >
          Submit
        </Button>

        {/* POPUP ERROR MESSAGE */}
        <BasePopup id={id} open={open} anchor={anchor} placement={"right"}>
          <PopupBody>  <Box style={{ marginLeft: '1vw', marginRight: '1vw' }}>{textPop}</Box> </PopupBody>
        </BasePopup>


      </Box>












      {!isLoadingMap &&
        //Node Map Creation 
        <GraphView mapPlot={mapPlot} filename={name} direction={selectedDirectionOption} nodesPerRow={nodesPerRow} />
      }


    </Box>


  );



  return content

};

export default Network;