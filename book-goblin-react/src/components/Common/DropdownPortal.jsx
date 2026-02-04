import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const DropdownPortal = ({ children, targetElement, onClose, isOpen, className = '' }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        targetElement && 
        !targetElement.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Prevent body scroll when dropdown is open (optional)
      // document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, targetElement]);

  if (!isOpen || !targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Calculate available space
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  const shouldOpenUp = spaceBelow < 200 && spaceAbove > 200;
  
  // Calculate horizontal position to ensure it stays in viewport
  let left = rect.left;
  let width = rect.width;
  
  // Adjust if dropdown would go off-screen on the right
  if (left + width > viewportWidth - 20) {
    left = viewportWidth - width - 20;
  }
  
  // Ensure minimum left position
  if (left < 20) {
    left = 20;
    width = Math.min(width, viewportWidth - 40);
  }

  const dropdownStyle = {
    position: 'fixed',
    top: shouldOpenUp 
      ? (rect.top + window.scrollY - 10) 
      : (rect.bottom + window.scrollY),
    left: left,
    width: width,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    padding: '0.5rem 0',
    marginTop: shouldOpenUp ? '-0.5rem' : '0.5rem',
    overflow: 'hidden',
    maxHeight: '300px',
    overflowY: 'auto',
  };

  return ReactDOM.createPortal(
    <div 
      ref={dropdownRef} 
      style={dropdownStyle}
      className={`portal-dropdown ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};

export default DropdownPortal;