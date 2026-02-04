package com.bookgoblin.controller;

import com.bookgoblin.model.dto.response.ApiResponse;
import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.service.OpenLibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final OpenLibraryService openLibraryService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        List<BookResponse> books = openLibraryService.searchBooks(query, page, limit);
        return ResponseEntity.ok(ApiResponse.success("Books retrieved successfully", books));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse> getTrendingBooks() {
        List<BookResponse> books = openLibraryService.getTrendingBooks();
        return ResponseEntity.ok(ApiResponse.success("Trending books retrieved successfully", books));
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponse> getBookDetails(@PathVariable String bookId) {
        BookResponse book = openLibraryService.getBookDetails(bookId);
        if (book != null) {
            return ResponseEntity.ok(ApiResponse.success("Book details retrieved successfully", book));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Book not found"));
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<ApiResponse> getBookByIsbn(@PathVariable String isbn) {
        BookResponse book = openLibraryService.getBookByISBN(isbn);
        if (book != null) {
            return ResponseEntity.ok(ApiResponse.success("Book retrieved successfully", book));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Book not found"));
    }
}