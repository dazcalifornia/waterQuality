import {
  useState,
  useEffect,
  useCallback
} from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

import { Line } from 'react-chartjs-2';
import axios from 'axios';
    

export default function Home() {
   //fetch data and plot graph from localhost:8000/db
  interface WaterData {
    Datetime: string[];
    Salinity: number[];
    Turbidity: number[];
    Conductivity: number[];
    DO: number[];
    Seatemp: number[];
    chlorophyll: number[];
  }
  
  const [waterData, setWaterData] = useState<WaterData>({Datetime: [], Salinity: [], Turbidity: [], Conductivity: [], DO: [], Seatemp: [], chlorophyll: []});
  const [date, setDate] = useState<string[]>([]);
  
  const getData = useCallback(() => {
    axios.get<WaterData>('https//cactus.franx.dev:8000:8000/db')
      .then(res => {
        const data = res.data;
        setWaterData(data);
        setDate(data.Datetime);
        console.log(data);
      }).catch(err => {
        console.log(err);
      });
  },[])
  
  useEffect(() => {
    getData();
  }, [getData]);
  
  
  const water = {
    labels: date,
    datasets: [
      {
        data: waterData.Salinity,
        label: "Salinity",
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        data: waterData.Turbidity,
        label: "Turbidity",
        fill: false,
        backgroundColor: "#742774",
        borderColor: "#742774"
      },
      {
        data: waterData.Conductivity,
        label: "Conductivity",
        fill: false,
        backgroundColor: "#ff0000",
        borderColor: "#ff0000"
      },
      {
        data: waterData.DO,
        label: "DO",
        fill: false,
        backgroundColor: "#00ff00",
        borderColor: "#00ff00"
      },
      {
        data: waterData.Seatemp,
        label: "Seatemp",
        fill: false,
        backgroundColor: "#0000ff",
        borderColor: "#0000ff"
      },
      {
        data: waterData.chlorophyll,
        label: "chlorophyll",
        fill: false,
        backgroundColor: "#ffff00",
        borderColor: "#ffff00"
      }
    ],
  };


  return (
    <div>
      <h1>Home</h1>
      <pre>
        <p>
          this is chart showing a data from datacenter 
        </p>
        </pre>
      <Line data={water}/>
    </div>
  )
}
