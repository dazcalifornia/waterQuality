import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Warning, Error } from "@mui/icons-material";

interface Notification {
  [key: string]: {
    percent_diff: number;
    status: string;
  };
}

const NotiPage = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    axios
      .get<Notification>("https://cactus.franx.dev:8000/noti2")
      .then((res) => {
        setNotification(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getSeverity = (status: string): string => {
    if (status.includes("Danger")) {
      return "danger";
    } else if (status.includes("Moderated")) {
      return "moderated";
    } else {
      return "ok";
    }
  };

  const renderNotification = (
    label: string,
    percentDiff: number,
    status: string
  ) => {
    if (!status) {
      return null; // Hide notifications with empty status
    }

    const severity = getSeverity(status);

    return (
      <Accordion key={label} className={`accordion ${severity}`}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{label}</Typography>
          {severity === "danger" && <Error />}
          {severity === "moderated" && <Warning />}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {`${label}: ${percentDiff.toFixed(2)}%`}
            <br />
            <span>Status: {status}</span>
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div>
      {notification && (
        <div>
          {Object.entries(notification).map(([label, data]) =>
            renderNotification(label, data.percent_diff, data.status)
          )}
        </div>
      )}
    </div>
  );
};

export default NotiPage;
