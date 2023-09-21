import React from "react";
import { Grid, Badge, Box, Typography, BadgeProps, Paper } from "@mui/material";
import { styled } from "@mui/system";

const shapeStyles = {
  bgcolor: "white",
  width: 50,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const shapeBoxStyles = { borderRadius: 8 };

const FluentTypography = styled(Typography)(() => ({
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(0, 0, 0, 0.87)",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
}));

const StyledBadge = styled(Badge)(() => ({
  background: `linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))`,
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
  borderRadius: "50%",
  transform: "scale(1.5)",
  transition: "box-shadow 0.3s",
  "&.selected": {
    boxShadow: `0 4px 10px rgba(6, 199, 85, 0.4)`,
  },
}));

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

  const box = (
    <Paper elevation={3} sx={{ ...shapeStyles, ...shapeBoxStyles }}>
      <FluentTypography>
        {latestData !== undefined ? latestData.toFixed(2) : ""}
      </FluentTypography>
    </Paper>
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
          padding: 12,
        }}
      >
        <StyledBadge
          color={badgeColor}
          overlap="circular"
          badgeContent={diff !== null ? `${diff.toFixed(2)}` : ""}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          className={isSelected ? "selected" : ""}
        >
          {box}
        </StyledBadge>
        <Typography style={{ marginTop: 20 }}>
          {id} {unit}
        </Typography>
      </div>
    </Grid>
  );
};

export default GridItems;
