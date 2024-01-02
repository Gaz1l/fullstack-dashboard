//Components
import Header from '../../components/Header';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
//Contexts
import { useState } from 'react';
//Icons



const ErrorManager = () => {

    const [reportMessage, setreportMessage] = useState('');



    const handleSubmit = async () => {

        console.log(reportMessage)
        try {
            // Send a request to backend to create request 
            await fetch(process.env.REACT_APP_BASE_URL + "/report/", {
                method: 'POST',
                body: JSON.stringify({ reportMessage }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
            })
                .then(async (res) => {

                    if (!res.ok) {

                        //Access token invalid - Forbidden
                        if (res.status === 403) {

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


                                    // Tries to get data again with new access token 
                                    try {
                                        const responses = await fetch(process.env.REACT_APP_BASE_URL + "/report/", {
                                            method: 'POST',
                                            body: JSON.stringify({ reportMessage }),
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                                            },
                                        })
                                        if (responses.ok) {
                                            // Valid access token and gets data 
                                            alert("Report Uploaded Successfully!")
                                        }
                                        else {
                                            const data = await response.json();
                                            //Error submiting report 
                                            alert(data["message"])
                                        }


                                    } catch (error) {
                                        //other errors 
                                        console.error('Unexpected error during report upload', error);

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

                        else {
                            // Error submiting 
                            const data = await res.json();
                            alert(data["message"])
                        }

                    }
                    else
                        alert("Report Uploaded Successfully!")
                })

        } catch (error) {
            //Other error 
            alert(error)
        }
    };

    /*MAIN BOX - CONTAINS ALL REPORT SUBMITION COMPONENTS */
    return (

        <Box sx={{
            ml: "2vw",
            overflow: "hidden"
        }} >


            {/* HEADER */}
            <Header title="Report Error" subtitle="Give your feedback" />

            {/*ONE COLUMN GRID BOX - COINTAINING REPORT INPUT AND SUBMIT BUTTON*/}

            <Box sx={{
                width: "50%",
                display: "grid"
            }} >
                <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Error"
                    type="text"
                    multiline
                    rows={10}
                    columns={100}
                    value={reportMessage}
                    onChange={(e) => setreportMessage(e.target.value)}
                />
                <Box sx={{
                    paddingTop: "1vh",
                    display: "flex"
                }} >
                    <Button
                        onClick={handleSubmit}
                        variant="contained" size="medium" >
                        Submit Error
                    </Button>
                </Box>
            </Box>


        </Box>








    )


}


export default ErrorManager