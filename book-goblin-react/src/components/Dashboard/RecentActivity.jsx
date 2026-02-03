import React from 'react';
import { useBooks } from '../../context/BookContext';

const RecentActivity = () => {
  const { books } = useBooks();
  const recentBooks = books.slice(0, 4);

  const getStatusBadge = (status) => {
    const badges = {
      'Reading': { class: 'bg-info', text: 'Reading' },
      'TBR': { class: 'bg-purple', text: 'TBR' },
      'Completed': { class: 'bg-success', text: 'Completed' },
      'DNF': { class: 'bg-warning', text: 'DNF' }
    };
    return badges[status] || { class: 'bg-secondary', text: status };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }
    return stars;
  };

  return (
    <section>
      <h2 className="text-gradient mb-4">Recent Activity</h2>
      <div className="row g-4">
        {recentBooks.map((book) => {
          const badge = getStatusBadge(book.status);
          
          return (
            <div key={book.id} className="col-md-6 col-lg-3">
              <div className="card card-glass h-100 border-0">
                <img 
                  src={book.image} 
                  className="card-img-top" 
                  alt={book.title}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted small">{book.author}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-warning">
                      {renderStars(book.rating)}
                    </div>
                    <span className={`badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;