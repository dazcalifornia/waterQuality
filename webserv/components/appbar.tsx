import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const MyAppBar = ({ currentPage }:any) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">{currentPage}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;

