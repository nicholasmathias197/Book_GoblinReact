import React, { useState } from 'react';
import { useBooks } from '../../context/BookContext';

const AddBookForm = ({ onSubmit, onClose }) => {
  const { addBookToLibrary, loading } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    publishedYear: '',
    status: 'WANT_TO_READ'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statuses = [
    { value: 'WANT_TO_READ', label: 'Want to Read' },
    { value: 'READING', label: 'Currently Reading' },
    { value: 'READ', label: 'Read' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Title and author are required');
      return;
    }
    
    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        status: formData.status
      };
      
      const result = await addBookToLibrary(bookData);
      
      if (result.success) {
        setSuccess('Book added to your library successfully!');
        
        // Reset form
        setFormData({
          title: '',
          author: '',
          isbn: '',
          pages: '',
          publishedYear: '',
          status: 'WANT_TO_READ'
        });
        
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(result.data);
        }
        
        // Auto-close after success (optional)
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
        
      } else {
        setError(result.error || 'Failed to add book to library');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      pages: '',
      publishedYear: '',
      status: 'WANT_TO_READ'
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="card border-0 p-4 shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <h4 className="text-gradient">Add Book to Library</h4>
          <p className="text-muted small">Add a new book to your personal library</p>
        </div>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}
        
        <div className="row g-3">
          <div className="col-md-12">
            <label htmlFor="title" className="form-label">
              Book Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter book title"
            />
          </div>
          
          <div className="col-md-12">
            <label htmlFor="author" className="form-label">
              Author <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter author name"
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="isbn" className="form-label">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              className="form-control"
              value={formData.isbn}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Optional - for automatic details"
            />
            <div className="form-text">
              Enter ISBN to fetch book details automatically
            </div>
          </div>
          
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">Reading Status</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6">
            <label htmlFor="pages" className="form-label">Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              className="form-control"
              value={formData.pages}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Optional"
              min="1"
            />
          </div>
          
          <div className="col-md-6">
            <label htmlFor="publishedYear" className="form-label">Published Year</label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              className="form-control"
              value={formData.publishedYear}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Optional"
              min="0"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        
        <div className="mt-4 d-flex justify-content-between">
          <div>
            <button 
              type="button" 
              className="btn btn-secondary me-2"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            {onClose && (
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : 'Add to Library'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;