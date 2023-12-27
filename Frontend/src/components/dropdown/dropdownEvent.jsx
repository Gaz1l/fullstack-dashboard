//Dropdown of nws names received from db and takes option selected as value 

//React and MUI component 
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const DropdownEventComponent = ({ name, id, value, label, onChange, posts }) => {
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
        {        //plot nw names received and takes option selected as value 
          posts.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default DropdownEventComponent