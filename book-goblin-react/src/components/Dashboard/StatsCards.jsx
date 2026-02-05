import React from 'react';

const StatsCards = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <section className="mb-5">
        <div className="d-inline-block px-4 py-2 mb-4 rounded-4 bg-gradient-primary">
          <h4 className="mb-0">Your Reading Snapshot</h4>
        </div>
        
        <div className="row g-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="col-md-3">
              <div className="stat-card p-4 rounded-4 placeholder-glow">
                <div className="d-flex align-items-center mb-3">
                  <div className="placeholder rounded-circle" style={{ width: '40px', height: '40px' }}></div>
                  <div className="placeholder col-6 ms-3"></div>
                </div>
                <div className="placeholder col-8 mb-1"></div>
                <div className="placeholder col-5"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const statItems = [
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      description: 'Books in your library',
      icon: 'bi-book',
      color: 'primary'
    },
    {
      title: 'Books Read',
      value: stats?.booksRead || 0,
      description: 'Completed books',
      icon: 'bi-check-circle',
      color: 'success'
    },
    {
      title: 'Currently Reading',
      value: stats?.booksReading || 0,
      description: 'Books in progress',
      icon: 'bi-bookmark',
      color: 'warning'
    },
    {
      title: 'To Read',
      value: stats?.booksToRead || 0,
      description: 'Books in queue',
      icon: 'bi-list-check',
      color: 'info'
    }
  ];

  const completionRate = stats?.totalBooks ? 
    Math.round((stats.booksRead / stats.totalBooks) * 100) : 0;

  return (
    <section className="mb-5">
      <div className="d-inline-block px-4 py-2 mb-4 rounded-4 bg-gradient-primary">
        <h4 className="mb-0">Your Reading Snapshot</h4>
      </div>
      
      <div className="row g-4">
        {statItems.map((stat, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className="stat-card p-4 rounded-4 shadow-sm border">
              <div className="d-flex align-items-center mb-3">
                <i className={`bi ${stat.icon} fs-3 text-${stat.color} me-3`}></i>
                <h2 className="display-6 fw-bold text-gradient mb-0">
                  {stat.value}
                </h2>
              </div>
              <p className="h5 mb-1">{stat.title}</p>
              <small className="text-muted">{stat.description}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Reading Progress</span>
          <span className="fw-bold">{completionRate}% Complete</span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div 
            className="progress-bar bg-success" 
            role="progressbar" 
            style={{ width: `${completionRate}%` }}
            aria-valuenow={completionRate} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-1 small">
          <span>{stats?.booksRead || 0} books read</span>
          <span>{stats?.totalBooks || 0} total books</span>
        </div>
      </div>
    </section>
  );
};

export default StatsCards;