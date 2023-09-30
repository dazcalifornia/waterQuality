import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { Bar } from "react-chartjs-2";

interface ForecastData {
  Datetime: string;
  Salinity: number;
  Turbidity: number;
  SeaTemp: number;
  DOSaturation: number;
  Chlorophyll: number;
}
const filledChipClass = "filled-chip";
const outlinedChipClass = "outlined-chip";

const ForecastPage = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [selectedChart, setSelectedChart] = useState("All");

  const handleChartChange = (chartname: any) => {
    setSelectedChart(chartname);
  };

  useEffect(() => {
    axios
      .get<ForecastData[]>("https://cactus.franx.dev:8000/forecast")
      .then((response) => {
        setForecastData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const labels = forecastData.map((item) => item.Datetime);
  const salinityData = forecastData.map((item) => item.Salinity);
  const turbidityData = forecastData.map((item) => item.Turbidity);
  const seaTempData = forecastData.map((item) => item.SeaTemp);
  const doSaturationData = forecastData.map((item) => item.DOSaturation);
  const chlorophyllData = forecastData.map((item) => item.Chlorophyll);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Salinity",
        data: salinityData,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Turbidity",
        data: turbidityData,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Sea Temperature",
        data: seaTempData,
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        borderWidth: 1,
      },
      {
        label: "DO Saturation",
        data: doSaturationData,
        backgroundColor: "rgba(255,205,86,0.2)",
        borderColor: "rgba(255,205,86,1)",
        borderWidth: 1,
      },
      {
        label: "Chlorophyll-a",
        data: chlorophyllData,
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ],
    trendlineLinear: {
      colorMin: "red",
      lineStyle: "dotted",
      width: 2,
      projection: false, // optional
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to adjust its height
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };
  const selectedChartData = {
    labels: labels,
    datasets: chartData.datasets.filter((dataset) =>
      selectedChart === "All" ? true : dataset.label === selectedChart
    ),
    trendlineLinear: {
      colorMin: "red",
      lineStyle: "dotted",
      width: 2,
      projection: false, // optional
    },
  };

  return (
    <div>
      {forecastData.length > 0 ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap", // Wrap chips to new line on small screens
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Chip
              label="All"
              onClick={() => handleChartChange("All")}
              className={
                selectedChart === "All" ? filledChipClass : outlinedChipClass
              }
              style={{
                backgroundColor:
                  selectedChart === "All" ? "#073763" : "transparent",
                color: selectedChart === "All" ? "white" : "#073763",
                border: selectedChart === "All" ? "none" : "1px solid #073763",
              }}
            />
            {chartData.datasets.map((dataset) => (
              <Chip
                key={dataset.label}
                label={dataset.label}
                onClick={() => handleChartChange(dataset.label)}
                className={
                  selectedChart === dataset.label
                    ? filledChipClass
                    : outlinedChipClass
                }
                style={{
                  backgroundColor:
                    selectedChart === dataset.label ? "#073763" : "transparent",
                  color: selectedChart === dataset.label ? "white" : "#073763",
                  border:
                    selectedChart === dataset.label
                      ? "none"
                      : "1px solid #073763",
                }}
              />
            ))}
          </div>
          <div style={{ height: "60vh", marginBottom: "20px" }}>
            <Bar data={selectedChartData} options={chartOptions} />
          </div>{" "}
          <Divider style={{ margin: "20px" }} />
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Salinity</TableCell>
                  <TableCell>Turbidity</TableCell>
                  <TableCell>SeaTemp</TableCell>
                  <TableCell>DOSaturation</TableCell>
                  <TableCell>Chlorophyll</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forecastData.map((item) => (
                  <TableRow key={item.Datetime}>
                    <TableCell>{item.Datetime}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.Salinity.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.Turbidity.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.SeaTemp.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.DOSaturation.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item.Chlorophyll.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
};

export default ForecastPage;
