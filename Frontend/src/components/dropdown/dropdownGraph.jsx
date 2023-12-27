//Dropdown of graphs displayed to be selected by user in order to perform operation 

//React and MUI component 
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


const DropdownGraphComponent = ({ name, id, value, label, onChange, emptyArray, posts }) => {
  return (
    <FormControl sx={{ marginRight: 1, minWidth: 150 }} size="small">
      <InputLabel id="demo-simple-select-label">{name}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id={id}
        value={value}
        label={label}
        onChange={onChange}
      >
        {!emptyArray &&         //plot of graphs displayed
          posts.map((option, index) => (
            <MenuItem key={index} value={index}>
              {option["nodeName"]} {option["vector"]} {option["parameter"]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};



export default DropdownGraphComponent;