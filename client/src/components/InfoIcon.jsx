import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

function InfoButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div >
      
      <IconButton color="inherit" onClick={handleClickOpen}>
        <InfoIcon />
      </IconButton>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Info Dialog</DialogTitle>
        <DialogContent sx={{width:'300px'}}>
        <Typography>DevInfo v1.0</Typography> 
          <DialogContentText>
          By Andro Raspudic
          </DialogContentText>  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InfoButton;
