import React from 'react';

const ProductionCard = (props:{ title:string, description:string, status:string, date:string }) => {
  const {title,description,status,date} = props;
type StatusColors = {
  [key: string]: string;
  active: string;
  inprogress: string;
  pending: string;
  done: string;
  inactive: string;
};

const statusColors: StatusColors = {
  active: '#06C755',
  inprogress: '#FFD200',
  pending: '#FF9100',
  done: '#00BFFF',
  inactive: '#888',
};
const statusColor = statusColors[status];
  //const statusColor = status === 'active' ? '#06C755' : '#888'; // set color based on status
  //const statusText = status === 'active' ? 'Active' : 'Inactive'; // set text based on status

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
