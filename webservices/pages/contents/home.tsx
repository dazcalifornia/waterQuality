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

import { Bar, Line, Scatter, Bubble, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
    

export default function Home() {

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Rainfall',
        borderColor: '#3e95cd',
        fill: false
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Temperature',
        borderColor: '#8e5ea2',
        fill: false
      },
      {
        data: [18, 48, 77, 9, 100, 27, 40],
        label: 'Humidity',
        borderColor: '#3cba9f',
        fill: false
      }
    ]
  };
  const options = {
    plugins: {
      legend: {
          display: false,
      },
    },
    elements: {
      line:{
        tension: 0,
        borderWidth: 2,
        borderColor: '#3e95cd',
        fill: "start",
        backgroundcolor: "rgba(47,97,68,0.3)",
      },
      point:{
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h1>Home</h1>
      <pre>
        <p>
          this is chart showing a data from datacenter 
        </p>
        </pre>
      <Line data={data} width={100} height={40} options={options} />

    </div>
  )
}
