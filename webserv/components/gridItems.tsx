import React from 'react';
import {
  Grid,
  Badge,
  Box,
  Paper,
  Typography,
  Collapse,
  BadgeProps,
} from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);


const shapeStyles = {
  bgcolor: 'white',
  width: 50,
  height: 50,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid blue',
};

const shapeCircleStyles = { borderRadius: '50%' };


const GridItems = ({ id, handleClick, isSelected, data }: any) => {
  const latestData = data[id].slice(-1)[0]; // Get the last element of the data array

  const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }}>
    <Typography variant="subtitle1">
      {latestData !== undefined ? latestData.toFixed(2) : ''}
    </Typography>
  </Box>
);
  const diff =
    latestData && data[id][data[id].length - 2]
      ? Math.abs(latestData - data[id][data[id].length - 2])
      : null;

  let badgeColor: BadgeProps['color'] = 'default';

  if (diff !== null) {
    if (diff >= 10) {
      badgeColor = 'error';
    } else if (diff >= 5) {
      badgeColor = 'warning';
    } else {
      badgeColor = 'success';
    }
  }

  return (
    <Grid item xs={4} md={3}>
      <div
        onClick={() => handleClick(id)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 16,
          border: isSelected ? '2px solid #000' : '2px solid transparent',
          borderRadius: 8,
        }}
      >
        <Badge
          color={badgeColor}
          overlap="circular"
          badgeContent={diff !== null ? `${diff.toFixed(2)}` : ''}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          style={{ transform: 'scale(1.5)' }}
        >
          {circle}
        </Badge>
        <Typography variant="subtitle1" style={{ marginTop: 20 }}>
          {id}
        </Typography>
        <Typography variant="subtitle1" style={{ marginTop: 10 }}>
          {latestData !== undefined ? latestData.toFixed(2) : ''}
        </Typography>
      </div>
    </Grid>
  );
};

export default GridItems;
