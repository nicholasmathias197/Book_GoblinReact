import React, { useState } from 'react';

const BookCarousel = ({ books = [] }) => {
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
        <p className="text-muted">No recommendations available</p>
      </div>
    );
  }

  const currentBook = books[activeIndex];

  return (
    <div className="carousel-container">
      <div id="discoverCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner rounded-4 overflow-hidden">
          {books.map((book, index) => (
            <div
              key={book.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="d-flex justify-content-start">
                <img
                  src={book.image}
                  className="d-block"
                  alt={book.title}
                  style={{ height: '300px', width: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-caption bg-dark bg-opacity-75 p-3"
                   style={{ textAlign: 'left', right: 'auto', left: '220px', bottom: '20px', width: 'auto' }}>
                <h5>{book.title}</h5>
                <p>{book.author} • {book.genre} • {book.rating}★</p>
              </div>
            </div>
          ))}
        </div>
        
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
      </div>
      
      {/* Carousel Indicators */}
      <div className="carousel-indicators mt-3">
        {books.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;