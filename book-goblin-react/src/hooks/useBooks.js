import { useState, useCallback } from 'react';
import { booksAPI, libraryAPI } from '../utils/api';

export const useBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = useCallback(async (query, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await booksAPI.searchBooks(query, page, limit);
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

  const getBookByISBN = useCallback(async (isbn) => {
    setLoading(true);
    try {
      const book = await booksAPI.getBookByISBN(isbn);
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
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReadingProgress = useCallback(async (userBookId, currentPage) => {
    setLoading(true);
    try {
      const result = await libraryAPI.updateReadingProgress(userBookId, currentPage);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    searchBooks,
    getBookDetails,
    getBookByISBN,
    getTrendingBooks,
    addBookToLibrary,
    updateReadingProgress,
  };
};