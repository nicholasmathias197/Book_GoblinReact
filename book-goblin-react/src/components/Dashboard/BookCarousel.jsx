import React, { useState } from 'react';

const BookCarousel = ({ 
  books = [], 
  getCover, 
  onBookClick, 
  onAddToLibrary,
  title = "Featured Books",
  showAddButton = false,
  emptyMessage = "No books available"
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === books.length - 1 ? 0 : prev + 1));
  };

  if (books.length === 0) {
    return (
      <div className="text-center p-5">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  const currentBook = books[activeIndex];

  const getCoverImage = (book) => {
    if (book.coverId) {
      return getCover ? getCover(book.coverId) : '/Img/default-book-cover.jpg';
    }
    return book.image || '/Img/default-book-cover.jpg';
  };

  return (
    <div className="carousel-container">
      {title && <h4 className="text-gradient mb-4">{title}</h4>}
      
      <div id="discoverCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner rounded-4 overflow-hidden">
          {books.map((book, index) => (
            <div
              key={book.id || book.openLibraryId || index}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="d-flex justify-content-start position-relative">
                <img
                  src={getCoverImage(book)}
                  className="d-block"
                  alt={book.title}
                  style={{ 
                    height: '300px', 
                    width: '200px', 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => onBookClick && onBookClick(book)}
                  onError={(e) => {
                    e.target.src = '/Img/default-book-cover.jpg';
                    e.target.style.objectFit = 'contain';
                    e.target.style.padding = '20px';
                  }}
                />
                
                {/* Add to Library Button */}
                {showAddButton && onAddToLibrary && (
                  <button
                    className="btn btn-primary position-absolute"
                    style={{
                      top: '10px',
                      right: '10px',
                      zIndex: 10,
                      padding: '5px 15px',
                      fontSize: '0.9rem',
                      borderRadius: '20px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToLibrary(book);
                    }}
                    title="Add to My Books"
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add to Library
                  </button>
                )}
                
                <div className="carousel-caption bg-dark bg-opacity-75 p-3"
                     style={{ 
                       textAlign: 'left', 
                       right: 'auto', 
                       left: '220px', 
                       bottom: '20px', 
                       width: 'auto',
                       maxWidth: '400px'
                     }}>
                  <h5>{book.title}</h5>
                  <p>
                    {book.author || 'Unknown Author'} • 
                    {book.genre ? ` ${book.genre} • ` : ' '}
                    {book.rating ? `${book.rating.toFixed(1)}★` : 'No rating'}
                  </p>
                  <div className="mt-2">
                    {book.publishedYear && (
                      <span className="badge bg-secondary me-2">{book.publishedYear}</span>
                    )}
                    {book.pages && (
                      <span className="badge bg-info">{book.pages} pages</span>
                    )}
                    {book.status && (
                      <span className={`badge ${book.status === 'READING' ? 'bg-warning' : 
                                         book.status === 'READ' ? 'bg-success' : 
                                         'bg-primary'}`}>
                        {book.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {books.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              onClick={handlePrev}
            >
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={handleNext}
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </>
        )}
      </div>
      
      {/* Carousel Indicators */}
      {books.length > 1 && (
        <div className="carousel-indicators mt-3 d-flex justify-content-center">
          {books.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`carousel-indicator mx-1 ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '1px solid #fff',
                backgroundColor: index === activeIndex ? '#fff' : 'transparent'
              }}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCarousel;