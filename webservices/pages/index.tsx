import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import Contents from "../components/Contents";

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handleMenuClick = (pageName: string) => {
    setCurrentPage(pageName);
  };

  return (
    <div>
      <Head>
        <title>WaterQuality</title>
       
      </Head>
      {/*header*/}
      <nav className="navbar is-fixed-top has-background-info" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <h1 className="title">{currentPage}</h1>
          </a>
            <i className="fas fa-home"></i>
        </div>
      </nav>
      {/*content*/}
      <section className="">
        <i className="fas fa-user"></i>
        <Contents selectedTab={currentPage} />
      </section>
      {/*menu*/}
     <div className="bottom-nav">
  <a href="#" className="active">
    <i className="fa fa-home"></i>
    <span>Home</span>
  </a>
  <a href="#">
    <i className="fa fa-search"></i>
    <span>Search</span>
  </a>
  <a href="#">
    <i className="fa fa-user"></i>
    <span>Profile</span>
  </a>
</div>
        <nav className="navbar is-fixed-bottom is-mobile">
  <div className="navbar-menu">
    <div className="navbar-start">
      <a href="#" className="navbar-item">
        <span className="icon is-large"><i className="fas fa-home"></i></span>
        <span>Dashboard</span>
      </a>
      <a href="#" className="navbar-item">
        <span className="icon is-large"><i className="fas fa-mobile-alt"></i></span>
        <span>Device</span>
      </a>
      <a href="#" className="navbar-item">
        <span className="icon is-large"><i className="fas fa-map-marker-alt"></i></span>
        <span>Map</span>
      </a>
      <a href="#" className="navbar-item">
        <span className="icon is-large"><i className="fas fa-bell"></i></span>
        <span>Notification</span>
      </a>
      <a href="#" className="navbar-item">
        <span className="icon is-large"><i className="fas fa-cloud-sun"></i></span>
        <span>Forecast</span>
      </a>
    </div>
  </div>
</nav>
    </div>
  );
};

export default Home;
