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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function Network() {
  const [NetList, setNetList] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

  const [userData, setUserData] = useState(null);

  // Page transition
  const [showTransition, setShowTransition] = useState(true);
  useEffect(() => {
    const delay = setTimeout(() => {
      setShowTransition(false);
      clearTimeout(delay);
    }, 2000);
  }, []);

  // Login status 
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/check-login", { withCredentials: true });
        if (response.data.loggedIn) {
          setUserData(response.data.userID);
        } else {
          setUserData('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const [Net, setNet] = useState({
    "networkID": "",
    "NetworkName": "",
    "NetworkType": "",
    "NetworkInterface": "",
    "Speed": ""
  });

  const [UNet, setUNet] = useState({
    "networkID": "",
    "NetworkName": "",
    "NetworkType": "",
    "NetworkInterface": "",
    "Speed": ""
  });

  //Read - network rows
  const rows = NetList.map((row)=>({
    networkID: row.networkID,
    NetworkName: row.NetworkName,
    NetworkType: row.NetworkType,
    NetworkInterface: row.NetworkInterface,
    Speed: row.Speed
    
  }))

  // Network list columns
  const columns = [
    { field: 'networkID', headerName: 'ID', width: 80 },
    { field: 'NetworkName', headerName: 'Name', width: 140 },
    { field: 'NetworkType', headerName: 'Type', width: 100},
    { field: 'NetworkInterface', headerName: 'Interface', width: 100},
    { field: 'Speed', headerName: 'Speed', width: 130 },
    { field: 'Actions', headerName: 'Actions', width: 100,
    sortable: false, renderCell: (params) => (
      <div>    
        <IconButton
          variant="contained"
          onClick={() => handleOpenUpdate(params.row)}
        >
        <EditIcon />
        </IconButton>          
        <IconButton aria-label="Delete" 
        onClick={() => handleOpenDelNet(params.row)}
        >
        <DeleteIcon />
        </IconButton>
      </div>
    ),
    }
  ];

  // Network list fetch
  const fetchNet = () => {
    Axios.get("http://localhost:3001/api/network", { withCredentials: true }).then((response) =>{
        setNetList(response.data)       
    })
    .catch(error =>{
      window.location.href = '/login';
      console.log(error);
    })
  };

  useEffect(() => {
    fetchNet();
  }, [reducerValue]);
  
  const refreshData = () => {
    fetchNet();
  };

  
  /// Handle Delete Network confirm
    const [openDelNet, setopenDelNet] = useState(false);
    const [DelNet, setDelNet] = useState({
      "networkID": "",
      "NetworkName": ""
    });

    const handleOpenDelNet = (row) => {
    setDelNet({... DelNet, networkID: row.networkID, NetworkName: row.NetworkName})
    setopenDelNet(true);
    };

    const handleCloseDelNet = () => {
        setopenDelNet(false);
        setErrorMessageNet('')
        resetClickCount()
        
    };

    //Delete network
    const [errorMessageNet, setErrorMessageNet] = useState('');
    
    const [clickCount, setClickCount] = useState(0);
    

    const resetClickCount = () => {
      setErrorMessageNet('')
      setClickCount(0);
    };

    /// Delete Confirm 
    const DelNetcon = (params) => {
      const id = params;
      setClickCount(clickCount + 1);

      const fetchDeviceData = Axios.get('http://localhost:3001/api/net/devices/' + id);
 
      Promise.all([fetchDeviceData])
            .then(([devData]) => {
                const DataDevice = devData.data

                if(Array.isArray(DataDevice) && DataDevice.length > 0){       
                  setErrorMessageNet('Cannot delete network. Network is in use!')
                }
                else{    
                Axios.get("http://localhost:3001/api/network/" + id, {})
                  .then((response) => {
                    setDelNet({});
                    setopenDelNet(false);
                    setOpenNoti(true);
                    forceUpdate();
                          
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                 });
                }
            })
      
      
      
    };

    // Network Type 
    const NetTypeOptions = [
      { label: 'Wifi 2.4Ghz', value: 1 },
      { label: 'Wifi 5Ghz', value: 2 },
      { label: 'LAN', value: 3 },
     ];

     // Network Interface
     const NetInterfaceOptions = [
      { label: 'Internal', value: 1 },
      { label: 'External', value: 2 },
      { label: 'Reserved', value: 3 },
     ]

    // Add Network popup 
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [errorName, seterrorName] = useState('');

    const togglePopup = () => {
      setPopupOpen(!isPopupOpen);
      
      setErrorMessage('')
      seterrorName('')
      
      setNet({})
      refreshData();
    };

    
    
      
      // Add Network 2nd button
      const [errorMessage, setErrorMessage] = useState('');
      
      const submitForm = () => {
        if (!Net.NetworkName) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (NetList.find(net => net.NetworkName === Net.NetworkName)){
          seterrorName('Name already exists!')
        }     
        else {                    
          Axios.post("http://localhost:3001/api/network", {
            Net: Net           
          }).then(()=> {
            setPopupOpen(togglePopup);
            setOpenNoti(true);
            setNet({});  
            forceUpdate();

          })      
        }       
      };

      
          
    // Update Network   
    const [openUpdate, setOpenUpdate] = useState(false);
    const [oldName, setoldName] = useState('');
    
    const handleOpenUpdate = (row) => {
        setUNet({... UNet, networkID: row.networkID, NetworkName: row.NetworkName, NetworkType: row.NetworkType, NetworkInterface: row.NetworkInterface, Speed: row.Speed})
        setoldName(row.NetworkName)
        setOpenUpdate(true);
        refreshData();

    };


    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setUNet({});
        seterrorName('')
        setoldName('')
        refreshData();
    };

    const CheckNameExist = (name) =>{
      refreshData();
      const nameExists = NetList.some(net => net.NetworkName === name && oldName !== name);     
      return nameExists
    }
   

    /// Notification
    const [openNoti, setOpenNoti] = useState(false);
    const handleCloseNoti = () => {
      setOpenNoti(false);
    };



      /// Update network 2nd button
    const handleUpdate = () => { 
      if (!UNet.NetworkName){
      setErrorMessage('Field cannot be empty.');
      }
      if (CheckNameExist(UNet.NetworkName)){
        seterrorName('Name already exists!');
      } 
      else { 
          const id = UNet.networkID;
          const name = UNet.NetworkName;
          const type = UNet.NetworkType;
          const interf = UNet.NetworkInterface;
          const speed= UNet.Speed;
    
          Axios.patch("http://localhost:3001/api/network/" + id + "/" + name + "/" + type + "/" + interf + "/" + speed , {
          }).then(()=>{
              setUNet({});
              setOpenNoti(true);
              forceUpdate(); 
              handleCloseUpdate();
          })
          .catch((error) => {
              console.error("Error:", error);
          });
      
      }
  };


  return (
    <Box sx={{width: '90%', padding: '30px', paddingTop: '100px', overflow: 'auto', backgroundColor: '#d3dce8'}}>  
              <Box className="App"
                >
                {showTransition && <PageTransition />}
                {!showTransition}
              </Box>    
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


          <div >         
            <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={togglePopup} variant="contained">+ Add Network</Button>         
            {isPopupOpen && ( // ADD Network          
            <Box sx={{zIndex: 1000}} className="popup-container" >           
            <Box className="popup" >
              <Box>
                  <Grid container className="popup-header" justifyContent="space-between">
                    <Grid item>
                      <Typography className="AddDevTitle" variant="body1">ADD NETWORK</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton variant="contained" onClick={togglePopup}>
                      <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
              </Box>
              <Box className="select-container">                                      
                    <FormControl >
                      <TextField                                            
                      label="Network Name" 
                      required
                      name={Net.NetworkName} 
                      onChange={(e)=> setNet({...Net, NetworkName: e.target.value}, setErrorMessage(''))}   
                      error={(true && !!errorMessage && !Net.NetworkName) || (true && !!errorName)}                                      
                      >
                    </TextField>
                    <FormHelperText>{!Net.NetworkName && <div className="err">{errorMessage}</div>}</FormHelperText>
                    <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                    </FormControl>
                    <FormControl>
                    
                    <Autocomplete                
                      label="Select network type"
                      options={NetTypeOptions}
                      disableClearable
                      required
                      renderInput={(params) => <TextField {...params} label="Select network type" error={true && !!errorMessage && !Net.NetworkType}/>}
                      onChange={(e, newValue)=> setNet({...Net, NetworkType: newValue.label}, setErrorMessage(''))} 
                      />
                      <FormHelperText>{!Net.NetworkType && <div className="err">{errorMessage}</div>}</FormHelperText>
                    </FormControl>
                    <FormControl>
                    <Autocomplete                
                      label="Select network interface"
                      options={NetInterfaceOptions}
                      disableClearable
                      required
                      renderInput={(params) => <TextField {...params} label="Select network interface" error={true && !!errorMessage && !Net.NetworkInterface}/>}
                      onChange={(e, newValue)=> setNet({...Net, NetworkInterface: newValue.label}, setErrorMessage(''))} 
                      />
                      <FormHelperText>{!Net.NetworkInterface && <div className="err">{errorMessage}</div>}</FormHelperText>
                    </FormControl>
                    
                    <FormControl >
                      <TextField 
                      label="Speed"
                      type="number" 
                      name={Net.Speed} 
                      onChange={(e)=> setNet({...Net, Speed: e.target.value})}
                      />                
                    </FormControl>
                    
                    
              
                    <div className="AddDeviceButtons">
                    <Button variant="contained" onClick={submitForm}>
                      Add Network
                    </Button>
                    <Button variant="contained" onClick={togglePopup}>
                      Close
                    </Button>
                    </div>
                </Box>
              </Box>
              </Box>
            )}
          </div>   

          {openDelNet && (  // DEL Network
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE NETWORK</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton variant="contained" onClick={handleCloseDelNet}>
                            <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                    </Box>
                    <Box className="select-container">
                          <div>
                          <Typography>
                            Are you sure you want to delete network:
                            <Typography style={{ fontWeight: 'bold' }}>
                              {DelNet.NetworkName}
                            </Typography>
                          </Typography>
                          
                          <FormHelperText>{<div className="err">{errorMessageNet}</div>}</FormHelperText>
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelNetcon(DelNet.networkID)}>
                            Confirm
                          </Button>
                          <Button variant="contained" onClick={handleCloseDelNet}>
                            Close
                          </Button>
                          </div>
                    </Box>
                    </div>
                    </div>
          )}
          
          {openUpdate && (  // UPDATE Network          
                      <Box sx={{zIndex: 1000}} className="popup-container"> 
                        <div className="popup">
                        <Box>
                          <Grid container className="popup-header" justifyContent="space-between">
                            <Grid item>
                              <Typography className="AddDevTitle" variant="body1">UPDATE NETWORK</Typography>
                            </Grid>
                            <Grid item>
                              <IconButton variant="contained" onClick={handleCloseUpdate}>
                              <CloseIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      <Box className="select-container">         
                          <FormControl >
                          <TextField                                            
                          label="Network Name" 
                          required
                          value={UNet.NetworkName}
                          name={UNet.NetworkName} 
                          onChange={(e)=> setUNet({...UNet, NetworkName: e.target.value}, setErrorMessage(''))}   
                          error={(true && !!errorMessage && !UNet.NetworkName) || (true && !!errorName)}                                      
                          >
                        </TextField>
                        <FormHelperText>{!UNet.NetworkName && <div className="err">{errorMessage}</div>}</FormHelperText>
                        <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                        </FormControl>
                        <FormControl>
                        
                        <Autocomplete                
                          label="Select network type"
                          defaultValue={UNet.NetworkType}
                          options={NetTypeOptions}
                          disableClearable
                          required
                          renderInput={(params) => <TextField {...params} label="Select network type" error={true && !!errorMessage && !UNet.NetworkType}/>}
                          onChange={(e, newValue)=> setUNet({...UNet, NetworkType: newValue.label}, setErrorMessage(''))} 
                          />
                          <FormHelperText>{!Net.NetworkType && <div className="err">{errorMessage}</div>}</FormHelperText>
                        </FormControl>
                        <FormControl>
                        <Autocomplete                
                          label="Select network interface"
                          defaultValue={UNet.NetworkInterface}
                          options={NetInterfaceOptions}
                          disableClearable
                          required
                          renderInput={(params) => <TextField {...params} label="Select network interface" error={true && !!errorMessage && !UNet.NetworkInterface}/>}
                          onChange={(e, newValue)=> setUNet({...UNet, NetworkInterface: newValue.label}, setErrorMessage(''))} 
                          />
                          <FormHelperText>{!UNet.NetworkInterface && <div className="err">{errorMessage}</div>}</FormHelperText>
                        </FormControl>
                        
                        <FormControl >
                          <TextField 
                          label="Speed"
                          type="number" 
                          value={UNet.Speed}
                          name={UNet.Speed} 
                          onChange={(e)=> setUNet({...UNet, Speed: e.target.value})}
                          />                
                        </FormControl>


                  <div className="AddDeviceButtons">  
                  <Button variant="contained" onClick={handleUpdate}>
                    Update
                  </Button>
                  <Button variant="contained" onClick={handleCloseUpdate}>
                    Close
                  </Button>
                  </div>
                      </Box>
                      </div>
                      </Box>
          )}       

        <Box sx={{backgroundColor: 'white', height: '600px', width: '850px'}}>           
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.networkID}
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
          />
          </Box> 




    </Box>
  );
}

export default Network;
