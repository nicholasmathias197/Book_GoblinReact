import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import StatsCards from '../components/Dashboard/StatsCards';
import BookCarousel from '../components/Dashboard/BookCarousel';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext'; // Changed from hooks to context
import { libraryAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    trendingBooks, 
    loading, 
    myBooks,
    getBookCover,
    getTrendingBooks,
    getMyBooks,
    addBookToLibrary
  } = useBooks();
  
  const [stats, setStats] = useState(null);
  const [currentlyReading, setCurrentlyReading] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch trending books
        await getTrendingBooks();
        
        // Fetch library stats from backend
        const statsResult = await libraryAPI.getLibraryStats(user.id);
        setStats(statsResult);
        
        // Fetch currently reading book
        const readingResult = await libraryAPI.getCurrentlyReading(user.id);
        setCurrentlyReading(readingResult);
        
        // Fetch user's books for recent activity
        await getMyBooks();
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, getTrendingBooks, getMyBooks]);

  const handleMarkAsRead = async (book) => {
    try {
      // Assuming book has userBookId for backend reference
      await libraryAPI.updateReadingProgress(book.userBookId, book.pages);
      
      // Refresh data
      await getMyBooks();
      const statsResult = await libraryAPI.getLibraryStats(user.id);
      setStats(statsResult);
      
    } catch (error) {
      console.error('Error marking book as read:', error);
    }
  };

  const handleBookClick = (book) => {
    navigate('/discover', { state: { searchQuery: book.title } });
  };

  const handleAddToLibrary = async (book) => {
    try {
      await addBookToLibrary({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        pages: book.pages,
        publishedYear: book.publishedYear,
        status: 'WANT_TO_READ'
      });
      
      // Show success message
      alert('Book added to your library!');
    } catch (error) {
      console.error('Error adding book to library:', error);
      alert('Failed to add book to library');
    }
  };

  const getRecentlyAddedBooks = () => {
    // Sort by added date (assuming we have addedAt in book object)
    return [...myBooks]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, 5);
  };

  const getCurrentlyReadingBooks = () => {
    return myBooks.filter(book => book.status === 'READING').slice(0, 3);
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="container-fluid py-4 px-3 px-lg-4">
            {/* Hero Section */}
            <div className="row align-items-center g-5 mb-5">
              <div className="col-lg-6">
                <div className="hero-image">
                  <img 
                    src="/Img/BookGoblinMess.png" 
                    alt="Book Goblin" 
                    className="img-fluid rounded-4"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="text-center mb-4">
                  <h3 className="text-gradient mb-1">Welcome back, {user?.username}!</h3>
                  <p className="text">
                    {currentlyReading ? 
                      `Currently reading: ${currentlyReading.title}` : 
                      'Your reading journey continues'}
                  </p>
                </div>
                {dashboardLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <BookCarousel 
                    books={getCurrentlyReadingBooks()} 
                    getCover={getBookCover}
                    onBookClick={handleBookClick}
                    emptyMessage="Not currently reading any books. Start a new book!"
                  />
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Trending Books */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-gradient mb-0">Trending Books</h2>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/discover')}
                >
                  <i className="bi bi-search me-2"></i>
                  Discover More Books
                </button>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading trending books...</p>
                </div>
              ) : (
                <BookCarousel 
                  books={trendingBooks.slice(0, 5)} 
                  getCover={getBookCover}
                  onBookClick={handleBookClick}
                  showAddButton={true}
                  onAddToLibrary={handleAddToLibrary}
                />
              )}
            </section>

            {/* Quick Actions Section */}
            <section className="mb-5">
              <div className="card-glass p-4">
                <h3 className="text-gradient mb-4">Quick Actions</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div 
                      className="card card-action p-4 text-center" 
                      onClick={() => navigate('/discover')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mb-3">
                        <i className="bi bi-search" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h5>Find New Books</h5>
                      <p className="small mb-0">Search millions of books in our database</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div 
                      className="card card-action p-4 text-center" 
                      onClick={() => navigate('/mybooks')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="mb-3">
                        <i className="bi bi-plus-circle" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h5>My Library</h5>
                      <p className="small mb-0">Manage your personal library collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <RecentActivity 
              books={getRecentlyAddedBooks()} 
              onMarkAsRead={handleMarkAsRead}
              getCover={getBookCover}
              loading={dashboardLoading}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;