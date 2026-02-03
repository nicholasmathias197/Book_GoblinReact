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
            {/* Hero Section */}
            <div className="hero-image mb-5" style={{ overflow: 'hidden', borderRadius: '1rem' }}>
              <img 
                src="/Img/Chilling Goblin 3.0.png" 
                alt="Chilling Goblin"
                className="img-fluid"
                style={{ marginTop: '-250px', marginLeft: '300px', transform: 'translateY(-20px)' }}
              />
            </div>

            {/* Reading Stats */}
            <div className="row g-4 mb-5">
              <div className="col-lg-6">
                <div className="card-glass p-4">
                  <h3 className="text-gradient mb-4">Reading Progress</h3>
                  <div className="table-responsive">
                    <table className="table reading-table w-100">
                      <thead>
                        <tr>
                          <th className="text-start">Month</th>
                          <th className="text-end">Books</th>
                          <th className="text-end">Pages</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>March 2024</td>
                          <td className="text-end">3</td>
                          <td className="text-end">850</td>
                        </tr>
                        <tr>
                          <td>February 2024</td>
                          <td className="text-end">4</td>
                          <td className="text-end">1,200</td>
                        </tr>
                        <tr>
                          <td>January 2024</td>
                          <td className="text-end">5</td>
                          <td className="text-end">1,500</td>
                        </tr>
                        <tr>
                          <td>December 2023</td>
                          <td className="text-end">6</td>
                          <td className="text-end">1,800</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-top">
                          <td className="fw-bold">Total</td>
                          <td className="text-end fw-bold">18</td>
                          <td className="text-end fw-bold text-purple">5,350</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="mt-3 text-center text-muted small">
                    <i className="bi bi-graph-up me-1"></i> 12% increase from last quarter
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="card-glass p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-gradient mb-0">Reading Goals</h3>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-plus"></i> Set Goal
                    </button>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="progress-circle" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                      <svg viewBox="0 0 36 36" className="circular-chart">
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
                          strokeDasharray="65, 100"
                        />
                      </svg>
                      <div className="mt-3">
                        <h4>65%</h4>
                        <p className="text-muted">18 of 50 books read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Section */}
            <section>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-gradient mb-0">My Books ({sortedBooks.length})</h2>
                
                {/* Filters and Sort */}
                <div className="d-flex gap-3">
                  <div className="btn-group" role="group">
                    <button 
                      className={`btn btn-outline-light ${filter === 'all' ? 'active' : ''}`}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`btn btn-outline-light ${filter === 'Reading' ? 'active' : ''}`}
                      onClick={() => setFilter('Reading')}
                    >
                      Reading
                    </button>
                    <button 
                      className={`btn btn-outline-light ${filter === 'Completed' ? 'active' : ''}`}
                      onClick={() => setFilter('Completed')}
                    >
                      Completed
                    </button>
                    <button 
                      className={`btn btn-outline-light ${filter === 'TBR' ? 'active' : ''}`}
                      onClick={() => setFilter('TBR')}
                    >
                      TBR
                    </button>
                  </div>
                  
                  <select 
                    className="form-select w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>
              
              {/* Books Grid */}
              <div className="row g-4">
                {sortedBooks.map((book) => {
                  const badge = getStatusBadge(book.status);
                  
                  return (
                    <div key={book.id} className="col-md-6 col-lg-3">
                      <div className="card card-glass h-100 border-0 d-flex flex-row align-items-start p-3">
                        <img 
                          src={book.image} 
                          className="card-img-left" 
                          alt={book.title}
                          style={{ width: '120px', height: '180px', objectFit: 'cover', marginRight: '15px' }}
                        />
                        <div className="card-body d-flex flex-column p-0" style={{ flex: 1 }}>
                          <h5 className="card-title fs-6 mb-1">{book.title}</h5>
                          <p className="card-text text-muted small mb-2">{book.author}</p>
                          <div className="text-warning mb-2 small">
                            {renderStars(book.rating)}
                          </div>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <span className={`badge ${badge.class}`}>{badge.text}</span>
                            <div className="action-buttons">
                              {book.status !== 'Completed' && (
                                <button 
                                  className="btn btn-sm btn-success me-1"
                                  onClick={() => markAsRead(book.id)}
                                >
                                  <i className="bi bi-check"></i>
                                </button>
                              )}
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this book?')) {
                                    deleteBook(book.id);
                                  }
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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