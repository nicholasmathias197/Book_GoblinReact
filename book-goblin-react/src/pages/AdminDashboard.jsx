import React, { useState } from 'react';

const AdminDashboard = () => {
  const [pendingFlags, setPendingFlags] = useState([
    { id: 1, title: 'Inappropriate Review', type: 'review', reportedBy: 'user_jane', time: '2 hours ago' },
    { id: 2, title: 'Spam Account Activity', type: 'user', reportedBy: 'system', time: '5 hours ago' },
    { id: 3, title: 'Duplicate Book Entry', type: 'book', reportedBy: 'admin', time: 'Yesterday' }
  ]);

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'Jane Doe', username: '@bookworm_jane', joined: 'Today', books: 5 },
    { id: 2, name: 'Robert Smith', username: '@robert_reads', joined: 'Yesterday', books: 12 }
  ]);

  const handleApprove = (id) => {
    setPendingFlags(prev => prev.filter(flag => flag.id !== id));
  };

  const handleDeny = (id) => {
    if (window.confirm('Are you sure you want to remove this flag?')) {
      setPendingFlags(prev => prev.filter(flag => flag.id !== id));
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="header py-3 px-4 bg-dark-glass border-bottom border-glass">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h2 mb-1 text-gradient">Book Goblin Admin</h1>
            <p className="text">Administrator Dashboard</p>
          </div>
          <div className="dropdown">
            <button className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2" type="button">
              <img 
                src="Img/adminavatar.png" 
                alt="Admin Avatar" 
                className="rounded-circle border border-purple"
                width="42"
                height="42"
              />
              <span>Admin User</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Navigation */}
      <nav className="top-admin-nav">
        <div className="container-fluid">
          <div className="admin-nav-links">
            <a href="/admin" className="admin-nav-btn active">
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
            <a href="#" className="admin-nav-btn">
              <i className="bi bi-people me-2"></i>User Management
            </a>
            <a href="#" className="admin-nav-btn">
              <i className="bi bi-flag me-2"></i>Content Flags
            </a>
            <a href="#" className="admin-nav-btn">
              <i className="bi bi-book me-2"></i>Book Database
            </a>
          </div>
        </div>
      </nav>

      <main className="main-content admin-dashboard-content">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <div className="text-end">
              <span className="badge bg-light text-dark">Last updated: Today, 10:30 AM</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-value">12,847</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-change positive">↑ 234 this week</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-value">{pendingFlags.length}</div>
                <div className="stat-label">Pending Flags</div>
                <div className="stat-change negative">↑ 3 since yesterday</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-value">42</div>
                <div className="stat-label">Book Submissions</div>
                <div className="stat-change positive">↑ 12 pending</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-value">96.7%</div>
                <div className="stat-label">System Uptime</div>
                <div className="stat-change positive">All systems normal</div>
              </div>
            </div>
          </div>
          
          {/* Pending Content Flags */}
          <div className="admin-section mb-4">
            <div className="section-header">
              <h3 className="section-title">⚠️ Pending Content Flags</h3>
              <a href="#" className="view-all-btn">View All →</a>
            </div>
            
            <div className="flags-list">
              {pendingFlags.map(flag => (
                <div key={flag.id} className="flag-item">
                  <div className="flag-icon">
                    {flag.type === 'review' ? '🗣️' : flag.type === 'user' ? '🚫' : '📚'}
                  </div>
                  <div className="flag-info">
                    <div className="flag-title">{flag.title}</div>
                    <div className="flag-meta">
                      Reported by: {flag.reportedBy} • {flag.time}
                    </div>
                  </div>
                  <div className="action-btns">
                    <button 
                      className="btn btn-sm btn-approve"
                      onClick={() => handleApprove(flag.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-deny"
                      onClick={() => handleDeny(flag.id)}
                    >
                      Remove
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Activity & Quick Actions */}
          <div className="row">
            <div className="col-lg-8">
              <div className="admin-section mb-4">
                <div className="section-header">
                  <h3 className="section-title">📋 Recent Admin Activity</h3>
                </div>
                <div className="activity-log">
                  <div className="activity-item">
                    <strong>@admin_you</strong> approved user submission for "Project Hail Mary"
                    <div className="activity-time">10:15 AM • Just now</div>
                  </div>
                  <div className="activity-item">
                    <strong>@mod_john</strong> resolved a content flag on review ID #8923
                    <div className="activity-time">9:45 AM • 30 minutes ago</div>
                  </div>
                  <div className="activity-item">
                    <strong>System</strong> added 42 new users from referral program
                    <div className="activity-time">Yesterday • 4:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="admin-section mb-4">
                <div className="section-header">
                  <h3 className="section-title">⚡ Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <a href="#" className="quick-action-btn">
                    <span className="quick-action-icon">👤</span>
                    <span>Add New User</span>
                  </a>
                  <a href="#" className="quick-action-btn">
                    <span className="quick-action-icon">📖</span>
                    <span>Add Book Manually</span>
                  </a>
                  <a href="#" className="quick-action-btn">
                    <span className="quick-action-icon">📊</span>
                    <span>Generate Report</span>
                  </a>
                  <a href="#" className="quick-action-btn">
                    <span className="quick-action-icon">⚙️</span>
                    <span>System Settings</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* New User Registrations */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">👥 Recent User Registrations</h3>
              <a href="#" className="view-all-btn">Manage All Users →</a>
            </div>
            
            <div className="row">
              {recentUsers.map(user => (
                <div key={user.id} className="col-md-6">
                  <div className="user-item">
                    <div className="user-avatar">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-meta">
                        {user.username} • Joined: {user.joined} • {user.books} books added
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary">View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 bg-dark-glass border-top border-glass">
        <div className="text-center">
          <p className="text">&copy; U197 Designs 2025 | Admin Dashboard v2.1</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;