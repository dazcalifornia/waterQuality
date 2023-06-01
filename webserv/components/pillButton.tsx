import React from 'react';
import { Button, Typography } from '@mui/material';

const PillButton = ({ label, isActive }) => {
  return (
    <Button
      variant={isActive ? 'contained' : 'outlined'}
      color={isActive ? 'primary' : 'default'}
      style={{ margin: '0 4px' }}
    >
      <Typography variant="body2" style={{ textTransform: 'none' }}>
        {label}
      </Typography>
    </Button>
  );
};

export default PillButton;
