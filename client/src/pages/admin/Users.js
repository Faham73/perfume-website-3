import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../../utils/axios';
import { FaEdit, FaTrash, FaUserShield, FaUser, FaEye, FaTimes, FaCheck, FaBan, FaSave } from 'react-icons/fa';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  const userRoles = ['user', 'admin'];

  const roleColors = {
    user: '#6c757d',
    admin: '#dc3545'
  };

  const roleIcons = {
    user: <FaUser />,
    admin: <FaUserShield />
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching users');
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user role');
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const editUser = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingUser(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country')
      }
    };

    try {
      await api.put(`/admin/users/${editingUser._id}`, updateData);
      toast.success('User updated successfully');
      closeEditForm();
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const suspendedUsers = users.filter(user => user.status === 'suspended').length;

    return { totalUsers, adminUsers, activeUsers, suspendedUsers };
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  const stats = getUserStats();

  return (
    <div className="admin-users">
      <div className="container">
        <div className="admin-header">
          <h1>Users Management</h1>
          <div className="user-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Admins</h3>
              <p>{stats.adminUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active</h3>
              <p>{stats.activeUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Suspended</h3>
              <p>{stats.suspendedUsers}</p>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="role-filter">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="role-select"
            >
              <option value="all">All Roles</option>
              {userRoles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <p><strong>{user.name}</strong></p>
                        <p className="user-id">ID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <p>{user.email}</p>
                      <p>{user.phone || 'No phone'}</p>
                    </div>
                  </td>
                  <td>
                    <span
                      className="role-badge"
                      style={{ backgroundColor: roleColors[user.role] }}
                    >
                      {roleIcons[user.role]}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.status === 'active' ? 'active' : 'suspended'}`}
                    >
                      {user.status === 'active' ? <FaCheck /> : <FaBan />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        className="btn btn-view"
                        onClick={() => viewUserDetails(user)}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        className="btn btn-edit"
                        onClick={() => editUser(user)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                        className="role-update-select"
                      >
                        {userRoles.map(role => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        className={`btn ${user.status === 'active' ? 'btn-suspend' : 'btn-activate'}`}
                        onClick={() => handleUserStatusToggle(user._id, user.status)}
                      >
                        {user.status === 'active' ? <FaBan /> : <FaCheck />}
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>No users found matching your criteria.</p>
          </div>
        )}

        {showUserModal && selectedUser && (
          <div className="user-modal-overlay">
            <div className="user-modal">
              <div className="modal-header">
                <h2>User Details - {selectedUser.name}</h2>
                <button className="close-btn" onClick={closeUserModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="user-details">
                <div className="detail-section">
                  <h3>Basic Information</h3>
                  <div className="basic-details">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                    <p><strong>Role:</strong> 
                      <span
                        className="role-badge inline"
                        style={{ backgroundColor: roleColors[selectedUser.role] }}
                      >
                        {roleIcons[selectedUser.role]}
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge inline ${selectedUser.status}`}>
                        {selectedUser.status === 'active' ? <FaCheck /> : <FaBan />}
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </p>
                    <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedUser.address && (
                  <div className="detail-section">
                    <h3>Address Information</h3>
                    <div className="address-details">
                      <p><strong>Street:</strong> {selectedUser.address.street || 'N/A'}</p>
                      <p><strong>City:</strong> {selectedUser.address.city || 'N/A'}</p>
                      <p><strong>State:</strong> {selectedUser.address.state || 'N/A'}</p>
                      <p><strong>ZIP Code:</strong> {selectedUser.address.zipCode || 'N/A'}</p>
                      <p><strong>Country:</strong> {selectedUser.address.country || 'N/A'}</p>
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Account Activity</h3>
                  <div className="activity-details">
                    <p><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</p>
                    <p><strong>Login Count:</strong> {selectedUser.loginCount || 0}</p>
                    <p><strong>Profile Updated:</strong> {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditForm && editingUser && (
          <div className="edit-form-overlay">
            <div className="edit-form">
              <div className="form-header">
                <h2>Edit User - {editingUser.name}</h2>
                <button className="close-btn" onClick={closeEditForm}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingUser.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingUser.email}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingUser.phone || ''}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      defaultValue={editingUser.address?.street || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={editingUser.address?.city || ''}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      defaultValue={editingUser.address?.state || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      defaultValue={editingUser.address?.zipCode || ''}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={editingUser.address?.country || ''}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> Update User
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeEditForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
