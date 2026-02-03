import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header sticky-top py-3 px-4 bg-dark-glass border-bottom border-glass">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h2 mb-1 text-gradient">Book Goblin</h1>
          <p className="text">Your Personal Library Assistant</p>
        </div>
        
        <div className="dropdown">
          <button 
            className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img 
              src={user?.avatar || '/Img/avatar.png'} 
              alt="User Avatar" 
              className="rounded-circle border border-purple"
              width="42"
              height="42"
            />
            <span>Account</span>
          </button>
          
          {isMenuOpen && (
            <div className="dropdown-menu dropdown-menu-end bg-dark border border-light show">
              {user?.role === 'admin' && (
                <>
                  <Link className="dropdown-item text-light" to="/admin">
                    <i className="bi bi-crown me-2"></i>
                    Switch to Admin
                  </Link>
                  <div className="dropdown-divider"></div>
                </>
              )}
              
              <Link className="dropdown-item text-light" to="/profile">
                <i className="bi bi-person me-2"></i>
                Your Profile
              </Link>
              
              <Link className="dropdown-item text-light" to="/add-account">
                <i className="bi bi-plus-circle me-2"></i>
                Add Account
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;