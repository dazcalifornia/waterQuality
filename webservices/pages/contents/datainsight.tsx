import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import csvtojson from "csvtojson";

interface SalinityData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function DataInsights() {
  const [salinity, setSalinity] = useState<SalinityData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getSalinity = async () => {
      const response = await fetch("../../data/salinity.csv");
      const csvData = await response.text();
      const jsonData = await csvtojson().fromString(csvData);

      const salinityLabels = jsonData.map((row) => row["Datetime"]);
      const salinityData = jsonData.map((row) => row["Salinity (PSU)"]);

      setSalinity({
        labels: salinityLabels,
        datasets: [
          {
            label: "Salinity",
            data: salinityData,
            fill: false,
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgba(75, 192, 192, 0.2)",
          },
          {
              label: "conductivity",
              data: [1,2,3,4,5,6,7,8,9,10],
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
          },
          {
              label: "Turbitity",
              data: [1,2,3,4,5,6,7,8,9,10],
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
          },
          {
              label: "sea temperature",
              data: [1,2,3,4,5,6,7,8,9,10],
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
          },
          {
              label: "DO saturation",
              data: [1,2,3,4,5,6,7,8,9,10],
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
          },
          {
              label: "Chlorophyll",
              data: [1,2,3,4,5,6,7,8,9,10],
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
      });
    };
    getSalinity();
  }, []);

  return (
    <div>
      <h1>Data</h1>
      <Line data={salinity} />
    </div>
  );
}
