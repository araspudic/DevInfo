import React from "react";
import Axios from "axios";
import Typography from '@mui/material/Typography';
import 'chart.js/auto';
import 'chartjs-plugin-annotation';
import { Doughnut } from 'react-chartjs-2';
import { useState, useEffect, useReducer } from "react";
import Box from '@mui/material/Box';
const DoughnutChart = () => {

  const [DeviceList, setDeviceList] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
  
  useEffect(() => {
    Axios.get("http://localhost:3001/api/devicecharts", { withCredentials: true })
      .then((response) => {
        setDeviceList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const CompliantDevices = DeviceList.filter(device => device.Compliant === true).length;
  const NonCompliantDevices = DeviceList.filter(device => device.Compliant === false).length;
 
  const totalDevices = CompliantDevices + NonCompliantDevices;
  const options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  const data = {
    labels: ['Compliant', 'Non-compliant'],
    datasets: [
      {
        data: [CompliantDevices, NonCompliantDevices],
        backgroundColor: ['#163694', '#662196'],
        hoverBackgroundColor: ['#163694', '#662196'],
      },
      options
    ],
  };
  const [fontSize, setFontSize] = useState(3);
  
  const deviceCount = (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Arial',
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
  // Page refresh if resize window
  const handleResize = () => {
    updateFontSize();
    window.location.reload();
  };
  useEffect(() => {
    updateFontSize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
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
      <Typography className="grey-text" sx={{fontSize: "14px"}}>IMAGE COMPLIANCE</Typography>
      <div style={{ position: 'relative' }}>
      <div> 
      <Doughnut data={data} options={options} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '52%',
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
