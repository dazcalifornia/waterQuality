import React from 'react';

import { Grid, Paper } from '@mui/material';

const GridItems = ({id,handleClick}) => {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper onClick={()=>handleClick(id)}>{id}</Paper>
    </Grid>
  );
}
export default GridItems;
