import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';

import Card from './components/card';
import StatusCard from './components/status';
import ActivityCard from './components/activity';
import ProductionCard from './components/production';

export default function Home() {

  //fetch ACtivity Data 
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const actRec = pb.collection("activity").getFullList(200,{
      sort: '-created'
    }).then((act) => {
      setActivityData(act);
    }).catch((error) => {
      console.error(error);
      // handle error
      setActivityData(error);
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
          <ProductionCard title="Production" description="descriptione" status="inactive" date="11/11/1111"/>

        </div>
        <div className="column card">
          {activityData?.map((act) => (
            <ActivityCard title={act.title} description={act.desc} date={act.date}/>
          ))}
        </div>
	      	<div className="column card">
	      		<Card/> 
	      	</div>
	      </div>
    </div>
  );
}
