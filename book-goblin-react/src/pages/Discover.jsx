import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import BookCarousel from '../components/Dashboard/BookCarousel';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../utils/api';

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    trendingBooks, 
    loading, 
    getBookCover,
    searchBooks,
    addBookToLibrary,
    getTrendingBooks
  } = useBooks();
  
  // Refs for scrolling
  const searchResultsRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [topSearchResults, setTopSearchResults] = useState([]);
  const [isTopSearching, setIsTopSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [showTopSearchResults, setShowTopSearchResults] = useState(false);
  const [searchTotalResults, setSearchTotalResults] = useState(0);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);
  const [showTopSearchEmpty, setShowTopSearchEmpty] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const genres = ['all', 'Fantasy', 'Science Fiction', 'Mystery', 'Horror', 'Romance', 'Non-Fiction'];

  // Check for search query from navigation
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      setActiveTab('search');
      // Scroll to search results after a short delay
      setTimeout(() => {
        if (searchResultsRef.current) {
          searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await getTrendingBooks();
        // For recommendations, we can use trending books or implement a recommendation service
        setRecommendations(trendingBooks.slice(0, 10));
      } catch (error) {
        console.error('Error loading discover data:', error);
      }
    };
    
    loadData();
  }, []);

  const scrollToSearchResults = () => {
    if (searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  };

  const handleTopSearch = async (e, page = 1) => {
    e?.preventDefault();
    if (!searchTerm.trim()) {
      setTopSearchResults([]);
      setShowTopSearchResults(false);
      setShowTopSearchEmpty(false);
      return;
    }

    setIsTopSearching(true);
    setShowTopSearchResults(true);
    setShowTopSearchEmpty(false);
    
    try {
      const limit = 20;
      const results = await searchBooks(searchTerm, page, limit);
      setTopSearchResults(page === 1 ? results : [...topSearchResults, ...results]);
      setHasMoreSearchResults(results.length === limit);
      setSearchPage(page);
      
      if (results.length === 0) {
        setShowTopSearchEmpty(true);
      }
      
      if (results.length > 0 && activeTab !== 'search') {
        setActiveTab('search');
        scrollToSearchResults();
      }
    } catch (error) {
      console.error('Top search failed:', error);
      setTopSearchResults([]);
      setShowTopSearchEmpty(true);
    } finally {
      setIsTopSearching(false);
    }
  };

  const handleLoadMoreTopResults = () => {
    if (!isTopSearching && hasMoreSearchResults) {
      handleTopSearch(null, searchPage + 1);
    }
  };

  const handleSearchSelect = (book) => {
    console.log('Selected book from search:', book);
  };

  const handleAddToLibrary = async (bookData) => {
    try {
      const result = await addBookToLibrary({
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        pages: bookData.pages,
        publishedYear: bookData.publishedYear,
        status: 'WANT_TO_READ'
      });
      
      if (result.success) {
        alert(`${bookData.title} added to your library!`);
      } else {
        alert(result.error || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book to library:', error);
      alert('Failed to add book to library');
    }
  };

  const handleBookCarouselClick = (book) => {
    setSearchTerm(book.title);
    setActiveTab('search');
    
    setTimeout(() => {
      handleTopSearch({ preventDefault: () => {} }, 1);
    }, 100);
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

  // Filter books for display
  const getDisplayedBooks = () => {
    let books = [];
    
    switch (activeTab) {
      case 'trending':
        books = trendingBooks;
        break;
      case 'discover':
      default:
        books = recommendations;
        break;
    }
    
    return books.filter(book => book.rating >= minRating);
  };

  // Get top featured books for carousel
  const getFeaturedBooks = () => {
    const allBooks = [...recommendations, ...trendingBooks];
    // Remove duplicates by title
    const uniqueBooks = allBooks.filter((book, index, self) =>
      index === self.findIndex((b) => b.title === book.title)
    );
    // Take first 5 for carousel
    return uniqueBooks.slice(0, 5);
  };

  const getFilteredBooks = () => {
    let books = getDisplayedBooks();
    
    // Apply genre filter
    if (selectedGenre !== 'all') {
      books = books.filter(book => 
        book.genre && book.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }
    
    // Apply rating filter
    books = books.filter(book => book.rating >= minRating);
    
    return books;
  };

  return (
    <div className="discover-page">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="container-fluid py-4 px-3 px-lg-3">
            {/* Hero Section with Book Carousel */}
            <div className="row align-items-center g-5 mb-5">
              <div className="col-lg-5">
                <div className="hero-image text-center">
                  <img 
                    src="/Img/Searching Goblin.png" 
                    alt="Searching Goblin" 
                    className="img-fluid" 
                    style={{ maxWidth: '350px' }}
                    onError={(e) => {
                      e.target.src = '/Img/default-book-cover.jpg';
                      e.target.style.objectFit = 'contain';
                    }}
                  />
                </div>
              </div>
              
              <div className="col-lg-7">
                <div className="mb-4">
                  <h1 className="text-gradient mb-2">Discover Books</h1>
                  <p className="text-muted">Explore recommendations and trending titles</p>
                </div>
                
                {/* Featured Books Carousel */}
                <div className="card border-0 shadow p-4 mb-4">
                  <BookCarousel 
                    books={getFeaturedBooks()}
                    getCover={getBookCover}
                    onBookClick={handleBookCarouselClick}
                    onAddToLibrary={handleAddToLibrary}
                    title="Featured Books"
                    showAddButton={true}
                  />
                  
                  {/* Advanced Filters */}
                  <div className="row mt-4 g-3">
                    <div className="col-md-6">
                      <label className="form-label">Genre Filter</label>
                      <select 
                        className="form-select"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                      >
                        {genres.map(genre => (
                          <option key={genre} value={genre}>
                            {genre === 'all' ? 'All Genres' : genre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Minimum Rating: {minRating}★</label>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="card border-0 shadow p-3 mb-4">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'discover' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('discover');
                      setSearchTerm('');
                      setShowTopSearchResults(false);
                      setShowTopSearchEmpty(false);
                    }}
                  >
                    <i className="bi bi-compass me-2"></i>
                    Discover
                    {activeTab === 'discover' && (
                      <span className="badge bg-primary ms-2">{getFilteredBooks().length} books</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('search');
                      setShowTopSearchResults(false);
                      setShowTopSearchEmpty(false);
                      if (searchTerm.trim()) {
                        scrollToSearchResults();
                      }
                    }}
                  >
                    <i className="bi bi-search me-2"></i>
                    Search Books
                    {searchTerm && (
                      <span className="badge bg-primary ms-2">{searchTerm}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'trending' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('trending');
                      setShowTopSearchResults(false);
                      setShowTopSearchEmpty(false);
                    }}
                  >
                    <i className="bi bi-fire me-2"></i>
                    Trending
                    {activeTab === 'trending' && (
                      <span className="badge bg-primary ms-2">{getFilteredBooks().length} books</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'discover' && (
              <section className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="text-gradient mb-0">
                    <i className="bi bi-compass me-2"></i>
                    Recommended for You
                    <span className="badge bg-primary ms-2">
                      {getFilteredBooks().length} books
                    </span>
                  </h2>
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Filter by Genre
                    </button>
                    <ul className="dropdown-menu">
                      {genres.map(genre => (
                        <li key={genre}>
                          <button 
                            className="dropdown-item"
                            onClick={() => setSelectedGenre(genre)}
                          >
                            {genre === 'all' ? 'All Genres' : genre}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading books...</p>
                  </div>
                ) : getFilteredBooks().length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-2 text-muted">No books found with current filters</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {getFilteredBooks().slice(0, 12).map((book) => (
                      <div key={book.id || book.openLibraryId} className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="d-flex justify-content-center p-3 pb-0 position-relative">
                            <img 
                              src={getBookCover(book.coverId, 'M')} 
                              className="card-img-top" 
                              alt={book.title}
                              style={{ 
                                width: '150px', 
                                height: '225px', 
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = '/Img/default-book-cover.jpg';
                                e.target.style.objectFit = 'contain';
                                e.target.style.padding = '10px';
                              }}
                            />
                            <button
                              className="btn btn-primary btn-sm position-absolute"
                              style={{
                                top: '10px',
                                right: '10px',
                                padding: '5px 10px',
                                borderRadius: '20px'
                              }}
                              onClick={() => handleAddToLibrary(book)}
                              title="Add to My Books"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title fs-6 mb-1">{book.title}</h5>
                            <p className="card-text text-muted small mb-2">{book.author}</p>
                            {book.rating > 0 && (
                              <div className="text-warning mb-2 small">
                                {renderStars(book.rating)}
                                <span className="ms-1 text-muted">({book.rating?.toFixed(1)})</span>
                              </div>
                            )}
                            <div className="mt-auto">
                              <button 
                                className="btn btn-sm btn-primary w-100"
                                onClick={() => handleAddToLibrary(book)}
                              >
                                <i className="bi bi-plus me-1"></i>Add to Library
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'search' && (
              <section className="mb-5" ref={searchResultsRef}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="text-gradient mb-0">
                    <i className="bi bi-search me-2"></i>
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Search Books'}
                  </h2>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveTab('discover');
                      setShowTopSearchEmpty(false);
                    }}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Discover
                  </button>
                </div>
                
                {/* Search input within the search tab */}
                <div className="card border-0 shadow p-4 mb-4">
                  <form onSubmit={handleTopSearch}>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search books by title, author, ISBN, or genre..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          if (e.target.value.trim() === '') {
                            setShowTopSearchResults(false);
                            setShowTopSearchEmpty(false);
                          }
                        }}
                      />
                      <button 
                        className="btn btn-primary"
                        type="submit"
                        disabled={isTopSearching}
                      >
                        {isTopSearching ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Searching...
                          </>
                        ) : 'Search'}
                      </button>
                    </div>
                  </form>

                  {/* Top Search Results */}
                  {showTopSearchResults && topSearchResults.length === 0 && showTopSearchEmpty && (
                    <div className="mt-3">
                      <div className="alert alert-warning mb-0">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        No results found for "{searchTerm}". Try a different search.
                      </div>
                    </div>
                  )}

                  {showTopSearchResults && topSearchResults.length > 0 && (
                    <div className="search-results-dropdown mt-3">
                      <div className="card border border-primary">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">
                              <i className="bi bi-search me-2"></i>
                              Quick Results
                            </h6>
                            <small className="text-muted">
                              Showing {topSearchResults.length} results
                            </small>
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setShowTopSearchResults(false);
                              setShowTopSearchEmpty(false);
                            }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {topSearchResults.map((book, index) => (
                              <div 
                                key={`${book.id || book.openLibraryId}-${index}`} 
                                className="list-group-item list-group-item-action"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAddToLibrary(book)}
                              >
                                <div className="d-flex align-items-center">
                                  <img
                                    src={getBookCover(book.coverId, 'S')}
                                    className="rounded me-3"
                                    alt={book.title}
                                    style={{ 
                                      width: '40px', 
                                      height: '60px', 
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.target.src = '/Img/default-book-cover.jpg';
                                      e.target.style.objectFit = 'contain';
                                      e.target.style.padding = '5px';
                                    }}
                                  />
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <h6 className="mb-1">{book.title}</h6>
                                        <small className="text-muted">{book.author || 'Unknown Author'}</small>
                                      </div>
                                      <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToLibrary(book);
                                        }}
                                      >
                                        <i className="bi bi-plus"></i>
                                      </button>
                                    </div>
                                    <div className="d-flex gap-2 mt-1">
                                      {book.rating > 0 && (
                                        <small className="text-warning">
                                          {renderStars(book.rating)}
                                        </small>
                                      )}
                                      {book.publishedYear && (
                                        <small className="badge bg-secondary">{book.publishedYear}</small>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {hasMoreSearchResults && topSearchResults.length > 0 && (
                          <div className="card-footer text-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={handleLoadMoreTopResults}
                              disabled={isTopSearching}
                            >
                              {isTopSearching ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-arrow-down me-2"></i>
                                  Load More Results
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'trending' && (
              <section className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="text-gradient mb-0">
                    <i className="bi bi-fire me-2"></i>
                    Trending Now
                    <span className="badge bg-primary ms-2">
                      {getFilteredBooks().length} books
                    </span>
                  </h2>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveTab('discover')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Discover
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading trending books...</p>
                  </div>
                ) : getFilteredBooks().length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-fire text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-2 text-muted">No trending books found with current filters</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {getFilteredBooks().slice(0, 12).map((book) => (
                      <div key={book.id || book.openLibraryId} className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="d-flex justify-content-center p-3 pb-0 position-relative">
                            <img 
                              src={getBookCover(book.coverId, 'M')} 
                              className="card-img-top" 
                              alt={book.title}
                              style={{ 
                                width: '150px', 
                                height: '225px', 
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = '/Img/default-book-cover.jpg';
                                e.target.style.objectFit = 'contain';
                                e.target.style.padding = '10px';
                              }}
                            />
                            <button
                              className="btn btn-primary btn-sm position-absolute"
                              style={{
                                top: '10px',
                                right: '10px',
                                padding: '5px 10px',
                                borderRadius: '20px'
                              }}
                              onClick={() => handleAddToLibrary(book)}
                              title="Add to My Books"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title fs-6 mb-1">{book.title}</h5>
                            <p className="card-text text-muted small mb-2">{book.author}</p>
                            {book.rating > 0 && (
                              <div className="text-warning mb-2 small">
                                {renderStars(book.rating)}
                              </div>
                            )}
                            <div className="mt-auto">
                              <button 
                                className="btn btn-sm btn-primary w-100"
                                onClick={() => handleAddToLibrary(book)}
                              >
                                <i className="bi bi-plus me-1"></i>Add to Library
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Quick Stats */}
            <div className="row mt-5">
              <div className="col-md-4">
                <div className="card border-0 shadow p-3 text-center">
                  <i className="bi bi-database text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-2 mb-1">Book Database</h5>
                  <p className="small mb-0 text-muted">Millions of books available</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow p-3 text-center">
                  <i className="bi bi-search text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-2 mb-1">Advanced Search</h5>
                  <p className="small mb-0 text-muted">By title, author, genre, ISBN</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow p-3 text-center">
                  <i className="bi bi-plus-circle text-primary" style={{ fontSize: '2rem' }}></i>
                  <h5 className="mt-2 mb-1">One-Click Add</h5>
                  <p className="small mb-0 text-muted">Add to your library instantly</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;