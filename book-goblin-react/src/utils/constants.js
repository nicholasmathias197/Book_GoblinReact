export const SAMPLE_BOOKS = [
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

export const SAMPLE_RECOMMENDATIONS = [
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

export const GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 
  'Horror', 'Non-Fiction', 'Biography', 'Historical Fiction',
  'Thriller', 'Young Adult', 'Classics', 'Poetry'
];

export const BOOK_STATUSES = [
  { value: 'Reading', label: 'Currently Reading' },
  { value: 'TBR', label: 'To Be Read' },
  { value: 'Completed', label: 'Completed' },
  { value: 'DNF', label: 'Did Not Finish' }
];