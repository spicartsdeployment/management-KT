import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DashboardOverview from "../pages/DashboardOverview";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout-root">
      {/* 🔝 Fixed Navbar */}
      <div className="dashboard-layout-topbar">
        <Topbar />
      </div>

      {/* ⚙️ Main App Body */}
      <div className="dashboard-layout-body">
        {/* 📚 Fixed Sidebar */}
        <div className="dashboard-layout-sidebar">
          <Sidebar />
        </div>

        {/* 🧭 Scrollable Main Content */}
        <main className="dashboard-layout-main">
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
