//Functions to communicate with backend when sending multiple requests 
async function sendGetRequest(url) {


  const getData = await fetch(url, {
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


            // Tries to get data again with new access token 
            try {
              const responses = await fetch(url, {
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


  return getData;
}

async function processURLs(parentArray) {
  let responseData = [];
  for (const url of parentArray) {
    try {
      const data = await sendGetRequest(url);
      responseData.push(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return responseData;
}

export { processURLs }
