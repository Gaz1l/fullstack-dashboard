//MUI and react components
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

//Styles/theme
import { tokens } from "../../theme";
import "react-pro-sidebar/dist/css/styles.css";

//Icons 
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MapIcon from '@mui/icons-material/Map';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import FeedbackIcon from '@mui/icons-material/Feedback';

//Sidebar item 
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

//Sidebar
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");


  //Sidebar item animations 
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      {/* Sidebar column */}
      <div style={{ flexDirection: "column", minHeight: "0", display: "flex", height: "100%" }}>


        <div className='sidebar' style={{ position: "relative", height: "100%", width: "100%" }}>
          <ProSidebar collapsed={isCollapsed} >
            <Menu iconShape="square">
              {/* TITLE AND MENU ICON */}
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography variant="h3" color={colors.grey[100]}>
                      DASHBOARD
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              {/*USER IDENTIFICATION*/}
              {!isCollapsed && (
                <Box mb="25px">
                  <Box textAlign="center">
                    <Typography
                      variant="h2"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      Welcome
                    </Typography>
                  </Box>
                </Box>
              )}

              {/*DASHBOARD OPTION*/}
              <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                  title="Dashboard"
                  to="/homepage"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/*FILE MANAGEMENT OPTION*/}
                <Item
                  title="File Management"
                  to="/homepage/files"
                  icon={<UploadFileIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/*NETWORK MAP OPTION*/}
                <Item
                  title="Network Map"
                  to="/homepage/network"
                  icon={<MapIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/*TRANSPONDER DATA OPTION*/}
                <Item
                  title="Transponder Data"
                  to="/homepage/transponder"
                  icon={<QueryStatsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/*SETTINGS OPTION*/}
                <Item

                  title="Settings"
                  to="/homepage/settings"
                  icon={<SettingsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />


                {/*GUIDE OPTION*/}
                <Item
                  title="How To Use"
                  to="/homepage/guide"
                  icon={<HelpCenterIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/*Report Error*/}
                <Item
                  title="Report Error"
                  to="/homepage/error"
                  icon={<FeedbackIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/*LOGOUT OPTION*/}
                <Item
                  title="Logout"
                  to="/logout"
                  icon={<LogoutIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>


            </Menu>
          </ProSidebar>
        </div>
      </div>
    </Box>
  );
};

export default Sidebar;