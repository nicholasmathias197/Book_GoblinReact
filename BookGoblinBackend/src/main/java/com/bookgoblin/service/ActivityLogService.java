package com.bookgoblin.service;

import com.bookgoblin.model.dto.response.ActivityLogResponse;
import com.bookgoblin.model.entity.ActivityLog;
import com.bookgoblin.model.entity.User;
import com.bookgoblin.model.enums.ActivityType;
import com.bookgoblin.repository.ActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Async
    public void logActivity(User user, ActivityType activityType, String description) {
        logActivity(user, activityType, description, null, null);
    }

    @Async
    public void logActivity(User user, ActivityType activityType, String description,
                            HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");

        logActivity(user, activityType, description, ipAddress, userAgent);
    }

    @Async
    public void logActivity(User user, ActivityType activityType, String description,
                            String ipAddress, String userAgent) {
        ActivityLog activityLog = ActivityLog.builder()
                .user(user)
                .activityType(activityType)
                .description(description)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();

        activityLogRepository.save(activityLog);
    }

    public Page<ActivityLogResponse> getUserActivities(Long userId, Pageable pageable) {
        return activityLogRepository.findByUserId(userId, pageable)
                .map(this::toResponse);
    }

    public Page<ActivityLogResponse> getAllActivities(Pageable pageable) {
        return activityLogRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public Page<ActivityLogResponse> getActivitiesWithFilters(Long userId, ActivityType activityType,
                                                              LocalDateTime startDate, LocalDateTime endDate,
                                                              Pageable pageable) {
        return activityLogRepository.findWithFilters(userId, activityType, startDate, endDate, pageable)
                .map(this::toResponse);
    }

    public void cleanupOldLogs(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        var oldLogs = activityLogRepository.findByCreatedAtBetween(
                LocalDateTime.MIN, cutoffDate);
        activityLogRepository.deleteAll(oldLogs);
    }

    private ActivityLogResponse toResponse(ActivityLog activityLog) {
        return ActivityLogResponse.builder()
                .id(activityLog.getId())
                .userId(activityLog.getUser() != null ? activityLog.getUser().getId() : null)
                .username(activityLog.getUser() != null ? activityLog.getUser().getUsername() : "System")
                .activityType(activityLog.getActivityType())
                .description(activityLog.getDescription())
                .ipAddress(activityLog.getIpAddress())
                .userAgent(activityLog.getUserAgent())
                .createdAt(activityLog.getCreatedAt())
                .build();
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}