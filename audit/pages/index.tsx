import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';

import Card from './components/card';
import StatusCard from './components/status';
import ActivityCard from './components/activity';
import ProductionCard from './components/production';
import TodoList from './components/todoCard';

export default function Home() {

  //fetch ACtivity Data 
  const [activityData, setActivityData] = useState(null);
  const [productionData, setProductionData] = useState(null);

  useEffect(() => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const actRec = pb.collection("activity").getFullList(200,{
      sort: '-created'
    }).then((act) => {
      const formattedActivities = act.map((activity) => {
        const date = new Date(activity.date);
        const formattedDate = date.toLocaleDateString();
        return { ...activity, date: formattedDate };
      });
      setActivityData(formattedActivities);
    }).catch((error) => {
      console.error(error);
      // handle error
      setActivityData(error);
    });
    const prodRec = pb.collection("productions").getFullList(200,{
      sort: '-created'
    }).then((prod) => {
      const formattedProductions = prod.map((production) => {
        const date = new Date(production.date);
        const formattedDate = date.toLocaleDateString();
        return { ...production, date: formattedDate };
      });
      setProductionData(formattedProductions);
    }).catch((error) => {
      console.error(error);
      // handle error
      setProductionData(error);
    });


  }, []);

  return (
    <div >
      
      <Head>
        <title>Progression Web Page 📦</title>
        <meta name="description" content="This web will show what I'm doin " />
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="row">
	      <div className="column left-column card">
          {productionData?.map((production) => (
            <ProductionCard
            title={production.title} 
            description={production.desc} 
            status={production.status}
            date={production.date}/>
          ))}

        </div>
        <div className="column card">
          {activityData?.map((act) => (
            <ActivityCard title={act.title} description={act.desc} date={act.date}/>
          ))}
        </div>
	      	<div className="column card">
            <TodoList />
	      	</div>
	      </div>
    </div>
  );
}
