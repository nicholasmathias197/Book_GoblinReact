package com.bookgoblin.repository;

import com.bookgoblin.model.entity.UserBook;
import com.bookgoblin.model.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Long> {
    List<UserBook> findByUserId(Long userId);
    List<UserBook> findByUserIdAndStatus(Long userId, BookStatus status);
    Optional<UserBook> findByUserIdAndBookId(Long userId, Long bookId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    // Add this method for admin stats
    long countByAddedAtBetween(LocalDateTime start, LocalDateTime end);
}