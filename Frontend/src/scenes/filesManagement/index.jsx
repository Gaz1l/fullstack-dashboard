//React components 
import * as React from 'react';
import { useState, useEffect } from 'react';

//Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

//MUI Components 
import { Box, Button, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Components 
import Header from "../../components/Header";

//Handlers
import { handleName, handleFileChange, handleFileUpload, handleDelete } from "../../features/filemanagement/handleFiles";

//Router imports 
import { useNavigate } from 'react-router-dom'

const FileManager = () => {

  const [name, setName] = React.useState('');           //id nw selected on dropdown
  const [updateFlag, setUpdateFlag] = useState(false);    //update flag - delete or upload 
  const [selectedFile, setSelectedFile] = useState(null);   //selected file on dropdown to upload 
  const [networks, setNetworks] = useState([]);           //array with names of nws in db
  const [emptyArray, setEmptyArray] = useState(true);     //flag of no files in db 

  const navigate = useNavigate()

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


              // Tries to get files again with new access token 
              try {
                const responses = await fetch(process.env.REACT_APP_BASE_URL + "/files/", {
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
                //Empty array - no networks in the db 
                else if (responses.status === 400)
                  return [];

                else {
                  // Other error 
                  alert(responses.status)
                  throw new Error("Other error");
                }



              } catch (error) {
                //other errors 
                console.error('Unexpected error during get files', error);

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
        //Empty array - no networks in the db 
        else if (res.status === 400)
          return [];

        else {
          // Other error 
          alert(res.status)
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
  }, [updateFlag, navigate]);


  return (

    /*MAIN BOX - CONTAINS ALL FILE MANAGEMENT COMPONENTS */

    <Box sx={{
      ml: "2vw",
      overflow: "hidden"
    }} >


      {/* HEADER */}
      <Header title="File Management" subtitle="Upload and Delete Network Files" />



      {/* FIRST ROW - DELETE FILE */}

      <Box sx={{ display: 'flex', alignItems: 'stretch', marginTop: '1vh' }}>

        {/* FILE DROPDOWN - sets id of nw selected in name */}
        <FormControl sx={{ marginRight: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-label">File Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="networkDropdown"
            value={name}  //id da rede 
            label="FileName"
            onChange={(event) => handleName(event, setName)}
          >

            {!emptyArray &&         //plot aos nomes das redes recebidos 
              networks.map((option, index) => (
                <MenuItem key={index} value={option["_id"]}>
                  {option["network"]}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {/* DELETE BUTTON */}
        <Button onClick={() => handleDelete(name, setName, setUpdateFlag)} variant="contained" size="medium" startIcon={<DeleteIcon />}>
          Delete
        </Button>


      </Box>






      {/* SECOND ROW - UPLOAD FILE */}
      <Box sx={{ display: 'flex', alignItems: 'stretch', marginTop: '1vh' }}>

        {/* SELECT FILE -  sets file selected to upload*/}
        <TextField sx={{ marginRight: 1, marginTop: 1, minWidth: 120 }}
          type="file"
          onChange={(event) => handleFileChange(event, setSelectedFile)}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />

        {/* UPLOAD BUTTON */}

        <Button sx={{ marginTop: 1 }} onClick={() => handleFileUpload(selectedFile, setUpdateFlag)} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file

        </Button>





      </Box>

    </Box>








  )


}


export default FileManager






















