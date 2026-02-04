package com.bookgoblin.model.enums;

public enum ActivityType {
    // User activities
    USER_REGISTERED,
    USER_LOGIN,
    USER_LOGOUT,
    USER_PROFILE_UPDATED,
    USER_PASSWORD_CHANGED,

    // Book activities
    BOOK_ADDED,
    BOOK_REMOVED,
    BOOK_STATUS_CHANGED,
    READING_PROGRESS_UPDATED,
    BOOK_RATED,
    BOOK_REVIEWED,

    // Library activities
    LIBRARY_CREATED,
    LIBRARY_UPDATED,

    // Admin activities
    ADMIN_LOGIN,
    USER_MANAGED,
    CONTENT_MODERATED,
    SYSTEM_SETTINGS_UPDATED,

    // System activities
    API_CALL,
    ERROR_OCCURRED
}