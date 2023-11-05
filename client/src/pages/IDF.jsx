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

function IDF() {
  const [IDFList, setIDFList] = useState([]);
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

  const [IDF, setIDF] = useState({
    "IDFID": "",
    "IDFName": "",
    "Version": "",
    "Compliant": "",
    "MadeOn": ""
  });

  const [UIDF, setUIDF] = useState({
    "IDFID": "",
    "IDFName": "",
    "Version": "",
    "Compliant": ""
  });

  //Read - IDF rows
  const rows = IDFList.map((row)=>({
    IDFID: row.IDFID,
    IDFName: row.IDFName,
    Version: row.Version,
    Compliant: row.Compliant,
    MadeOn: row.MadeOn
    
  }))

  // IDF list columns
  const columns = [
    { field: 'IDFID', headerName: 'ID', width: 80 },
    { field: 'IDFName', headerName: 'IDF Name', width: 140 },
    { field: 'Version', headerName: 'Version', width: 100},
    {
      field: 'Compliant',
      headerName: 'Compliant',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <span>{params.value === false ? '✖' : '✔'}</span>
      ),
    },
    { field: 'MadeOn', headerName: 'Made on', width: 130,
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
        onClick={() => handleOpenDelIDF(params.row)}
        >
        <DeleteIcon />
        </IconButton>
      </div>
    ),
    }
  ];

  // IDF list fetch
  const fetchIDFs = () => {
    Axios.get("http://localhost:3001/api/idf", { withCredentials: true }).then((response) =>{
        setIDFList(response.data)       
    })
    .catch(error =>{
      window.location.href = '/login';
      console.log(error);
    })
  };

  useEffect(() => {
    fetchIDFs();
  }, [reducerValue]);
  
  const refreshData = () => {
    fetchIDFs();
  };

  
  /// Handle Delete IDF confirm
    const [openDelIDF, setopenDelIDF] = useState(false);
    const [DelIDF, setDelIDF] = useState({
      "IDFID": "",
      "IDFName": ""
    });

    const handleOpenDelIDF = (row) => {
    setDelIDF({... DelIDF, IDFID: row.IDFID, IDFName: row.IDFName})
    setopenDelIDF(true);
    };

    const handleCloseDelIDF = () => {
        setopenDelIDF(false);
        setErrorMessageDev('')
        resetClickCount()
        
    };

    //Delete IDF
    const [errorMessageDev, setErrorMessageDev] = useState('');
    const [clickCount, setClickCount] = useState(0);
    

    const resetClickCount = () => {
      setErrorMessageDev('')
      setClickCount(0);
    };

    /// Delete Confirm 
    const DelIDFcon = (params) => {
      const id = params;
      setClickCount(clickCount + 1);

      const fetchDeviceData = Axios.get('http://localhost:3001/api/idf/devices/' + id);
 
      Promise.all([fetchDeviceData])
            .then(([devData]) => {
                const DataDevice = devData.data

                if(Array.isArray(DataDevice) && DataDevice.length > 0){       
                  setErrorMessageDev('Cannot delete IDF. IDF is in use!')
                }
                else{    
                Axios.get("http://localhost:3001/api/idf/" + id, {})
                  .then((response) => {
                    setDelIDF({});
                    setopenDelIDF(false);
                    setOpenNoti(true);
                    forceUpdate();
                          
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                 });
                }
            })
      
      
      
    };

    // Add IDF popup 
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [errorName, seterrorName] = useState('');

    const togglePopup = () => {
      setPopupOpen(!isPopupOpen);
      
      setErrorMessage('')
      seterrorName('')
      setIsOn(false)
      setIDF({})
      refreshData();
    };

    
    
      
      // Add IDF 2nd button
      const [errorMessage, setErrorMessage] = useState('');
      const [isOn, setIsOn] = React.useState(false);
      const currentDate = new Date();

      const submitForm = () => {
        IDF.MadeOn = currentDate; 
        IDF.Compliant = isOn;
        if (!IDF.IDFName) {
          setErrorMessage('Field cannot be empty.');
        }
        else if (IDFList.find(idf => idf.IDFName === IDF.IDFName)){
          seterrorName('Name already exists!')
        }     
        else {                    
          Axios.post("http://localhost:3001/api/idf", {
            IDF: IDF           
          }).then(()=> {
            setPopupOpen(togglePopup);
            setOpenNoti(true);
            setIDF({});  
            forceUpdate();

          })      
        }       
      };

      
          
    // Update IDF   
    const [openUpdate, setOpenUpdate] = useState(false);
    const [oldName, setoldName] = useState('');
    
    const handleOpenUpdate = (row) => {
        setUIDF({... UIDF, IDFID: row.IDFID, IDFName: row.IDFName, Version: row.Version, Compliant: row.Compliant})
        setoldName(row.IDFName)
        setOpenUpdate(true);
        refreshData();

    };


    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setUIDF({});
        seterrorName('')
        setoldName('')
        refreshData();
    };

    const CheckNameExist = (name) =>{
      refreshData();
      const nameExists = IDFList.some(idf => idf.IDFName === name && oldName !== name);     
      return nameExists
    }
   

    
    
    
    

  /// Notification
    const [openNoti, setOpenNoti] = useState(false);
    const handleCloseNoti = () => {
      setOpenNoti(false);
    };


    // Update IDF Compliant
    const [isOn2, setIsOn2] = useState(UIDF.Compliant);
      useEffect(() => {
        setIsOn2(UIDF.Compliant); 
      }, [UIDF.Compliant]);

      const handleChange = () => {
        const newValue = !isOn2;
        setIsOn2(newValue);
      };


      /// Update IDF 2nd button
    const handleUpdate = () => { 
      if (!UIDF.IDFName){
      setErrorMessage('Field cannot be empty.');
      }
      if (CheckNameExist(UIDF.IDFName)){
        seterrorName('IDF Name already exists!');
      } 
      else { 
          const id = UIDF.IDFID;
          const name = UIDF.IDFName;
          const ver = UIDF.Version;
          const comp = isOn2 ? 1 : 0
          console.log('pred req', comp)
          Axios.patch("http://localhost:3001/api/idf/" + id + "/" + name + "/" + ver + "/" + comp , {
          }).then(()=>{
              setUIDF({});
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
            <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={togglePopup} variant="contained">+ Add IDF</Button>         
            {isPopupOpen && ( // ADD IDF         
            <Box sx={{zIndex: 1000}} className="popup-container" >           
            <Box className="popup" >
              <Box>
                  <Grid container className="popup-header" justifyContent="space-between">
                    <Grid item>
                      <Typography className="AddDevTitle" variant="body1">ADD IDF</Typography>
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
                      label="IDF Name" 
                      required
                      name={IDF.IDFName} 
                      onChange={(e)=> setIDF({...IDF, IDFName: e.target.value}, setErrorMessage(''))}   
                      error={(true && !!errorMessage && !IDF.IDFName) || (true && !!errorName)}                                      
                      >
                    </TextField>
                    <FormHelperText>{!IDF.IDFName && <div className="err">{errorMessage}</div>}</FormHelperText>
                    <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                    </FormControl>
                    <FormControl >
                      <TextField 
                      label="Version"
                      type="number" 
                      name={IDF.Version} 
                      onChange={(e)=> setIDF({...IDF, Version: e.target.value})}
                      />                
                    </FormControl>

                    
                    <FormControl>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Compliant</Typography>
                          <Switch
                          checked={isOn}
                          onChange={() => setIsOn((prevIsOn) => !prevIsOn)}
                          value={isOn ? 1 : 0}
                          inputProps={{ 'aria-label': 'slider' }}
                          />
                      </div>
                    </FormControl>
                    
                    
              
                    <div className="AddDeviceButtons">
                    <Button variant="contained" onClick={submitForm}>
                      Add IDF
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


          {openDelIDF && (  // DEL IDF
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE IDF</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton variant="contained" onClick={handleCloseDelIDF}>
                            <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                    </Box>
                    <Box className="select-container">
                          <div>
                          <Typography>
                            Are you sure you want to delete IDF:
                            <Typography style={{ fontWeight: 'bold' }}>
                              {DelIDF.IDFName}
                            </Typography>
                          </Typography>
                          
                          <FormHelperText>{<div className="err">{errorMessageDev}</div>}</FormHelperText>
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelIDFcon(DelIDF.IDFID)}>
                            Confirm
                          </Button>
                          <Button variant="contained" onClick={handleCloseDelIDF}>
                            Close
                          </Button>
                          </div>
                    </Box>
                    </div>
                    </div>
          )}
 
          {openUpdate && (  // UPDATE IDF          
                      <Box sx={{zIndex: 1000}} className="popup-container"> 
                        <div className="popup">
                        <Box>
                          <Grid container className="popup-header" justifyContent="space-between">
                            <Grid item>
                              <Typography className="AddDevTitle" variant="body1">UPDATE IDF</Typography>
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
                            label="IDF Name" 
                            required
                            value={UIDF.IDFName}
                            name={UIDF.IDFName} 
                            onChange={(e)=> setUIDF({...UIDF, IDFName: e.target.value}, setErrorMessage(''))}   
                            error={(true && !!errorMessage && !UIDF.IDFName) || (true && !!errorName)}                                      
                            >
                          </TextField>
                          <FormHelperText>{!UIDF.IDFName && <div className="err">{errorMessage}</div>}</FormHelperText>
                          <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                          </FormControl>
                          <FormControl >
                            <TextField 
                            label="Version"
                            type="number" 
                            value={UIDF.Version}
                            name={UIDF.Version} 
                            onChange={(e)=> setUIDF({...UIDF, Version: e.target.value})}
                            />                
                          </FormControl>

                          
                          <FormControl>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>Compliant</Typography>
                                <Switch
                                checked={isOn2}
                                onChange={handleChange}
                                //value={UIDF.Compliant ? 1 : 0}
                                inputProps={{ 'aria-label': 'slider' }}
                                />
                            </div>
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
            getRowId={(row) => row.IDFID}
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

export default IDF;
