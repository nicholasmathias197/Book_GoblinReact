package com.bookgoblin.controller;

import com.bookgoblin.model.dto.response.AdminStatsResponse;
import com.bookgoblin.model.dto.response.ApiResponse;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.enums.Role;
import com.bookgoblin.service.AdminService;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administrator endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    @GetMapping("/stats")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<ApiResponse> getStats(@AuthenticationPrincipal User admin) {
        adminService.checkAdmin(admin);
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (admin view)")
    public ResponseEntity<ApiResponse> getAllUsers(
            @AuthenticationPrincipal User admin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        adminService.checkAdmin(admin);

        Sort sort = sortDirection.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> users = adminService.getAllUsersForAdmin(pageable, admin);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Update user role")
    public ResponseEntity<ApiResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role,
            @AuthenticationPrincipal User admin) {

        adminService.checkAdmin(admin);
        User updatedUser = adminService.updateUserRole(userId, role, admin);
        return ResponseEntity.ok(ApiResponse.success("User role updated", updatedUser));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Deactivate user")
    public ResponseEntity<ApiResponse> deactivateUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal User admin) {

        adminService.checkAdmin(admin);
        adminService.deactivateUser(userId, admin);
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    @PostMapping("/content/{contentId}/moderate")
    @Operation(summary = "Moderate content")
    public ResponseEntity<ApiResponse> moderateContent(
            @PathVariable Long contentId,
            @RequestParam String action,
            @AuthenticationPrincipal User admin) {

        adminService.checkAdmin(admin);
        adminService.moderateContent(contentId, action, admin);
        return ResponseEntity.ok(ApiResponse.success("Content moderated"));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get activity logs")
    public ResponseEntity<ApiResponse> getActivityLogs(
            @AuthenticationPrincipal User admin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        adminService.checkAdmin(admin);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        var logs = userService.getUserActivities(admin.getId(), pageable);

        return ResponseEntity.ok(ApiResponse.success("Activity logs retrieved", logs));
    }
}