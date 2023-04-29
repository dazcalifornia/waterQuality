import {useState,useEffect} from 'react'
import { 
  PageLayout,
  Box,
  ThemeProvider,
  Button,
} from '@primer/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Contents from '../components/Contents'


//test ploting graph 
import { Line } from 'react-chartjs-2';
import axios from 'axios';


const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState('home')

  //fetch data and plot graph from localhost:8000/db
  const [waterData ,setWaterData ] = useState([]);
  const [date, setDate] = useState([]);

  const getData = () => {
    axios.get('http://localhost:8000/db')
      .then(res => {
        const data = res.data;
        setWaterData(data);
        setDate(data.Datetime);
        console.log(data);
      }).catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    getData();
  }, []);


  const salinityData = {
  labels: date,
  datasets: [
    {
      data: waterData.Salinity,
      label: "Salinity",
      fill: false,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};


  return (
    <ThemeProvider >
    <div>
      <Head>
        <title>waterData insight :{selectedTab}</title>
        <meta name="description" content="webpage show water quality" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <PageLayout.Header>
          <Nav setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
        </PageLayout.Header>
        <PageLayout.Content>
          <Contents selectedTab={selectedTab} />
        </PageLayout.Content>
        <PageLayout.Pane>
            <Button onClick={getData}>Get Data</Button>
            <Line data={salinityData} width={200} height={400} />
          <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default', p: 3,borderRadius:10}}>
            <p>
                show water quality data from datacenter and data from north bongkot 
            </p>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Footer>
          <Footer />
        </PageLayout.Footer>
      </PageLayout>
      
    </div>
    </ThemeProvider>
  )
}


export default Home
