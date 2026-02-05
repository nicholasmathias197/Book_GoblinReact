import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const genres = [
    'Fantasy', 'Mystery', 'Romance', 'Sci-Fi', 
    'Thriller', 'Horror', 'Biography', 'History'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthColors = ['#dc3545', '#dc3545', '#ffc107', '#ffc107', '#28a745', '#28a745'];
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="auth-container overflow-hidden">
              <div className="row g-0">
                {/* Register Form */}
                <div className="col-lg-6 p-4 p-lg-5">
                  <div className="p-3">
                    <div className="text-center mb-5">
                      <h2 className="h1 text-gradient mb-3">Join Book Goblin</h2>
                      <p className="text-muted">Create your personal library</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-control"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="reader@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                        {formData.password && (
                          <>
                            <div className="password-strength mt-2">
                              <div 
                                className="strength-bar" 
                                style={{
                                  width: `${(passwordStrength / 5) * 100}%`,
                                  backgroundColor: strengthColors[passwordStrength],
                                  height: '5px',
                                  borderRadius: '2px',
                                  transition: 'width 0.3s ease'
                                }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              Strength: {strengthText[passwordStrength]}
                            </small>
                          </>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control ${
                            formData.confirmPassword && 
                            formData.password !== formData.confirmPassword ? 'is-invalid' : ''
                          }`}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <div className="invalid-feedback">Passwords do not match</div>
                        )}
                      </div>
                      
                      {/* Genres (Optional) */}
                      <div className="mb-4">
                        <label className="form-label">Favorite Genres (Optional)</label>
                        <p className="text-muted small mb-3">
                          Select genres to personalize your recommendations
                        </p>
                        <div className="row g-2">
                          {genres.map((genre) => (
                            <div key={genre} className="col-6">
                              <button
                                type="button"
                                className={`btn w-100 ${
                                  selectedGenres.includes(genre) ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                                onClick={() => toggleGenre(genre)}
                                disabled={loading}
                              >
                                {genre}
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
                          </small>
                        </div>
                      </div>
                      
                      {/* Terms and Conditions */}
                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="terms"
                            className="form-check-input"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            disabled={loading}
                          />
                          <label htmlFor="terms" className="form-check-label small">
                            I agree to the 
                            <a href="#" className="text-primary text-decoration-none ms-1">Terms of Service</a> 
                            and 
                            <a href="#" className="text-primary text-decoration-none ms-1">Privacy Policy</a>
                          </label>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-3 mb-4"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="text-center">
                      <p className="mb-2">
                        Already have an account? 
                        <Link to="/login" className="text-decoration-none text-primary ms-1">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Image Side */}
                <div className="col-lg-6 bg-primary bg-gradient d-none d-lg-flex align-items-center justify-content-center p-5 text-white">
                  <div className="text-center">
                    <img 
                      src="/Img/Searching Goblin.png" 
                      alt="Searching Goblin" 
                      className="img-fluid mb-4 rounded-4"
                      style={{ maxWidth: '300px' }}
                    />
                    <h3 className="h4 mb-3">Discover Your Next Favorite</h3>
                    <p className="mb-0">
                      Create your account to start building your personal library and discover new books.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;