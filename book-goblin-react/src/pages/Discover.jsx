import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import { useBooks } from '../context/BookContext';

const Discover = () => {
  const { recommendations, addToTbr } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);

  const genres = ['all', 'Fantasy', 'Sci-Fi', 'Mystery', 'Horror', 'Romance', 'Non-Fiction'];

  const filteredBooks = recommendations.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    const matchesRating = book.rating >= minRating;
    
    return matchesSearch && matchesGenre && matchesRating;
  });

  const handleAddToTbr = (book) => {
    addToTbr(book);
    alert(`${book.title} added to your TBR list!`);
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
    <div className="discover-page">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="container-fluid py-4 px-3 px-lg-3">
            {/* Hero Section */}
            <div className="row align-items-center g-5 mb-5">
              <div className="col-lg-6">
                <div className="hero-image">
                  <img 
                    src="Img/Searching%20Goblin.png" 
                    alt="Searching Goblin" 
                    className="img-fluid" 
                    style={{ maxWidth: '400px' }}
                  />
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="text-center mb-4">
                  <h3 className="text-gradient mb-1">Recommended for You</h3>
                  <p className="text">Based on your reading</p>
                </div>
                
                {/* Search and Filters */}
                <div className="card-glass p-4 mb-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-glass">
                          <i className="bi bi-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control bg-dark border-glass text-light"
                          placeholder="Search books, authors, or genres..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <select 
                        className="form-select bg-dark border-glass text-light"
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
                  </div>
                  
                  {/* Rating Filter */}
                  <div className="row mt-3">
                    <div className="col-12">
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

            {/* Books Grid */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-gradient mb-0">More Books to Explore</h2>
                <div className="dropdown">
                  <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="bi bi-filter me-2"></i>Filter by Genre
                  </button>
                  <ul className="dropdown-menu bg-dark border border-light">
                    {genres.map(genre => (
                      <li key={genre}>
                        <button 
                          className="dropdown-item text-light"
                          onClick={() => setSelectedGenre(genre)}
                        >
                          {genre === 'all' ? 'All Genres' : genre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Books Grid */}
              <div className="row g-4">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="col-md-6 col-lg-3">
                    <div className="card card-glass h-100 border-0">
                      <div className="d-flex justify-content-center p-3 pb-0">
                        <img 
                          src={book.image} 
                          className="card-img-top" 
                          alt={book.title}
                          style={{ width: '150px', height: '225px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fs-6 mb-1">{book.title}</h5>
                        <p className="card-text text-muted small mb-2">{book.author}</p>
                        <div className="text-warning mb-2 small">
                          {renderStars(book.rating)}
                        </div>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="badge bg-purple">{book.genre}</span>
                          <span className="badge bg-secondary">{book.rating}★</span>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary mt-3 w-100"
                          onClick={() => handleAddToTbr(book)}
                        >
                          <i className="bi bi-plus me-1"></i>Add to TBR
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Section */}
            <section>
              <h3 className="text-gradient mb-4">Trending Now</h3>
              <div className="row g-3">
                {filteredBooks.slice(0, 2).map((book) => (
                  <div key={book.id} className="col-12">
                    <div className="card-glass p-3">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img 
                            src={book.image} 
                            className="img-fluid rounded-3" 
                            alt={book.title}
                            style={{ height: '100px', width: '70px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="col-md-7">
                          <h5 className="mb-1">{book.title}</h5>
                          <p className="text-muted small mb-2">{book.author}</p>
                          <p className="small mb-0">Discover this trending book that everyone is talking about!</p>
                        </div>
                        <div className="col-md-3 text-md-end">
                          <div className="text-warning mb-2">
                            {renderStars(book.rating)}
                          </div>
                          <button 
                            className="btn btn-sm btn-gradient"
                            onClick={() => handleAddToTbr(book)}
                          >
                            <i className="bi bi-plus me-1"></i>Add to TBR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;