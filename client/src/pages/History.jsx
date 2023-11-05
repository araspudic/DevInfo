import React from "react";
import { useState, useEffect, useReducer } from "react";
import Axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import "../Devices.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PageTransition from "../components/PageTransition";

function User() {
  const [HistoryList, setHistoryList] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

  // Page transition
  const [showTransition, setShowTransition] = useState(true);
  useEffect(() => {
    const delay = setTimeout(() => {
      setShowTransition(false);
      clearTimeout(delay);
    }, 2000);
  }, []);

  

  //Read - device rows
  const rows = HistoryList.map((row)=>({
    ID: row.ID,
    DeviceID: row.DeviceID,
    DeviceName: row.DeviceName,
    Action: row.Action,
    Executed_by: row.Executed_by,
    Date: row.Date
  }))

  // User list columns
  const columns = [
    { field: 'ID', headerName: 'ID', width: 100 },
    { field: 'DeviceID', headerName: 'Device ID', width: 100 },
    { field: 'DeviceName', headerName: 'Device name', width: 120 },
    { field: 'Action', headerName: 'Action', width: 120},
    { field: 'Executed_by', headerName: 'Executed by', width: 130 },
    { field: 'Date', headerName: 'Date', width: 120,
     valueFormatter: (params) => {
      const date = new Date(params.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    },
  ];

  // Device history fetch
  
  useEffect(() => {     
    Axios.get("http://localhost:3001/api/history", { withCredentials: true })
      .then((response) => {
        setHistoryList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [reducerValue]);
  
/// Handle Delete device confirm
const [openDelDev, setopenDelDev] = useState(false);


const handleOpenDelDev = () => {
  setopenDelDev(true);
};

const handleCloseDelDev = () => {
  setopenDelDev(false);
};

//Delete history
const DelHistory = () => {
  Axios.get("http://localhost:3001/api/historydel/", {})
    .then((response) => {
      setopenDelDev(false);
      forceUpdate();
      setOpenNoti(true);
    })
    
};
/// Notification
const [openNoti, setOpenNoti] = useState(false);
  const handleNoti = () => {
    setOpenNoti(true);
  };
  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  
  return (
    <Box sx={{ width: '90%', padding: '30px', paddingTop: '100px', overflow: 'auto', backgroundColor: '#d3dce8'}}>      
        <Box className="App"
          >
            {showTransition && <PageTransition />}
            {!showTransition}
        </Box>     
        <div>
          <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={() => handleOpenDelDev()} variant="contained">EMPTY HISTORY</Button>
        </div>

        <div>
          <Snackbar 
            open={openNoti} 
            autoHideDuration={3000} 
            onClose={handleCloseNoti}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            >
            <Alert severity="success" onClose={handleCloseNoti}>
              Action completed successfully!
            </Alert>
          </Snackbar>
      </div>
        
        <Box sx={{backgroundColor: 'white', height: '600px', width: 'auto'}} >        
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.ID}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            slotProps={{
              toolbar: {
                  showQuickFilter: true
               }
            }}
            localeText={{ noRowsLabel: "No device history found." }}
          />
           </Box>

          {openDelDev && ( // DEL DEVICE
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE HISTORY</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton variant="contained" onClick={handleCloseDelDev}>
                            <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                    </Box>
                    <Box className="select-container">
                          <div>
                          <Typography>
                            Are you sure you want to delete device history?
                          </Typography>                     
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelHistory()}>
                            Confirm
                          </Button>
                          <Button variant="contained" onClick={handleCloseDelDev}>
                            Close
                          </Button>
                          </div>
                    </Box>
                    </div>
                    </div>
        )}


    </Box>
  );
}

export default User;
