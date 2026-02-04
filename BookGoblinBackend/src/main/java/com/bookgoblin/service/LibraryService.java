package com.bookgoblin.service;

import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.model.entity.Library;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.enums.BookStatus;
import com.bookgoblin.repository.LibraryRepository;
import com.bookgoblin.repository.UserBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserBookRepository userBookRepository;
    private final BookService bookService;

    public Library getUserLibrary(Long userId) {
        return libraryRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Library newLibrary = Library.builder()
                            .user(User.builder().id(userId).build())
                            .build();
                    return libraryRepository.save(newLibrary);
                });
    }

    public Map<String, Object> getLibraryStats(Long userId) {
        Library library = getUserLibrary(userId);

        return Map.of(
                "totalBooks", library.getTotalBooks(),
                "booksRead", library.getBooksRead(),
                "booksReading", library.getBooksReading(),
                "booksToRead", library.getBooksToRead(),
                "totalPagesRead", library.getTotalPagesRead(),
                "completionRate", calculateCompletionRate(library)
        );
    }

    private double calculateCompletionRate(Library library) {
        if (library.getTotalBooks() == 0) {
            return 0.0;
        }
        return (double) library.getBooksRead() / library.getTotalBooks() * 100;
    }

    public Map<String, Long> getReadingTrends(Long userId, int days) {
        // This would typically query reading activity over time
        // For now, return mock data
        return Map.of(
                "totalBooksRead", (long) userBookRepository.findByUserIdAndStatus(userId, BookStatus.READ).size(),
                "avgPagesPerDay", 50L,
                "readingStreak", 7L
        );
    }

    public BookResponse getCurrentlyReading(Long userId) {
        var currentlyReading = userBookRepository.findByUserIdAndStatus(userId, BookStatus.READING)
                .stream()
                .findFirst();

        if (currentlyReading.isPresent()) {
            var userBook = currentlyReading.get();
            var book = userBook.getBook();

            return BookResponse.builder()
                    .id(book.getId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .coverId(book.getCoverId())
                    .pages(book.getPages())
                    .currentPage(userBook.getCurrentPage())
                    .status(userBook.getStatus())
                    .build();
        }

        return null;
    }
}