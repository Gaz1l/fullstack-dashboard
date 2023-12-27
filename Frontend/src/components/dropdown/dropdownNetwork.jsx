//Dropdown of nws names received from db and takes id as value 

//React and MUI components
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const DropdownNetworkComponent = ({ name, id, value, label, onChange, emptyArray, posts }) => {
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
        {!emptyArray &&         //plots names of received nws and takes id as value 
          posts.map((option, index) => (
            <MenuItem key={index} value={option["_id"]}>
              {option["network"]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default DropdownNetworkComponent;