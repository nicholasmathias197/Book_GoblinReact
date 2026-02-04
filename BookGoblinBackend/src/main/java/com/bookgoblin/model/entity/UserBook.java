package com.bookgoblin.model.entity;

import com.bookgoblin.model.enums.BookStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    private BookStatus status;

    private Integer currentPage;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String review;

    private LocalDateTime startedReading;

    private LocalDateTime finishedReading;

    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
        if (status == null) {
            status = BookStatus.WANT_TO_READ;
        }
        if (currentPage == null) {
            currentPage = 0;
        }
    }
}