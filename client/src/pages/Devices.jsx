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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/system';
import PageTransition from "../components/PageTransition";

const useStyles = styled((theme) => ({
  autocomplete: {
    zIndex: 1, 
    width: '3000px'
  },
}));

function Devices(){

    const classes = useStyles();

    // Page transition
    const [showTransition, setShowTransition] = useState(true);
    useEffect(() => {
      const delay = setTimeout(() => {
        setShowTransition(false);
        clearTimeout(delay);
      }, 2000);
    }, []);

    const [DeviceList, setDeviceList] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
    
    const [Device, setDevice] = useState({
      "deviceID": "",
      "Name": "",
      "Status": "",
      "IP_address": "",
      "MAC_address": "",
      "CPU": "",
      "RAM": "",
      "Flash_size": "",
      "LicencaFK": "",
      "NetworkFK": "",
      "IDF": "",
      "user": ""
    });

    


    // User data fetch 
    const [userDataID, setuserDataID] = useState(null);
    const [userDataName, setuserDataName] = useState(null);

    // Login status
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const response = await Axios.get("http://localhost:3001/api/check-login", { withCredentials: true });
          if (response.data.loggedIn) {
            setuserDataID(response.data.userID);
            setuserDataName(response.data.userName);
          } else {
            setuserDataID('');
            setuserDataName('');
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      };

      checkLoginStatus();
    }, []);

    // Device list fetch
    useEffect(() => {     
      Axios.get("http://localhost:3001/api/device", { withCredentials: true })
        .then((response) => {
            const data = response.data;
            // Check Licence Validity - Lock commands
            const currentDate = new Date();
            const updatedData = data.map(device => {
              const validityDate = new Date(device.Validity);
              const isLicActive = validityDate > currentDate;
            
              return { ...device, isLicActive: isLicActive };
            });

            updatedData.map(device => {
              if (device.isLicActive === false && device.Status != "Offline") {
                // Set status Offline
                Axios.patch("http://localhost:3001/api/device/" + device.deviceID + "/Offline" , {
                }).then(()=>{
                  forceUpdate(); 
                  // Second request - trigger update Executed by
                    return Axios.patch("http://localhost:3001/api/history/" + userDataName );
                })
                .then(() => {  
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
              }
              
            })
          

          setDeviceList(updatedData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, [reducerValue]);


    //Read - device rows
    const rows = DeviceList.map((row)=>({
      deviceID: row.deviceID,
      name: row.name,
      Status: row.Status,
      IP_address: row.IP_address,
      MAC_address: row.MAC_address,
      CPU: row.CPU,
      RAM: row.RAM,
      Flash_size: row.Flash_size,
      LicencaID: row.LicencaID,
      LicencaFK: row.LicencaName,
      networkdID: row.networkID,
      NetworkFK: row.NetworkName,
      IDFID: row.IDFID,
      IDF: row.IDFName,
      isLicActive: row.isLicActive
    }))

      //Licenca dropdown menu
      const [Licencaoptions, setLicencaOptions] = useState([""]);
      useEffect(() => {
        const getData = async () => {
          const arr = [];
          const currentDate = new Date();
      
          await Axios.get('http://localhost:3001/api/licences').then((res) => {
            let result = res.data;
            result.map((lic) => {
              const validityDate = new Date(lic.Validity);
              const isExpired = validityDate <= currentDate;
      
              let label = lic.LicencaName;
              if (isExpired) {
                label += ' (expired)';
              }
      
              return arr.push({ value: lic.LicencaID, label });
            });
            setLicencaOptions(arr);
          });
        };
        getData();
      }, []);
      //Network dropdown menu
       const [NetOptions, setNetOptions] = useState([""]);
       useEffect(() => {
         const getData = async () => {
           const arr = [];
           await Axios.get('http://localhost:3001/api/network').then((res) => {
             let result = res.data;
             result.map((network) => {
               return arr.push({value: network.networkID, label: network.NetworkName});
             });
             setNetOptions(arr)
           });
         };
         getData();
       }, []);
      //IDF dropdown menu
      const [IDFoptions, setIDFOptions] = useState([""]);
      useEffect(() => {
        const getData = async () => {
          const arr = [];
          await Axios.get('http://localhost:3001/api/idf').then((res) => {
            let result = res.data;
            result.map((idf) => {
              return arr.push({value: idf.IDFID, label: idf.IDFName});
            });
            setIDFOptions(arr)
          });
        };
        getData();
      }, []);
      //Status dropdown
      
    
      const [alignment, setAlignment] = useState('Online');

      const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
        setDevice({...Device, Status: newAlignment})
      };



      // Add device popup 
      const togglePopup = () => {
        setPopupOpen(!isPopupOpen);
        setErrorMessage('');
        setDevice({});
        setDevice({...Device, userID: userDataID});
        seterrorName('');
      };

      // Add device 2nd button
      const [errorMessage, setErrorMessage] = useState('');
      const [errorName, seterrorName] = useState('');

      const submitForm = () => {
        if (!Device.Name) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (!Device.NetworkFK) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (!Device.LicencaFK) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (!Device.IDF) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (DeviceList.find(dev => dev.name === Device.Name)){
          seterrorName('Device name already exists!')
        }
        else {                    
          Axios.post("http://localhost:3001/api/device", {
            Device: Device 
          }).then(()=>{
            forceUpdate();
            setPopupOpen(togglePopup);
            setOpenNoti(true);  
            setDevice({});
            // Second request - trigger update Executed by
            return Axios.patch("http://localhost:3001/api/history/" + userDataName );              
          })
          .then(() => {  
          })
          .catch((error) => {
            console.error("Error:", error);
          });               
        }       
      };
     
      const handleCloseAddDevice = () => {
        setPopupOpen(false);
      };
      
/// Update Device state
const [UDev, setUDev] = useState({
  "deviceID": "",
  "Name": "",
  "Status": "",
  "IP_address": "",
  "MAC_address": "",
  "CPU": "",
  "RAM": "",
  "Flash_size": "",
  "LicencaID": "",
  "LicencaFK": "",
  "networkdID": "",
  "NetworkFK": "",
  "IDFID": "",
  "IDF": ""
});

/// Handle Update device
const [open, setOpen] = useState(false);
 
const handleOpen = (row) => {
  setUDev({... UDev, deviceID: row.deviceID,Status: row.Status, Name: row.name, IP_address: row.IP_address, MAC_address: row.MAC_address, CPU: row.CPU, RAM: row.RAM, Flash_size: row.Flash_size, LicencaID: row.LicencaID, LicencaFK: row.LicencaFK, networkdID: row.networkdID, NetworkFK: row.NetworkFK, IDFID: row.IDFID, IDF: row.IDF})
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

/// Handle Delete device confirm
const [openDelDev, setopenDelDev] = useState(false);
const [DelDev, setDelDev] = useState({
  "deviceID": "",
  "Name": ""
});

const handleOpenDelDev = (row) => {
  setDelDev({... DelDev, deviceID: row.deviceID, Name: row.name})
  setopenDelDev(true);
};

const handleCloseDelDev = () => {
  setopenDelDev(false);
};
//Delete device
const DelDevice = (params) => {
  const id = params;

  Axios.get("http://localhost:3001/api/device/" + id, {})
    .then((response) => {
      setDelDev({});
      setopenDelDev(false);
      setOpenNoti(true);
      forceUpdate();
      // Second request - trigger update Executed by
      return Axios.patch("http://localhost:3001/api/history/" + userDataName );
    })
    .then(() => {  
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};




/// Update Device 2nd button
const handleUpdate = () => { 
  if (!UDev.Name){
    setErrorMessage('Field cannot be empty.');
  } 
  else { 
    const id = UDev.deviceID;
    const name = UDev.Name;
    const status = UDev.Status;
    const ip = UDev.IP_address;
    const mac = UDev.MAC_address;
    const cpu = UDev.CPU;
    const ram = UDev.RAM;
    const flash = UDev.Flash_size;
    const lic = UDev.LicencaID;
    const net = UDev.networkdID;
    const idf = UDev.IDFID;
    Axios.patch("http://localhost:3001/api/device/" + id + "/" + name + "/" + status + "/" + ip + "/" + mac + "/" + cpu + "/" + ram + "/" + flash + "/" + lic + "/" + net + "/" + idf, {
    }).then(()=>{
      setUDev({});
      handleClose();
      setOpenNoti(true);
      forceUpdate(); 
      // Second request - trigger update Executed by
      return Axios.patch("http://localhost:3001/api/history/" + userDataName );
    })
    .then(() => {  
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    
  }
};

/// Notification
const [openNoti, setOpenNoti] = useState(false);
  const handleNoti = () => {
    setOpenNoti(true);
  };
  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

/// Status background color
  const getStatusBackgColor = (status) => {
    if (status === 'Online') return '#27e83e';
    if (status === 'Offline') return '#e82727';
    return '#e3eb4d';
  };

/// Commands menu
const [anchorEl, setAnchorEl] = useState(null);
const [selectedRowId, setSelectedRowId] = useState(null);

const handleCommandItemClick = (row, type) => {
    const id = selectedRowId;
    const status = type;
    Axios.patch("http://localhost:3001/api/device/" + id + "/" + status , {
    }).then(()=>{
      setOpenNoti(true);
      forceUpdate();
       // Second request - trigger update Executed by
      return Axios.patch("http://localhost:3001/api/history/" + userDataName );
    })
    .then(() => {  
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    handleCommandMenuClose();
};
const handleCommandMenuClick = (event, rowId) => {
  setAnchorEl(event.currentTarget);
  setSelectedRowId(rowId);
};
const handleCommandMenuClose = () => {
  setAnchorEl(null);
  setSelectedRowId(null);
};
const handleCommandMenuKeyPress = (event) => {
  if (event.key === 'Escape') {
    handleCommandMenuClose();
  }
};


// Search bar
const [searchText, setSearchText] = useState('');

const handleSearch = (event) => {
  const { value } = event.target;
  setSearchText(value);
};

const filteredRows = rows.filter((row) =>
row.name.toLowerCase().includes(searchText.toLowerCase())
);

      // Device list columns
      const columns = [
        { field: 'deviceID', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'Status', headerName: 'Status', width: 100,
        renderCell: (params) => (
          <div style={{ backgroundColor: getStatusBackgColor(params.row.Status), padding: '8px', width: '150px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            {params.value}
          </div>         
        ),      
        },
        { field: 'IP_address', headerName: 'IP', width: 130 },
        { field: 'MAC_address', headerName: 'MAC', width: 130 },
        { field: 'CPU', headerName: 'CPU', width: 100 },
        { field: 'RAM', headerName: 'RAM', width: 70 },
        { field: 'Flash_size', headerName: 'Flash', width: 70 },
        { field: 'LicencaFK', headerName: 'License', width: 130 },
        { field: 'NetworkFK', headerName: 'Network', width: 100 },
        { field: 'IDF', headerName: 'IDF', width: 130 },
        { field: 'Actions', headerName: 'Actions', width: 150,
        sortable: false, renderCell: (params) => {

          const isLicActive = params.row.isLicActive;

          return (   
          <div>    
            <IconButton
              variant="contained"
              onClick={() => handleOpen(params.row)}
            >
            <EditIcon />
            </IconButton>          
            <IconButton aria-label="Delete" onClick={() => handleOpenDelDev(params.row)}>
            <DeleteIcon />
            </IconButton>

            <IconButton           
            onClick={(e) => handleCommandMenuClick(e, params.row.deviceID)}
            disabled={!isLicActive}
            >
            <MoreVertIcon />
            </IconButton>
            <Menu
              id={`menu-${params.row.deviceID}`}
              anchorEl={anchorEl}
              open={selectedRowId === params.row.deviceID}
              onClose={handleCommandMenuClose}
              onKeyDown={handleCommandMenuKeyPress}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                getContentAnchorEl: null,
              }}
            >
            <MenuItem onClick={(e) => handleCommandItemClick(e, 'Online')}>Switch on</MenuItem>
            <MenuItem onClick={(e) => handleCommandItemClick(e, 'Offline')}>Shut down</MenuItem>
            <MenuItem onClick={(e) => handleCommandItemClick(e, 'Updating')}>Update</MenuItem>
          </Menu>
          </div>
          )
        },
        }
      ];

      
    return (
      <Box sx={{width: '90%',padding: '30px', paddingTop: '80px', overflow: 'auto', backgroundColor: '#d3dce8'}}>
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
        <div>         
          <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={togglePopup} variant="contained">+ Add device</Button>         
          {isPopupOpen && (           // Add device popup         
          <Box sx={{zIndex: 1000}} className="popup-container" >           
          <Box className="popupadd" onClose={handleCloseAddDevice}>
            <Box>
                <Grid container className="popup-header" justifyContent="space-between">
                  <Grid item>
                    <Typography className="AddDevTitle" variant="body1">ADD DEVICE</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton variant="contained" onClick={togglePopup}>
                    <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
            </Box>
            <Box className="select-container">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>                                      
                  <FormControl fullWidth>
                    <TextField                                            
                    label="Device name" 
                    name={Device.Name} 
                    onChange={(e)=> setDevice({...Device, Name: e.target.value}, setErrorMessage(''))}   
                    error={(true && !!errorMessage && !Device.Name) || (true && !!errorName)}                                      
                    >
                  </TextField>
                  <FormHelperText>{!Device.Name && <div className="err">{errorMessage}</div>}</FormHelperText>
                  <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>               
                  <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    sx={{paddingBottom: '7px'}}
                  >
                    <ToggleButton style={{ backgroundColor: '#27e83e', width:'100%', padding: '8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px'}} value="Online">Online</ToggleButton>
                    <ToggleButton style={{ backgroundColor: '#e82727', width:'100%',padding: '8px', borderRadius: '4px', fontWeight: 'bold' , fontSize: '11px' }} value="Offline">Offline</ToggleButton>
                    <ToggleButton style={{ backgroundColor: '#e3eb4d', width:'100%',padding: '8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }} value="Updating">Update</ToggleButton>
                  </ToggleButtonGroup>
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField label="IP address" name={Device.IP_address} onChange={(e)=> setDevice({...Device, IP_address: e.target.value})} sx={{paddingBottom: '7px'}}/>
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField label="MAC address" name={Device.MAC_address} onChange={(e)=> setDevice({...Device, MAC_address: e.target.value})} sx={{paddingBottom: '7px'}}/>
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField label="CPU" name={Device.CPU} onChange={(e)=> setDevice({...Device, CPU: e.target.value})} sx={{paddingBottom: '7px'}}/>
                  </FormControl>
                    
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TextField 
                    label="RAM" 
                    name={Device.RAM} 
                    onChange={(e)=> setDevice({...Device, RAM: e.target.value})}
                    type="number"
                    sx={{paddingBottom: '7px'}}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField label="Flash size" type="number" name={Device.Flash} onChange={(e)=> setDevice({...Device, Flash_size: e.target.value})} sx={{paddingBottom: '7px'}}/>
                  </FormControl>
                  <FormControl fullWidth>               
                  <Autocomplete
                    className="test"
                    label="Licenca"                                                          
                    options={Licencaoptions}
                    disableClearable
                    renderInput={(e) => <TextField {...e} label="Licenca" error={true && !!errorMessage && !Device.LicencaFK}/>}
                    onChange={(e, newValue)=> setDevice({...Device, LicencaFK: newValue.value}, setErrorMessage(''))}  
                    sx={{paddingBottom: '7px'}}                                
                  ></Autocomplete>
                  <FormHelperText>{!Device.LicencaFK && <div className="err">{errorMessage}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>
                  <Autocomplete
                    label="Network"                                        
                    options={NetOptions}
                    disableClearable
                    renderInput={(e) => <TextField {...e} label="Network" error={true && !!errorMessage && !Device.NetworkFK}/>}
                    onChange={(e, newValue)=> setDevice({...Device, NetworkFK: newValue.value, NetworkName: newValue.label}, setErrorMessage(''))}
                    sx={{paddingBottom: '7px'}}
                  ></Autocomplete>
                  <FormHelperText>{!Device.NetworkFK && <div className="err">{errorMessage}</div>}</FormHelperText>
                  </FormControl>
                  
                  <FormControl fullWidth>
                  <Autocomplete
                  
                  sx={{
                    zIndex: 10, // Adjust the z-index as needed
                    paddingBottom: '7px'
                  }}
                      options={IDFoptions}
                      disableClearable
                      
                      renderInput={(e) => <TextField {...e} label="IDF" error={true && !!errorMessage && !Device.IDF} />}
                      onChange={(e, newValue)=> setDevice({...Device, IDF: newValue.value}, setErrorMessage(''))}
                  ></Autocomplete>
                  <FormHelperText>{!Device.IDF && <div className="err">{errorMessage}</div>}</FormHelperText>
                  </FormControl>
                  
                  </Grid>
                  <Grid item xs={12} md={6}>
                  <div className="AddDeviceButtons" >
                    <Button variant="contained" onClick={submitForm}>
                      Add device
                    </Button>
                    <Button variant="contained" onClick={togglePopup}>
                      Close
                    </Button>
                    </div>
                  </Grid>
              </Grid>

              </Box>
              
            </Box>
            </Box >
          )}
        </div>
        
        
        <TextField
            label="Search devices..."
            variant="outlined"
            width='50%'
            onChange={handleSearch}
            sx={{backgroundColor: 'white'}}
          />
        <Box sx={{backgroundColor: 'white', height: '700px', width: 'auto'}} >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.deviceID}
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
            localeText={{ noRowsLabel: "No devices found." }}
          />
          
        </Box>
          
          {open && ( // UPDATE DEVICE
            
            <Box sx={{zIndex: 1000}} className="popup-container"> 
              <div className="popupadd">
              <Box>
                <Grid container className="popup-header" justifyContent="space-between">
                  <Grid item>
                    <Typography className="AddDevTitle" variant="body1">UPDATE DEVICE</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton variant="contained" onClick={handleClose}>
                    <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            <Box className="select-container">
            <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
          <FormControl fullWidth>
          <TextField label="Name" error={true && !!errorMessage && !Device.Name} value={UDev.Name} name={UDev.Name} onChange={(e)=> setUDev({...UDev, Name: e.target.value}, setErrorMessage(''))} sx={{paddingBottom: '7px'}}/> 
          <FormHelperText>{!Device.Name && <div className="err">{errorMessage}</div>}</FormHelperText>
          </FormControl>
          <FormControl fullWidth>               
                  <ToggleButtonGroup
                    color="primary"
                    value={UDev.Status}
                    exclusive
                    onChange={(e, newAlignment)=> setUDev({...UDev, Status: newAlignment} )}
                    sx={{paddingBottom: '7px'}}
                  >
                    <ToggleButton style={{ backgroundColor: '#27e83e', width:'100%', padding: '8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px'}} value="Online">Online</ToggleButton>
                    <ToggleButton style={{ backgroundColor: '#e82727', width:'100%',padding: '8px', borderRadius: '4px', fontWeight: 'bold' , fontSize: '11px'}} value="Offline">Offline</ToggleButton>
                    <ToggleButton style={{ backgroundColor: '#e3eb4d', width:'100%',padding: '8px', borderRadius: '4px', fontWeight: 'bold' , fontSize: '11px'}} value="Updating">Update</ToggleButton>
                  </ToggleButtonGroup>
                  </FormControl>
        <FormControl fullWidth>
          <TextField label="IP" value={UDev.IP_address} name={UDev.IP_address} onChange={(e)=> setUDev({...UDev, IP_address: e.target.value})} sx={{paddingBottom: '7px'}}/>
        </FormControl>
        <FormControl fullWidth>
          <TextField label="MAC" value={UDev.MAC_address} name={UDev.MAC_address} onChange={(e)=> setUDev({...UDev, MAC_address: e.target.value})} sx={{paddingBottom: '7px'}}/>
        </FormControl>
        <FormControl fullWidth>
          <TextField label="CPU" value={UDev.CPU} name={Device.CPU} onChange={(e)=> setUDev({...UDev, CPU: e.target.value})} sx={{paddingBottom: '7px'}}/>
        </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <TextField label="RAM" type="number" value={UDev.RAM} name={UDev.RAM} onChange={(e)=> setUDev({...UDev, RAM: e.target.value})} sx={{paddingBottom: '7px'}}/>
        </FormControl>
        <FormControl fullWidth>
          <TextField label="Flash" type="number" value={UDev.Flash_size} name={UDev.Flash} onChange={(e)=> setUDev({...UDev, Flash_size: e.target.value})} sx={{paddingBottom: '7px'}}/>
        </FormControl>
        <FormControl fullWidth>
        <Autocomplete                    
          defaultValue={UDev.LicencaFK}
          options={Licencaoptions}
          disableClearable
          renderInput={(e) => <TextField {...e} label="Licenca" />}
          onChange={(e, newValue)=> setUDev({...UDev, LicencaID: newValue.value}, setErrorMessage(''))}
          sx={{paddingBottom: '7px'}}   
        />
        </FormControl>
        <FormControl fullWidth>
        <Autocomplete                        
          defaultValue={UDev.NetworkFK}
          options={NetOptions}
          disableClearable
          renderInput={(e) => <TextField {...e} label="Network" />}
          onChange={(e, newValue)=> setUDev({...UDev, networkdID: newValue.value}, setErrorMessage(''))}
          sx={{paddingBottom: '7px'}}
        ></Autocomplete>
        </FormControl>
        <FormControl fullWidth>
        <Autocomplete
          defaultValue={UDev.IDF}           
          options={IDFoptions}
          disableClearable
          renderInput={(e) => <TextField {...e} label="IDF" />}
          onChange={(e, newValue)=> setUDev({...UDev, IDFID: newValue.value}, setErrorMessage(''))}
          sx={{paddingBottom: '7px'}}
        ></Autocomplete>
        </FormControl>  
        </Grid>
        <Grid item xs={12} md={6}>
        <div className="AddDeviceButtons">  
        <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
        </div>
        </Grid>
        </Grid>
            </Box>
            </div>
            </Box>
        )}


          {openDelDev && ( // DEL DEVICE
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE DEVICE</Typography>
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
                            Are you sure you want to delete device:
                          </Typography>
                          <Typography style={{ fontWeight: 'bold' }}>
                            {DelDev.Name}
                          </Typography>
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelDevice(DelDev.deviceID)}>
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



export default Devices;