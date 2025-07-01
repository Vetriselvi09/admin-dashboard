// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import AdminNavbar from './AdminNavbar';
import "./AdminDashboard.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div style={{ padding: '20px' }}>
        <h2>Customer Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Dispatch</th>
                <th>Placed At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerName}<br />{order.customerPhone}</td>
                  <td>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.dispatchDetails}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Orders;
