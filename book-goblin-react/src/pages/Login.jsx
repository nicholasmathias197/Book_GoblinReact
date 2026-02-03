import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="auth-container overflow-hidden">
              <div className="row g-0">
                {/* Login Form */}
                <div className="col-lg-6 p-4 p-lg-5">
                  <div className="p-3">
                    <div className="text-center mb-5">
                      <h2 className="h1 text-gradient mb-3">Welcome Back</h2>
                      <p className="text-muted">Sign in to your Book Goblin account</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-dark"
                          placeholder="reader@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="password" className="form-label text-light">Password</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-dark"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <div className="text-end mt-2">
                          <a href="#" className="text-decoration-none text-purple small">
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="remember"
                            className="form-check-input"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                          />
                          <label htmlFor="remember" className="form-check-label text-light">
                            Remember me
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
                            Signing In...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                          </>
                        )}
                      </button>
                    </form>
                    
                    {/* Social Login */}
                    <div className="text-center mb-4">
                      <p className="text-muted mb-3">Or sign in with</p>
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
                        Don't have an account? 
                        <Link to="/register" className="text-decoration-none text-purple ms-1">
                          Sign up here
                        </Link>
                      </p>
                      <p className="mb-0 small text-muted">
                        By signing in, you agree to our 
                        <a href="#" className="text-decoration-none text-muted ms-1">Terms of Service</a> and 
                        <a href="#" className="text-decoration-none text-muted ms-1">Privacy Policy</a>
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
                    <h3 className="h4 mb-3">Your Reading Journey Awaits</h3>
                    <p className="mb-0">Track your books, discover new favorites, and connect with fellow readers.</p>
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

export default Login;