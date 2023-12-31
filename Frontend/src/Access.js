
//React and router imports 
import { useNavigate } from 'react-router-dom'
import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react";

//Validate access to homepage components - valid tokens from log in - persistent login 
const Access = () => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate()


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
              console.error('Unexpected error during token verifier', error);

            }
          }
          // If the refresh is not valid - Forbidden 
          else if (response.status === 403)
            return "Forbidden"
          //Cookie invalid or user does not exist 
          else if (response.status === 401)
            return response.status.json()
        } catch (error) {
          //Other error 
          console.error('Unexpected error during token refresh', error);

        }

      }
      else if (res.status === 403)
      return "Forbidden"
    
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
        else{
          setStatus(false)
          navigate('/')
        }
      } catch (error) {
        // Handle errors 
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call token function immediately

  }, [navigate])

  let content

  //Not valid - redirects to login - WORK on this ! 

   

  //Valid - allows to access page 
    if (status)
    content = <Outlet />


  return content
}

export default Access;

