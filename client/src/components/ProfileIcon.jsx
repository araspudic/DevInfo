import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box
} from '@mui/material';
import { AccountCircle, Padding } from '@mui/icons-material';
import Axios from "axios";
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function ProfileIcon() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      
      Axios({
        method: "POST",
        withCredentials: true,
        url: "http://localhost:3001/logout?_method=DELETE",
      }).then(res => { 
        if(res.data === "Logged out"){ 
          window.location.href = '/dashboard'
        }
      })
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [userDataName, setUserDataName] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/api/check-login", { withCredentials: true });
        if (response.data.loggedIn) {
          setUserDataName(response.data.userName);
        } else {
          setUserDataName('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      <IconButton onClick={handleOpenMenu} color="inherit">
        <AccountCircle />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {/* Add profile content here */}
        <Box>
          <Typography sx={{marginRight: 1}}>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
              {userDataName}         
          </Typography>
          <MenuItem onClick={handleLogout}>
          <ExitToAppIcon/>
            Logout
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default ProfileIcon;
