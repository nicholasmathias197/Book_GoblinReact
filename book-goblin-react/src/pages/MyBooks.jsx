import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import { useBooks } from '../hooks/useBooks';

const MyBooks = () => {
  const navigate = useNavigate();
  const { books, deleteBook, updateBook, getBookCover } = useBooks();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [readingStats, setReadingStats] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  // Calculate statistics
  useEffect(() => {
    const completedBooks = books.filter(book => book.status === 'Completed');
    const completedCount = completedBooks.length;
    const totalPagesRead = completedBooks.reduce((sum, book) => sum + (parseInt(book.pages) || 0), 0);
    
    // Group by month
    const statsByMonth = {};
    completedBooks.forEach(book => {
      if (book.finishedDate) {
        const date = new Date(book.finishedDate);
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
    setTotalBooks(completedCount);
    setTotalPages(totalPagesRead);
    
    const goal = 50;
    const progress = Math.min(Math.round((completedCount / goal) * 100), 100);
    setGoalProgress(progress);
  }, [books]);

  const filteredBooks = books.filter(book => {
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

  const handleMarkAsRead = async (bookId) => {
    await updateBook(bookId, { 
      status: 'Completed', 
      progress: 100,
      finishedDate: new Date().toISOString()
    });
  };

  const handleMarkAsReading = async (bookId) => {
    await updateBook(bookId, { 
      status: 'Reading',
      startedDate: new Date().toISOString()
    });
  };

  const handleMarkAsDNF = async (bookId) => {
    await updateBook(bookId, { 
      status: 'DNF',
      finishedDate: new Date().toISOString()
    });
  };

  const getBookImage = (book) => {
    if (book.coverUrl) return book.coverUrl;
    if (book.image) return book.image;
    if (book.coverId) return getBookCover(book.coverId, 'S');
    return '/Img/default-book-cover.jpg';
  };

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
                <p className="text-white-80 mb-0">Manage your personal book collection</p>
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
                <div className="card-glass p-4">
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
                            <h5 className="mb-0">{goalProgress}%</h5>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">{totalBooks} of 50 books completed</h5>
                          <p className="mb-0 text-white-80">{totalPages.toLocaleString()} total pages read</p>
                          <div className="mt-2">
                            <button 
                              className="btn btn-sm btn-outline-light"
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
                      <div className="card-stat p-3 text-center h-100">
                        <div className="small text-white-80 mb-1">Total Collection</div>
                        <h2 className="mb-0 text-white">{books.length}</h2>
                        <p className="small mb-0 text-white-80">books in your library</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Sort Bar */}
            <div className="card-glass p-3 mb-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="btn-group" role="group">
                    {['all', 'Reading', 'Completed', 'TBR', 'DNF'].map((status) => (
                      <button
                        key={status}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-light'}`}
                        onClick={() => setFilter(status)}
                      >
                        {status === 'all' ? 'All Books' : status}
                        {status !== 'all' && (
                          <span className="badge bg-dark ms-2">
                            {books.filter(b => b.status === status).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-6 text-md-end mt-2 mt-md-0">
                  <select 
                    className="form-select form-select-sm bg-dark border-glass text-light d-inline-block w-auto"
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
                  {filter === 'all' ? 'All Books' : filter} ({sortedBooks.length})
                </h3>
                {filter !== 'all' && (
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setFilter('all')}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              <div className="row g-4">
                {sortedBooks.length === 0 ? (
                  <div className="col-12">
                    <div className="card-glass p-5 text-center">
                      <i className="bi bi-book" style={{ fontSize: '3rem' }}></i>
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
                  sortedBooks.map((book) => {
                    const badge = getStatusBadge(book.status);
                    const bookImage = getBookImage(book);
                    
                    return (
                      <div key={book.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="card card-glass h-100 border-0 hover-lift">
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
                              <h6 className="card-title mb-1 text-white">{book.title || 'Untitled Book'}</h6>
                              <p className="card-text small mb-2 text-white-80">{book.author || 'Unknown Author'}</p>
                              <div className="text-warning mb-2 small">
                                {renderStars(book.userRating || book.rating || 0)}
                              </div>
                              <div className="mt-auto d-flex justify-content-between align-items-center">
                                <span className={`badge ${badge.class} px-2 py-1`}>{badge.text}</span>
                                <div className="action-buttons d-flex gap-1">
                                  {/* Show Reading button only if not already Reading */}
                                  {book.status !== 'Reading' && (
                                    <button 
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleMarkAsReading(book.id)}
                                      title="Mark as Reading"
                                    >
                                      <i className="bi bi-play-circle"></i>
                                    </button>
                                  )}
                                  
                                  {/* Show DNF button only if not already DNF */}
                                  {book.status !== 'DNF' && (
                                    <button 
                                      className="btn btn-sm btn-outline-warning"
                                      onClick={() => handleMarkAsDNF(book.id)}
                                      title="Mark as Did Not Finish"
                                    >
                                      <i className="bi bi-x-circle"></i>
                                    </button>
                                  )}
                                  
                                  {/* Show Complete button only if not already Completed */}
                                  {book.status !== 'Completed' && (
                                    <button 
                                      className="btn btn-sm btn-outline-success"
                                      onClick={() => handleMarkAsRead(book.id)}
                                      title="Mark as Completed"
                                    >
                                      <i className="bi bi-check-circle"></i>
                                    </button>
                                  )}
                                  
                                  {/* Always show Delete button */}
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