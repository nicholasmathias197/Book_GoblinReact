import React, { useState, useEffect } from 'react';
import { searchBooks, getBookCover } from '../../utils/api';

const BookSearch = ({ onSelectBook, onAddBook, initialQuery = '', showResults = true }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search when initialQuery changes
  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      handleAutoSearch(initialQuery, 1);
    }
  }, [initialQuery]);

  const handleAutoSearch = async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;
    
    console.log('Auto-searching for:', searchQuery);
    setSearching(true);
    setSearchError(null);
    setHasSearched(true);
    
    try {
      const limit = 12;
      const results = await searchBooks(searchQuery, { limit, page });
      console.log('Search results received:', results.length, 'books');
      
      if (page === 1) {
        setSearchResults(results);
      } else {
        setSearchResults(prev => [...prev, ...results]);
      }
      
      setHasMoreResults(results.length === limit);
      setTotalResults(results.length);
      
      if (results.length === 0) {
        setSearchError(`No books found for "${searchQuery}". Try a different search.`);
      }
    } catch (error) {
      console.error('Search error details:', error);
      setSearchError(`Search failed: ${error.message}. Please try again.`);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchError('Please enter a search term');
      setHasSearched(false);
      return;
    }
    
    console.log('Searching for:', query);
    setSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setCurrentPage(1);
    setHasSearched(true);
    
    try {
      const results = await searchBooks(query, { limit: 12, page: 1 });
      console.log('Search results received:', results.length, 'books');
      
      setSearchResults(results);
      setHasMoreResults(results.length === 12);
      setTotalResults(results.length);
      
      if (results.length === 0) {
        setSearchError(`No books found for "${query}". Try a different search.`);
      }
    } catch (error) {
      console.error('Search error details:', error);
      setSearchError(`Search failed: ${error.message}. Please try again.`);
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!query.trim() || !hasMoreResults) return;
    
    const nextPage = currentPage + 1;
    setSearching(true);
    
    try {
      const results = await searchBooks(query, { limit: 12, page: nextPage });
      setSearchResults(prev => [...prev, ...results]);
      setHasMoreResults(results.length === 12);
      setCurrentPage(nextPage);
      setTotalResults(prev => prev + results.length);
    } catch (error) {
      console.error('Load more error:', error);
      setSearchError('Failed to load more results');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBook = (book) => {
    console.log('Selected book:', book);
    const formattedBook = {
      title: book.title,
      author: book.author,
      genre: book.genre || 'General',
      pages: book.pages,
      publishedYear: book.publishedYear,
      coverId: book.coverId,
      isbn: book.isbn,
      openLibraryKey: book.openLibraryKey,
      rating: book.rating || 0
    };
    
    if (onSelectBook) {
      onSelectBook(formattedBook);
    }
  };

  const handleAddFromSearch = async (book) => {
    console.log('Adding book from search:', book.title);
    try {
      const bookData = {
        ...book,
        status: 'TBR',
        progress: 0,
        userRating: 0,
        coverUrl: getBookCover(book.coverId)
      };
      
      if (onAddBook) {
        await onAddBook(bookData);
      }
      
      // Remove the added book from search results
      setSearchResults(prev => prev.filter(b => b.id !== book.id));
      setTotalResults(prev => prev - 1);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
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

  return (
    <div className="book-search">
      {showResults && (
        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Search for books (e.g., Harry Potter, Stephen King, Fantasy)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={searching}
            />
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={searching || !query.trim()}
            >
              {searching ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Searching...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {searchError && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {searchError}
        </div>
      )}

      {searchResults.length > 0 && showResults && (
        <div className="search-results">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-gradient mb-0">
              <i className="bi bi-book me-2"></i>
              Found {totalResults} books for "{query}"
            </h5>
            <div className="text-white-80 small">
              Page {currentPage}
            </div>
          </div>
          
          <div 
            className={`results-container ${searchResults.length > 6 ? 'scrollable' : ''}`}
            style={{
              maxHeight: searchResults.length > 6 ? '500px' : 'auto',
              overflowY: searchResults.length > 6 ? 'auto' : 'visible',
              paddingRight: searchResults.length > 6 ? '10px' : '0'
            }}
          >
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {searchResults.map((book) => (
                <div key={book.id} className="col">
                  <div className="card h-100 bg-dark border border-secondary">
                    <div className="row g-0 h-100">
                      <div className="col-4">
                        <img
                          src={getBookCover(book.coverId, 'M')}
                          className="img-fluid rounded-start h-100 object-fit-cover"
                          alt={book.title}
                          style={{ minHeight: '150px' }}
                          onError={(e) => {
                            e.target.src = '/Img/default-book-cover.jpg';
                            e.target.style.objectFit = 'contain';
                            e.target.style.padding = '10px';
                            e.target.style.backgroundColor = '#f0f0f0';
                          }}
                        />
                      </div>
                      <div className="col-8">
                        <div className="card-body d-flex flex-column h-100 p-3">
                          <h6 className="card-title text-white mb-1">{book.title}</h6>
                          <p className="card-text small text-muted mb-2">
                            by {book.author || 'Unknown Author'}
                          </p>
                          
                          <div className="mb-2">
                            {book.rating > 0 && (
                              <div className="d-flex align-items-center">
                                <span className="me-2">{renderStars(book.rating)}</span>
                                <span className="badge bg-warning text-dark">
                                  {book.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                            {book.publishedYear && (
                              <span className="badge bg-secondary">{book.publishedYear}</span>
                            )}
                          </div>
                          
                          <div className="mt-auto pt-2">
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary flex-fill"
                                onClick={() => handleSelectBook(book)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit & Add
                              </button>
                              <button
                                className="btn btn-sm btn-primary flex-fill"
                                onClick={() => handleAddFromSearch(book)}
                              >
                                <i className="bi bi-plus-circle me-1"></i>
                                Quick Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {hasMoreResults && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-light"
                onClick={handleLoadMore}
                disabled={searching}
              >
                {searching ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-down me-2"></i>
                    Load More Books
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {!searching && hasSearched && searchResults.length === 0 && !searchError && showResults && (
        <div className="text-center py-4">
          <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2 text-muted">No books found. Try a different search term.</p>
        </div>
      )}

      {!searching && !hasSearched && searchResults.length === 0 && !searchError && showResults && (
        <div className="text-center py-4">
          <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2 text-muted">Enter a search term to find books.</p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;