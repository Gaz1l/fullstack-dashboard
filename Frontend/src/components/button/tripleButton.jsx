//Add, Reset and Submit button when choosing multiple parameters to ask at backend 
//React and MUI component 
import React from 'react';
import { Button } from '@mui/material';


const TripleButton = ({ firstClick, secondClick, thirdClick }) => {


  return (
    <div   >
      <Button onClick={firstClick} variant="contained" size="medium" sx={{ marginRight: "0.25vw" }} >
        Add
      </Button>
      <Button onClick={secondClick} variant="contained" size="medium" sx={{ marginRight: "0.25vw" }}>
        Reset
      </Button>
      <Button onClick={thirdClick} variant="contained" size="medium" sx={{ marginRight: "0.25vw" }}>
        Submit
      </Button>
    </div>

  );
};

export default TripleButton