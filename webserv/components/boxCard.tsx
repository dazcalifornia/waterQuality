import React from "react";
import { Grid, Badge, Box, Typography, BadgeProps, Paper } from "@mui/material";

const BoxCard = ({ id, handleClick, isSelected, data, unit }: any) => {
  return (
    <Grid item xs={12} md={3}>
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
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Typography variant="caption">
              {data[id] ? data[id][data[id].length - 1].toFixed(2) : ""}
            </Typography>
          }
        >
          <Paper
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: 3,
              p: 2,
            }}
          >
            <Typography variant="h4">{id}</Typography>
            <Typography variant="h6">{unit}</Typography>
          </Paper>
        </Badge>
      </div>
    </Grid>
  );
};
export default BoxCard;
