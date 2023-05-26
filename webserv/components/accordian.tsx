import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const AccordionItem = ({ gridItemId }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`panel-${gridItemId}-content`}>
        <Typography>Accordion {gridItemId}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          This is the content for Accordion {gridItemId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Mauris molestie feugiat consectetur.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionItem;

