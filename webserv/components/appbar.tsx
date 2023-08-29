import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

import axios from "axios";

interface Notification {
  status: string;
}

const MyAppBar = ({ currentPage }: any) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const typographyStyles = {
    flexGrow: 1,
    textAlign: "center",
  };

  const appBarStyles = {
    backgroundColor: "#073763",
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/noti2")
      .then((res) => {
        const filteredEntries = Object.entries(res.data).filter(
          ([_, data]) => (data.status as any) !== ""
        );

        const objectNamesWithStatus = filteredEntries.map(
          ([objectName]) => objectName
        );

        setNotificationCount(objectNamesWithStatus.length);
        setNotifications(res.data);
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

  return (
    <AppBar position="fixed" sx={appBarStyles}>
      <Toolbar>
        <Typography variant="h6" sx={typographyStyles}>
          {currentPage}
        </Typography>
        <div onClick={() => setShowNotifications(!showNotifications)}>
          <Badge badgeContent={notificationCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </div>
      </Toolbar>
      {showNotifications && renderNotifications()}
    </AppBar>
  );
};

export default MyAppBar;
