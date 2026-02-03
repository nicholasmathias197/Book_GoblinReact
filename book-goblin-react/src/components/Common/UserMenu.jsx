import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button 
        className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={user?.avatar || 'Img/avatar.png'} 
          alt="User Avatar" 
          className="rounded-circle border border-purple"
          width="42"
          height="42"
        />
        <span>Account</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end bg-dark border border-light show">
          {user?.role === 'admin' && (
            <>
              <a className="dropdown-item text-light" href="/admin">
                <i className="bi bi-crown me-2"></i>
                Switch to Admin
              </a>
              <div className="dropdown-divider"></div>
            </>
          )}
          
          <a className="dropdown-item text-light" href="#">
            <i className="bi bi-person me-2"></i>
            Your Profile
          </a>
          
          <a className="dropdown-item text-light" href="#">
            <i className="bi bi-plus-circle me-2"></i>
            Add Account
          </a>
          
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
  );
};

export default UserMenu;