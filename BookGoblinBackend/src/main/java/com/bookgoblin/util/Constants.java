package com.bookgoblin.util;

public class Constants {

    // Pagination
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";

    // Cache
    public static final String BOOK_CACHE_PREFIX = "book_";
    public static final String USER_CACHE_PREFIX = "user_";
    public static final String CACHE_TTL_MINUTES = "10";

    // Security
    public static final int PASSWORD_MIN_LENGTH = 6;
    public static final int PASSWORD_MAX_LENGTH = 100;
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;

    // Validation patterns
    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    public static final String USERNAME_PATTERN = "^[a-zA-Z0-9._-]+$";

    // Book constants
    public static final int MAX_BOOK_TITLE_LENGTH = 255;
    public static final int MAX_BOOK_AUTHOR_LENGTH = 255;
    public static final int MAX_BOOK_DESCRIPTION_LENGTH = 2000;
    public static final int MAX_REVIEW_LENGTH = 5000;

    // API
    public static final int MAX_SEARCH_RESULTS = 100;
    public static final int DEFAULT_SEARCH_LIMIT = 10;
    public static final int MAX_TRENDING_BOOKS = 20;

    // Date formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    // Error messages
    public static final String ERROR_BOOK_NOT_FOUND = "Book not found";
    public static final String ERROR_USER_NOT_FOUND = "User not found";
    public static final String ERROR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERROR_VALIDATION_FAILED = "Validation failed";
    public static final String ERROR_INTERNAL_SERVER = "Internal server error";
}