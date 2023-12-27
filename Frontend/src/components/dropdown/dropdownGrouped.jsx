//Dropdown of parameter options received from db and sets parameter selected 

//React and MUI component 
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, ListSubheader } from '@mui/material';

const DropdownGroupedComponent = ({ name, id, value, label, onChange, posts }) => {
  return (
    <FormControl sx={{ marginRight: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-simple-select-label">{name}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id={id}
        value={value}
        label={label}
        onChange={onChange}
      >
        <ListSubheader>RX</ListSubheader>
        {posts[0].map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}

        <ListSubheader>Penalties_dB</ListSubheader>
        {posts[1].map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}

        <ListSubheader>Margins_dB</ListSubheader>
        {posts[2].map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownGroupedComponent