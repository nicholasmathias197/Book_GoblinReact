package com.bookgoblin.service;

import com.bookgoblin.exception.UnauthorizedException;
import com.bookgoblin.model.dto.response.AdminStatsResponse;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.enums.ActivityType;
import com.bookgoblin.model.enums.Role;
import com.bookgoblin.repository.ActivityLogRepository;
import com.bookgoblin.repository.BookRepository;
import com.bookgoblin.repository.UserBookRepository;
import com.bookgoblin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final UserBookRepository userBookRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogService activityLogService;

    public void checkAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }
    }

    public AdminStatsResponse getStats() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();

        Long totalUsers = userRepository.count();
        Long newUsersToday = userRepository.countByCreatedAtBetween(todayStart, now);
        Long activeUsersToday = activityLogRepository.countSince(todayStart);
        Long totalBooks = bookRepository.count();
        Long booksAddedToday = userBookRepository.countByAddedAtBetween(todayStart, now);
        Long totalActivities = activityLogRepository.count();
        Long activitiesToday = activityLogRepository.countSince(todayStart);

        // Calculate average rating (this would need a proper query in real implementation)
        Double averageRating = 4.5; // Placeholder

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .activeUsersToday(activeUsersToday)
                .totalBooks(totalBooks)
                .booksAddedToday(booksAddedToday)
                .totalActivities(totalActivities)
                .activitiesToday(activitiesToday)
                .totalReviews(0L) // Would need review repository
                .averageRating(averageRating)
                .build();
    }

    public Page<User> getAllUsersForAdmin(Pageable pageable, User admin) {
        checkAdmin(admin);
        return userRepository.findAll(pageable);
    }

    public User updateUserRole(Long userId, Role newRole, User admin) {
        checkAdmin(admin);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        activityLogService.logActivity(
                admin,
                ActivityType.USER_MANAGED,
                "Updated user role to " + newRole + " for user: " + user.getUsername()
        );

        return updatedUser;
    }

    public void deactivateUser(Long userId, User admin) {
        checkAdmin(admin);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real app, you'd have an active field instead of deleting
        userRepository.delete(user);

        activityLogService.logActivity(
                admin,
                ActivityType.USER_MANAGED,
                "Deactivated user: " + user.getUsername()
        );
    }

    public void moderateContent(Long contentId, String action, User admin) {
        checkAdmin(admin);

        // Implement content moderation logic
        activityLogService.logActivity(
                admin,
                ActivityType.CONTENT_MODERATED,
                action + " content with id: " + contentId
        );
    }
}