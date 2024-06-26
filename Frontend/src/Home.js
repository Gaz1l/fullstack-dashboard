//MUI components and Route 
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box';
import { CssBaseline, ThemeProvider } from "@mui/material";

//Contexts 
import { ColorModeContext, useMode, useNav, NavComContext } from "./theme";

//Components 
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import FileManager from "./scenes/filesManagement/index"
import NetworkMap from "./scenes/networkMap/index"
import TransponderData from './scenes/transponderData/index';
import Settings from './scenes/settings';
//import Guide from './scenes/guide';
import Access from './Access';
import ErrorManager from './scenes/errorReporter';

//Homepage routes - dashboard/filemanager/networkmap/transponderdata/settings/guide
function Home() {
  const [theme, colorMode] = useMode();
  const [navMode] = useNav();


  return (


    <ColorModeContext.Provider value={colorMode}>
      <NavComContext.Provider value={navMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/*FULL PAGE BOX */}
          <Box className="app" style={{ overflow: "hidden" }}>
            <Sidebar isSidebar={true} />
            <main className="content" >


              {/*MAIN AREA BOX AND PATHS -                 <Route path="/guide" element={<Guide />} /> */}
              <Box style={{ paddingTop: "5vh", height: "100vh",width: "100%", overflow: "auto" }}>
                <Routes>

                  <Route element={<Access />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/files" element={<FileManager />} />
                    <Route path="/network" element={<NetworkMap />} />
                    <Route path="/transponder" element={<TransponderData />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/error" element={<ErrorManager />} />


                  </Route>

                </Routes>
              </Box>

            </main>
          </Box>

        </ThemeProvider>
      </NavComContext.Provider>
    </ColorModeContext.Provider>

  );
}

export default Home;
