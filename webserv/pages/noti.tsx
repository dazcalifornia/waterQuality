import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      .get<Notification>('http://localhost:8000/noti')
      .then((res) => {
        setNotification(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Notification</h1>
      {notification && (
        <ul>
          <li>
            Salinity: {notification.Salinity ? notification.Salinity.percent_diff.toFixed(2) : 'N/A'}%
          </li>
          <li>
            Conductivity: {notification.Conductivity ? notification.Conductivity.percent_diff.toFixed(2) : 'N/A'}%
          </li>
          <li>
            Turbidity: {notification.Turbidity ? notification.Turbidity.percent_diff.toFixed(2) : 'N/A'}%
          </li>
          <li>
            SeaTemp: {notification.SeaTemp ? notification.SeaTemp.percent_diff.toFixed(2) : 'N/A'}%
          </li>
          <li>
            DO: {notification.DO ? notification.DO.percent_diff.toFixed(2) : 'N/A'}%
          </li>
          <li>
            Chlorophyll: {notification.chlorophyll ? notification.chlorophyll.percent_diff.toFixed(2) : 'N/A'}%
          </li>
        </ul>
      )}
    </div>
  );
};

export default NotiPage;
