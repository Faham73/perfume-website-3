import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import './Admin.css';
import api from '../../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="error-message">
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome to your perfume store management panel</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-card">
              <FaBox />
              <h3>Manage Products</h3>
              <p>Add, edit, or remove products from your store</p>
            </Link>

            <Link to="/admin/orders" className="action-card">
              <FaShoppingCart />
              <h3>View Orders</h3>
              <p>Track and manage customer orders</p>
            </Link>

            <Link to="/admin/users" className="action-card">
              <FaUsers />
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="orders-table">
            {stats.recentOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user.name}</td>
                      <td>${order.totalAmount || order.totalPrice || 0}</td>
                      <td>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-orders">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="low-stock-alert">
            <h2>
              <FaExclamationTriangle /> Low Stock Alert
            </h2>
            <div className="low-stock-grid">
              {stats.lowStockProducts.map(product => (
                <div key={product._id} className="low-stock-item">
                  <img 
                    src={product.images[0]?.url || product.images[0] || '/placeholder.jpg'} 
                    alt={product.name} 
                  />
                  <div className="item-details">
                    <h4>{product.name}</h4>
                    <p className="stock-warning">Only {product.stock} left in stock!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
