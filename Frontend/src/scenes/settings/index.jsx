//Components
import Header from '../../components/Header';
import { useContext } from "react";
import Box from '@mui/material/Box';
import { Typography, IconButton, useTheme } from "@mui/material";

//Contexts
import { ColorModeContext, NavComContext } from "../../theme";

//Icons
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const Settings = () => {

  //Get contexts for global settings 
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navMode = useContext(NavComContext);


  /* PAGE BOX CONTAINING HEADER AND GRID BOX WITH SETTINGS */
  return (

    <Box sx={{
      ml: "2vw",
      overflow: "hidden"
    }} >



      <Header title="Settings" subtitle="Manage Your Preferences" />


      {/* GRID BOX WITH TWO COLUMNS CONTAINING SETTINGS */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 0.15fr)",
        overflow: "hidden"
      }} >



        {/* FIRST ROW - Theme Mode */}
        <Box> <Typography
          variant="h5"
          fontWeight="bold"
        >
          {"Theme Mode"}

        </Typography>
        </Box>

        {/* FIRST ROW - Theme Mode Button */}
        <Box>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>

        {/* SECOND ROW - Navigation Mode */}
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            {"Navigation Commands"}
          </Typography>
        </Box>


        {/* SECOND ROW - Navigation Mode Button*/}
        <Box>
          <IconButton onClick={navMode.toggleNavCom}>
            {navMode.mode === "off" ? (
              <ClearIcon />
            ) : (
              <CheckIcon />
            )}
          </IconButton>



        </Box>



      </Box>





    </Box>








  )


}


export default Settings