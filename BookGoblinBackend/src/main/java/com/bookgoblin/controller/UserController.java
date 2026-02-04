package com.bookgoblin.controller;

import com.bookgoblin.model.dto.response.ApiResponse;
import com.bookgoblin.model.dto.response.UserResponse;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile and management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        UserResponse userResponse = userService.toUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", userResponse));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserResponse userResponse = userService.toUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", userResponse));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users")
    public ResponseEntity<ApiResponse> searchUsers(@RequestParam String query) {
        var users = userService.searchUsers(query).stream()
                .map(userService::toUserResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users found", users));
    }

    @GetMapping
    @Operation(summary = "Get all users (paginated)")
    public ResponseEntity<ApiResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserResponse> users = userService.getAllUsers(pageable)
                .map(userService::toUserResponse);

        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody User updatedUser,
            @AuthenticationPrincipal User currentUser) {

        // Check if user is updating their own profile or is admin
        if (!currentUser.getId().equals(userId) &&
                !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Unauthorized to update this user"));
        }

        User user = userService.updateUser(userId, updatedUser);
        UserResponse userResponse = userService.toUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success("User updated", userResponse));
    }

    @PutMapping("/{userId}/password")
    @Operation(summary = "Update user password")
    public ResponseEntity<ApiResponse> updatePassword(
            @PathVariable Long userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            @AuthenticationPrincipal User currentUser) {

        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Unauthorized to update password"));
        }

        userService.updatePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully"));
    }
}