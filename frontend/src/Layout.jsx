import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <section className="main">
        <Outlet />
      </section>
    </>
  );
};

export default Layout;
