import React from "react";
import Axios from "axios";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { useState, useEffect, useReducer } from "react";

const DoughnutChart = () => {
  const [DeviceList, setDeviceList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/device", { withCredentials: true })
      .then((response) => {
        setDeviceList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const onlineDevices = DeviceList.filter(device => device.Status === "Online").length;
  const offlineDevices = DeviceList.filter(device => device.Status === "Offline").length;
  const updatingDevices = DeviceList.filter(device => device.Status === "Updating").length;
  
  const totalDevices = onlineDevices + offlineDevices + updatingDevices;

  const options = {
    plugins: {
      annotation: {
        annotations: {
          label1: {
            type: 'label',
            xValue: 2.5,
            yValue: 60,
            backgroundColor: 'red',
            display: true,
            content: "This is my text",
            font: {
              size: 18
            },
          },
        },
      },
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  const data = {
    labels: ['Online', 'Offline', 'Updating'],
    datasets: [
      {
        data: [onlineDevices, offlineDevices, updatingDevices],
        backgroundColor: ['#163694', '#c8c5c9', '#662196'],
        hoverBackgroundColor: ['#163694', '#c8c5c9', '#662196'],
  
      },
      options
    ],
  };

  const [fontSize, setFontSize] = useState(3);

  const deviceCount = (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: `${fontSize}px`,
      }}
    >
      <span style={{ color: '#666' }}>Total</span><br />
      <span>{totalDevices}</span> <span style={{ color: 'black' }}>{totalDevices === 1 ? 'device' : 'devices'}</span>
    </div>
  );

  
  const updateFontSize = () => {
    const container = document.getElementById('doughnut-container');
    if (container) {
      const containerWidth = container.offsetWidth;
      const newFontSize = containerWidth / 15; 
      setFontSize(newFontSize);
    }
  };

  
  useEffect(() => {
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, []);

  return (
  
        <Box 
          sx={{
            backgroundColor: 'white',
            padding: 2, 
            borderRadius: 1.5, 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            
          }}
        >
            <Typography className="grey-text" sx={{fontSize: "14px"}}>DEVICES</Typography>
            <div style={{ position: 'relative' }}>
              <div>
              <Doughnut data={data} options={options} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
              {deviceCount}
              </div>
        </div>
        </Box>
  )
};

export default DoughnutChart;