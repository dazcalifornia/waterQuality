import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";

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
        </div>
      </nav>
      {/*content*/}
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">waterquality</h1>
            <i className="fas fa-3x fa-tint"></i>
          </div>
        </div>
      </section>
      {/*menu*/}
      <nav className="navbar is-fixed-bottom has-background-info" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start is-justify-content-space-between is-fullwidth is-flex-touch">
            <a href="#" className={`navbar-item ${currentPage === "Dashboard" ? "is-active" : ""}`} onClick={() => handleMenuClick("Dashboard")}>
              <span className="icon is-large">
                <i className="fas fa-home"></i>
              </span>
              <span>Dashboard</span>
            </a>
            <a href="#" className={`navbar-item ${currentPage === "Device" ? "is-active" : ""}`} onClick={() => handleMenuClick("Device")}>
              <span className="icon is-large">
                <i className="fas fa-mobile-alt"></i>
              </span>
              <span>Device</span>
            </a>
            <a href="#" className={`navbar-item ${currentPage === "Map" ? "is-active" : ""}`} onClick={() => handleMenuClick("Map")}>
              <span className="icon is-large">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <span>Map</span>
            </a>
            <a href="#" className={`navbar-item ${currentPage === "Notification" ? "is-active" : ""}`} onClick={() => handleMenuClick("Notification")}>
              <span className="icon is-large">
                <i className="fas fa-bell"></i>
              </span>
              <span>Notification</span>
            </a>
            <a href="#" className={`navbar-item ${currentPage === "Forecast" ? "is-active" : ""}`} onClick={() => handleMenuClick("Forecast")}>
              <span className="icon is-large">
                <i className="fas fa-cloud-sun"></i>
              </span>
              <span>Forecast</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Home;
