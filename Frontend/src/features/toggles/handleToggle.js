//handlers for toggling betweens button status when plotting the graphs 

//linear or logaritmic scale - grid and values
function toggleText(setDisplayText) {
  setDisplayText((prevDisplayText) =>
    prevDisplayText === "linear" ? "log" : "linear"
  );
};


//split or not two graphs
function toggleSplit(setSplitGraphs) {
  setSplitGraphs((prevDisplayText) =>
    prevDisplayText === "split" ? "unsplit" : "split"
  );
};

//allow or not grid in the graph
function toggleGrid(setGridText) {
  setGridText((prevDisplayText) =>
    prevDisplayText === "grid" ? "no grid" : "grid"
  );
};

//remove selected element from databuffer 
function handleRemoveElement(indexToRemove, setdataBuffer) {
  setdataBuffer((prevData) => prevData.filter((_, index) => index !== indexToRemove));
};

//subtract number 
function toggleUp(setValue,value) {
  setValue(value-10);
};

//add number 
function toggleDown(setValue,value) {
  setValue(value+10);
};

//toggle rounding options 
function toggleRound(setRoundText) {
  setRoundText((prevRoundText) =>
    prevRoundText === "round" ? "no round" : "round"
  );
};

export { toggleText, toggleSplit, toggleGrid, handleRemoveElement,toggleUp,toggleDown,toggleRound }