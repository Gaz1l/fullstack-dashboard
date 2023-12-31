//whenever a direction is chosen and set, get from backend the parameters list 
async function handleTransponderInputChange(event, name, setTransponderDirection, setTransponderRLOptions, setTransponderPenOptions, setTransponderMarOptions) {

  setTransponderDirection(event);    //sets direction selected

  let fullUrl = process.env.REACT_APP_BASE_URL + "/files/data/network/transponder/" + name + "/" + event
  //fetch(`http://localhost:3500/files/data/network/transponder/${name}/${event}`)
  fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        // If the response status is OK, proceed with parsing the JSON
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


            // Tries to get data again with new access token 
            try {
              const responses = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                },
              })
              if (responses.ok) {
                // Valid access token and gets data 

                return responses.json();
              }
              //invalid access token - redirects to home page 
              else {
                // Other error 
                alert(responses.status)
                throw new Error("Other error");
              }


            } catch (error) {
              //other errors 
              console.error('Unexpected error during get data', error);

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
        // Other error 
        alert(res.status)
        throw new Error("Other error");
      }
    })
    .then(data => {

      //sets parameter options received from backend 
      setTransponderRLOptions(data["RL"]);
      setTransponderPenOptions(data["Penalties_dB"]);
      setTransponderMarOptions(data["Margins_dB"]);

    })
    .catch(error => console.error('Error:', error));


};

export { handleTransponderInputChange }