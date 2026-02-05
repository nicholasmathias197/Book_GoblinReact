import React, { createContext, useState, useContext, useCallback } from 'react';
import { booksAPI, libraryAPI } from '../utils/api';

const BookContext = createContext({});

export const useBooks = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = useCallback(async (query, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await booksAPI.searchBooks(query, page, limit);
      setBooks(results);
      return { success: true, data: results };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookDetails = useCallback(async (bookId) => {
    setLoading(true);
    try {
      const book = await booksAPI.getBookDetails(bookId);
      return { success: true, data: book };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrendingBooks = useCallback(async () => {
    setLoading(true);
    try {
      const books = await booksAPI.getTrendingBooks();
      setTrendingBooks(books);
      return { success: true, data: books };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyBooks = useCallback(async (status = null) => {
    setLoading(true);
    try {
      const books = await libraryAPI.getMyBooks(status);
      setMyBooks(books);
      return { success: true, data: books };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookToLibrary = useCallback(async (bookData) => {
    setLoading(true);
    try {
      const result = await libraryAPI.addBookToLibrary(bookData);
      
      // Refresh my books
      await getMyBooks();
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [getMyBooks]);

  const updateReadingProgress = useCallback(async (userBookId, currentPage) => {
    setLoading(true);
    try {
      const result = await libraryAPI.updateReadingProgress(userBookId, currentPage);
      
      // Update local state
      setMyBooks(prev => prev.map(book => 
        book.userBookId === userBookId 
          ? { ...book, currentPage, status: currentPage >= book.pages ? 'READ' : 'READING' }
          : book
      ));
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookCover = (coverId, size = 'M') => {
    return booksAPI.getBookCover(coverId, size);
  };

  const value = {
    books,
    myBooks,
    trendingBooks,
    loading,
    error,
    searchBooks,
    getBookDetails,
    getTrendingBooks,
    getMyBooks,
    addBookToLibrary,
    updateReadingProgress,
    getBookCover,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};