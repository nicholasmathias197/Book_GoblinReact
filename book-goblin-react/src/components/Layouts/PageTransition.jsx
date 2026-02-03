import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = () => {
  const [isActive, setIsActive] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Hide transition after initial load
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show transition on route change
    setIsActive(true);
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={`page-transition position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${
      isActive ? 'active' : ''
    }`}>
      <img 
        src="Img/page_turning.gif" 
        alt="Page Turning Transition" 
        className="w-100 h-100 object-fit-cover"
      />
    </div>
  );
};

export default PageTransition;