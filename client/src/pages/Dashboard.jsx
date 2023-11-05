import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import Typography from '@mui/material/Typography';
import "../Devices.css"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DeviceChart from '../components/Charts/DevicesChart';
import DeviceStatusChart from '../components/Charts/DeviceStatus';
import DeviceDistributionChart from '../components/Charts/DeviceDistributionChrat';
import IDFComplianceChart from '../components/Charts/IDFComplianceChart';
import LicenceInfo from '../components/Charts/LicenceInfo';
import IDFInfo from '../components/Charts/IDFInfo';



const Dashboard = () => {
  const [userDataName, setUserDataName] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/check-login", { withCredentials: true });
        if (response.data.loggedIn) {
          setUserDataName(response.data.userName);
        } else {
          setUserDataName('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);



  return (
    <Box sx={{padding: '30px', paddingTop: '70px', backgroundColor: '#d3dce8'}}>
      
      <Typography sx={{fontSize: "30px", paddingBottom: "10px"}}>Welcome back {userDataName}!</Typography>
      
      <Grid container spacing={2}>
        {/* Component 1 */}
        <Grid item xs={12} sm={6} md={5} lg={3} >
          <DeviceChart/>
        </Grid>

        {/* Component 2 */}
        <Grid item xs={12} sm={6} md={5} lg={3}>
          <DeviceDistributionChart/>
        </Grid>

        {/* Component 3 */}
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <DeviceStatusChart/>
        </Grid>

        {/* Component 4 */}
        <Grid item xs={12} sm={6} md={5} lg={3}>
          <IDFComplianceChart/>
        </Grid>

        {/* Component 5 */}
        <Grid item xs={12} sm={6} md={5} lg={5}>
          <IDFInfo/>
        </Grid>

        {/* Component 6 */}
        <Grid item xs={12} sm={6} md={5} lg={3.5}>  
            <LicenceInfo/>
        </Grid>

</Grid>
      
        
      
    </Box>
  );
};
  
export default Dashboard;