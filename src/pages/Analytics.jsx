import React from "react";
import AdminNavbar from "./AdminNavbar";
import "./AdminDashboard.css";

const Analytics = () => {
  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="analytics-coming-soon">
        <img
          src="/analytics.png"
          alt="Analytics Coming Soon"
          className="analytics-img"
        />
        <h2 className="section-title">Analytics Dashboard Coming Soon</h2>
      </div>
    </div>
  );
};

export default Analytics;
