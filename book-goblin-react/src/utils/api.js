// Base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  getProfile: async () => {
    return apiRequest('/users/me');
  },
  
  updateProfile: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  updatePassword: async (userId, oldPassword, newPassword) => {
    return apiRequest(`/users/${userId}/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, {
      method: 'PUT',
    });
  },
};

// Books API
export const booksAPI = {
  searchBooks: async (query, page = 1, limit = 10) => {
    return apiRequest(`/books/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },
  
  getBookDetails: async (bookId) => {
    return apiRequest(`/books/${bookId}`);
  },
  
  getBookByISBN: async (isbn) => {
    return apiRequest(`/books/isbn/${isbn}`);
  },
  
  getTrendingBooks: async () => {
    return apiRequest('/books/trending');
  },
  
  // Get book cover URL (still uses OpenLibrary for covers)
  getBookCover: (coverId, size = 'M') => {
    if (!coverId) return '/Img/default-book-cover.jpg';
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  },
};

// Library API
export const libraryAPI = {
  getMyBooks: async (status = null) => {
    const url = status ? `/library/my-books?status=${status}` : '/library/my-books';
    return apiRequest(url);
  },
  
  addBookToLibrary: async (bookData) => {
    return apiRequest('/library/add', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },
  
  updateReadingProgress: async (userBookId, currentPage) => {
    return apiRequest(`/library/progress/${userBookId}`, {
      method: 'PUT',
      body: JSON.stringify({ currentPage }),
    });
  },
  
  getLibraryStats: async (userId) => {
    return apiRequest(`/library/stats/${userId}`);
  },
  
  getCurrentlyReading: async (userId) => {
    return apiRequest(`/library/currently-reading/${userId}`);
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return apiRequest('/admin/stats');
  },
  
  getAllUsers: async (page = 0, size = 10) => {
    return apiRequest(`/admin/users?page=${page}&size=${size}`);
  },
  
  updateUserRole: async (userId, role) => {
    return apiRequest(`/admin/users/${userId}/role?role=${role}`, {
      method: 'PUT',
    });
  },
  
  deactivateUser: async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
  
  getActivityLogs: async (page = 0, size = 50) => {
    return apiRequest(`/admin/logs?page=${page}&size=${size}`);
  },
  
  moderateContent: async (contentId, action) => {
    return apiRequest(`/admin/content/${contentId}/moderate?action=${action}`, {
      method: 'POST',
    });
  },
};

// User API
export const userAPI = {
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },
  
  searchUsers: async (query) => {
    return apiRequest(`/users/search?query=${encodeURIComponent(query)}`);
  },
  
  getAllUsers: async (page = 0, size = 10, sortBy = 'id', sortDirection = 'asc') => {
    return apiRequest(`/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
  },
};

// Activity API
export const activityAPI = {
  getUserActivities: async (userId, page = 0, size = 20) => {
    return apiRequest(`/activities/user/${userId}?page=${page}&size=${size}`);
  },
  
  getAllActivities: async (page = 0, size = 50) => {
    return apiRequest(`/activities?page=${page}&size=${size}`);
  },
};

export default {
  auth: authAPI,
  books: booksAPI,
  library: libraryAPI,
  admin: adminAPI,
  user: userAPI,
  activity: activityAPI,
};