import React,{useState} from 'react';

import AccordionItem from '@/components/accordian';
import { 
  Grid,
  Badge,
  Box,
  Paper,
  Typography,
  Collapse,
  BadgeProps
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

const shapeStyles = { bgcolor: 'primary.main', width: 50, height: 50 };
const shapeCircleStyles = { borderRadius: '50%' };


const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }} />
);


const GridItems = ({ id, handleClick, isSelected, data }:any) => {

  const diff =
    data[id][10] && data[id][11] ? Math.abs(data[id][11] - data[id][10]) : null;
  

  let badgeColor: BadgeProps['color'] = 'default'; // Explicitly specify the type

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
      </div>
    </Grid>
  );
};

export default GridItems;
