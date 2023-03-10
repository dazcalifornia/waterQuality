import React from 'react';

const ActivityCard = (props:{title:string,description:string,date:string}) => {
  const {title,description,date} = props;
  return (
   <div className="activity-card">
      <div className="circle"></div>
      <div className="line"></div>
      <div>
        <h3><span className="title">{title}</span></h3>
        <p>{description}</p>
        <p>{date}</p>


      </div>
    </div>
  );
};

export default ActivityCard;
