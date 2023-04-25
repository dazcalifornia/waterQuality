import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import csvtojson from "csvtojson";
import fs from "fs-extra";

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
      const csvData = await fs.readFile("../../data/salinity.csv", "utf-8");
      const response = await csvtojson().fromString(csvData);

      const salinityLabels = response.map((row) => row["Datetime"]);
      const salinityData = response.map((row) => row["Salinity (PSU)"]);

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

