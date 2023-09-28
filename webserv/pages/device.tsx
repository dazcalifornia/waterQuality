import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Air, Cloud, ArrowRight, Add } from "@mui/icons-material";

const formatDeviceDataName = (dataName: any) => {
  switch (dataName) {
    case "Conductivity_mScm":
      return "Conductivity";
    case "Turbitity_FTU":
      return "Turbidity";
    case "Sea_temperature_°C":
      return "Sea Temperature";
    case "Chlorophylla_ppb":
      return "Chlorophyll-a";
    case "DO_saturation_":
      return "Dissolved Oxygen Saturation";
    case "airTemp":
      return "Air Temperature";
    case "relativehumid":
      return "Relative Humidity";
    case "atm":
      return "Atmospheric Pressure";
    case "windSpeed":
      return "Wind Speed";
    case "windDirect":
      return "Wind Direction";

    default:
      return dataName.replace(/_/g, " ").replace(/\w\S*/g, (word: any) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
  }
};

const DevicePage = () => {
  const [deviceData, setDeviceData] = useState<{ [key: string]: string[] }>({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the JSON data from the server
    axios
      .get("https://cactus.franx.dev:8000/device")
      .then((response) => {
        setDeviceData(response.data);
        console.log("deviceData: ", deviceData);
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            All Device
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={handleModalOpen}
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
          >
            Add Device
          </Button>
        </Toolbar>
      </AppBar>
      {Object.entries(deviceData).map(([tableName, columns]) => (
        <Accordion key={tableName} style={{ marginBottom: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemIcon>
              {tableName === "WaterData" ? <Cloud /> : <Air />}
            </ListItemIcon>
            <Typography>
              {tableName === "WaterData" ? "Sriracha" : "North Bongkot"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Data in this table:
            </Typography>
            <List>
              {columns
                .filter((column) => column !== "Datetime") // Filter out "Datetime" column
                .map((column) => (
                  <ListItem
                    key={column}
                    style={{ marginBottom: "5px", fontSize: "16px" }}
                  >
                    <ListItemIcon>
                      <ArrowRight />
                    </ListItemIcon>
                    <ListItemText primary={formatDeviceDataName(column)} />{" "}
                    {/* Format the column name */}
                  </ListItem>
                ))}
            </List>
            <Typography variant="body2">
              {`You can add more data to this table by clicking the "Add Data" but
              this is not implemented yet.`}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={4}
            style={{
              padding: "20px",
              width: "80%",
              maxWidth: "500px",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Device Modal
            </Typography>
            <Typography variant="body1">
              This is where you can add a new device. However, this
              functionality is not implemented yet.
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleModalClose}
                color="primary"
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalClose}
                color="primary"
                variant="contained"
              >
                Buy
              </Button>
            </div>
          </Paper>
        </div>
      </Modal>
    </Container>
  );
};

export default DevicePage;
