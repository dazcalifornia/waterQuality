import React from 'react';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MapIcon from '@mui/icons-material/Map';
import UpdateIcon from '@mui/icons-material/Update';


const Navigation = ({currentPage, handleChangePage} :any) => {
  return (
      <BottomNavigation
        style={{ position: 'fixed', bottom: 0, width: '100%' }}
        value={currentPage}
        onChange={handleChangePage}
        showLabels
        >
        <BottomNavigationAction label="Dashboard" value="dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="My device" value="device" icon={<DeviceHubIcon />} />
        <BottomNavigationAction label="Notifications" value="notifications" icon={<NotificationsIcon />} />
        <BottomNavigationAction label="Map" value="map" icon={<MapIcon />} />
        <BottomNavigationAction label="Forecasts" value="forecast" icon={<UpdateIcon />} />
      </BottomNavigation>
    );
}
export default Navigation;
