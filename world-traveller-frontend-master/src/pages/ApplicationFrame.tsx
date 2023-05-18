import React from "react";

import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

export default function ApplicationFrame() {
  return (
    <>
      <div className="fixed bg-base-bg h-screen w-screen"></div>
      <div className="flex flex-col-reverse lg:grid lg:grid-flow-col lg:grid-cols-[auto_1fr] h-screen relative z-10">
        <Navbar />
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
