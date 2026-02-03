import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-1 text-gradient mb-4">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/dashboard" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go to Dashboard
          </Link>
          <Link to="/discover" className="btn btn-outline-light">
            <i className="bi bi-compass me-2"></i>
            Discover Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;