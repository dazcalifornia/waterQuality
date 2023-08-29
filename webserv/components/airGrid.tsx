import React from "react";
import { Grid, Badge, Box, Typography, BadgeProps } from "@mui/material";

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

interface AirGridsProps {
  id: string;
  handleClick: (id: string) => void;
  isSelected: boolean;
  data: any;
  unit: string;
}

const AirGrids: React.FC<AirGridsProps> = ({
  id,
  handleClick,
  isSelected,
  data,
  unit,
}) => {
  const latestHourData = data.mean_per_hour[id];
  const latestData = latestHourData ? latestHourData[id] : undefined;
  let diff = 0;

  if (latestData) {
    const hourKeys = Object.keys(latestHourData);
    if (hourKeys.length > 1) {
      const latestHour = hourKeys[hourKeys.length - 1];
      const prevHour = hourKeys[hourKeys.length - 2];
      if (
        latestHourData[latestHour][id] !== undefined &&
        latestHourData[prevHour][id] !== undefined
      ) {
        diff = latestHourData[latestHour][id] - latestHourData[prevHour][id];
      }
    }
  }

  let badgeColor: BadgeProps["color"] = "default";

  if (diff >= 10) {
    badgeColor = "error";
  } else if (diff >= 5) {
    badgeColor = "warning";
  } else {
    badgeColor = "success";
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
          badgeContent={diff.toFixed(2)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          style={{ transform: "scale(1.5)", fontSize: "10px" }}
        >
          <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }}>
            <Typography variant="body1">
              {latestData !== undefined ? latestData.toFixed(2) : ""}
            </Typography>
          </Box>
        </Badge>
        <Typography style={{ marginTop: 20 }}>
          {id} {unit}
        </Typography>
      </div>
    </Grid>
  );
};

export default AirGrids;
