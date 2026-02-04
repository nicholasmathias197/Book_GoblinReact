const API_BASE_URL = 'https://openlibrary.org';

export const searchBooks = async (query, options = {}) => {
  const params = new URLSearchParams({
    q: query,
    limit: options.limit || 10,
    page: options.page || 1,
    fields: 'key,title,author_name,cover_i,first_publish_year,edition_count,number_of_pages_median,subject,language,isbn,ia,ratings_average,ratings_count',
    ...options
  });

  try {
    const response = await fetch(`${API_BASE_URL}/search.json?${params}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.docs.map(doc => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown Author',
      genre: doc.subject?.[0] || 'General',
      publishedYear: doc.first_publish_year,
      pages: doc.number_of_pages_median,
      coverId: doc.cover_i,
      isbn: doc.isbn?.[0],
      editionCount: doc.edition_count,
      availableOnline: doc.ia && doc.ia.length > 0,
      openLibraryKey: doc.key,
      rating: doc.ratings_average || 0,
      ratingCount: doc.ratings_count || 0,
      language: doc.language?.[0] || 'en'
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${bookId}.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return {
      ...data,
      description: data.description?.value || data.description || 'No description available',
      covers: data.covers || []
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

export const getBookCover = (coverId, size = 'M') => {
  if (!coverId) return '/Img/default-book-cover.jpg';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const getAuthorDetails = async (authorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}${authorId}.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return {
      name: data.name,
      bio: data.bio?.value || data.bio || 'No biography available',
      photos: data.photos || []
    };
  } catch (error) {
    console.error('Error fetching author details:', error);
    return null;
  }
};

export const getTrendingBooks = async () => {
  return searchBooks('fantasy OR science fiction OR mystery', {
    limit: 12,
    sort: 'rating desc'
  });
};

export const getBookByISBN = async (isbn) => {
  try {
    const response = await fetch(`${API_BASE_URL}/isbn/${isbn}.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return {
      id: data.key,
      title: data.title,
      author: data.authors?.[0]?.name || 'Unknown Author',
      pages: data.number_of_pages,
      coverId: data.covers?.[0],
      isbn: isbn,
      publishedYear: data.publish_date?.split('-')[0],
      description: data.description?.value || data.description
    };
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return null;
  }
};