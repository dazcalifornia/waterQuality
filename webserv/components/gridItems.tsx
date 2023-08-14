import React from "react";
import {
  Grid,
  Badge,
  Box,
  Paper,
  Typography,
  Collapse,
  BadgeProps,
} from "@mui/material";

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

const shapeStyles = {
  bgcolor: "white",
  width: 50,
  height: 50,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px solid  #073763",
};

const shapeCircleStyles = { borderRadius: "50%" };

const GridItems = ({ id, handleClick, isSelected, data }: any) => {
  const latestData = data[id].slice(-1)[0]; // Get the last element of the data array

  const circle = (
    <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }}>
      <Typography variant="body1">
        {latestData !== undefined ? latestData.toFixed(2) : ""}
      </Typography>
    </Box>
  );
  const diff =
    latestData && data[id][data[id].length - 2]
      ? Math.abs(latestData - data[id][data[id].length - 2])
      : null;

  let badgeColor: BadgeProps["color"] = "default";
  let unit = "";

  if (id === "Salinity") {
    unit = "mg/l";
  } else if (id === "SeaTemp") {
    unit = "°C";
  } else if (id === "pH") {
    unit = "pH";
  } else if (id === "DO") {
    unit = "mg/l";
  } else if (id === "Turbidity") {
    unit = "NTU";
  } else if (id === "Chlorophyll") {
    unit = "µg/l";
  } else if (id === "Conductivity") {
    unit = "µS/cm";
  } else if (id === "chlorophyll") {
    unit = "µg/l";
  }
  // Add more conditions for other data types

  if (diff !== null) {
    if (diff >= 10) {
      badgeColor = "error";
    } else if (diff >= 5) {
      badgeColor = "warning";
    } else {
      badgeColor = "success";
    }
  }

  return (
    <Grid item xs={4} md={3}>
      <div
        onClick={() => handleClick(id)}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          border: isSelected ? "2px solid #000" : "2px solid transparent",
          borderRadius: 8,
        }}
      >
        <Badge
          color={badgeColor}
          overlap="circular"
          badgeContent={diff !== null ? `${diff.toFixed(2)}` : ""}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          style={{ transform: "scale(1.5)", fontSize: "10px" }}
        >
          {circle}
        </Badge>
        <Typography style={{ marginTop: 20 }}>
          {id} {unit}
        </Typography>
      </div>
    </Grid>
  );
};

export default GridItems;
