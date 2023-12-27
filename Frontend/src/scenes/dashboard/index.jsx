//Components 
import Transponder from "../../components/transponderBox";
import Network from '../../components/networkBox';

//React components 
import Box from '@mui/material/Box';

const Dashboard = () => {

  /*DASHBOARD - MAIN PAGE BOX*/
  return (

    <Box style={{ height: "100vh", width: "95vw" }}>

      <Network />

      {/*SPACING BETWEEN COMPONENTS */}
      <Box style={{ height: "3vh" }}></Box>

      <Transponder />

    </Box>
  );
};


export default Dashboard
