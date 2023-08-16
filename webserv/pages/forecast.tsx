import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

interface ForecastData {
  Datetime: string;
  Salinity: number;
  Turbidity: number;
  SeaTemp: number;
  DOSaturation: number;
  Chlorophyll: number;
}

const ForecastPage = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  useEffect(() => {
    axios
      .get<ForecastData[]>("http://localhost:8000/forecast")
      .then((response) => {
        setForecastData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {forecastData.length > 0 ? (
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
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
};

export default ForecastPage;
