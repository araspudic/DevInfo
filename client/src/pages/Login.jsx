import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
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
import PageTransition from "../components/PageTransition";
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

export default function SignInSide() {
  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Page transition
  const [showTransition, setShowTransition] = useState(true);
  useEffect(() => {
    const delay = setTimeout(() => {
      setShowTransition(false);
      clearTimeout(delay);
    }, 2000);
  }, []);


  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const login = () => {
    if (!loginUsername) {
      setErrorMessage('Field cannot be empty.');
    }
    else if (!loginPassword) {
      setErrorMessage('Field cannot be empty.');
    }
    else { 
    Axios({
      method: "POST",
      data: {
        Name: loginUsername,
        Password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/login",
    }).then(res => { 
      if(res.data === "Username or password is incorrect!"){
        setErrorAuthMessage(res.data)
      }else {
        window.location.href = '/dashboard'
      }
    })
    .catch(error=>{
      console.log(error)
      
    })
  }
  };
  
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAuthMessage, setErrorAuthMessage] = useState('');


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
              Sign in
            </Typography>
            <FormHelperText>{<div className="err">{errorAuthMessage}</div>}</FormHelperText>
        <FormControl >
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="Name"
            label="Name"
            name="Name"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            error={true && !!errorMessage && !loginUsername}          
          />
          <FormHelperText>{!loginUsername && <div className="err">{errorMessage}</div>}</FormHelperText>
          </FormControl> 
          <FormControl >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            error={true && !!errorMessage && !loginPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={handlePasswordToggle}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            style={{ width: '225px' }}
          />
          <FormHelperText>{!loginPassword && <div className="err">{errorMessage}</div>}</FormHelperText>
          </FormControl>
           
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={login}
            sx={{ marginTop: 2 }}
          >
            Sign In
          </Button>
          <Typography sx={{ marginTop: 4 }} variant="body2" color="text.secondary" align="center">
            Don't have an account? <a href="/register">Sign up</a>
          </Typography>

          <Copyright sx={{ mt: 2 }} />
          </Box>
          
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}