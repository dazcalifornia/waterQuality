import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import axios from "axios";

interface Notification {
  status: string;
}

const MyAppBar = ({ currentPage, changePage }: any) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<
    Record<string, Notification>
  >({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Added state for drawer

  const typographyStyles = {
    flexGrow: 1,
    textAlign: "center",
  };

  const appBarStyles = {
    backgroundColor: "#073763",
    zIndex: 1400, // Increased zIndex to ensure AppBar is above the Drawer
  };

  useEffect(() => {
    axios
      .get("https://cactus.franx.dev:8000/noti2")
      .then((res) => {
        const responseData: { [key: string]: Notification } = res.data;
        const filteredEntries = Object.entries(responseData).filter(
          ([_, data]) => data.status !== ""
        );

        const objectNamesWithStatus = filteredEntries.map(
          ([objectName]) => objectName
        );

        setNotificationCount(objectNamesWithStatus.length);
        setNotifications(responseData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderNotifications = () => {
    return (
      <div>
        {Object.keys(notifications).map((valueKey, index) => {
          const notification = notifications[valueKey as any];
          return (
            <div key={index} style={{ marginBottom: "10px" }}>
              {notification.status && (
                <div>
                  <span>
                    {valueKey} - {notification.status}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar position="fixed" sx={appBarStyles}>
        <Toolbar>
          <div onClick={toggleDrawer}>
            {/* Hamburger icon with 16px size */}
            <div style={{ fontSize: "24px" }}>&#9776;</div>
          </div>
          <Typography variant="h6" sx={typographyStyles}>
            {currentPage}
          </Typography>
          <div
            onClick={() => {
              setShowNotifications(!showNotifications);
              // Change the page to Notifications when the button is clicked
              changePage("Notifications");
            }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </div>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        style={{ zIndex: 1300, paddingTop: "200px" }} // Added zIndex to ensure Drawer is below AppBar
      >
        <List>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "100px",
            }}
          >
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>Powered by</p>
            <div
              style={{
                display: "flex",
                margin: "10px",

                gap: "4px",
              }}
            >
              <img
                src="ptt.png"
                alt="Image 1"
                style={{ width: "100px", height: "100px", marginRight: "10px" }}
              />
              <img
                src="SSN.png"
                alt="Image 2"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <hr
              style={{
                width: "80%",
                height: "2px",
                background: "#073763",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />
          </div>
        </List>
      </Drawer>
    </>
  );
};

export default MyAppBar;
