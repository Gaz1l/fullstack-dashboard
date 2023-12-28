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
        })
            .then(response => {

                if (!response.ok) {
                    //Error nmessage defined 
                    if (response.status === 409) {
                        //Duplicate error 
                        throw new Error('File Already Exists');
                    }
                    else {
                        // Handle other non-OK responses
                        throw new Error('Network response was not ok');
                    }

                }
                return response.json();
            })
            .then(data => {
                //Success upload alert 
                console.log('File uploaded successfully:', data.message);
                alert('File uploaded successfully!');

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
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response body as JSON
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