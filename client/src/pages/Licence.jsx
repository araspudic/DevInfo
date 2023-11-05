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

function Licence() {
  const [LicList, setLicList] = useState([]);
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

  const [Lic, setLic] = useState({
    "LicencaID": "",
    "LicencaName": "",
    "Validity": ""
  });

  const [ULic, setULic] = useState({
    "LicencaID": "",
    "LicencaName": "",
    "Validity": ""
  });

  //Read - licence rows
  const rows = LicList.map((row)=>({
    LicencaID: row.LicencaID,
    LicencaName: row.LicencaName,
    Validity: row.Validity
    
  }))

  // Licence list columns
  const columns = [
    { field: 'LicencaID', headerName: 'ID', width: 80 },
    { field: 'LicencaName', headerName: 'Name', width: 140 },
    { field: 'Validity', headerName: 'Validity', width: 110 ,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
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
        onClick={() => handleOpenDelLic(params.row)}
        >
        <DeleteIcon />
        </IconButton>
      </div>
    ),
    }
  ];

  // Licence list fetch
  const fetchLic = () => {
    Axios.get("http://localhost:3001/api/licences", { withCredentials: true }).then((response) =>{
        setLicList(response.data)       
    })
    .catch(error =>{
      window.location.href = '/login';
      console.log(error);
    })
  };

  useEffect(() => {
    fetchLic();
  }, [reducerValue]);
  
  const refreshData = () => {
    fetchLic();
  };

  
  /// Handle Delete Licence confirm
    const [openDelLic, setopenDelLic] = useState(false);
    const [DelLic, setDelLic] = useState({
      "LicencaID": "",
      "LicencaName": ""
    });

    const handleOpenDelLic = (row) => {
    setDelLic({... DelLic, LicencaID: row.LicencaID, LicencaName: row.LicencaName})
    setopenDelLic(true);
    };

    const handleCloseDelLic = () => {
        setopenDelLic(false);
        setErrorMessageLic('')
        resetClickCount()
        
    };

    //Delete licence
    const [errorMessageLic, setErrorMessageLic] = useState('');
    
    const [clickCount, setClickCount] = useState(0);
    

    const resetClickCount = () => {
      setErrorMessageLic('')
      setClickCount(0);
    };

    /// Delete Confirm 
    const DelLiccon = (params) => {
      const id = params;
      setClickCount(clickCount + 1);

      const fetchDeviceData = Axios.get('http://localhost:3001/api/licenca/devices/' + id);
 
      Promise.all([fetchDeviceData])
            .then(([devData]) => {
                const DataDevice = devData.data

                if(Array.isArray(DataDevice) && DataDevice.length > 0){       
                  setErrorMessageLic('Cannot delete licence. Licence is in use!')
                }
                else{    
                Axios.get("http://localhost:3001/api/licenca/" + id, {})
                  .then((response) => {
                    setDelLic({});
                    setopenDelLic(false);
                    setOpenNoti(true);
                    forceUpdate();
                          
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                 });
                }
            })
      
      
      
    };

    

    // Add licence popup 
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [errorName, seterrorName] = useState('');

    const togglePopup = () => {
      setPopupOpen(!isPopupOpen);
      
      setErrorMessage('')
      seterrorName('')
      setSelectedDate('')
      setLic({})
      refreshData();
    };

    
    
      
      // Add Licence 2nd button
      const [errorMessage, setErrorMessage] = useState('');
      
      const submitForm = () => {
        if (!Lic.LicencaName) {
          setErrorMessage('Field cannot be empty.');
        }
        if (!Lic.Validity) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (LicList.find(lic => lic.LicencaName === Lic.LicencaName)){
          seterrorName('Name already exists!')
        }     
        else {                    
          Axios.post("http://localhost:3001/api/licenca", {
            Lic: Lic           
          }).then(()=> {
            setPopupOpen(togglePopup);
            setOpenNoti(true);
            setLic({});  
            forceUpdate();

          })      
        }       
      };

      
          
    // Update Licenca   
    const [openUpdate, setOpenUpdate] = useState(false);
    const [oldName, setoldName] = useState('');
    const [oldPw, setoldPw] = useState('');
    
    const handleOpenUpdate = (row) => {
        const dateOnlyString = new Date(row.Validity).toISOString().split('T')[0];
        setULic({... ULic, LicencaID: row.LicencaID, LicencaName: row.LicencaName, Validity: dateOnlyString})
        setoldName(row.LicencaName)
        setOpenUpdate(true);
        refreshData();

    };


    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setULic({});
        seterrorName('')
        setoldName('')
        refreshData();
    };

    const CheckNameExist = (name) =>{
      refreshData();
      const nameExists = LicList.some(lic => lic.LicencaName === name && oldName !== name);     
      return nameExists
    }
   

    
    
    
    

    /// Notification
    const [openNoti, setOpenNoti] = useState(false);
    const handleCloseNoti = () => {
      setOpenNoti(false);
    };



      /// Update licenca 2nd button
    const handleUpdate = () => { 
      if (!ULic.LicencaName){
      setErrorMessage('Field cannot be empty.');
      }
      if (!ULic.Validity){
        setErrorMessage('Field cannot be empty.');
        }
      if (CheckNameExist(ULic.LicencaName)){
        seterrorName('Name already exists!');
      } 
      else { 
          const id = ULic.LicencaID;
          const name = ULic.LicencaName;
          const val = ULic.Validity;
          
    
          Axios.patch("http://localhost:3001/api/licenca/" + id + "/" + name + "/" + val , {
          }).then(()=>{
              setULic({});
              setOpenNoti(true);
              forceUpdate(); 
              handleCloseUpdate();
          })
          .catch((error) => {
              console.error("Error:", error);
          });
      
      }
  };

  //Date picker - Add licence
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setLic({...Lic, Validity: event.target.value})
    setULic({...ULic, Validity: event.target.value})
  };
  //Date picker - Update licence
  const [selectedDate2, setSelectedDate2] = useState(ULic.Validity);

  useEffect(() => {
    setSelectedDate2(ULic.Validity); 
  }, [ULic.Validity]);

  const handleDateChange2 = (event) => {
    setSelectedDate2(event.target.value);
    setLic({...Lic, Validity: event.target.value})
    setULic({...ULic, Validity: event.target.value})
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
            <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={togglePopup} variant="contained">+ Add LICENCE</Button>         
            {isPopupOpen && ( // ADD Licenca          
            <Box sx={{zIndex: 1000}} className="popup-container" >           
            <Box className="popup" >
              <Box>
                  <Grid container className="popup-header" justifyContent="space-between">
                    <Grid item>
                      <Typography className="AddDevTitle" variant="body1">ADD LICENCE</Typography>
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
                      label="Licenca Name" 
                      required
                      name={Lic.LicencaName} 
                      onChange={(e)=> setLic({...Lic, LicencaName: e.target.value}, setErrorMessage(''))}   
                      error={(true && !!errorMessage && !Lic.LicencaName) || (true && !!errorName)}                                      
                      >
                    </TextField>
                    <FormHelperText>{!Lic.LicencaName && <div className="err">{errorMessage}</div>}</FormHelperText>
                    <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                    </FormControl>
                    <FormControl>
                    <TextField
                        id="date"
                        label="Validity"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={(true && !!errorMessage && !Lic.Validity) || (true && !!errorName)}
                        />
                    </FormControl>
                    <FormHelperText>{!Lic.Validity && <div className="err">{errorMessage}</div>}</FormHelperText>
                    <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                    
              
                    <div className="AddDeviceButtons">
                    <Button variant="contained" onClick={submitForm}>
                      Add Licence
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

          {openDelLic && (  // DEL Licenca
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE LICENCE</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton variant="contained" onClick={handleCloseDelLic}>
                            <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                    </Box>
                    <Box className="select-container">
                          <div>
                          <Typography>
                            Are you sure you want to delete licence:
                            <Typography style={{ fontWeight: 'bold' }}>
                              {DelLic.LicencaName}
                            </Typography>
                          </Typography>
                          
                          <FormHelperText>{<div className="err">{errorMessageLic}</div>}</FormHelperText>
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelLiccon(DelLic.LicencaID)}>
                            Confirm
                          </Button>
                          <Button variant="contained" onClick={handleCloseDelLic}>
                            Close
                          </Button>
                          </div>
                    </Box>
                    </div>
                    </div>
          )}


            {openUpdate && (  // UPDATE Licence          
                      <Box sx={{zIndex: 1000}} className="popup-container"> 
                        <div className="popup">
                        <Box>
                          <Grid container className="popup-header" justifyContent="space-between">
                            <Grid item>
                              <Typography className="AddDevTitle" variant="body1">UPDATE LICENCE</Typography>
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
                        label="Licenca Name" 
                        required
                        value={ULic.LicencaName}
                        name={ULic.LicencaName} 
                        onChange={(e)=> setULic({...ULic, LicencaName: e.target.value}, setErrorMessage(''))}   
                        error={(true && !!errorMessage && !ULic.LicencaName) || (true && !!errorName)}                                      
                        >
                        </TextField>
                        <FormHelperText>{!ULic.LicencaName && <div className="err">{errorMessage}</div>}</FormHelperText>
                        <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                        </FormControl>
                        <FormControl>
                        <TextField
                            id="date"
                            label="Validity"
                            type="date"
                            value={ULic.Validity}
                            onChange={handleDateChange2}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={(true && !!errorMessage && !ULic.Validity) || (true && !!errorName)}
                            />
                        <FormHelperText>{!ULic.Validity && <div className="err">{errorMessage}</div>}</FormHelperText>
                        <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>    
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
            getRowId={(row) => row.LicencaID}
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

export default Licence;
