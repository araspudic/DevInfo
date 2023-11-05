import React, { useState, useEffect } from 'react';
import "./style.css"
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Axios from "axios";


const LoadingBars = () => { 
  
  const [DeviceList, setDeviceList] = useState([]);
  

  useEffect(() => {
    Axios.get("http://localhost:3001/api/devicecharts", { withCredentials: true })
      .then((response) => {
        setDeviceList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

 
  // Status data bars
  const onlineDevices = DeviceList.filter(device => device.Status === "Online").length;
  const offlineDevices = DeviceList.filter(device => device.Status === "Offline").length;
  const updatingDevices = DeviceList.filter(device => device.Status === "Updating").length;
  const totalDevices = DeviceList.filter(device => device.Status).length;

  const onlinePercentage = ((onlineDevices / totalDevices) * 100).toFixed(0);
  const offlinePercentage = ((offlineDevices / totalDevices) * 100).toFixed(0);
  const updatingPercentage = ((updatingDevices / totalDevices) * 100).toFixed(0);


  const data = {
    statuses: ['Online', 'Offline', 'Updating'],
    percentages: [onlinePercentage, offlinePercentage, updatingPercentage],
    colors: ['#163694', '#c8c5c9', '#662196'],
  };
  // Other data bars
  const compliantDevices = DeviceList.filter(device => device.Compliant === true).length;
  const internalDevices = DeviceList.filter(device => device.NetworkInterface === "Internal").length;
  const externalDevices = DeviceList.filter(device => device.NetworkInterface === "External").length;

  const compliantPercentage = ((compliantDevices / totalDevices) * 100).toFixed(0);
  const internalPercentage = ((internalDevices / totalDevices) * 100).toFixed(0);
  const externalPercentage = ((externalDevices / totalDevices) * 100).toFixed(0);

  const OtherData = {
    statuses: ['Compliant', 'Internal', 'External'],
    percentages: [compliantPercentage, internalPercentage, externalPercentage],
    colors: ['#163694', '#c8c5c9', '#662196'],
  };
  
  return ( 
  <Box 
      sx={{
        backgroundColor: 'white',
        padding: 2, 
        borderRadius: 1.5, 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      }}
    >
    <Typography className="grey-text" sx={{fontSize: "14px", marginBottom: '10px'}}>DEVICE STATUS</Typography>
    <div>
      {data.statuses.map((status, index) => (
        <div key={index}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '80px', color: 'black' }}>{status}</div>
            <div className="bar">
              <div
                className={`fill-bar fill-${status.toLowerCase()}`}
                style={{ width: `${data.percentages[index]}%`}}
              ></div>
            </div>
            <div style={{ marginLeft: '10px', width: '30px', textAlign: 'right'  }}>{data.percentages[index]}%</div>
          </div>
        </div>
      ))}
    <hr></hr>
    {OtherData.statuses.map((status, index) => (
        <div key={index}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '80px', color: 'black' }}>{status}</div>
            <div className="bar">
              <div
                className={`fill-bar fill-${status.toLowerCase()}`}
                style={{ width: `${OtherData.percentages[index]}%`}}
              ></div>
            </div>
            <div style={{ marginLeft: '10px', width: '30px', textAlign: 'right' }}>{OtherData.percentages[index]}%</div>
          </div>
        </div>
      ))}
    </div>
  </Box>
  )
};

export default LoadingBars;