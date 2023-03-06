import React from 'react';

const ProductionCard = ({ title, description, status, date }) => {
  const statusColor = status === 'active' ? 'green' : '#888'; // set color based on status
  const statusText = status === 'active' ? 'Active' : 'Inactive'; // set text based on status

  return (
    <div className="production-card">
      <div className="header">
        <div className="title">{title}</div>
        <div className="status-pill" style={{ backgroundColor: statusColor }}>
          {status}
        </div>
      </div>
      <div className="description">{description}</div>
      <div className="date">{date}</div>
    </div>
  );
};

export default ProductionCard;
