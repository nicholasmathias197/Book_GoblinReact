package com.bookgoblin.service;

import com.bookgoblin.model.dto.request.BookRequest;
import com.bookgoblin.model.dto.request.UpdateProgressRequest;
import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.model.entity.Book;
import com.bookgoblin.model.entity.Library;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.entity.UserBook;
import com.bookgoblin.model.enums.BookStatus;
import com.bookgoblin.repository.BookRepository;
import com.bookgoblin.repository.LibraryRepository;
import com.bookgoblin.repository.UserBookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserBookRepository userBookRepository;
    private final LibraryRepository libraryRepository;
    private final OpenLibraryService openLibraryService;

    @Transactional
    public Book addBookToLibrary(BookRequest request, User user) {
        // Try to find book by ISBN first
        Book book = null;
        if (request.getIsbn() != null && !request.getIsbn().isEmpty()) {
            book = bookRepository.findByIsbn(request.getIsbn())
                    .orElseGet(() -> {
                        // Try to fetch from OpenLibrary
                        BookResponse openLibraryBook = openLibraryService.getBookByISBN(request.getIsbn());
                        if (openLibraryBook != null) {
                            return Book.builder()
                                    .title(openLibraryBook.getTitle())
                                    .author(openLibraryBook.getAuthor())
                                    .isbn(request.getIsbn())
                                    .coverId(openLibraryBook.getCoverId())
                                    .pages(openLibraryBook.getPages())
                                    .publishedYear(openLibraryBook.getPublishedYear())
                                    .description(openLibraryBook.getDescription())
                                    .openLibraryId(openLibraryBook.getOpenLibraryId())
                                    .build();
                        }
                        return null;
                    });
        }

        // If book not found by ISBN, create new book
        if (book == null) {
            book = Book.builder()
                    .title(request.getTitle())
                    .author(request.getAuthor())
                    .isbn(request.getIsbn())
                    .pages(request.getPages())
                    .publishedYear(request.getPublishedYear())
                    .build();
        }

        // Save book if new
        if (book.getId() == null) {
            book = bookRepository.save(book);
        }

        // Check if book already in user's library
        Optional<UserBook> existingUserBook = userBookRepository.findByUserIdAndBookId(user.getId(), book.getId());
        if (existingUserBook.isPresent()) {
            throw new RuntimeException("Book already in library");
        }

        // Add to user's library
        UserBook userBook = UserBook.builder()
                .user(user)
                .book(book)
                .status(request.getStatus() != null ? request.getStatus() : BookStatus.WANT_TO_READ)
                .currentPage(0)
                .addedAt(LocalDateTime.now())
                .build();

        userBookRepository.save(userBook);

        // Update library stats
        updateLibraryStats(user.getId());

        return book;
    }

    public List<BookResponse> getUserBooks(Long userId, BookStatus status) {
        List<UserBook> userBooks = status != null ?
                userBookRepository.findByUserIdAndStatus(userId, status) :
                userBookRepository.findByUserId(userId);

        return userBooks.stream()
                .map(userBook -> {
                    Book book = userBook.getBook();
                    return BookResponse.builder()
                            .id(book.getId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .genre(book.getGenre() != null ? book.getGenre().name() : null)
                            .publishedYear(book.getPublishedYear())
                            .pages(book.getPages())
                            .coverId(book.getCoverId())
                            .isbn(book.getIsbn())
                            .description(book.getDescription())
                            .rating(book.getRating())
                            .ratingCount(book.getRatingCount())
                            .status(userBook.getStatus())
                            .currentPage(userBook.getCurrentPage())
                            .userRating(userBook.getRating())
                            .review(userBook.getReview())
                            .build();
                })
                .toList();
    }

    @Transactional
    public void updateReadingProgress(Long userBookId, UpdateProgressRequest request) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new RuntimeException("Book not found in library"));

        userBook.setCurrentPage(request.getCurrentPage());

        // Update status based on progress
        Book book = userBook.getBook();
        if (request.getCurrentPage() >= book.getPages()) {
            userBook.setStatus(BookStatus.READ);
            userBook.setFinishedReading(LocalDateTime.now());
        } else if (request.getCurrentPage() > 0) {
            userBook.setStatus(BookStatus.READING);
            if (userBook.getStartedReading() == null) {
                userBook.setStartedReading(LocalDateTime.now());
            }
        }

        userBookRepository.save(userBook);
        updateLibraryStats(userBook.getUser().getId());
    }

    private void updateLibraryStats(Long userId) {
        Library library = libraryRepository.findByUserId(userId)
                .orElseGet(() -> Library.builder().user(User.builder().id(userId).build()).build());

        List<UserBook> userBooks = userBookRepository.findByUserId(userId);

        long totalBooks = userBooks.size();
        long booksRead = userBooks.stream()
                .filter(ub -> ub.getStatus() == BookStatus.READ)
                .count();
        long booksReading = userBooks.stream()
                .filter(ub -> ub.getStatus() == BookStatus.READING)
                .count();
        long booksToRead = userBooks.stream()
                .filter(ub -> ub.getStatus() == BookStatus.WANT_TO_READ)
                .count();

        int totalPagesRead = userBooks.stream()
                .filter(ub -> ub.getStatus() == BookStatus.READ)
                .mapToInt(UserBook::getCurrentPage)
                .sum();

        library.setTotalBooks((int) totalBooks);
        library.setBooksRead((int) booksRead);
        library.setBooksReading((int) booksReading);
        library.setBooksToRead((int) booksToRead);
        library.setTotalPagesRead(totalPagesRead);

        libraryRepository.save(library);
    }
}