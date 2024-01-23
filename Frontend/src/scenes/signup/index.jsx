// react imports 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//MUI Components 
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//Components
import Header from "../../components/Header";

//Router imports 
import { useNavigate } from 'react-router-dom'

//Sign up page to create new account 
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const navigate = useNavigate()



  const handleCreate = async () => {
    //Send data to backend to create account 
    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL + "/users/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, code }),
      });
      //gets response from backend 
      const data = await response.json();

      //account created - redirects to login 
      if (response.ok) {



        alert(data["message"])
        navigate('/')
      }

      //account not created - alert with error 
      else
        alert(data["message"])

    } catch (error) {
      //Other error 
      alert(error)
    }
  };




  return (

    //Grid box 3x3 
    <Box sx={{

      margin: "-2vh",
      height: "95vh",
      width: "95vw",
      display: "grid",
      gridTemplateRows: 'repeat(3, 1fr)',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateAreas: `". . ."
        ". login ."
        ". . ."`,

    }} >

      {/* Grid box - five rows - for each element centered  */}
      <Box sx={{
        gridArea: 'login',
        display: "grid",
        gridTemplateRows: 'repeat(5, 0.25fr)',


      }} >

        {/*row one - header */}
        <Box sx={{
          display: "flex",
          justifyContent: "center"

        }} >
          {/* HEADER */}
          <Header title="DASHBOARD" subtitle="Create An Account" />
        </Box>



        {/*row two - username input */}
        <Box sx={{
          display: "flex",
          justifyContent: "center"

        }} >
          <TextField

            label="UserName"
            variant="outlined"
            size="small"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}


          />
        </Box>

        {/*row three - password input */}
        <Box sx={{
          display: "flex",
          justifyContent: "center",

        }} >

          <TextField
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </Box>

        {/*row four - validation code input */}

        <Box sx={{
          display: "flex",
          justifyContent: "center",

        }} >

          <TextField
            label="Code"
            variant="outlined"
            size="small"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}

          />
        </Box>
          {/*row five - back to login */}
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            margin: "1vh"

          }} >
            <Link to="/" >
              Back To Login
            </Link>
          </Box>
        {/*row six - create account button */}

        <Box sx={{
          display: "flex",
          justifyContent: "center"

        }} >

          <Button onClick={handleCreate}
            margin="-1vh"
            variant="contained" size="small" >
            Create Account
          </Button>


        </Box>
      </Box>

    </Box>




  );
};

export default Signup;