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
  const [UserList, setUserList] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

  const [userData, setUserData] = useState(null);
  const [userDataName, setuserDataName] = useState(null);

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
          setuserDataName(response.data.userName);
        } else {
          setUserData('');
          setuserDataName('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const [User, setUser] = useState({
    "userID": "",
    "Name": "",
    "LastName": "",
    "Email": "",
    "Password": "",
    "ulogaFK": ""
  });

  const [UUser, setUUser] = useState({
    "userID": "",
    "Name": "",
    "LastName": "",
    "Email": "",
    "Password": "",
    "ulogaFK": ""
  });

  //Read - device rows
  const rows = UserList.map((row)=>({
    userID: row.userID,
    Name: row.Name,
    LastName: row.LastName,
    Email: row.Email,
    Password: row.Password,
    ulogaFK: row.ulogaFK
  }))

  // User list columns
  const columns = [
    { field: 'userID', headerName: 'ID', width: 80 },
    { field: 'Name', headerName: 'Name', width: 100 },
    { field: 'LastName', headerName: 'Lastname', width: 100},
    { field: 'Email', headerName: 'Email', width: 130 },
    {
      field: 'ulogaFK',
      headerName: 'Is Admin',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <span>{params.value === 1 ? '✖' : '✔'}</span>
      ),
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
        onClick={() => handleOpenDelUsr(params.row)}
        >
        <DeleteIcon />
        </IconButton>
      </div>
    ),
    }
  ];

  // User list fetch
  const fetchUsers = () => {
    Axios.get("http://localhost:3001/api/users", { withCredentials: true }).then((response) =>{
        setUserList(response.data)       
    })
    .catch(error =>{
      window.location.href = '/login';
      console.log(error);
    })
  };

  useEffect(() => {
    fetchUsers();
  }, [reducerValue]);
  
  const refreshData = () => {
    fetchUsers();
  };

  
  /// Handle Delete user confirm
    const [openDelUsr, setopenDelUsr] = useState(false);
    const [DelUsr, setDelUsr] = useState({
      "userID": "",
      "Name": ""
    });

    const handleOpenDelUsr = (row) => {
    setDelUsr({... DelUsr, userID: row.userID, Name: row.Name})
    setopenDelUsr(true);
    };

    const handleCloseDelUsr = () => {
        setopenDelUsr(false);
        setErrorMessageDev('')
        resetClickCount()
        setDevsToDel();
    };

    //Delete user
    const [errorMessageDev, setErrorMessageDev] = useState('');
    
    const [clickCount, setClickCount] = useState(0);
    const [DevsToDel, setDevsToDel] = useState('');

    const resetClickCount = () => {
      setErrorMessageDev('')
      setClickCount(0);
    };

    /// Delete Confirm 
    const DelUser = (params) => {
      const id = params;
      setClickCount(clickCount + 1);

      const fetchDeviceData = Axios.get('http://localhost:3001/api/user/device/' + id);
 
      switch (clickCount + 1) {
        case 1:
          console.log('Button clicked once');
          Promise.all([fetchDeviceData])
            .then(([devData]) => {
                const DataDevice = devData.data
                
              if (Array.isArray(DataDevice) && DataDevice.length > 0){ 
                // If there are devices
                
                const devNames = DataDevice.map(item => item.name);
              
                const devIds = DataDevice.map(item => item.deviceID);
              
                const devNamesString = devNames.join(', ');
              
                setDevsToDel(devIds)
                const errMsgDev ="Devices " + devNamesString + ' will too be deleted. Confirm?';
                setErrorMessageDev(errMsgDev)
                console.log('devs to del',devIds)
              }
              
              if(DataDevice.length === 0){
                // Delete user
                Axios.get("http://localhost:3001/api/user/" + id, {
                  }).then(()=>{
                  setDelUsr({});
                  setopenDelUsr(false);
                  setOpenNoti(true);
                  forceUpdate();
                  resetClickCount();
                  refreshData(); 
                  });
                  if(userData === id){
                    Axios({
                      method: "POST",
                      withCredentials: true,
                      url: "http://localhost:3001/logout?_method=DELETE",
                    }).then(res => { 
                      if(res.data === "Logged out"){ 
                        window.location.href = '/dashboard'
                      }
                    })
                  }
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          break;
        case 2:

          Axios.post('http://localhost:3001/api/device/multiple', { devIDs: DevsToDel })
          .then(()=>{
            forceUpdate(); 
              // Second request - trigger update Executed by
              return Axios.patch("http://localhost:3001/api/history/" + userDataName );
          })
          .then(() => {
            return Axios.get('http://localhost:3001/api/user/' + id);
          })
          .then(() => {
            setDelUsr({});
            setopenDelUsr(false);
            setOpenNoti(true);
            forceUpdate();
            refreshData();
          })
          .catch(error => {
            console.error('Error:', error);
          });
          if(userData === id){
            Axios({
              method: "POST",
              withCredentials: true,
              url: "http://localhost:3001/logout?_method=DELETE",
            }).then(res => { 
              if(res.data === "Logged out"){ 
                window.location.href = '/dashboard'
              }
            })
          }
          resetClickCount();
          break;    
      }
    };

    // Add user popup 
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName, seterrorName] = useState('');
    const [errorEmail, seterrorEmail] = useState('');

    const togglePopup = () => {
      setPopupOpen(!isPopupOpen);
      setErrorPassword('')
      setErrorMessage('')
      seterrorName('')
      seterrorEmail('')
      setUser({})
      refreshData();
    };

    // Check if input is email type
    function isEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!email) return true
      return emailRegex.test(email);
    }

    const UlogaOptions = [
     { label: 'Client', value: 1 },
     { label: 'Admin', value: 2 },
    ];
      
      // Add user 2nd button
      const [errorMessage, setErrorMessage] = useState('');

      const submitForm = () => {
        if (!User.Name || !User.Password || !User.ulogaFK) {
          setErrorMessage('Field cannot be empty.');
        }       
        else if(User.Password.length <= 8){
          setErrorPassword('Password is too short!');
        }
        else if (UserList.find(user => user.Name === User.Name)){
          seterrorName('Name already exists!')
        }
        else if (!isEmail(User.Email)){
          seterrorEmail('Email is not valid!')
        }
        else {                    
          Axios.post("http://localhost:3001/api/user", {
            User: User           
          }).then(()=> {
            setPopupOpen(togglePopup);
            setOpenNoti(true);
            setUser({});  
            forceUpdate();

          })      
        }       
      };

      const [showPassword, setShowPassword] = useState(false);
      const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
      };
          
    // Update user   
    const [openUpdate, setOpenUpdate] = useState(false);
    const [oldName, setoldName] = useState('');
    const [oldPw, setoldPw] = useState('');
    
    const handleOpenUpdate = (row) => {
    setUUser({... UUser, userID: row.userID,Name: row.Name, LastName: row.LastName, Email: row.Email, Password: row.Password, ulogaFK: row.ulogaFK})
    setOpenUpdate(true);
    refreshData();
    setoldName(row.Name);
    setoldPw(row.Password);
    };

    const getLabelFromValue = (value) => {
        const option = UlogaOptions.find((opt) => opt.value === value);
        return option ? option.label : '';
      };

    const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setUUser({});
    setErrorPassword('')
    seterrorName('')
    seterrorEmail('')
    setoldName('')
    setoldPw('');
    refreshData();
    };

    const CheckNameExist = (name) =>{
      refreshData();
      const nameExists = UserList.some(user => user.Name === name && oldName !== name);     
      return nameExists
    }
    const CheckPwChange = (pw) =>{
      refreshData();
      if (oldPw === pw){
        return true
      }     
      else {
        return false
      }
    }

    /// Update user 2nd button
    const handleUpdate = () => { 
      if(CheckPwChange(UUser.Password) === true){ 
        //Password did not change // Update wihtout password
          if (!UUser.Name || !UUser.Password || !UUser.ulogaFK) {
              setErrorMessage('Field cannot be empty.');
          }
          else if (UUser.Password.length <= 8){
              setErrorPassword('Password it too short!')
          }
          else if (CheckNameExist(UUser.Name)){
            seterrorName('Username already exists!')
          }
          else if (!isEmail(UUser.Email)){
            seterrorEmail('Email is not valid!')
          }          
          else { 
            Axios.patch("http://localhost:3001/api/usernopw", {
              UUser: UUser
            })
              forceUpdate(); 
              setUUser({});
              handleCloseUpdate();
              setOpenNoti(true);   
          }
      } else {
        // Password is changed
        if (!UUser.Name || !UUser.Password || !UUser.ulogaFK) {
          setErrorMessage('Field cannot be empty.');
      }
      else if (UUser.Password.length <= 8){
          setErrorPassword('Password it too short!')
      }
      else if (CheckNameExist(UUser.Name)){
        seterrorName('Username already exists!')
      }
      else if (!isEmail(UUser.Email)){
        seterrorEmail('Email is not valid!')
      }          
      else { 
        Axios.patch("http://localhost:3001/api/user", {
          UUser: UUser
        })
          forceUpdate(); 
          setUUser({});
          handleCloseUpdate();
          setOpenNoti(true);   
      }}
    };


  /// Notification
    const [openNoti, setOpenNoti] = useState(false);
    const handleCloseNoti = () => {
      setOpenNoti(false);
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
          {openDelUsr && (  // DEL USER
                    
                    <div className="popup-container"> 
                      <div className="popup">
                      <Box>
                        <Grid container className="popup-header" justifyContent="space-between">
                          <Grid item>
                            <Typography className="AddDevTitle" variant="body1">DELETE USER</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton variant="contained" onClick={handleCloseDelUsr}>
                            <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                    </Box>
                    <Box className="select-container">
                          <div>
                          <Typography>
                            Are you sure you want to delete user:
                            <Typography style={{ fontWeight: 'bold' }}>
                              {DelUsr.Name}
                            </Typography>
                          </Typography>
                          
                          <FormHelperText>{<div className="err">{errorMessageDev}</div>}</FormHelperText>
                          </div>
                          <div className="AddDeviceButtons">
                          <Button variant="contained" onClick={() => DelUser(DelUsr.userID)}>
                            Confirm
                          </Button>
                          <Button variant="contained" onClick={handleCloseDelUsr}>
                            Close
                          </Button>
                          </div>
                    </Box>
                    </div>
                    </div>
          )}

          <div >         
          <Button sx={{margin:'10px', marginLeft:'0px'}} onClick={togglePopup} variant="contained">+ Add user</Button>         
          {isPopupOpen && ( // ADD USER         
          <Box sx={{zIndex: 1000}} className="popup-container" >           
          <Box className="popup" >
            <Box>
                <Grid container className="popup-header" justifyContent="space-between">
                  <Grid item>
                    <Typography className="AddDevTitle" variant="body1">ADD USER</Typography>
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
                    label="Username" 
                    required
                    name={User.Name} 
                    onChange={(e)=> setUser({...User, Name: e.target.value}, setErrorMessage(''))}   
                    error={(true && !!errorMessage && !User.Name) || (true && !!errorName)}                                      
                    >
                  </TextField>
                  <FormHelperText>{!User.Name && <div className="err">{errorMessage}</div>}</FormHelperText>
                  <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl >
                    <TextField 
                    label="Lastname" 
                    name={User.LastName} 
                    onChange={(e)=> setUser({...User, LastName: e.target.value})}
                    />                
                  </FormControl>
                  <FormControl>
                    <TextField 
                    label="Email" 
                    type="email" 
                    name={User.Email} 
                    onChange={(e)=> setUser({...User, Email: e.target.value})}
                    error={true && !!errorEmail}
                    />
                    <FormHelperText>{<div className="err">{errorEmail}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <TextField 
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required                   
                    name={User.Password} 
                    onChange={(e)=> setUser({...User, Password: e.target.value}, setErrorMessage('')                      
                    )}
                    error={(true && !!errorMessage && !User.Password) || (true && !!errorPassword)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handlePasswordToggle}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    
                    />
                  <FormHelperText>{!User.Password && <div className="err">{errorMessage}</div>}</FormHelperText>
                  <FormHelperText>{<div className="err">{errorPassword}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl>
                  <Autocomplete                
                    label="Select User role"
                    options={UlogaOptions}
                    disableClearable
                    required
                    renderInput={(params) => <TextField {...params} label="Select User role" error={true && !!errorMessage && !User.ulogaFK}/>}
                    onChange={(e, newValue)=> setUser({...User, ulogaFK: newValue.value}, setErrorMessage(''))} 
                    />
                    <FormHelperText>{!User.ulogaFK && <div className="err">{errorMessage}</div>}</FormHelperText>
                  </FormControl>
                  
                  
                  <div className="AddDeviceButtons">
                  <Button variant="contained" onClick={submitForm}>
                    Add user
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

          {openUpdate && (  // UPDATE USER          
            <Box sx={{zIndex: 1000}} className="popup-container"> 
              <div className="popup">
              <Box>
                <Grid container className="popup-header" justifyContent="space-between">
                  <Grid item>
                    <Typography className="AddDevTitle" variant="body1">UPDATE USER</Typography>
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
                    label="Username" 
                    required
                    value={UUser.Name} 
                    name={UUser.Name} 
                    onChange={(e)=> setUUser({...UUser, Name: e.target.value}, setErrorMessage(''))}   
                    error={(true && !!errorMessage && !UUser.Name) || (true && !!errorName)}                                      
                    >
                  </TextField>
                  <FormHelperText>{!UUser.Name && <div className="err">{errorMessage}</div>}</FormHelperText>
                  <FormHelperText>{<div className="err">{errorName}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl >
                    <TextField label="Lastname" name={UUser.LastName} value={UUser.LastName} onChange={(e)=> setUUser({...UUser, LastName: e.target.value})}/>
                  </FormControl>
                  <FormControl>
                    <TextField 
                    label="Email" 
                    name={UUser.Email} 
                    value={UUser.Email} 
                    onChange={(e)=> setUUser({...UUser, Email: e.target.value})}
                    error={true && !!errorEmail}
                    />
                  <FormHelperText>{<div className="err">{errorEmail}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <TextField 
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required 
                    placeholder={"Change password"} 
                    onChange={(e)=> setUUser({...UUser, Password: e.target.value}, setErrorMessage(''))}
                    error={(true && !!errorMessage && !UUser.Password) || (true && !!errorPassword)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handlePasswordToggle}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    />
                  <FormHelperText>{!UUser.Password && <div className="err">{errorMessage}</div>}</FormHelperText>
                  <FormHelperText>{<div className="err">{errorPassword}</div>}</FormHelperText>
                  </FormControl>
                  <FormControl>
                  <Autocomplete
                    label="Select User role"
                    defaultValue={getLabelFromValue(UUser.ulogaFK)}
                    options={UlogaOptions}
                    disableClearable                  
                    renderInput={(params) => <TextField {...params} label="Select User role" />}
                    onChange={(e, newValue)=> setUUser({...UUser, ulogaFK: newValue.value}, setErrorMessage(''))} 
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

        <Box sx={{backgroundColor: 'white', height: '500px', width: '750px'}}>           
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.userID}
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

export default User;
