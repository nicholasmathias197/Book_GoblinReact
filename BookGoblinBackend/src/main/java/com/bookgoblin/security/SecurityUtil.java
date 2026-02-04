package com.bookgoblin.util;

import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.enums.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }

        return null;
    }

    public static Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    public static String getCurrentUsername() {
        User user = getCurrentUser();
        return user != null ? user.getUsername() : null;
    }

    public static boolean isAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole() == Role.ADMIN;
    }

    public static boolean isCurrentUser(Long userId) {
        User user = getCurrentUser();
        return user != null && user.getId().equals(userId);
    }

    public static boolean isAdminOrCurrentUser(Long userId) {
        return isAdmin() || isCurrentUser(userId);
    }

    public static void checkAuthorization(Long userId) {
        if (!isAdminOrCurrentUser(userId)) {
            throw new com.bookgoblin.exception.UnauthorizedException();
        }
    }
}