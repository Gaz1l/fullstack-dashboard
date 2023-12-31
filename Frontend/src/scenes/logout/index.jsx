//React and router imports 
import { useNavigate } from 'react-router-dom'
import {  useEffect } from "react";

//component to handle logout click 
const Logout = () => {


  const navigate = useNavigate()



  useEffect(() => {
    const fetchData = async () => {
      try {
        //sends request to logout endpoint to delete cookie and tokens 
         await fetch(process.env.REACT_APP_BASE_URL + "/auth/logout", {
          method: 'GET',
          credentials: 'include', // Include credentials to send cookies
        }).then(async (res) => {

          if (res.ok) {
            // Logout successfull and cookie deleted 
            // Delete access token and return valid message 
            //Redirects to login 
            sessionStorage.removeItem('accessToken');
            alert("Logged Out!")
            navigate('/')
          }
          //Error logging out message
          else
          alert("Error Logout")
        })

     
      } catch (error) {
        //other errors 
        console.error('Error fetching data:', error);
        alert(error)
      }


    };

    fetchData(); // Call the logout function immediately


  }, [navigate])




}

export default Logout;