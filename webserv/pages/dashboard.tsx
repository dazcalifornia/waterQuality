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
        setWaterData((prevState) => ({ ...prevState, ...restData, Datetime }));
        setDate(Datetime);
        console.log(restData);
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
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      ]
    }
    setHandleCharts(testChart);
  };

  const water = {
    labels: date,
    datasets: [
      {
        data: waterData.Salinity,
        label: "Salinity",
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        data: waterData.Turbidity,
        label: "Turbidity",
        fill: false,
        backgroundColor: "#742774",
        borderColor: "#742774"
      },
      {
        data: waterData.Conductivity,
        label: "Conductivity",
        fill: false,
        backgroundColor: "#ff0000",
        borderColor: "#ff0000"
      },
      {
        data: waterData.DO,
        label: "DO",
        fill: false,
        backgroundColor: "#00ff00",
        borderColor: "#00ff00"
      },
      {
        data: waterData.Seatemp,
        label: "Seatemp",
        fill: false,
        backgroundColor: "#0000ff",
        borderColor: "#0000ff"
      },
      {
        data: waterData.chlorophyll,
        label: "chlorophyll",
        fill: false,
        backgroundColor: "#ffff00",
        borderColor: "#ffff00"
      }
    ],
  };

  return (
    <div>
      <Grid container spacing={2}>
        {Object.keys(waterData).map((key) => (
          <GridItems
            key={key}
            id={key}
            handleClick={handleClick}
            isSelected={selectedItem === key}
          />
        ))}
       
      </Grid>

      {selectedItem && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Chart for {selectedItem}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Place your chart component here */}
            <Line data={handleCharts} />
            <Typography>Chart goes here</Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default Dashboard;
