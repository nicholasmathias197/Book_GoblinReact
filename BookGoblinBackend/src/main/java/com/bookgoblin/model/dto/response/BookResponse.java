package com.bookgoblin.model.dto.response;

import com.bookgoblin.model.enums.BookStatus;
import com.bookgoblin.model.enums.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String genre;
    private Integer publishedYear;
    private Integer pages;
    private String coverId;
    private String isbn;
    private String description;
    private Double rating;
    private Integer ratingCount;
    private String language;
    private Boolean availableOnline;
    private String openLibraryId;

    // For user-specific books
    private BookStatus status;
    private Integer currentPage;
    private Integer userRating;
    private String review;
}