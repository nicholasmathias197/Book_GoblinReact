package com.bookgoblin.controller;

import com.bookgoblin.model.dto.request.BookRequest;
import com.bookgoblin.model.dto.request.UpdateProgressRequest;
import com.bookgoblin.model.dto.response.ApiResponse;
import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final BookService bookService;

    @GetMapping("/my-books")
    public ResponseEntity<ApiResponse> getMyBooks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status) {
        List<BookResponse> books = bookService.getUserBooks(user.getId(),
                status != null ? com.bookgoblin.model.enums.BookStatus.valueOf(status.toUpperCase()) : null);
        return ResponseEntity.ok(ApiResponse.success("Books retrieved successfully", books));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addBookToLibrary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookRequest request) {
        bookService.addBookToLibrary(request, user);
        return ResponseEntity.ok(ApiResponse.success("Book added to library successfully"));
    }

    @PutMapping("/progress/{userBookId}")
    public ResponseEntity<ApiResponse> updateReadingProgress(
            @PathVariable Long userBookId,
            @Valid @RequestBody UpdateProgressRequest request) {
        bookService.updateReadingProgress(userBookId, request);
        return ResponseEntity.ok(ApiResponse.success("Reading progress updated successfully"));
    }
}