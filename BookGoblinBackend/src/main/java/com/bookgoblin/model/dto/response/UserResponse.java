package com.bookgoblin.model.dto.response;

import com.bookgoblin.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Library stats
    private Integer totalBooks;
    private Integer booksRead;
    private Integer booksReading;
    private Integer booksToRead;
    private Integer totalPagesRead;

    // Activity stats
    private Long totalActivities;
    private LocalDateTime lastActivityAt;
}