package com.bookgoblin.repository;

import com.bookgoblin.model.entity.ActivityLog;
import com.bookgoblin.model.enums.ActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<ActivityLog> findByUserId(Long userId, Pageable pageable);

    List<ActivityLog> findByActivityType(ActivityType activityType);

    List<ActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM ActivityLog a WHERE " +
            "(:userId IS NULL OR a.user.id = :userId) AND " +
            "(:activityType IS NULL OR a.activityType = :activityType) AND " +
            "(:startDate IS NULL OR a.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR a.createdAt <= :endDate)")
    Page<ActivityLog> findWithFilters(
            @Param("userId") Long userId,
            @Param("activityType") ActivityType activityType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT COUNT(a) FROM ActivityLog a WHERE a.createdAt >= :startDate")
    Long countSince(@Param("startDate") LocalDateTime startDate);
}