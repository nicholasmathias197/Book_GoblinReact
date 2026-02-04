import { useState, useEffect, useCallback } from 'react';
import { 
  searchBooks, 
  getBookCover, 
  getTrendingBooks,
  getBookDetails,
  getBookByISBN 
} from '../utils/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with user's books from localStorage
  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('userBooks') || '[]');
    setBooks(storedBooks);
  }, []);

  // Fetch recommendations and trending books
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch trending books
        const trending = await getTrendingBooks();
        setTrendingBooks(trending);
        
        // Fetch personalized recommendations
        const userBooks = JSON.parse(localStorage.getItem('userBooks') || '[]');
        if (userBooks.length > 0) {
          const userGenres = [...new Set(userBooks.map(book => book.genre))];
          if (userGenres.length > 0) {
            const recommendationsQuery = userGenres.slice(0, 2).join(' OR ');
            const recs = await searchBooks(recommendationsQuery, { 
              limit: 6,
              sort: 'rating desc'
            });
            setRecommendations(recs);
          } else {
            setRecommendations(trending.slice(0, 6));
          }
        } else {
          setRecommendations(trending.slice(0, 6));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // IMPORTANT: Add this searchBook function
  const searchBook = async (query, filters = {}) => {
    setLoading(true);
    try {
      let searchQuery = query;
      
      // Add filters to query if provided
      if (filters.genre) {
        searchQuery += ` subject:${filters.genre}`;
      }
      if (filters.author) {
        searchQuery += ` author:${filters.author}`;
      }
      if (filters.year) {
        searchQuery += ` first_publish_year:${filters.year}`;
      }

      const results = await searchBooks(searchQuery, { 
        limit: filters.limit || 20,
        sort: filters.sort || 'relevance'
      });
      return results;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      const existingBooks = JSON.parse(localStorage.getItem('userBooks') || '[]');
      
      const newBook = {
        ...bookData,
        id: bookData.openLibraryKey || `user_${Date.now()}`,
        added: new Date().toISOString(),
        status: bookData.status || 'TBR',
        progress: bookData.progress || 0,
        rating: bookData.rating || 0,
        userRating: 0,
        notes: '',
        startedDate: null,
        finishedDate: null,
        coverUrl: bookData.coverUrl || getBookCover(bookData.coverId)
      };
      
      const updatedBooks = [newBook, ...existingBooks];
      localStorage.setItem('userBooks', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      
      // Update reading stats
      updateReadingStats();
      
      return newBook;
    } catch (err) {
      setError('Failed to add book');
      throw err;
    }
  };

  const updateBook = (id, updates) => {
    try {
      const updatedBooks = books.map(book => 
        book.id === id ? { ...book, ...updates } : book
      );
      localStorage.setItem('userBooks', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      
      // Update reading stats if status changed to completed
      if (updates.status === 'Completed') {
        updateReadingStats();
      }
      
      return updatedBooks.find(book => book.id === id);
    } catch (err) {
      setError('Failed to update book');
      throw err;
    }
  };

  const deleteBook = (id) => {
    try {
      const updatedBooks = books.filter(book => book.id !== id);
      localStorage.setItem('userBooks', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      
      // Update reading stats
      updateReadingStats();
    } catch (err) {
      setError('Failed to delete book');
      throw err;
    }
  };

  const updateReadingStats = () => {
    const userBooks = JSON.parse(localStorage.getItem('userBooks') || '[]');
    const completedBooks = userBooks.filter(book => book.status === 'Completed');
    const totalPages = completedBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
    
    const stats = {
      booksRead: completedBooks.length,
      pagesRead: totalPages,
      currentStreak: calculateReadingStreak(userBooks),
      yearlyGoal: 52,
      progress: Math.round((completedBooks.length / 52) * 100)
    };
    
    localStorage.setItem('readingStats', JSON.stringify(stats));
  };

  const calculateReadingStreak = (userBooks) => {
    // Simple streak calculation based on recent activity
    const recentActivities = userBooks
      .filter(book => book.finishedDate)
      .map(book => new Date(book.finishedDate))
      .sort((a, b) => b - a);
    
    if (recentActivities.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(recentActivities[0]);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < recentActivities.length; i++) {
      const prevDate = new Date(recentActivities[i]);
      prevDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else if (diffDays > 1) {
        break;
      }
    }
    
    return streak;
  };

  const getReadingStats = () => {
    const stats = JSON.parse(localStorage.getItem('readingStats'));
    if (!stats) {
      const defaultStats = {
        booksRead: 0,
        pagesRead: 0,
        currentStreak: 0,
        yearlyGoal: 52,
        progress: 0
      };
      localStorage.setItem('readingStats', JSON.stringify(defaultStats));
      return defaultStats;
    }
    return stats;
  };

  const fetchBookDetails = async (bookId) => {
    try {
      return await getBookDetails(bookId);
    } catch (err) {
      setError('Failed to fetch book details');
      throw err;
    }
  };

  const fetchBookByISBN = async (isbn) => {
    try {
      return await getBookByISBN(isbn);
    } catch (err) {
      setError('Failed to fetch book by ISBN');
      throw err;
    }
  };

  return {
    books,
    recommendations,
    trendingBooks,
    loading,
    error,
    searchBook,  // Make sure this is exported
    addBook,
    updateBook,
    deleteBook,
    getBookCover,
    getReadingStats,
    fetchBookDetails,
    fetchBookByISBN
  };
};