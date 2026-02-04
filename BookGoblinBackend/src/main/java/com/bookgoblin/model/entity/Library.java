package com.bookgoblin.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "libraries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer totalBooks;

    private Integer booksRead;

    private Integer booksReading;

    private Integer booksToRead;

    private Integer totalPagesRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        totalBooks = 0;
        booksRead = 0;
        booksReading = 0;
        booksToRead = 0;
        totalPagesRead = 0;
    }
}