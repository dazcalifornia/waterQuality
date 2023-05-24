import React,{
    useState
  } from 'react';

import MyAppBar from './appbar';
import Navigation from './navigation';

import HomePage from '@/pages/homepage';
import AboutPage from '@/pages/about';
import ContactPage from '@/pages/contact';

const pageComponents ={
    home :HomePage,
    about :AboutPage,
    contact :ContactPage
  };

const Main = () =>{
  const [currentPage, setCurrentPage] = useState('home');

  const handleChangePage = (event:any, newValue:any) => {
    setCurrentPage(newValue);
  };

  const PageComponent = pageComponents[currentPage];

  return (
    <div>
      <MyAppBar currentPage={currentPage} />
      <div className="content-container">
        <PageComponent />
        <p>hi</p>
      </div>
      <Navigation currentPage={currentPage} handleChangePage={handleChangePage} />
      <style jsx>{`
        .content-container {
          padding-bottom: 56px; /* Height of bottom navigation */
          margin-top: 64px; /* Height of app bar */
        }
      `}</style>
    </div>
  );
}
export default Main;
