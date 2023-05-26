import React,{
  useState
} from 'react';

import {Grid} from '@mui/material';

import GridItems from '@/components/gridItems';
import AccordionItem from '@/components/accordian';

const DashboardPage = () => {
  const [selectedGridItem, setSelectedGridItem] = useState(null);

  const handleGridItemClick = (gridItemId) => {
    setSelectedGridItem(gridItemId);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Dashboard</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <GridItems id={1} handleClick={handleGridItemClick} />
          <GridItems id={2} handleClick={handleGridItemClick} />
          <GridItems id={3} handleClick={handleGridItemClick} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedGridItem && <AccordionItem gridItemId={selectedGridItem} />}
      </Grid>
    </Grid>
  );}
export default DashboardPage;
