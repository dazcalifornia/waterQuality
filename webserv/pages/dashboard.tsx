import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import GridItems from '@/components/gridItems';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

import { Bar } from 'react-chartjs-2';
interface WaterData {
  Datetime: string[];
  Salinity: number[];
  Turbidity: number[];
  Conductivity: number[];
  DO: number[];
  SeaTemp: number[];
  chlorophyll: number[];
}

const Dashboard = () => {
  const [waterData, setWaterData] = useState<WaterData>({
    Datetime: [],
    Salinity: [],
    Turbidity: [],
    Conductivity: [],
    DO: [],
    SeaTemp: [],
    chlorophyll: [],
  });
  const [date, setDate] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);


const getData = useCallback(() => {
  axios
    .get<WaterData>('http://localhost:8000/db')
    .then((res) => {
      const { Datetime, ...restData } = res.data;
      const formattedData: Omit<WaterData, 'Datetime'> = {
        Salinity: [],
        Turbidity: [],
        Conductivity: [],
        DO: [],
        SeaTemp: [],
        chlorophyll: [],
      };

      const validKeys: (keyof Omit<WaterData, 'Datetime'>)[] = ['Salinity', 'Turbidity', 'Conductivity', 'DO', 'SeaTemp', 'chlorophyll'];

      validKeys.forEach((key) => {
        formattedData[key] = restData[key].slice(0, 12);
      });

      setWaterData((prevData) => ({
        ...prevData,
        ...formattedData,
      }));

      setDate(Datetime);
      console.log(formattedData);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);


  useEffect(() => {
    getData();
  }, [getData]);

  const [handleCharts, setHandleCharts] = useState({});

  const handleClick = (id: string) => {
    setSelectedItem(id);
    console.log("id", id);
    const testChart = {
      labels: date,
      datasets: [
        {
        data: waterData[id as keyof WaterData],
        label: id,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      ]
    }
    setHandleCharts(testChart);
  };

  

  return (
    <div>
      
<Grid container spacing={2}>
  {Object.keys(waterData).map((key) => {
    if (key !== 'Datetime') {
      return (
        <GridItems
          key={key}
          id={key}
          handleClick={handleClick}
          isSelected={selectedItem === key}
          data={waterData}
        />
      );
    }
    return null;
  })}
</Grid>


      {selectedItem && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Chart for {selectedItem}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Place your chart component here */}
            <Bar data={handleCharts} />
            <Typography>Chart goes here</Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default Dashboard;
