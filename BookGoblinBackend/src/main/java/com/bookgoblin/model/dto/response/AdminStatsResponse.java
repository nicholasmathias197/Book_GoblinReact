package com.bookgoblin.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long newUsersToday;
    private Long activeUsersToday;
    private Long totalBooks;
    private Long booksAddedToday;
    private Long totalActivities;
    private Long activitiesToday;
    private Long totalReviews;
    private Double averageRating;
}