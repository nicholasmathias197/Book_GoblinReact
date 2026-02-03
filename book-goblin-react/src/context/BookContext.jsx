import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BookContext = createContext(null);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useLocalStorage('userBooks', []);
  const [recommendations, setRecommendations] = useLocalStorage('recommendations', []);
  const [tbrList, setTbrList] = useLocalStorage('tbrList', []);
  const [readingStats, setReadingStats] = useLocalStorage('readingStats', {
    booksRead: 37,
    pagesRead: 5350,
    currentStreak: 7,
    yearlyGoal: 52,
    progress: 71
  });

  // Sample book data
  const sampleBooks = [
    {
      id: 1,
      title: "The Only Good Indians",
      author: "Stephen Graham Jones",
      genre: "Horror",
      rating: 3.5,
      status: "TBR",
      progress: 0,
      image: "https://m.media-amazon.com/images/I/710FffsUloL._SY466_.jpg",
      pages: 320,
      description: "A tale of revenge, cultural identity, and supernatural horror."
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      rating: 5,
      status: "Completed",
      progress: 100,
      image: "https://m.media-amazon.com/images/I/81DMp7F91LL._SL1500_.jpg",
      pages: 412,
      description: "Epic science fiction set in the distant future."
    },
    {
      id: 3,
      title: "The Will Of The Many",
      author: "James Islington",
      genre: "Fantasy",
      rating: 4,
      status: "Reading",
      progress: 65,
      image: "https://m.media-amazon.com/images/I/71p5luifDjL._SL1500_.jpg",
      pages: 640,
      description: "A thrilling fantasy epic about power and sacrifice."
    },
    {
      id: 4,
      title: "Shadow of the Gods",
      author: "John Gwynne",
      genre: "Fantasy",
      rating: 4.5,
      status: "Completed",
      progress: 100,
      image: "https://m.media-amazon.com/images/I/815EJibD9DL._SY466_.jpg",
      pages: 528,
      description: "A Norse-inspired epic fantasy of vengeance and redemption."
    }
  ];

  const sampleRecommendations = [
    {
      id: 101,
      title: "The Poppy War",
      author: "R. F. Kuang",
      genre: "Fantasy",
      rating: 5.0,
      image: "https://m.media-amazon.com/images/I/41bnANqltqL._SY445_SX342_QL70_FMwebp_.jpg"
    },
    {
      id: 102,
      title: "Gideon The Ninth",
      author: "Tamsyn Muir",
      genre: "Fantasy",
      rating: 4.2,
      image: "https://m.media-amazon.com/images/I/71GHKo78YBL._SL1500_.jpg"
    },
    {
      id: 103,
      title: "Priory of the Orange Tree",
      author: "Samantha Shannon",
      genre: "Fantasy",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/91NXdVnMoGL._SL1500_.jpg"
    }
  ];

  // Initialize with sample data if empty
  useEffect(() => {
    if (books.length === 0) {
      setBooks(sampleBooks);
    }
    if (recommendations.length === 0) {
      setRecommendations(sampleRecommendations);
    }
  }, [books.length, recommendations.length, setBooks, setRecommendations]);

  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      added: new Date().toISOString()
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id, updates) => {
    setBooks(prev => 
      prev.map(book => 
        book.id === id ? { ...book, ...updates } : book
      )
    );
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addToTbr = (book) => {
    if (!tbrList.some(item => item.id === book.id)) {
      setTbrList(prev => [...prev, book]);
      return true;
    }
    return false;
  };

  const removeFromTbr = (id) => {
    setTbrList(prev => prev.filter(book => book.id !== id));
  };

  const updateReadingStats = (newStats) => {
    setReadingStats(prev => ({ ...prev, ...newStats }));
  };

  const markAsRead = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      updateBook(bookId, { status: 'Completed', progress: 100 });
      updateReadingStats({
        booksRead: readingStats.booksRead + 1,
        pagesRead: readingStats.pagesRead + (book.pages || 300)
      });
    }
  };

  const value = {
    books,
    recommendations,
    tbrList,
    readingStats,
    addBook,
    updateBook,
    deleteBook,
    addToTbr,
    removeFromTbr,
    updateReadingStats,
    markAsRead
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};