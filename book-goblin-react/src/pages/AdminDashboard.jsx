import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const [pendingFlags, setPendingFlags] = useState([
    { id: 1, title: 'Inappropriate Review', type: 'review', reportedBy: 'user_jane', time: '2 hours ago' },
    { id: 2, title: 'Spam Account Activity', type: 'user', reportedBy: 'system', time: '5 hours ago' },
    { id: 3, title: 'Duplicate Book Entry', type: 'book', reportedBy: 'admin', time: 'Yesterday' }
  ]);

  const [recentUsers, setRecentUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [statsResult, usersResult] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAllUsers(0, 10)
        ]);

        if (statsResult.success) {
          setStats(statsResult.data);
        }

        if (usersResult.success) {
          setRecentUsers(usersResult.data.content || usersResult.data);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [isAdmin, navigate]);

  const handleApprove = (id) => {
    setPendingFlags(prev => prev.filter(flag => flag.id !== id));
  };

  const handleDeny = (id) => {
    if (window.confirm('Are you sure you want to remove this flag?')) {
      setPendingFlags(prev => prev.filter(flag => flag.id !== id));
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      // Refresh user list
      const usersResult = await adminAPI.getAllUsers(0, 10);
      if (usersResult.success) {
        setRecentUsers(usersResult.data.content || usersResult.data);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <header className="header py-3 px-4 bg-dark border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h2 mb-1 text-primary">Book Goblin Admin</h1>
            <p className="text-muted">Administrator Dashboard</p>
          </div>
          <div className="dropdown">
            <button className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" type="button">
              <img 
                src="/Img/adminavatar.png" 
                alt="Admin Avatar" 
                className="rounded-circle border border-primary"
                width="42"
                height="42"
              />
              <span>{user?.username || 'Admin'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Navigation */}
      <nav className="top-admin-nav bg-light border-bottom">
        <div className="container-fluid">
          <div className="admin-nav-links d-flex gap-3 py-2">
            <a href="/admin" className="btn btn-primary">
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
            <a href="#" className="btn btn-outline-primary">
              <i className="bi bi-people me-2"></i>User Management
            </a>
            <a href="#" className="btn btn-outline-primary">
              <i className="bi bi-flag me-2"></i>Content Flags
            </a>
            <a href="#" className="btn btn-outline-primary">
              <i className="bi bi-book me-2"></i>Book Database
            </a>
          </div>
        </div>
      </nav>

      <main className="main-content admin-dashboard-content bg-light">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <div className="text-end">
              <span className="badge bg-secondary">Last updated: Today, 10:30 AM</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <div className="stat-value display-6 fw-bold">
                    {loading ? '...' : stats?.totalUsers || '0'}
                  </div>
                  <div className="stat-label text-muted">Total Users</div>
                  <div className="stat-change positive small">
                    ↑ {stats?.newUsersToday || '0'} this week
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <div className="stat-value display-6 fw-bold">
                    {pendingFlags.length}
                  </div>
                  <div className="stat-label text-muted">Pending Flags</div>
                  <div className="stat-change negative small">↑ 3 since yesterday</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <div className="stat-value display-6 fw-bold">
                    {loading ? '...' : stats?.totalBooks || '0'}
                  </div>
                  <div className="stat-label text-muted">Books in System</div>
                  <div className="stat-change positive small">
                    ↑ {stats?.booksAddedToday || '0'} today
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <div className="stat-value display-6 fw-bold">
                    {loading ? '...' : stats?.activitiesToday || '0'}
                  </div>
                  <div className="stat-label text-muted">Today's Activities</div>
                  <div className="stat-change positive small">All systems normal</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Users */}
          <div className="admin-section mb-4">
            <div className="section-header d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-title">👥 Recent Users</h3>
              <a href="#" className="btn btn-outline-primary btn-sm">View All →</a>
            </div>
            
            <div className="card border-0 shadow">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm"></div>
                    <p className="mt-2 small text-muted">Loading users...</p>
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted">No users found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.slice(0, 5).map((userItem) => (
                          <tr key={userItem.id}>
                            <td>{userItem.username}</td>
                            <td>{userItem.email}</td>
                            <td>
                              <span className={`badge ${
                                userItem.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'
                              }`}>
                                {userItem.role}
                              </span>
                            </td>
                            <td>
                              {new Date(userItem.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-primary"
                                  onClick={() => navigate(`/users/${userItem.id}`)}
                                >
                                  View
                                </button>
                                <button 
                                  className="btn btn-outline-secondary"
                                  onClick={() => handleUpdateUserRole(userItem.id, 'ADMIN')}
                                >
                                  Make Admin
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="row">
            <div className="col-lg-8">
              <div className="admin-section mb-4">
                <div className="section-header mb-3">
                  <h3 className="section-title">📋 Recent Activity</h3>
                </div>
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <div className="activity-log">
                      <div className="activity-item border-bottom py-2">
                        <strong>@admin_you</strong> approved user submission for "Project Hail Mary"
                        <div className="activity-time text-muted small">10:15 AM • Just now</div>
                      </div>
                      <div className="activity-item border-bottom py-2">
                        <strong>System</strong> added {stats?.newUsersToday || '0'} new users
                        <div className="activity-time text-muted small">9:45 AM • 30 minutes ago</div>
                      </div>
                      <div className="activity-item py-2">
                        <strong>System</strong> recorded {stats?.activitiesToday || '0'} activities today
                        <div className="activity-time text-muted small">Yesterday • 4:30 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="admin-section mb-4">
                <div className="section-header mb-3">
                  <h3 className="section-title">⚡ Quick Actions</h3>
                </div>
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <a href="#" className="btn btn-outline-primary">
                        <span className="quick-action-icon">👤</span>
                        Add New User
                      </a>
                      <a href="#" className="btn btn-outline-primary">
                        <span className="quick-action-icon">📖</span>
                        Add Book Manually
                      </a>
                      <a href="#" className="btn btn-outline-primary">
                        <span className="quick-action-icon">📊</span>
                        Generate Report
                      </a>
                      <a href="#" className="btn btn-outline-primary">
                        <span className="quick-action-icon">⚙️</span>
                        System Settings
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 bg-dark text-white">
        <div className="text-center">
          <p className="mb-0">&copy; Book Goblin 2024 | Admin Dashboard v2.1</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;