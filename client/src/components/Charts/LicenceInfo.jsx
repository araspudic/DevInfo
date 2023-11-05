import React from "react";
import Axios from "axios";
import "./style.css"
import Typography from '@mui/material/Typography';
import 'chart.js/auto';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";


const ExpiringDevicesBox = () => {
  const [data, setdata] = useState([]);
  

  useEffect(() => {
    Axios.get("http://localhost:3001/api/devicecharts", { withCredentials: true })
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Usage of Licences
  const licenseCounts = {};
  data.forEach((item) => {
    const licenseName = item.LicencaName;
    if (licenseCounts[licenseName]) {
      licenseCounts[licenseName]++;
    } else {
      licenseCounts[licenseName] = 1;
    }
  });
  
  // Licences sort
  const sortedLicenses = Object.entries(licenseCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);

  // Threshold - real time date
  const today = new Date();
  const thresholdDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  // Filter devices that are expiring soon
  const expiringDevices = data
  .filter((device) => {
    const validityDate = new Date(device.Validity);
    return validityDate >= thresholdDate; // Keep only devices with future validity dates
  })
  .sort((a, b) => {
    const validityDateA = new Date(a.Validity);
    const validityDateB = new Date(b.Validity);
    return validityDateA - validityDateB; 
  })
  .slice(0, 3);

  

  // Format the information for expiring devices
  const expiringDeviceInfo = expiringDevices.map((device) => {
    const validityDate = new Date(device.Validity);
    const month = validityDate.toLocaleString('default', { month: 'long' });
    const year = validityDate.getFullYear();
    return `${device.Name} ${month} ${year}`;
  });

  // If there are no expiring devices
  if (expiringDeviceInfo.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: '#163694',
          padding: 2, 
          borderRadius: 3, 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}   
      >
        <Typography className="grey-text" sx={{fontSize: "14px", marginBottom: '10px', color: 'white'}}>LICENCE INFROMATION</Typography>
        <Typography sx={{color: 'white', marginBottom: '5px'}} variant="h6">Expires:</Typography>
        <Typography sx={{color: 'white'}}>No devices expiring soon.</Typography>
      </Box>
    );
  }

  // else
  return (
    <Box
      sx={{
        backgroundColor: '#163694',
        padding: 2,
        borderRadius: 1.5,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontSize: '13px',
        height: 'auto'
      }}
    >
      <Typography className="grey-text" sx={{fontSize: "14px", marginBottom: '10px', color: 'white'}}>LICENCE INFROMATION</Typography>
      <Typography sx={{ color: 'white', marginBottom: '5px', fontSize: '14px' }}>Expires:</Typography>
      {expiringDevices.map((device) => (
        <div key={device.deviceID}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px',
              
            }}
          >
            <div style={{ color: 'white' }}>
              {device.Name} 
            </div>           
            <div style={{ color: 'white', marginLeft: '10px', textAlign: 'right' }}>
              {new Date(device.Validity).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      ))}
      <hr></hr>
      <Typography sx={{ color: 'white', marginBottom: '5px', fontSize: '14px' }}>Licences in use:</Typography>
      {sortedLicenses.map(([licenseName, count], index) => (
        <Typography key={index} sx={{color: 'white', fontSize: '13px'}}>
          {licenseName}
          <span style={{ float: 'right', color: 'white' }}>{count}</span>
        </Typography>
      ))}
    </Box>
  );
};

export default ExpiringDevicesBox;
