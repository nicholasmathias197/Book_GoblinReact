import React from 'react';

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      title: 'Books Read',
      value: stats?.booksRead || 0,
      description: 'Total books completed',
      icon: 'bi-book',
      color: 'primary'
    },
    {
      title: 'To Be Read',
      value: stats?.tbr || 0,
      description: 'Books in your queue',
      icon: 'bi-list-check',
      color: 'purple'
    },
    {
      title: 'Recommended',
      value: stats?.recommendations || 0,
      description: 'Books suggested for you',
      icon: 'bi-star',
      color: 'warning'
    },
    {
      title: 'Goal Progress',
      value: `${stats?.progress || 0}%`,
      description: 'Yearly reading goal',
      icon: 'bi-flag',
      color: 'success'
    }
  ];

  return (
    <section className="mb-5">
      <div className="d-inline-block px-4 py-2 mb-4 rounded-4 bg-gradient-primary">
        <h4 className="mb-0">Your Reading Snapshot</h4>
      </div>
      
      <div className="row g-4">
        {statItems.map((stat, index) => (
          <div key={index} className="col-md-3">
            <div className="stat-card p-4 rounded-4">
              <div className="d-flex align-items-center mb-3">
                <i className={`bi ${stat.icon} fs-3 text-${stat.color} me-3`}></i>
                <h2 className="display-6 fw-bold text-gradient mb-0">
                  {stat.value}
                </h2>
              </div>
              <p className="h5 mb-1">{stat.title}</p>
              <small className="text">{stat.description}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCards;