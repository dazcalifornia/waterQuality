import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

interface SalinityData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function DataInsights() {
  // const [salinity, setSalinity] = useState<SalinityData>({
  //   labels: [],
  //   datasets: [],
  // });

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await axios.get('http://localhost:8000/salinity');
  //       const data = response.data;
  //       if (Array.isArray(data)) {
  //         setSalinity({
  //           labels: data.map((item: any) => item.datetime),
  //           datasets: [
  //             {
  //               data: data.map((item: any) => item.salinity),
  //               label: "Salinity",
  //               fill: false,
  //               backgroundColor: "rgba(75,192,192,1)",
  //               borderColor: "rgba(75,192,192,1)",
  //             },
  //           ],
  //         });
  //       } else {
  //         console.log("Error: data is not an array");
  //       }
  //       console.log(data.map((item: any) => item.salinity));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const salinity ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        data: [31.540248346,31.8340562239,31.8946550515,31.9186163249,30.5323217182,30.8711312327,30.2218294239,29.4506287896,30.6916554262,32.159361869,32.6059318201,32.8303636367,30.7300436558],
        label: 'salinity',
        borderColor: '#3e95cd',
        fill: false
      }
    ]
  }
  const conduct ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        data: [53.0917662006,53.9325296588,54.9628130773,55.8413509927,52.7790075217,53.3287841608, 51.978696609,50.5233967955,51.4308406124,52.6516321369,52.6516321369,52.6516321369,52.0328110841],
        label: 'Conductivity (mS/cm)',
        borderColor: '#8e5ea2',
        fill: false
      }
    ]
  }
  const turbidity ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        date:[4.0034122254,5.338160673,4.0803293742,5.4108992605,32.0923479164,5.102232152,5.7382354159,2.5816909941,2.0973558323,2.3401305772,4.2582764581,1.5262167326,2.0061949594,2.1823239854],
        label: 'Turbidity',
        borderColor: '#3cba9f',
        fill: false
      }
    ]
  }
  const seatemp ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        data: [2.1823239854,30.261665778,31.2432924296,32.0923479164,31.2795285408,31.1841942868,30.8337146499,30.5226447901,29.507917405,28.5084956247,27.266802552,26.2914070562,27.6925479825],
        label: 'Sea temperature (¬∞C)',
        borderColor: '#3cba9f',
        fill: false
      }
    ]
  }
  const dosaturation ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        data: [91.967742536,93.3690996226,85.7082638889,104.7298521505,97.4375694444,83.6999193548,103.3120564516,79.0118138267,75.454829271,92.7910555556,96.0692055549,97.645577957,89.8801191044,],
        label: 'Do saturation',
        borderColor: '#ffcc00',
        fill: false
      },
    ]
  }
  const cholorophyll ={
    labels: [1582909200000,
      1585587600000,
      1588179600000,
      1590858000000,
      1593450000000,
      1596128400000,
      1598806800000,
      1601398800000,
      1604077200000,
      1606669200000,
      1609347600000,
      1612026000000,
      1614445200000],
    datasets: [
      {
        data: [6.4912665675,5.0765428981,3.940971235,19.6220830149,12.1458601239,19.6325662489,14.1827144168,4.371957017,3.6722033457,2.1786941154,2.2811677625,1.9395561331,2.805581045],
        label: 'Chlorophyll-a (ppb)',
        borderColor :'#AAFF00 ',
        fill: false
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
          display: true,
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
      <h1>Data</h1>
      <Line data={salinity} width={200} height={100} options={options} />
      <Line data={conduct} width={200} height={100} options={options} />
      <Line data={turbidity} width={200} height={100} options={options} />
      <Line data={seatemp} width={200} height={100} options={options} />
      <Line data={dosaturation} width={200} height={100} options={options} />
      <Line data={cholorophyll} width={200} height={100} options={options} />
    </div>
  );
}
