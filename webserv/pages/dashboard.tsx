import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Grid, Chip, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import GridItems from "@/components/gridItems";

interface WaterData {
  Datetime: string[];
  Salinity: string[]; // Update type to string[]
  Turbidity: string[]; // Update type to string[]
  Conductivity: string[]; // Update type to string[]
  DO: string[]; // Update type to string[]
  SeaTemp: string[]; // Update type to string[]
  chlorophyll: string[]; // Update type to string[]
}

interface NorthBData {
  Datetime: Date[];
  airTemp: number[];
  relativeHumidity: number[];
  atm: number[];
  windSpeed: number[];
  windDirect: number[];
}

const Dashboard = () => {
  const [northBData, setNorthBData] = useState<NorthBData>({
    Datetime: [],
    airTemp: [],
    relativeHumidity: [],
    atm: [],
    windSpeed: [],
    windDirect: [],
  });
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
  const [timeRange, setTimeRange] = useState<string>("");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("Src");

  const timeRanges = [
    { label: "Years", value: "" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "24 Hours", value: "24hours" },
  ];
  const dataSources = [
    { label: "set1", value: "Src" },
    { label: "set2", value: "northB" },
  ];

  const getData = useCallback((timeRange?: string) => {
    const url = timeRange
      ? `http://localhost:8000/db2?time_range=${timeRange}`
      : "http://localhost:8000/db";

    axios
      .get<WaterData>(url)
      .then((res) => {
        const { Datetime, ...restData } = res.data;
        let formattedData: Omit<WaterData, "Datetime">;

        if (timeRange === "24hours") {
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

  //get NorthB data with time range using http://localhost:8000/north_bongkot_data ednpoint
  const getNorthBData = useCallback((timeRange?: string) => {
    const url = timeRange
      ? `http://localhost:8000/north_bongkot_data?time_range=${timeRange}`
      : "http://localhost:8000/north_bongkot_data";

    axios.get<NorthBData>(url).then((res) => {
      console.log("Response data:", res.data); // Add this Line
    });
  }, []);

  useEffect(() => {
    if (selectedDataSource === "Src") {
      getData(timeRange);
    } else if (selectedDataSource === "northB") {
      getNorthBData(timeRange);
    }
  }, [getData, timeRange, selectedDataSource, getNorthBData]);

  const handleClick = (id: string) => {
    setSelectedItem(id);
    const testChart = {
      labels: date,
      datasets: [
        {
          type: "bar",
          label: id,
          data: waterData[id as keyof WaterData].map((value) =>
            parseFloat(value)
          ),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderRadius: 10,
          order: 1,
        },
        {
          type: "line",
          label: "trendLine",
          data: calculateTrendLine(
            waterData[id as keyof WaterData].map((value) => parseFloat(value))
          ),
          fill: false,
          borderColor: "rgba(255,0,0,1)",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: "rgba(255,0,0,1)",
          pointBorderColor: "rgba(255,0,0,1)",
          pointBorderWidth: 2,
          order: 0,
        },
      ],
    };
    setHandleCharts(testChart);
  };

  const calculateTrendLine = (data: number[]): number[] => {
    const n = data.length;
    const xSum = data.reduce((sum, value, index) => sum + index, 0);
    const ySum = data.reduce((sum, value) => sum + value, 0);
    const xySum = data.reduce((sum, value, index) => sum + index * value, 0);
    const xSquareSum = data.reduce(
      (sum, value, index) => sum + index * index,
      0
    );

    const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    const trendLine = data.map((value, index) => slope * index + intercept);

    return trendLine;
  };

  const handleRefresh = (selectedTimeRange: string) => {
    setTimeRange(selectedTimeRange);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
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
          color: "rgba(0, 0, 0, 0.1)",
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
      <div style={{ margin: "16px" }}>
        <div>
          <>
            {dataSources.map((source) => (
              <Chip
                key={source.value}
                label={source.label}
                onClick={() => setSelectedDataSource(source.value)}
                variant={
                  selectedDataSource === source.value ? "filled" : "outlined"
                }
                color="primary"
                style={{ margin: "4px" }}
              />
            ))}
          </>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {selectedDataSource === "Src" ? (
          <div>
            {timeRanges.map((range) => (
              <Chip
                key={range.value}
                label={range.label}
                onClick={() => handleRefresh(range.value)}
                variant={timeRange === range.value ? "filled" : "outlined"}
                color="primary"
                style={{ margin: "4px" }}
              />
            ))}
          </div>
        ) : (
          <Typography variant="h6">North B</Typography>
        )}
      </div>
      <Grid container spacing={2}>
        {Object.keys(waterData).map((key) => {
          if (key !== "Datetime") {
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
        <>
          <div style={{ marginTop: "20px" }}>
            <Line data={handleCharts} options={chartOptions} height={400} />
          </div>
        </>
      )}

      {selectedItem && (
        <>
          {/* Display chart for selected water quality item */}
          <div style={{ marginTop: "20px" }}>
            <Line data={handleCharts} options={chartOptions} height={400} />
          </div>
        </>
      )}
      {selectedDataSource === "northB" && (
        <div style={{ marginTop: "20px" }}>
          {/* Display "northB" data */}
          <Typography variant="h6">North B</Typography>
          <Grid container spacing={2}>
            {Object.keys(northBData).map((key) => {
              if (key !== "Datetime") {
                return (
                  <GridItems
                    key={key}
                    id={key}
                    handleClick={handleClick}
                    isSelected={selectedItem === key}
                    data={northBData}
                  />
                );
              }
              return null;
            })}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
