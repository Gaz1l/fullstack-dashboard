//Components and Route 
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box';
import { CssBaseline, ThemeProvider } from "@mui/material";

//Contexts - theme and nav mode 
import { ColorModeContext, useMode, useNav, NavComContext } from "./theme";

//Components 
import Logout from './scenes/logout';
import Login from './scenes/login/index'
import Home from './Home';
import Signup from './scenes/signup';

//App routes - homepage/login/logout/signup 
function App() {
  const [theme, colorMode] = useMode();
  const [navMode] = useNav();

  return (


    <ColorModeContext.Provider value={colorMode}>
      <NavComContext.Provider value={navMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/*FULL PAGE BOX */}
          <Box className="app" style={{ overflow: "hidden" }}>

            <main className="content" >

              {/*MAIN AREA BOX AND PATHS*/}
              <Box style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
                <Routes >
                  <Route path="/" element={<Login />} />
                  <Route path="/homepage/*" element={<Home />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </Box>

            </main>
          </Box>

        </ThemeProvider>
      </NavComContext.Provider>
    </ColorModeContext.Provider>

  );
}

export default App;
