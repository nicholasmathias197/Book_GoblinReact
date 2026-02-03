import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: 'bi-house', label: 'Home' },
    { path: '/books', icon: 'bi-book', label: 'My Books' },
    { path: '/discover', icon: 'bi-compass', label: 'Discover' },
    { 
      path: 'https://www.hpb.com/', 
      icon: 'bi-cart-plus', 
      label: 'Buy Books',
      external: true 
    },
  ];

  const menuItems = [
    { icon: 'bi-gear', label: 'Settings' },
    { icon: 'bi-heart', label: 'Wishlist' },
    { icon: 'bi-flag', label: 'Reading Goals' },
    { icon: 'bi-star', label: 'Favorites' },
    { icon: 'bi-question-circle', label: 'Help & Support' },
  ];

  return (
    <nav className="nav-sidebar d-none d-lg-block">
      <div className="d-flex flex-column gap-3 px-3 pt-6 py-3"> {/* Added pt-4 here */}
        <div className="d-flex flex-column gap-3 px-3 pt-5 pb-3"> {/* Changed to pt-5 */}
        {navItems.map((item) => (
          item.external ? (
            <a
              key={item.path}
              href={item.path}
              className="nav-btn secondary text-decoration-none d-flex align-items-center gap-3 p-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span className="fs-5">{item.label}</span>
            </a>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-btn text-decoration-none d-flex align-items-center gap-3 p-3 ${
                  isActive ? '' : 'secondary'
                }`
              }
              end
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span className="fs-5">{item.label}</span>
            </NavLink>
          )
        ))}

        {/* Dropdown Menu */}
        <div className="dropdown">
          <button 
            className="nav-btn secondary dropdown-toggle w-100 d-flex align-items-center gap-3 p-3"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className="bi bi-list fs-5"></i>
            <span className="fs-5">Menu</span>
          </button>
          
          {menuOpen && (
            <div className="dropdown-menu show bg-dark border border-light">
              {menuItems.map((item) => (
                <a 
                  key={item.label}
                  className="dropdown-item text-light p-3" 
                  href="#"
                >
                  <i className={`bi ${item.icon} me-2 fs-5`}></i>
                  {item.label}
                </a>
              ))}
              
              {user?.role === 'admin' && (
                <>
                  <div className="dropdown-divider"></div>
                  <a 
                    className="dropdown-item text-light p-3" 
                    href="/admin"
                  >
                    <i className="bi bi-crown me-2 fs-5"></i>
                    Admin Dashboard
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      </div> 
    </nav>
  );
};

export default Sidebar;