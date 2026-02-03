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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
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

    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
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
        password: formData.password,
        preferences: {
          genres: selectedGenres,
          readingGoal: 52
        }
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
                        <label htmlFor="username" className="form-label text-light">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-control form-control-dark"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control form-control-dark"
                          placeholder="reader@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label text-light">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control form-control-dark"
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
                        <label htmlFor="confirmPassword" className="form-label text-light">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control form-control-dark ${
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
                      
                      {/* Genres */}
                      <div className="mb-4">
                        <label className="form-label text-light">Favorite Genres</label>
                        <p className="text-muted small mb-3">
                          Select genres to personalize your recommendations
                        </p>
                        <div className="row g-2">
                          {genres.map((genre) => (
                            <div key={genre} className="col-6">
                              <button
                                type="button"
                                className={`genre-tag w-100 ${
                                  selectedGenres.includes(genre) ? 'selected' : ''
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
                          <label htmlFor="terms" className="form-check-label text-light small">
                            I agree to the 
                            <a href="#" className="text-purple text-decoration-none ms-1">Terms of Service</a> 
                            and 
                            <a href="#" className="text-purple text-decoration-none ms-1">Privacy Policy</a>
                          </label>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-gradient w-100 py-3 mb-4"
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
                    
                    {/* Social Register */}
                    <div className="text-center mb-4">
                      <p className="text-muted mb-3">Or sign up with</p>
                      <div className="d-flex gap-3">
                        <button 
                          className="btn btn-outline-light flex-grow-1"
                          disabled={loading}
                        >
                          <i className="bi bi-google me-2"></i>Google
                        </button>
                        <button 
                          className="btn btn-outline-light flex-grow-1"
                          disabled={loading}
                        >
                          <i className="bi bi-github me-2"></i>GitHub
                        </button>
                      </div>
                    </div>
                    
                    {/* Links */}
                    <div className="text-center">
                      <p className="mb-2">
                        Already have an account? 
                        <Link to="/login" className="text-decoration-none text-purple ms-1">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Image Side */}
                <div className="col-lg-6 bg-gradient-primary d-none d-lg-flex align-items-center justify-content-center p-5">
                  <div className="text-center text-white">
                    <img 
                      src="Img/Searching%20Goblin.png" 
                      alt="Searching Goblin" 
                      className="img-fluid mb-4 rounded-4"
                      style={{ maxWidth: '300px' }}
                    />
                    <h3 className="h4 mb-3">Discover Your Next Favorite</h3>
                    <p className="mb-0">
                      Tell us your reading preferences and we'll help you discover books tailored to your taste.
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