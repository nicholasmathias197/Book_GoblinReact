package com.bookgoblin.util;

import com.bookgoblin.model.dto.request.RegisterRequest;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.util.regex.Pattern;

@Component
public class Validator implements org.springframework.validation.Validator {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile(Constants.EMAIL_PATTERN);
    private static final Pattern USERNAME_PATTERN =
            Pattern.compile(Constants.USERNAME_PATTERN);

    @Override
    public boolean supports(Class<?> clazz) {
        return RegisterRequest.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        RegisterRequest request = (RegisterRequest) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "username.empty", "Username is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "email.empty", "Email is required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "password.empty", "Password is required");

        if (request.getUsername() != null) {
            if (request.getUsername().length() < Constants.USERNAME_MIN_LENGTH) {
                errors.rejectValue("username", "username.too.short",
                        "Username must be at least " + Constants.USERNAME_MIN_LENGTH + " characters");
            }
            if (request.getUsername().length() > Constants.USERNAME_MAX_LENGTH) {
                errors.rejectValue("username", "username.too.long",
                        "Username must be at most " + Constants.USERNAME_MAX_LENGTH + " characters");
            }
            if (!USERNAME_PATTERN.matcher(request.getUsername()).matches()) {
                errors.rejectValue("username", "username.invalid",
                        "Username can only contain letters, numbers, dots, underscores, and hyphens");
            }
        }

        if (request.getEmail() != null && !EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            errors.rejectValue("email", "email.invalid", "Please provide a valid email address");
        }

        if (request.getPassword() != null) {
            if (request.getPassword().length() < Constants.PASSWORD_MIN_LENGTH) {
                errors.rejectValue("password", "password.too.short",
                        "Password must be at least " + Constants.PASSWORD_MIN_LENGTH + " characters");
            }
            if (request.getPassword().length() > Constants.PASSWORD_MAX_LENGTH) {
                errors.rejectValue("password", "password.too.long",
                        "Password must be at most " + Constants.PASSWORD_MAX_LENGTH + " characters");
            }
        }
    }

    public static boolean isValidIsbn(String isbn) {
        if (isbn == null || isbn.trim().isEmpty()) {
            return false;
        }

        // Remove hyphens and spaces
        String cleanIsbn = isbn.replaceAll("[\\s-]+", "");

        // Check length
        if (cleanIsbn.length() != 10 && cleanIsbn.length() != 13) {
            return false;
        }

        // Check if all characters are digits (except last which could be X for ISBN-10)
        if (cleanIsbn.length() == 10) {
            return isValidIsbn10(cleanIsbn);
        } else {
            return isValidIsbn13(cleanIsbn);
        }
    }

    private static boolean isValidIsbn10(String isbn) {
        if (!isbn.matches("^\\d{9}[\\dX]$")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 9; i++) {
            int digit = Character.getNumericValue(isbn.charAt(i));
            sum += digit * (10 - i);
        }

        char lastChar = isbn.charAt(9);
        int lastDigit = (lastChar == 'X' || lastChar == 'x') ? 10 : Character.getNumericValue(lastChar);
        sum += lastDigit;

        return sum % 11 == 0;
    }

    private static boolean isValidIsbn13(String isbn) {
        if (!isbn.matches("^\\d{13}$")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 13; i++) {
            int digit = Character.getNumericValue(isbn.charAt(i));
            int multiplier = (i % 2 == 0) ? 1 : 3;
            sum += digit * multiplier;
        }

        return sum % 10 == 0;
    }
}