import React,{
  useState
} from 'react';

import {Grid, styled} from '@mui/material';

import GridItems from '@/components/gridItems';
import AccordionItem from '@/components/accordian';

const StyleGrid = styled(Grid)({
  '&.MuiPaper-root': {
    boxShadow:'none' 
  },
})

const DashboardPage = () => {
  const [selectedGridItem, setSelectedGridItem] = useState(null);

  const handleGridItemClick = (gridItemId) => {
    if (selectedGridItem === gridItemId) {
      setSelectedGridItem(null);
    } else {
      setSelectedGridItem(gridItemId);
    }
  };

  return (
    <StyleGrid container spacing={2}>
      <Grid item xs={12}>
        <h1>Dashboard</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} direction="row">
          <GridItems id={1} handleClick={handleGridItemClick} isSelected={selectedGridItem === 1} />
          <GridItems id={2} handleClick={handleGridItemClick} isSelected={selectedGridItem === 2} />
          <GridItems id={3} handleClick={handleGridItemClick} isSelected={selectedGridItem === 3} />
          <GridItems id={4} handleClick={handleGridItemClick} isSelected={selectedGridItem === 4} />
          <GridItems id={5} handleClick={handleGridItemClick} isSelected={selectedGridItem === 5} />
          <GridItems id={6} handleClick={handleGridItemClick} isSelected={selectedGridItem === 6} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedGridItem && <AccordionItem gridItemId={selectedGridItem} />}
      </Grid>
    </StyleGrid>
  );
}
export default DashboardPage;
