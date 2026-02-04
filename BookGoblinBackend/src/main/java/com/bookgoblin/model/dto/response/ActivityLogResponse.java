package com.bookgoblin.model.dto.response;

import com.bookgoblin.model.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private Long userId;
    private String username;
    private ActivityType activityType;
    private String description;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
}