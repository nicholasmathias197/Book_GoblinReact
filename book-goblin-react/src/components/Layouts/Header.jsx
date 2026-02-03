import React from 'react';
import UserMenu from '../Common/UserMenu';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header sticky-top py-3 px-4 bg-dark-glass border-bottom border-glass">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h2 mb-1 text-gradient">Book Goblin</h1>
          <p className="text">Your Personal Library Assistant</p>
        </div>
        
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Header;