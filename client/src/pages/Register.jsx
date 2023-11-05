import React, { useState, useEffect, useReducer } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Axios from "axios";


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function SignUpSide() {
  
  const [regUsername, setregUsername] = useState("");
  const [regPassword, setregPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const [UserList, setUserList] = useState([]);
  const [User, setUser] = useState({
    "userID": "",
    "Name": "",
    "LastName": "",
    "Email": "",
    "Password": "",
    "ulogaFK": ""
  });

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

  
  
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAuthMessage, setErrorAuthMessage] = useState('');

    const [errorPassword, setErrorPassword] = useState('');
    const [errorName, seterrorName] = useState('');
    const [errorEmail, seterrorEmail] = useState('');

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
                User: User,
                })
                .then((res) => {
                    if (res.status === 201) {
                        setUser('')
                        window.location.href = '/login';
                        } else {
                            console.log('no go')
                        }                
                })
                .then((res) => {
                    return Axios({
                        method: "POST",
                        withCredentials: true,
                        url: "http://localhost:3001/logout?_method=DELETE",
                        });
                })
                .catch((error) => {
                    console.error("Error:", error);
                }); 
      }       
    };

    
  const backgroundImageUrl = `${process.env.PUBLIC_URL}/logo.png`;
  


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '35% auto',
            backgroundPosition: 'center',
            backgroundColor: '#163694',
            
          }}
        >
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#163694' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <FormHelperText>{<div className="err">{errorAuthMessage}</div>}</FormHelperText>
            <Box className="select-container">
            <FormControl >
                    <TextField                                            
                    label="Name" 
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
                  </Box> 
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={submitForm}
            sx={{ marginTop: 2 }}
          >
            Sign Up
          </Button>
          <Typography sx={{ marginTop: 4 }} variant="body2" color="text.secondary" align="center">
            Back to <a href="/login">Sign in</a>
          </Typography>
          <Copyright sx={{ mt: 2 }} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}