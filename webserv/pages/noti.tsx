import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Notification {
  Salinity: {
    percent_diff: number;
  };
  Conductivity: {
    percent_diff: number;
  };
  Turbidity: {
    percent_diff: number;
  };
  SeaTemp: {
    percent_diff: number;
  };
  DO: {
    percent_diff: number;
  };
  chlorophyll: {
    percent_diff: number;
  };
}

const NotiPage = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    axios
      .get<Notification>("http://localhost:8000/noti")
      .then((res) => {
        setNotification(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getSeverity = (
    value: number,
    ranges: [number, number],
    dangerThreshold: number
  ): string => {
    if (value >= dangerThreshold) {
      return "danger";
    }
    const [lower, upper] = ranges;
    if (value >= lower && value <= upper) {
      return "warning";
    }
    return "notify";
  };

  const renderNotification = (
    label: string,
    value: number | null,
    ranges: [number, number],
    dangerThreshold: number
  ) => {
    const severity =
      value !== null ? getSeverity(value, ranges, dangerThreshold) : "";

    if (severity === "notify") {
      return null; // Hide notifications with severity 'notify'
    }

    return (
      <Accordion key={label}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {value !== null
              ? `${label}: ${value.toFixed(2)}%`
              : `${label}: N/A`}
            <br />
            {value !== null && <span>Severity: {severity}</span>}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div>
      <h1>Notification</h1>
      {notification && (
        <div>
          {renderNotification(
            "Salinity",
            notification.Salinity?.percent_diff,
            [0, 30],
            40
          )}
          {renderNotification(
            "Conductivity",
            notification.Conductivity?.percent_diff,
            [0, 0],
            0
          )}
          {renderNotification(
            "Turbidity",
            notification.Turbidity?.percent_diff,
            [26.68, 133],
            133
          )}
          {renderNotification(
            "SeaTemp",
            notification.SeaTemp?.percent_diff,
            [0, 0],
            0
          )}
          {renderNotification("DO", notification.DO?.percent_diff, [0, 0], 0)}
          {renderNotification(
            "Chlorophyll",
            notification.chlorophyll?.percent_diff,
            [0, 0],
            0
          )}
        </div>
      )}
    </div>
  );
};

export default NotiPage;
