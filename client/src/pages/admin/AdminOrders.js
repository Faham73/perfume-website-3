import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEdit, FaTruck, FaCheck, FaTimes, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const orderStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  ];

  const statusColors = {
    pending: '#ffc107',
    processing: '#17a2b8',
    shipped: '#007bff',
    delivered: '#28a745',
    cancelled: '#dc3545',
    refunded: '#6c757d'
  };

  const statusIcons = {
    pending: <FaClock />,
    processing: <FaEdit />,
    shipped: <FaTruck />,
    delivered: <FaCheck />,
    cancelled: <FaTimes />,
    refunded: <FaExclamationTriangle />
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getOrderCountByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <div className="admin-header">
          <h1>Orders Management</h1>
          <div className="order-stats">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>${getTotalRevenue().toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{getOrderCountByStatus('pending')}</p>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="all">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div className="customer-info">
                      <p><strong>{order.user.name}</strong></p>
                      <p>{order.user.email}</p>
                    </div>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.product.name}</span>
                          <span className="quantity">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>${order.totalAmount}</strong>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {statusIcons[order.status]}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <button
                        className="btn btn-view"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <FaEye /> View
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-update-select"
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found matching your criteria.</p>
          </div>
        )}

        {showOrderModal && selectedOrder && (
          <div className="order-modal-overlay">
            <div className="order-modal">
              <div className="modal-header">
                <h2>Order Details - {selectedOrder.orderNumber}</h2>
                <button className="close-btn" onClick={closeOrderModal}>
                  <FaTimes />
                </button>
              </div>
              <div className="order-details">
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="customer-details">
                    <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Shipping Address</h3>
                  <div className="shipping-details">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Order Items</h3>
                  <div className="order-items-detail">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <div className="item-image">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img src={item.product.images[0]} alt={item.product.name} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                        <div className="item-info">
                          <h4>{item.product.name}</h4>
                          <p>{item.product.brand}  {item.product.volume}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Order Summary</h3>
                  <div className="order-summary">
                    <p><strong>Subtotal:</strong> ${selectedOrder.subtotal}</p>
                    <p><strong>Shipping:</strong> ${selectedOrder.shippingCost}</p>
                    <p><strong>Tax:</strong> ${selectedOrder.tax}</p>
                    <p><strong>Total:</strong> ${selectedOrder.totalAmount}</p>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Order Timeline</h3>
                  <div className="order-timeline">
                    <div className="timeline-item">
                      <span className="timeline-date">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                      <span className="timeline-status">Order Placed</span>
                    </div>
                    {selectedOrder.statusHistory && selectedOrder.statusHistory.map((status, index) => (
                      <div key={index} className="timeline-item">
                        <span className="timeline-date">
                          {new Date(status.date).toLocaleString()}
                        </span>
                        <span className="timeline-status">
                          Status changed to {status.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
