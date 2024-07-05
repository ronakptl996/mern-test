import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <section className="main">
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default Layout;
