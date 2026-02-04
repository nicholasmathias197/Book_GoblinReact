package com.bookgoblin.model.entity;

import com.bookgoblin.model.enums.Genre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String openLibraryId;

    @Column(unique = true)
    private String isbn;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private Integer publishedYear;

    private Integer pages;

    private String coverId;

    private Double rating;

    private Integer ratingCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String language;

    private Boolean availableOnline;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        rating = 0.0;
        ratingCount = 0;
        language = "en";
        availableOnline = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}