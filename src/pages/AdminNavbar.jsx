import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };
  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <img src="/logo.png" alt="Logo" className="admin-logo" />
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>
      <div className="admin-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/products">View Products</Link>
        <Link to="/orders">View Orders</Link>
        <Link to="/analytics">Analytics</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
