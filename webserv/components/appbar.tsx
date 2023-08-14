import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const MyAppBar = ({ currentPage }: any) => {
  const appBarStyles = {
    backgroundColor: "#073763", // Set background color for AppBar
  };

  const typographyStyles = {
    flexGrow: 1, // Allow Typography to take all available space
    textAlign: "center", // Align text to center
  };

  return (
    <AppBar position="fixed" sx={appBarStyles}>
      <Toolbar>
        <Typography variant="h6" sx={typographyStyles}>
          {currentPage}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
