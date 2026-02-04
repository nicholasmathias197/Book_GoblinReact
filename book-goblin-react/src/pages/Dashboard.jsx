import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import StatsCards from '../components/Dashboard/StatsCards';
import BookCarousel from '../components/Dashboard/BookCarousel';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    recommendations, 
    loading, 
    books,
    getBookCover,
    getReadingStats,
    updateBook
  } = useBooks();
  
  const stats = getReadingStats();

  const handleMarkAsRead = async (bookId) => {
    await updateBook(bookId, { 
      status: 'Completed', 
      progress: 100,
      finishedDate: new Date().toISOString()
    });
  };

  const handleBookClick = (book) => {
    // Navigate to Discover page with book details or search
    navigate('/discover', { state: { searchQuery: book.title } });
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
                  <p className="text">Your reading journey continues</p>
                </div>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <BookCarousel 
                    books={recommendations.slice(0, 3)} 
                    getCover={getBookCover}
                    onBookClick={handleBookClick}
                  />
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Recommendations */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-gradient mb-0">Recommended For You</h2>
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
                  <p className="mt-2 text-muted">Loading recommendations...</p>
                </div>
              ) : (
                <BookCarousel 
                  books={recommendations.slice(0, 3)} 
                  getCover={getBookCover}
                  onBookClick={handleBookClick}
                />
              )}
            </section>

            {/* Quick Actions Section */}
            <section className="mb-5">
              <div className="card-glass p-4">
                <h3 className="text-gradient mb-4">Quick Actions</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="card card-action p-4 text-center" onClick={() => navigate('/discover')}>
                      <div className="mb-3">
                        <i className="bi bi-search" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h5>Find New Books</h5>
                      <p className="small mb-0">Search Open Library for millions of books</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card card-action p-4 text-center" onClick={() => navigate('/mybooks')}>
                      <div className="mb-3">
                        <i className="bi bi-plus-circle" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h5>Add to My Books</h5>
                      <p className="small mb-0">Manage your personal library collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <RecentActivity 
              books={books.slice(0, 5)} 
              onMarkAsRead={handleMarkAsRead}
              getCover={getBookCover}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;