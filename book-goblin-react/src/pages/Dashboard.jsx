import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import StatsCards from '../components/Dashboard/StatsCards';
import BookCarousel from '../components/Dashboard/BookCarousel';
import RecentActivity from '../components/Dashboard/RecentActivity';
import AddBookForm from '../components/Dashboard/AddBookForm';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { readingStats, recommendations } = useBooks();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddBook = (bookData) => {
    console.log('Adding book:', bookData);
    setShowAddForm(false);
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
                    src="Img/BookGoblinMess.png" 
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
                <BookCarousel books={recommendations.slice(0, 3)} />
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={readingStats} />

            {/* Add Book Section */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-gradient mb-0">Add a New Book</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {showAddForm ? 'Cancel' : 'Add Book'}
                </button>
              </div>
              {showAddForm && (
                <AddBookForm onSubmit={handleAddBook} />
              )}
            </section>

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;