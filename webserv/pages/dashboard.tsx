import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Grid, Chip, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  BarElement
);

import GridItems from "@/components/gridItems";
import BoxCard from "@/components/boxCard";

interface WaterData {
  Datetime: string[];
  Salinity: string[];
  Turbidity: string[];
  Conductivity: string[];
  DO: string[];
  SeaTemp: string[];
  chlorophyll: string[];
}

interface NorthBData {
  Datetime: string[];
  airTemp: string[];
  relativehumid: string[];
  atm: string[];
  windSpeed: string[];
  windDirect: string[];
}

const filledChipClass = "filled-chip";
const outlinedChipClass = "outlined-chip";

const dataNameMapping: Record<string, string> = {
  chlorophyll: "Chlorophyll-a",
  SeaTemp: "Sea Temp",
  //wind
  airTemp: "Air Temp",
  atm: "Atm",
  windSpeed: "Wind Speed",
  windDirect: "Wind Direct",
  relativehumid: "RU",
  // Add more mappings for other data names if needed
};

const formatDataName = (dataName: string): string => {
  return dataNameMapping[dataName] || dataName;
};

const Dashboard = () => {
  const [northBData, setNorthBData] = useState<NorthBData>({
    Datetime: [],
    airTemp: [],
    relativehumid: [],
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
  const [timeRange, setTimeRange] = useState<string>("");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("Src");

  const timeRanges = [
    { label: "Year", value: "" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "24 Hours", value: "24hours" },
  ];
  const dataSources = [
    { label: "Sriracha", value: "Src" },
    { label: "North Bongkot", value: "northB" },
  ];

  const getData = useCallback((timeRange?: string) => {
    const url = timeRange
      ? `https://cactus.franx.dev:8000/db3?time_range=${timeRange}`
      : "https://cactus.franx.dev:8000/db";

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
        } else if (timeRange === "week") {
          formattedData = {
            Salinity: restData.Salinity.slice(0, 7),
            Turbidity: restData.Turbidity.slice(0, 7),
            Conductivity: restData.Conductivity.slice(0, 7),
            DO: restData.DO.slice(0, 7),
            SeaTemp: restData.SeaTemp.slice(0, 7),
            chlorophyll: restData.chlorophyll.slice(0, 7),
          };
          setDate(Datetime.slice(0, 7));
        } else if (timeRange === "month") {
          formattedData = {
            Salinity: restData.Salinity.slice(0, 30),
            Turbidity: restData.Turbidity.slice(0, 30),
            Conductivity: restData.Conductivity.slice(0, 30),
            DO: restData.DO.slice(0, 30),
            SeaTemp: restData.SeaTemp.slice(0, 30),
            chlorophyll: restData.chlorophyll.slice(0, 30),
          };
          setDate(Datetime.slice(0, 30));
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getNorthBData = useCallback(
    (timeRange?: string) => {
      const url = timeRange
        ? `https://cactus.franx.dev:8000/north_bongkot_data?time_range=${timeRange}`
        : `https://cactus.franx.dev:8000/north_bongkot_data?time_range=""`;

      axios
        .get<NorthBData>(url)
        .then((res) => {
          const { Datetime, ...dataItem } = res.data;

          let formattedData: Omit<NorthBData, "Datetime">;

          if (timeRange === "month") {
            formattedData = {
              airTemp: dataItem.airTemp,
              relativehumid: dataItem.relativehumid,
              atm: dataItem.atm,
              windSpeed: dataItem.windSpeed,
              windDirect: dataItem.windDirect,
            };
            setDate(Datetime);
          } else if (timeRange === "week") {
            formattedData = {
              airTemp: dataItem.airTemp.slice(0, 7),
              relativehumid: dataItem.relativehumid.slice(0, 7),
              atm: dataItem.atm.slice(0, 7),
              windSpeed: dataItem.windSpeed.slice(0, 7),
              windDirect: dataItem.windDirect.slice(0, 7),
            };
            setDate(Datetime.slice(0, 7));
          } else if (timeRange === "24hours") {
            formattedData = {
              airTemp: dataItem.airTemp,
              relativehumid: dataItem.relativehumid,
              atm: dataItem.atm,
              windSpeed: dataItem.windSpeed,
              windDirect: dataItem.windDirect,
            };
            setDate(Datetime);
          } else {
            formattedData = {
              airTemp: dataItem.airTemp.slice(0, 12),
              relativehumid: dataItem.relativehumid.slice(0, 12),
              atm: dataItem.atm.slice(0, 12),
              windSpeed: dataItem.windSpeed.slice(0, 12),
              windDirect: dataItem.windDirect.slice(0, 12),
            };
            setDate(Datetime.slice(0, 12));
          }

          setNorthBData((prevData) => ({
            ...prevData,
            ...formattedData,
          }));
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    },
    [setNorthBData]
  );

  useEffect(() => {
    if (selectedDataSource === "Src") {
      getData(timeRange);
    } else if (selectedDataSource === "northB") {
      getNorthBData(timeRange);
    }
  }, [getData, timeRange, selectedDataSource, getNorthBData]);

  const handleClick = (id: string) => {
    setSelectedItem(id);
    const formattedId = formatDataName(id); // Format the data name
    if (selectedDataSource === "Src") {
      let waterChart = {
        labels: date,
        datasets: [
          {
            type: "bar",
            label: formattedId, // Use the formatted data name here
            data: waterData[id as keyof WaterData].map((value) =>
              parseFloat(value)
            ),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            order: 1,
          },
          {
            type: "line",
            label: "Trend Line",
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
      setHandleCharts(waterChart);
    } else if (selectedDataSource === "northB") {
      console.log("northB");
      let northBChart = {
        labels: date,
        datasets: [
          {
            type: "bar",
            label: formattedId, // Use the formatted data name here
            data: northBData[id as keyof NorthBData].map((value) =>
              parseFloat(value)
            ),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            order: 1,
          },
          {
            type: "line",
            label: "Trend line",
            data: calculateTrendLine(
              northBData[id as keyof NorthBData].map((value) =>
                parseFloat(value)
              )
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
      setHandleCharts(northBChart);
    }
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
        text: `${selectedItem}`,
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
      <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
        {dataSources.map((source) => (
          <Chip
            key={source.value}
            label={source.label}
            onClick={() => setSelectedDataSource(source.value)}
            className={
              selectedDataSource === source.value
                ? filledChipClass
                : outlinedChipClass
            }
            style={{
              backgroundColor:
                selectedDataSource === source.value ? "#073763" : "transparent",
              color: selectedDataSource === source.value ? "white" : "#073763",
              border:
                selectedDataSource === source.value
                  ? "none"
                  : "1px solid #073763",
              margin: "0 4px 0 4px",
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
        {timeRanges.map((range) => (
          <Chip
            key={range.value}
            label={range.label}
            onClick={() => handleRefresh(range.value)}
            className={
              timeRange === range.value ? filledChipClass : outlinedChipClass
            }
            style={{
              backgroundColor:
                timeRange === range.value ? "#073763" : "transparent",
              color: timeRange === range.value ? "white" : "#073763",
              border: timeRange === range.value ? "none" : "1px solid #073763",
              margin: "0 4px 0 4px",
            }}
          />
        ))}
      </div>

      <Grid container spacing={2} style={{ marginTop: 4 }}>
        {selectedDataSource === "Src" ? (
          <>
            {Object.keys(waterData).map((key) => {
              if (key !== "Datetime") {
                let unit = ""; // Define the unit based on the data type
                if (key === "Salinity") {
                  unit = "mg/l";
                } else if (key === "SeaTemp") {
                  unit = "°C";
                } else if (key === "pH") {
                  unit = "pH";
                } else if (key === "DO") {
                  unit = "mg/l";
                } else if (key === "Turbidity") {
                  unit = "NTU";
                } else if (key === "Chlorophyll") {
                  unit = "µg/l";
                } else if (key === "Conductivity") {
                  unit = "µS/cm";
                } else if (key === "chlorophyll") {
                  unit = "µg/l";
                }

                const formattedKey = formatDataName(key); // Format the data name
                return (
                  <>
                    <GridItems
                      key={key}
                      id={key}
                      handleClick={handleClick}
                      isSelected={selectedItem === key}
                      data={waterData}
                      unit={unit}
                      dataName={formattedKey} // Pass the formatted data name as prop
                    />
                  </>
                );
              }
              return null;
            })}
          </>
        ) : (
          <>
            {Object.keys(northBData).map((key) => {
              if (key !== "Datetime") {
                let unit = ""; // Define the unit based on the data type
                if (key === "airTemp") {
                  unit = "°C";
                } else if (key === "relativehumid") {
                  unit = "%";
                } else if (key === "atm") {
                  unit = "Pa";
                } else if (key === "windSpeed") {
                  unit = "m/s";
                } else if (key === "windDirect") {
                  unit = "360°";
                }
                const formattedKey = formatDataName(key); // Format the data name
                return (
                  <GridItems
                    key={key}
                    id={key}
                    handleClick={handleClick}
                    isSelected={selectedItem === key}
                    data={northBData}
                    unit={unit}
                    dataName={formattedKey} // Pass the formatted data name as prop
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </Grid>

      {selectedItem && (
        <>
          <div style={{ marginTop: "20px" }}>
            <Line data={handleCharts} options={chartOptions} height={400} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
