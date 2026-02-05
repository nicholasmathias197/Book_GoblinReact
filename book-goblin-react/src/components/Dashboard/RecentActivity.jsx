import React from 'react';
import { useBooks } from '../../context/BookContext';

const RecentActivity = ({ books, onMarkAsRead, getCover, loading = false }) => {
  const { myBooks } = useBooks();
  
  // Use provided books or fall back to context
  const recentBooks = books || myBooks.slice(0, 4);

  const getStatusBadge = (status) => {
    const badges = {
      'READING': { class: 'bg-warning', text: 'Reading', icon: 'bi-bookmark' },
      'WANT_TO_READ': { class: 'bg-info', text: 'To Read', icon: 'bi-book' },
      'READ': { class: 'bg-success', text: 'Read', icon: 'bi-check-circle' },
      'DROPPED': { class: 'bg-danger', text: 'Dropped', icon: 'bi-x-circle' }
    };
    return badges[status] || { class: 'bg-secondary', text: status, icon: 'bi-question-circle' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-gradient mb-4">Recent Activity</h2>
        <div className="row g-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 placeholder-glow">
                <div className="card-img-top placeholder" style={{ height: '250px' }}></div>
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-8"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recentBooks.length === 0) {
    return (
      <section>
        <h2 className="text-gradient mb-4">Recent Activity</h2>
        <div className="text-center py-5">
          <i className="bi bi-clock-history text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3 mb-2">No Recent Activity</h4>
          <p className="text-muted">Start adding books to see your activity here</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-gradient mb-0">Recent Activity</h2>
        <span className="badge bg-primary">
          {recentBooks.length} recent books
        </span>
      </div>
      
      <div className="row g-4">
        {recentBooks.map((book) => {
          const badge = getStatusBadge(book.status);
          
          return (
            <div key={book.id || book.openLibraryId} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <img 
                    src={getCover ? getCover(book.coverId, 'S') : book.image || '/Img/default-book-cover.jpg'}
                    className="card-img-top" 
                    alt={book.title}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/Img/default-book-cover.jpg';
                      e.target.style.objectFit = 'contain';
                      e.target.style.padding = '20px';
                    }}
                  />
                  <span className={`badge ${badge.class} position-absolute top-0 end-0 m-2`}>
                    <i className={`bi ${badge.icon} me-1`}></i>
                    {badge.text}
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate" title={book.title}>
                    {book.title}
                  </h5>
                  <p className="card-text text-muted small">{book.author}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted small">
                      {book.currentPage && book.pages ? (
                        <div className="mb-1">
                          <small>
                            Page {book.currentPage} of {book.pages}
                          </small>
                          <div className="progress" style={{ height: '3px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ width: `${(book.currentPage / book.pages) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    
                    {book.status === 'READING' && onMarkAsRead && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onMarkAsRead(book)}
                        title="Mark as read"
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    )}
                  </div>
                  
                  {book.addedAt && (
                    <div className="mt-2 text-muted small">
                      <i className="bi bi-calendar me-1"></i>
                      Added {formatDate(book.addedAt)}
                    </div>
                  )}
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