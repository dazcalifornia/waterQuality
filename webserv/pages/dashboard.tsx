import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import GridItems from '@/components/gridItems';

interface WaterData {
  Datetime: string[];
  Salinity: string[]; // Update type to string[]
  Turbidity: string[]; // Update type to string[]
  Conductivity: string[]; // Update type to string[]
  DO: string[]; // Update type to string[]
  SeaTemp: string[]; // Update type to string[]
  chlorophyll: string[]; // Update type to string[]
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
  const [handleCharts, setHandleCharts] = useState<any>({});
  const [expanded, setExpanded] = useState<string | false>(false);
  const [timeRange, setTimeRange] = useState<string>('');

  const getData = useCallback((timeRange?: string) => {
    const url = timeRange ? `http://localhost:8000/db2?time_range=${timeRange}` : 'http://localhost:8000/db';

    axios
      .get<WaterData>(url)
      .then((res) => {
        const { Datetime, ...restData } = res.data;
        let formattedData: Omit<WaterData, 'Datetime'>;

        if (timeRange === '24hours') {
          formattedData = {
            Salinity: restData.Salinity,
            Turbidity: restData.Turbidity,
            Conductivity: restData.Conductivity,
            DO: restData.DO,
            SeaTemp: restData.SeaTemp,
            chlorophyll: restData.chlorophyll,
          };
          setDate(Datetime);
        } else {
          formattedData = {
            Salinity: restData.Salinity.slice(0, 12),
            Turbidity: restData.Turbidity.slice(0, 12),
            Conductivity: restData.Conductivity.slice(0, 12),
            DO: restData.DO.slice(0, 12),
            SeaTemp: restData.SeaTemp.slice(0, 12),
            chlorophyll: restData.chlorophyll.slice(0, 12),
          };
          setDate(Datetime.slice(0, 12));
        }

        setWaterData((prevData) => ({
          ...prevData,
          ...formattedData,
        }));
        console.log(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getData(timeRange);
  }, [getData, timeRange]);

  const handleClick = (id: string) => {
    setSelectedItem(id);
    console.log('id', id);
    const testChart = {
      labels: date,
      datasets: [
        {
          type: 'bar',
          label: id,
          data: waterData[id as keyof WaterData],
          backgroundColor: generateRainbowPastelColors(waterData[id as keyof WaterData].length),
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
          borderRadius: 10, // Rounded corners for bars
          order: 1,
        },
        {
          type: 'line',
          label: 'trendLine',
          // @ts-ignore
          data: calculateTrendLine(waterData[id as keyof WaterData]),
          fill: false,
          borderColor: 'rgba(255,0,0,1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: 'rgba(255,0,0,1)',
          pointBorderColor: 'rgba(255,0,0,1)',
          pointBorderWidth: 2,
          order: 0,
        },
      ],
    };
    setHandleCharts(testChart);
  };

  // Function to generate rainbow pastel colors
  const generateRainbowPastelColors = (numColors: number) => {
    const colors = [];
    const hueStep = 360 / numColors;

    for (let i = 0; i < numColors; i++) {
      const hue = i * hueStep;
      const saturation = 70 + Math.random() * 10;
      const lightness = 80 + Math.random() * 10;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }

    return colors;
  };

  const calculateTrendLine = (data: number[]): number[] => {
    const n = data.length;
    const xSum = data.reduce((sum, value, index) => sum + index, 0);
    const ySum = data.reduce((sum, value) => sum + value, 0);
    const xySum = data.reduce((sum, value, index) => sum + index * value, 0);
    const xSquareSum = data.reduce((sum, value, index) => sum + index * index, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    const trendLine = data.map((value, index) => slope * index + intercept);

    return trendLine;
  };

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRefresh = (selectedTimeRange: string) => {
    setTimeRange(selectedTimeRange);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedItem} Chart By ${timeRange}`,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
        },
      },
    },
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

      <div style={{ marginTop: '20px' }}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>

<AccordionSummary>
  <Typography>Time Range</Typography>
</AccordionSummary>
<AccordionDetails>
  <div>
    <Button onClick={() => handleRefresh('')}>Years</Button>
    <Button onClick={() => handleRefresh('week')}>Week</Button>
    <Button onClick={() => handleRefresh('month')}>Month</Button>
    <Button onClick={() => handleRefresh('24hours')}>24 Hours</Button>
  </div>
</AccordionDetails>
</Accordion>
</div>

{selectedItem && (
  <div style={{ marginTop: '20px' }}>
    <Line data={handleCharts} options={chartOptions} height={400} />
  </div>
)}
</div>
);
};

export default Dashboard;
