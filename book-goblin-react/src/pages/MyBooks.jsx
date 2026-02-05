import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import { useBooks } from '../context/BookContext';
import { libraryAPI } from '../utils/api';

const MyBooks = () => {
  const navigate = useNavigate();
  const { myBooks, loading, getMyBooks, getBookCover } = useBooks();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [readingStats, setReadingStats] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [libraryStats, setLibraryStats] = useState(null);

  // Load books and stats
  useEffect(() => {
    const loadData = async () => {
      await getMyBooks();
      
      // Get library stats from backend
      try {
        const stats = await libraryAPI.getLibraryStats(1); // Replace with actual user ID from auth
        setLibraryStats(stats);
        
        // Calculate statistics
        const completedBooks = myBooks.filter(book => book.status === 'READ');
        const completedCount = completedBooks.length;
        const totalPagesRead = completedBooks.reduce((sum, book) => sum + (parseInt(book.pages) || 0), 0);
        
        setTotalBooks(completedCount);
        setTotalPages(totalPagesRead);
        
        const goal = 50;
        const progress = Math.min(Math.round((completedCount / goal) * 100), 100);
        setGoalProgress(progress);
        
        // Group by month for reading stats
        const statsByMonth = {};
        completedBooks.forEach(book => {
          if (book.finishedReading) {
            const date = new Date(book.finishedReading);
            const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            if (!statsByMonth[monthYear]) {
              statsByMonth[monthYear] = { books: 0, pages: 0 };
            }
            statsByMonth[monthYear].books += 1;
            statsByMonth[monthYear].pages += parseInt(book.pages) || 0;
          }
        });
        
        const statsArray = Object.entries(statsByMonth)
          .map(([month, data]) => ({ month, ...data }))
          .sort((a, b) => new Date(b.month) - new Date(a.month))
          .slice(0, 4);
        
        setReadingStats(statsArray);
      } catch (error) {
        console.error('Error loading library stats:', error);
      }
    };

    loadData();
  }, [getMyBooks]);

  const filteredBooks = myBooks.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'author':
        return (a.author || '').localeCompare(b.author || '');
      case 'rating':
        return (b.userRating || b.rating || 0) - (a.userRating || a.rating || 0);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      default:
        return 0;
    }
  });

  const getStatusBadge = (status) => {
    const badges = {
      'READING': { class: 'bg-warning', text: 'Reading' },
      'WANT_TO_READ': { class: 'bg-info', text: 'To Read' },
      'READ': { class: 'bg-success', text: 'Read' },
      'DROPPED': { class: 'bg-danger', text: 'Dropped' }
    };
    return badges[status] || { class: 'bg-secondary', text: status };
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    
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

  const getBookImage = (book) => {
    if (book.coverId) {
      return getBookCover(book.coverId, 'S');
    }
    return book.image || '/Img/default-book-cover.jpg';
  };

  const statusOptions = ['all', 'WANT_TO_READ', 'READING', 'READ', 'DROPPED'];

  return (
    <div className="mybooks-page">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="container-fluid py-4 px-3 px-lg-4">
            {/* Top Row: Header and Add Button */}
            <div className="row align-items-center mb-4">
              <div className="col-md-8">
                <h1 className="text-gradient mb-2">
                  <i className="bi bi-bookshelf me-2"></i>
                  My Library
                </h1>
                <p className="text-muted mb-0">Manage your personal book collection</p>
              </div>
              <div className="col-md-4 text-md-end">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/discover')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Books
                </button>
              </div>
            </div>

            {/* Reading Goals Card */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4 className="text-gradient mb-3">Reading Progress</h4>
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-4" style={{ width: '100px', height: '100px' }}>
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                              className="circle-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e6e6e6"
                              strokeWidth="3"
                            />
                            <path
                              className="circle"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#007bff"
                              strokeWidth="3"
                              strokeDasharray={`${goalProgress}, 100`}
                            />
                          </svg>
                          <div className="position-absolute top-50 start-50 translate-middle text-center">
                            <h5 className="mb-0">{goalProgress}%</h5>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">{totalBooks} of 50 books completed</h5>
                          <p className="mb-0 text-muted">{totalPages.toLocaleString()} total pages read</p>
                          <div className="mt-2">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => navigate('/discover')}
                            >
                              <i className="bi bi-search me-1"></i>
                              Find More Books
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border p-3 text-center h-100">
                        <div className="small text-muted mb-1">Total Collection</div>
                        <h2 className="mb-0">{myBooks.length}</h2>
                        <p className="small mb-0 text-muted">books in your library</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Sort Bar */}
            <div className="card border-0 shadow p-3 mb-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="btn-group flex-wrap" role="group">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-secondary'} m-1`}
                        onClick={() => setFilter(status)}
                      >
                        {status === 'all' ? 'All Books' : status.replace('_', ' ')}
                        {status !== 'all' && (
                          <span className="badge bg-dark ms-2">
                            {myBooks.filter(b => b.status === status).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-6 text-md-end mt-2 mt-md-0">
                  <select 
                    className="form-select form-select-sm d-inline-block w-auto"
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

            {/* Books Grid */}
            <section>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-gradient mb-0">
                  {filter === 'all' ? 'All Books' : filter.replace('_', ' ')} ({sortedBooks.length})
                </h3>
                {filter !== 'all' && (
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setFilter('all')}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading your books...</p>
                </div>
              ) : sortedBooks.length === 0 ? (
                <div className="col-12">
                  <div className="card border-0 shadow p-5 text-center">
                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3">No books found</h4>
                    <p>Try changing your filter or add some books to your collection</p>
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={() => navigate('/discover')}
                    >
                      <i className="bi bi-search me-2"></i>
                      Discover Books
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {sortedBooks.map((book) => {
                    const badge = getStatusBadge(book.status);
                    const bookImage = getBookImage(book);
                    
                    return (
                      <div key={book.id || book.openLibraryId} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body p-3 d-flex">
                            <img 
                              src={bookImage}
                              className="book-cover"
                              alt={book.title}
                              style={{ 
                                width: '80px', 
                                height: '120px', 
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                marginRight: '15px'
                              }}
                              onError={(e) => {
                                e.target.src = '/Img/default-book-cover.jpg';
                              }}
                            />
                            <div className="flex-grow-1 d-flex flex-column">
                              <h6 className="card-title mb-1">{book.title || 'Untitled Book'}</h6>
                              <p className="card-text small mb-2 text-muted">{book.author || 'Unknown Author'}</p>
                              <div className="text-warning mb-2 small">
                                {renderStars(book.userRating || book.rating || 0)}
                              </div>
                              <div className="mt-auto d-flex justify-content-between align-items-center">
                                <span className={`badge ${badge.class} px-2 py-1`}>{badge.text}</span>
                                {book.currentPage && book.pages && (
                                  <div className="progress" style={{ width: '60px', height: '4px' }}>
                                    <div 
                                      className="progress-bar" 
                                      style={{ width: `${(book.currentPage / book.pages) * 100}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyBooks;