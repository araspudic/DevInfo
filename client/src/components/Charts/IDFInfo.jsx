import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import Axios from "axios";
import Typography from '@mui/material/Typography';

const IDFInfo = () => {
  
    const [Devices, setDevices] = useState([]);
  

    useEffect(() => {
        Axios.get("http://localhost:3001/api/devicecharts", { withCredentials: true })
        .then((response) => {
            setDevices(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    
    const idfNameCounts = {};

    Devices.forEach(item => {
    const idfName = item.IDFName;
    idfNameCounts[idfName] = (idfNameCounts[idfName] || 0) + 1;
    });

    // Sort IDFNames 
    const sortedIDFNames = Object.keys(idfNameCounts).sort((a, b) => idfNameCounts[b] - idfNameCounts[a]);

    // Top 4 IDFNames 
    const top4IDFNames = sortedIDFNames.slice(0, 4);
    const top4Counts = top4IDFNames.map(idfName => idfNameCounts[idfName]);

  const data = {
    labels: top4IDFNames,
    datasets: [
      {
        label: 'Devices',
        data: top4Counts, 
        backgroundColor: [
          '#163694',
          '#662196',
          '#82a5bd',
          '#c8c5c9',
        ],
        borderColor: [
          '#163694',
          '#662196',
          '#82a5bd',
          '#c8c5c9',
        ],
        borderWidth: 1,
      },
    ],
  };

   const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        display: false,
        
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box 
      sx={{
        backgroundColor: 'white',
        padding: 1.9, 
        borderRadius: 1.5, 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}
    >
      <Typography className="grey-text" sx={{fontSize: "14px", paddingBottom: '20px'}}>IMAGE INFO</Typography>
      <div style={{ position: 'relative' }}>
      <div>
      <Bar data={data} options={options} />
      </div>
      </div>
    </Box>
  );
};

export default IDFInfo;
