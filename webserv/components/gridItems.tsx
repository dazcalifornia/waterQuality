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

interface GridItemsProps {
  id: string;
  handleClick: (id: string) => void;
  isSelected: boolean;
  data: any;
  unit: string;
}

const GridItems: React.FC<GridItemsProps> = ({
  id,
  handleClick,
  isSelected,
  data,
  unit,
}) => {
  const dataForId = data[id] || [];
  const latestData =
    dataForId.length > 0 ? dataForId[dataForId.length - 1] : undefined;

  const circle = (
    <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles }}>
      <Typography variant="body1">
        {latestData !== undefined ? latestData.toFixed(2) : ""}
      </Typography>
    </Box>
  );

  const diff =
    latestData && dataForId[dataForId.length - 2]
      ? Math.abs(latestData - dataForId[dataForId.length - 2])
      : null;

  let badgeColor: BadgeProps["color"] = "default";

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
