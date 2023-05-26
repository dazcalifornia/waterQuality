import React,{
    useState
  } from 'react';

import MyAppBar from './appbar';
import Navigation from './navigation';

import DashboardPage from '@/pages/dashboard';
import ForecastPage from '@/pages/forecast';
import MapPage from '@/pages/map';
import DevicePage from '@/pages/device';
import NotiPage from '@/pages/noti';

type PageComponents = {
  [key: string]: React.ComponentType<any>;
};

const pageComponents : PageComponents ={
  dashboard: DashboardPage,
  device: DevicePage,
  forecast: ForecastPage,
  map: MapPage,
  notifications: NotiPage,
};

const Main = () =>{
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleChangePage = (event:any, newValue:any) => {
    setCurrentPage(newValue);
  };

  const PageComponent = pageComponents[currentPage];

  return (
    <div>
      <MyAppBar currentPage={currentPage} />
      <div className="content-container">
        <PageComponent />
      </div>
      <Navigation currentPage={currentPage} handleChangePage={handleChangePage} />
      <style jsx>{`
        .content-container {
          padding-bottom: 56px; /* Height of bottom navigation */
          margin-top: 110px; /* Height of app bar */
        }
      `}</style>
    </div>
  );
}
export default Main;
