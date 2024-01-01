// react and router imports 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

//MUI Components 
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//Components
import Header from "../../components/Header";

//Login component 
const Login = () => {
  //Inputs 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(false);

  const navigate = useNavigate()



  const handleLogin = async () => {


    try {
      // Send a request to backend to authenticate 
      const response = await fetch(process.env.REACT_APP_BASE_URL + "/auth/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include credentials to allow cookies
      });

      //gets response from backend 
      const data = await response.json();

      //Logged in 
      if (response.ok) {


        alert("Logged In!")
        sessionStorage.setItem('accessToken', data.accessToken);
        navigate('/homepage')
      } else {
        // Error logging in 
        alert(data["message"])
      }
    } catch (error) {
      //Other error 
      alert(error)
    }
  };

  const accessTokenVerify = () => {
    // Check if the user is authenticated - sends access token 
    const reponseGet = fetch(process.env.REACT_APP_BASE_URL + "/auth/verify", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
    }).then(async (res) => {
      //receives response back from backend 

      // Acess token valid
      if (res.ok) {
        return "Valid";
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


            // Check if the user is authenticated - sends new access token 
            try {
              const responses = await fetch(process.env.REACT_APP_BASE_URL + "/auth/verify", {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
              });
              // Acess token valid
              if (responses.ok)

                return "Valid";

              else if (responses.status === 403)
                return "Forbidden"

              else if (responses.status === 401)
                return "Invalid Message"
            } catch (error) {
              // Other Error 
              console.error('Unexpected error during token refresh', error);

            }
          }
          // If the refresh is not valid - Forbidden 
          else if (response.status === 403)
            return "Forbidden"
          //Cookie invalid or user does not exist 
          else if (response.status === 401)
            return response.json()
        } catch (error) {
          //Other error 
          console.error('Unexpected error during token refresh', error);

        }

      }

      else if (res.status === 401)
        return "Invalid Message"





      else {
        // Other error 
        console.log("Other error:", res.status);
        throw new Error("Other error");
      }
    })

    //Return final status - if it is valid, forbidden or other specific error due to message/cookies
    return reponseGet;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Checks if token is valid 
        const State = await accessTokenVerify();

        //Valid 
        if (State === "Valid")
          setStatus(true)

        //Not valid 
        else
          setStatus(false)

      } catch (error) {
        // Handle errors 
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call token function immediately

  }, [])

  //already logged in - persistent login 
  if (status) {
    navigate('/homepage')
  }
  //Not already logged in 
  else {
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
          gridTemplateRows: 'repeat(5, 0.2fr)',


        }} >
          {/*row one - header */}
          <Box sx={{
            display: "flex",
            justifyContent: "center"

          }} >
            {/* HEADER */}
            <Header title="DASHBOARD" subtitle="Login Into Application" />
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

          {/*row four - sign up new account */}
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            margin: "1vh"

          }} >
            <Link to="/signup" >
              Sign Up
            </Link>
          </Box>


          {/*row five - login button */}
          <Box sx={{
            display: "flex",
            justifyContent: "center"

          }} >

            <Button onClick={handleLogin}
              margin="-1vh"
              variant="contained" size="small" >
              Login
            </Button>


          </Box>
        </Box>

      </Box>




    );
  };
}

export default Login;