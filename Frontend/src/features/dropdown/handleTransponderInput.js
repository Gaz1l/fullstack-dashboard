//whenever a direction is chosen and set, get from backend the parameters list 
async function handleTransponderInputChange(event, name, setTransponderDirection, setTransponderRLOptions, setTransponderPenOptions, setTransponderMarOptions) {

  setTransponderDirection(event);    //sets direction selected

  let fullUrl= process.env.REACT_APP_BASE_URL + "/files/data/network/transponder/" + name + "/"+  event 
  //fetch(`http://localhost:3500/files/data/network/transponder/${name}/${event}`)
  fetch(fullUrl)
    .then(response => response.json())
    .then(data => {

      //sets parameter options received from backend 
      setTransponderRLOptions(data["RL"]);
      setTransponderPenOptions(data["Penalties_dB"]);
      setTransponderMarOptions(data["Margins_dB"]);

    })
    .catch(error => console.error('Error:', error));


};

export { handleTransponderInputChange }