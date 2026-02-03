import React, { useState } from 'react';
import { useBooks } from '../../context/BookContext';

const AddBookForm = ({ onSubmit }) => {
  const { addBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: '',
    rating: 0,
    notes: ''
  });
  const [charCount, setCharCount] = useState(0);

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 
    'Horror', 'Non-Fiction', 'Biography', 'Historical Fiction'
  ];

  const statuses = [
    { value: 'Reading', label: 'Currently Reading' },
    { value: 'TBR', label: 'To Be Read' },
    { value: 'Completed', label: 'Completed' },
    { value: 'DNF', label: 'Did Not Finish' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'notes') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookData = {
      ...formData,
      rating: parseFloat(formData.rating),
      progress: formData.status === 'Completed' ? 100 : formData.status === 'Reading' ? 50 : 0,
      image: `https://picsum.photos/seed/${Date.now()}/200/300`,
      pages: Math.floor(Math.random() * 500) + 200
    };
    
    addBook(bookData);
    if (onSubmit) onSubmit(bookData);
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      genre: '',
      status: '',
      rating: 0,
      notes: ''
    });
    setCharCount(0);
  };

  return (
    <div className="card card-glass border-0 p-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">Book Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
              minLength="2"
              maxLength="100"
              placeholder="Enter book title"
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="author" className="form-label">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleInputChange}
              required
              minLength="2"
              maxLength="50"
              placeholder="Enter author name"
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="genre" className="form-label">Genre *</label>
            <select
              id="genre"
              name="genre"
              className="form-select"
              value={formData.genre}
              onChange={handleInputChange}
              required
            >
              <option value="">Select genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">Reading Status *</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div className="col-12">
            <label htmlFor="rating" className="form-label">Rating (0-5)</label>
            <input
              type="range"
              id="rating"
              name="rating"
              className="form-range"
              min="0"
              max="5"
              step="0.5"
              value={formData.rating}
              onChange={handleInputChange}
            />
            <div className="d-flex justify-content-between">
              <small>0</small>
              <small>1</small>
              <small>2</small>
              <small>3</small>
              <small>4</small>
              <small>5</small>
            </div>
            <div className="text-center mt-2">
              <span className="badge bg-primary">Rating: {formData.rating} stars</span>
            </div>
          </div>
          
          <div className="col-12">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              rows="3"
              maxLength="500"
              placeholder="Add your notes about this book (max 500 characters)"
              value={formData.notes}
              onChange={handleInputChange}
            />
            <div className="form-text text-end">
              <span className={charCount > 450 ? 'text-danger' : charCount > 400 ? 'text-warning' : 'text-muted'}>
                {charCount}/500 characters
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button type="submit" className="btn btn-primary me-2">
            Add Book
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                title: '',
                author: '',
                genre: '',
                status: '',
                rating: 0,
                notes: ''
              });
              setCharCount(0);
            }}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;