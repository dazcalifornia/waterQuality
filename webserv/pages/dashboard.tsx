import React,{
  useState,
  useEffect,
  useCallback
} from 'react';

import axios from 'axios'
import {Grid, styled, Collapse} from '@mui/material';

import GridItems from '@/components/gridItems';
import AccordionItem from '@/components/accordian';

import PillButton from '@/components/PillButton';

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


const StyleGrid = styled(Grid)({
  '&.MuiPaper-root': {
    boxShadow:'none' 
  },
})


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




// fetch data and plot graph from localhost:8000/db
interface WaterData {
  Datetime: string[];
  Salinity: number[];
  Turbidity: number[];
  Conductivity: number[];
  DO: number[];
  Seatemp: number[];
  chlorophyll: number[];
}




const DashboardPage = () => {
  const [selectedGridItem, setSelectedGridItem] = useState(null);

  const handleGridItemClick = (gridItemId) => {
    if (selectedGridItem === gridItemId) {
      setSelectedGridItem(null);
    } else {
      setSelectedGridItem(gridItemId);
    }
  };

  //fetch 
  const [waterData, setWaterData] = useState<WaterData>({
    Datetime: [],
    Salinity: [],
    Turbidity: [],
    Conductivity: [],
    DO: [],
    Seatemp: [],
    chlorophyll: [],
  });
  const [date, setDate] = useState<string[]>([]);

  const getData = useCallback(() => {
    axios
      .get<WaterData>('http://localhost:8000/db')
      .then((res) => {
        const data = res.data;
        setWaterData(data);
        setDate(data.Datetime);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);




  return (
    <StyleGrid container spacing={2}>

      <Grid item xs={12}>
        <h1>Dashboard</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} direction="row">
          <GridItems id={1} handleClick={handleGridItemClick} isSelected={selectedGridItem === 1} />
          <GridItems id={2} handleClick={handleGridItemClick} isSelected={selectedGridItem === 2} />
          <GridItems id={3} handleClick={handleGridItemClick} isSelected={selectedGridItem === 3} />
          <GridItems id={4} handleClick={handleGridItemClick} isSelected={selectedGridItem === 4} />
          <GridItems id={5} handleClick={handleGridItemClick} isSelected={selectedGridItem === 5} />
          <GridItems id={6} handleClick={handleGridItemClick} isSelected={selectedGridItem === 6} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedGridItem && 
          <Collapse in={selectedGridItem} timeout="auto" unmountOnExit>
            <div style={{ width: '100%', paddingLeft:10, paddingRight:10}}>
            <Line data={chartData} options={chartOptions} />
          </div>
          </Collapse>
        }
      </Grid>
    </StyleGrid>
  );
}
export default DashboardPage;
