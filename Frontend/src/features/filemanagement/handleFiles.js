//sets id of selected network to be deleted 
function handleName(event, setName) {
  setName(event.target.value);
};

//Set to the file selected to upload in the upload box to be uploaded  
function handleFileChange(event, setSelectedFile) {
  setSelectedFile(event.target.files[0]);
};


//function to upload file to db using POST method 
async function handleFileUpload(selectedFile, setUpdateFlag) {


  let fileExtension
  let lastDotIndex

  //Get file selected 
  const formData = new FormData();
  formData.append('file', selectedFile);

  //Get file extension 
  if (selectedFile !== null && selectedFile !== undefined) {
    lastDotIndex = selectedFile.name.lastIndexOf('.');
    fileExtension = selectedFile.name.slice(lastDotIndex + 1).toLowerCase();
  }


  // Check if the file extension is JSON or if there is a file selected
  if (selectedFile === null || selectedFile === undefined) {
    console.error('No File Selected');
    alert('No File Selected');

  }
  else if (fileExtension !== 'json') {
    console.error('Invalid file format. Please choose a JSON file.');
    alert('Invalid file format. Please choose a JSON file.');
  }
  else {

    //valid file uploaded with POST method to db 

    fetch(process.env.REACT_APP_BASE_URL + "/files/", {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
    })
      .then(async (res) => {

        if (!res.ok) {
          //Error nmessage defined 
          if (res.status === 409) {
            //Duplicate error 
            throw new Error('File Already Exists');
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
                  const responses = await fetch(process.env.REACT_APP_BASE_URL + "/files/", {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                  })
                  if (responses.ok) {
                    // Valid access token and gets data 
                    alert("File Uploaded Successfully!")
                  }
                  else if (responses.status === 409) {
                    //Duplicate error 
                    alert("File Already Exists")
                    throw new Error('File Already Exists');
                  }
                  else if (res.status === 401) {
                    alert("Missing Data")
                    throw new Error("Missing Data");
                  }
                  else {
                    // Other error 
                    alert(responses.status)
                    throw new Error("Other error");
                  }


                } catch (error) {
                  //other errors 
                  console.error('Unexpected error during file upload', error);

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
          else if (res.status === 401) {
            alert("Missing Data")
            throw new Error("Missing Data");
          }
          else {
            // Other error 
            alert(res.status)
            throw new Error("Other error");
          }

        }
        else
          alert("File Uploaded Successfully!")
      })
      .catch(error => {
        //Error alert 
        console.error(error);
        alert(error);
      })
      .finally(() => {
        //update flag 
        setUpdateFlag(true);
      });

  }
};

//function to delete file from db using DELETE method 
async function handleDelete(name, setName, setUpdateFlag) {


  //no file selected alert
  if (name === "") {
    alert('No File Selected');
  }
  else {

    //delete method to url 
    const url = process.env.REACT_APP_BASE_URL + "/files/data/delete/" + name + "/"
    //const url = `http://localhost:3500/files/data/delete/${name}/`;

    fetch(url, {
      method: 'DELETE',
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
                const responses = await fetch(url, {
                  method: 'DELETE',
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
                console.error('Unexpected error during delete file', error);

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
        // Handle success
        console.log('Delete successful:', data);
        setName("")

        // Display success message with alert
        alert('File deleted successfully!');

        setUpdateFlag(true)


      })
      .catch(error => {
        //Error deleting 
        console.error(error);
        // Display error message with alert
        alert('Error deleting file. Please try again.');

      });


  }
}


export { handleName, handleFileChange, handleFileUpload, handleDelete }