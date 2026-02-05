package com.bookgoblin.service;

import com.bookgoblin.exception.UserNotFoundException;
import com.bookgoblin.model.dto.response.UserResponse;
import com.bookgoblin.model.entity.ActivityLog;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.repository.ActivityLogRepository;
import com.bookgoblin.repository.LibraryRepository;
import com.bookgoblin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Cacheable(value = "users", key = "#username")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("username", username));
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public List<User> searchUsers(String query) {
        return userRepository.findAll().stream()
                .filter(user -> user.getUsername().toLowerCase().contains(query.toLowerCase()) ||
                        user.getEmail().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    @Transactional
    public User updateUser(Long userId, User updatedUser) {
        User user = getUserById(userId);

        if (updatedUser.getUsername() != null && !updatedUser.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updatedUser.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(updatedUser.getEmail());
        }

        if (updatedUser.getAvatarUrl() != null) {
            user.setAvatarUrl(updatedUser.getAvatarUrl());
        }

        User savedUser = userRepository.save(user);

        activityLogService.logActivity(
                savedUser,
                com.bookgoblin.model.enums.ActivityType.USER_PROFILE_UPDATED,
                "User profile updated"
        );

        return savedUser;
    }

    @Transactional
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        activityLogService.logActivity(
                user,
                com.bookgoblin.model.enums.ActivityType.USER_PASSWORD_CHANGED,
                "Password changed"
        );
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);

        activityLogService.logActivity(
                user,
                com.bookgoblin.model.enums.ActivityType.USER_MANAGED,
                "User deleted by admin"
        );
    }

    // ADD THIS METHOD - it was missing
    public Page<ActivityLog> getUserActivities(Long userId, Pageable pageable) {
        // First check if user exists
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        return activityLogRepository.findByUserId(userId, pageable);
    }

    public UserResponse toUserResponse(User user) {
        var library = libraryRepository.findByUserId(user.getId()).orElse(null);
        var lastActivity = activityLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .findFirst();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .totalBooks(library != null ? library.getTotalBooks() : 0)
                .booksRead(library != null ? library.getBooksRead() : 0)
                .booksReading(library != null ? library.getBooksReading() : 0)
                .booksToRead(library != null ? library.getBooksToRead() : 0)
                .totalPagesRead(library != null ? library.getTotalPagesRead() : 0)
                .totalActivities(activityLogRepository.countSince(LocalDateTime.now().minusDays(30)))
                .lastActivityAt(lastActivity.map(com.bookgoblin.model.entity.ActivityLog::getCreatedAt).orElse(null))
                .build();
    }
}