import React from 'react';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';


const Navigation = ({currentPage, handleChangePage} :any) => {
  return (
      <BottomNavigation
        style={{ position: 'fixed', bottom: 0, width: '100%' }}
        value={currentPage}
        onChange={handleChangePage}
        showLabels
        >
        <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="About" value="about" icon={<InfoIcon />} />
        <BottomNavigationAction label="Contact" value="contact" icon={<ContactMailIcon />} />
      </BottomNavigation>

    );
}
export default Navigation;
