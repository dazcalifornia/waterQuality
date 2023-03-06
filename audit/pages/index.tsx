import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';


import Card from './components/card';
import StatusCard from './components/status';
import ActivityCard from './components/activity';
import ProductionCard from './components/production';

export default function Home() {

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
        <ActivityCard title="Activity" description="Description" date="Date"/>
		</div>
		<div className="column card">
			<Card/> 
		</div>
	</div>
      
    </div>
  );
}
