import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import { useBooks } from '../context/BookContext';

const MyBooks = () => {
  const { books, deleteBook, markAsRead } = useBooks();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'rating':
        return b.rating - a.rating;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate reading stats
  const readingStats = [
    { month: 'March 2024', books: 3, pages: 850 },
    { month: 'February 2024', books: 4, pages: 1200 },
    { month: 'January 2024', books: 5, pages: 1500 },
    { month: 'December 2023', books: 6, pages: 1800 }
  ];
  
  const totalBooks = readingStats.reduce((sum, stat) => sum + stat.books, 0);
  const totalPages = readingStats.reduce((sum, stat) => sum + stat.pages, 0);
  const goalProgress = Math.min(Math.round((totalBooks / 50) * 100), 100); // Assuming 50 book goal

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
    <div className="mybooks-page">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="container-fluid py-4 px-3 px-lg-4">
            {/* Top Row: Hero Image and Reading Goals */}
            <div className="row g-4 mb-4">
              {/* Hero Image */}
              <div className="col-lg-8">
                <div className="card-glass p-0" style={{ height: '200px', overflow: 'hidden', borderRadius: '1rem' }}>
                  <div className="position-relative h-100">
                    <img 
                      src="/Img/Chilling Goblin 3.0.png" 
                      alt="Chilling Goblin"
                      className="position-absolute h-100 w-auto"
                      style={{ 
                        objectFit: 'cover',
                        right: '0',
                        top: '0'
                      }}
                    />
                    <div className="position-absolute top-0 start-0 p-4" style={{ zIndex: 1 }}>
                      <h2 className="text-gradient mb-2">My Reading Dashboard</h2>
                      <p className="text-muted mb-0">Track your reading journey</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reading Goals Card */}
              <div className="col-lg-4">
                <div className="card-glass h-100 p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-gradient mb-0">Reading Goal</h4>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                  
                  <div className="text-center flex-grow-1 d-flex flex-column justify-content-center">
                    <div className="position-relative d-inline-block mb-3" style={{ width: '120px', height: '120px' }}>
                      <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '100%', height: '100%' }}>
                        <path
                          className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          className="circle"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#9b4dff"
                          strokeWidth="3"
                          strokeDasharray={`${goalProgress}, 100`}
                        />
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h3 className="mb-0">{goalProgress}%</h3>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">{totalBooks} of 50 books</h5>
                      <p className="text-muted small mb-0">{totalPages.toLocaleString()} total pages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Reading Stats and Quick Filters */}
            <div className="row g-4 mb-4">
              {/* Reading Progress Card */}
              <div className="col-lg-8">
                <div className="card-glass p-4">
                  <h4 className="text-gradient mb-4">Reading Progress</h4>
                  <div className="row g-3">
                    {readingStats.map((stat, index) => (
                      <div key={index} className="col-sm-6 col-md-3">
                        <div className="card-stat p-3 text-center">
                          <div className="text-muted small mb-1">{stat.month}</div>
                          <div className="d-flex justify-content-center align-items-baseline">
                            <h3 className="mb-0 me-2">{stat.books}</h3>
                            <span className="text-muted small">books</span>
                          </div>
                          <div className="text-purple small">{stat.pages.toLocaleString()} pages</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-top text-center">
                    <div className="row">
                      <div className="col-6">
                        <div className="text-muted small">Total Books</div>
                        <h4 className="mb-0">{totalBooks}</h4>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Total Pages</div>
                        <h4 className="mb-0 text-purple">{totalPages.toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Filters Card */}
              <div className="col-lg-4">
                <div className="card-glass h-100 p-4">
                  <h4 className="text-gradient mb-4">Quick Filters</h4>
                  <div className="d-flex flex-column gap-2">
                    <button 
                      className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-light'} justify-content-start`}
                      onClick={() => setFilter('all')}
                    >
                      <i className="bi bi-collection me-2"></i>
                      All Books ({books.length})
                    </button>
                    <button 
                      className={`btn ${filter === 'Reading' ? 'btn-primary' : 'btn-outline-light'} justify-content-start`}
                      onClick={() => setFilter('Reading')}
                    >
                      <i className="bi bi-bookmark-check me-2"></i>
                      Currently Reading ({books.filter(b => b.status === 'Reading').length})
                    </button>
                    <button 
                      className={`btn ${filter === 'Completed' ? 'btn-primary' : 'btn-outline-light'} justify-content-start`}
                      onClick={() => setFilter('Completed')}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Completed ({books.filter(b => b.status === 'Completed').length})
                    </button>
                    <button 
                      className={`btn ${filter === 'TBR' ? 'btn-primary' : 'btn-outline-light'} justify-content-start`}
                      onClick={() => setFilter('TBR')}
                    >
                      <i className="bi bi-book me-2"></i>
                      To Be Read ({books.filter(b => b.status === 'TBR').length})
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="mb-3">Sort By</h6>
                    <select 
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="title">Title (A-Z)</option>
                      <option value="author">Author (A-Z)</option>
                      <option value="rating">Highest Rating</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Grid Section */}
            <section className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-gradient mb-0">
                  <i className="bi bi-bookshelf me-2"></i>
                  My Books ({sortedBooks.length})
                </h3>
                <div className="text-muted">
                  {filter !== 'all' && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setFilter('all')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              
              {/* Books Grid */}
              <div className="row g-4">
                {sortedBooks.length === 0 ? (
                  <div className="col-12">
                    <div className="card-glass p-5 text-center">
                      <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                      <h4 className="mt-3">No books found</h4>
                      <p className="text-muted">Try changing your filter or add some books to your collection</p>
                    </div>
                  </div>
                ) : (
                  sortedBooks.map((book) => {
                    const badge = getStatusBadge(book.status);
                    
                    return (
                      <div key={book.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="card card-glass h-100 border-0 hover-lift">
                          <div className="card-body p-3 d-flex">
                            <img 
                              src={book.image} 
                              className="book-cover"
                              alt={book.title}
                              style={{ 
                                width: '80px', 
                                height: '120px', 
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                marginRight: '15px'
                              }}
                            />
                            <div className="flex-grow-1 d-flex flex-column">
                              <h6 className="card-title mb-1">{book.title}</h6>
                              <p className="card-text text-muted small mb-2">{book.author}</p>
                              <div className="text-warning mb-2 small">
                                {renderStars(book.rating)}
                              </div>
                              <div className="mt-auto d-flex justify-content-between align-items-center">
                                <span className={`badge ${badge.class} px-2 py-1`}>{badge.text}</span>
                                <div className="action-buttons d-flex gap-1">
                                  {book.status !== 'Completed' && (
                                    <button 
                                      className="btn btn-sm btn-outline-success"
                                      onClick={() => markAsRead(book.id)}
                                      title="Mark as read"
                                    >
                                      <i className="bi bi-check"></i>
                                    </button>
                                  )}
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this book?')) {
                                        deleteBook(book.id);
                                      }
                                    }}
                                    title="Delete book"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyBooks;