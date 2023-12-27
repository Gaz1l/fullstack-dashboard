//Functions to communicate with backend when sending multiple requests 
async function sendGetRequest(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
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