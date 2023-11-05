import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
//
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import AccountCircleIcon from '@mui/icons-material/Album';
import IconForNetwork from '@mui/icons-material/Lan';
import IconForLicences from '@mui/icons-material/CardMembership';
//
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
//
import ProfileIcon from '../components/ProfileIcon';
import InfoIcon from '../components/InfoIcon';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 180;
const icons = [<DashboardIcon />, <DevicesIcon />, <AccountCircleIcon />, <IconForNetwork />, <IconForLicences />];
const icons2 = [<PeopleIcon />, <HistoryIcon />];



export default function PermanentDrawerLeft() {

  const location = useLocation();
  const routeWithoutSlash = location.pathname.startsWith('/') ? location.pathname.substring(1) : location;
  const capitalizedRoute = routeWithoutSlash.charAt(0).toUpperCase() + routeWithoutSlash.slice(1);

  console.log(capitalizedRoute);

  return (
    <Box sx={{ display: 'flex' , zIndex: 1000}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        
        <Toolbar>
          <Typography variant="h7" noWrap component="div">
            {capitalizedRoute}
          </Typography>
          <Box sx={{
              display: 'flex',
              ml: 'auto',
            }}>
            <InfoIcon/>
            <ProfileIcon/>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        
      >
        <Toolbar>
        <Box
          sx={{
            display: 'flex',
            ml: 'left',
            
          }}
          >
          <AssessmentIcon color='#163694' fontSize='large'/>
          <Typography sx={{marginTop: '2px'}} variant="h6" noWrap>DevInfo</Typography>
        </Box>
        </Toolbar>
        
        
        <List>
          {['Dashboard', 'Devices', 'IDF', 'Network', 'Licences'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
                <ListItemIcon>
                  {icons[index]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Users', 'History'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} to={`/${text.toLowerCase()}`}>
                <ListItemIcon>
                  {icons2[index]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
    </Box>
  );
}