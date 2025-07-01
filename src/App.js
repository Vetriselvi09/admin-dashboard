// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Products from './pages/ViewProducts';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
