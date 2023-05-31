import React,{useState} from 'react';

import AccordionItem from '@/components/accordian';
import { 
  Grid,
  Badge,
  Box,
  Paper,
  Typography,
  Collapse
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
import { Line } from 'react-chartjs-2';

const shapeStyles = { bgcolor: 'primary.main', width: 40, height: 40 };
const shapeCircleStyles = { borderRadius: '50%' };


const chartData = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        label: 'Data',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }} />
);

const GridItems = ({id,handleClick,isSelected}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

   return (
   <Grid item  xs={4} md={3}>
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
          color="secondary"
          overlap="circular"
          badgeContent=""
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          style={{ transform: 'scale(1.5)' }}
        >
          {circle}
        </Badge>
        <Typography variant="subtitle1" style={{ marginTop: 8 }}>
          Badge: {id}
        </Typography>
        <Typography variant="subtitle2">ID: {id}</Typography>
        <button onClick={handleExpand}>{isExpanded ? 'Collapse' : 'Expand'}</button>
        <Collapse in={isExpanded}>
          <div style={{ width: '100%', marginTop: 16 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </Collapse>
      </div>
    </Grid>
  );
}
export default GridItems;
