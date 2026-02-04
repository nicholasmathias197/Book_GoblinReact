package com.bookgoblin.util;

import com.bookgoblin.model.dto.response.BookResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class OpenLibraryMapper {

    public BookResponse toBookResponse(Map<String, Object> doc) {
        if (doc == null) {
            return null;
        }

        return BookResponse.builder()
                .title(getString(doc, "title"))
                .author(getFirstString(doc, "author_name"))
                .genre(getFirstString(doc, "subject"))
                .publishedYear(getInteger(doc, "first_publish_year"))
                .pages(getInteger(doc, "number_of_pages_median"))
                .coverId(getCoverId(doc))
                .isbn(getFirstString(doc, "isbn"))
                .rating(getDouble(doc, "ratings_average"))
                .ratingCount(getInteger(doc, "ratings_count"))
                .language(getFirstString(doc, "language"))
                .availableOnline(isAvailableOnline(doc))
                .openLibraryId(getString(doc, "key"))
                .build();
    }

    public BookResponse toDetailedBookResponse(Map<String, Object> response) {
        if (response == null) {
            return null;
        }

        return BookResponse.builder()
                .title(getString(response, "title"))
                .author(getAuthorName(response))
                .description(getDescription(response))
                .pages(getInteger(response, "number_of_pages"))
                .publishedYear(getPublishedYear(response))
                .isbn(getFirstIsbn(response))
                .openLibraryId(getString(response, "key"))
                .coverId(getFirstCoverId(response))
                .build();
    }

    private String getString(Map<String, Object> map, String key) {
        return map.containsKey(key) ? map.get(key).toString() : null;
    }

    private String getFirstString(Map<String, Object> map, String key) {
        if (!map.containsKey(key)) {
            return null;
        }

        Object value = map.get(key);
        if (value instanceof List) {
            List<?> list = (List<?>) value;
            return !list.isEmpty() ? list.get(0).toString() : null;
        }

        return value.toString();
    }

    private Integer getInteger(Map<String, Object> map, String key) {
        if (!map.containsKey(key)) {
            return null;
        }

        Object value = map.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        } else if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private Double getDouble(Map<String, Object> map, String key) {
        if (!map.containsKey(key)) {
            return null;
        }

        Object value = map.get(key);
        if (value instanceof Double) {
            return (Double) value;
        } else if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        } else if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private String getCoverId(Map<String, Object> doc) {
        if (!doc.containsKey("cover_i")) {
            return null;
        }

        Object coverId = doc.get("cover_i");
        if (coverId == null) {
            return null;
        }

        return coverId.toString();
    }

    private boolean isAvailableOnline(Map<String, Object> doc) {
        if (!doc.containsKey("ia")) {
            return false;
        }

        Object ia = doc.get("ia");
        if (ia instanceof List) {
            return !((List<?>) ia).isEmpty();
        }

        return false;
    }

    private String getAuthorName(Map<String, Object> response) {
        if (!response.containsKey("authors")) {
            return "Unknown Author";
        }

        Object authors = response.get("authors");
        if (authors instanceof List) {
            List<?> authorsList = (List<?>) authors;
            if (!authorsList.isEmpty() && authorsList.get(0) instanceof Map) {
                Map<?, ?> authorMap = (Map<?, ?>) authorsList.get(0);
                if (authorMap.containsKey("name")) {
                    return authorMap.get("name").toString();
                }
            }
        }

        return "Unknown Author";
    }

    private String getDescription(Map<String, Object> response) {
        if (!response.containsKey("description")) {
            return "No description available";
        }

        Object description = response.get("description");
        if (description instanceof Map) {
            Map<?, ?> descMap = (Map<?, ?>) description;
            if (descMap.containsKey("value")) {
                return descMap.get("value").toString();
            }
        } else if (description instanceof String) {
            return (String) description;
        }

        return "No description available";
    }

    private Integer getPublishedYear(Map<String, Object> response) {
        if (!response.containsKey("publish_date")) {
            return null;
        }

        Object publishDate = response.get("publish_date");
        if (publishDate instanceof String) {
            String date = (String) publishDate;
            try {
                // Extract year from date string (could be "2023", "2023-01-15", etc.)
                String year = date.split("-")[0];
                return Integer.parseInt(year);
            } catch (Exception e) {
                return null;
            }
        }

        return null;
    }

    private String getFirstIsbn(Map<String, Object> response) {
        // Try ISBN 13 first
        if (response.containsKey("isbn_13")) {
            Object isbn13 = response.get("isbn_13");
            if (isbn13 instanceof List) {
                List<?> isbns = (List<?>) isbn13;
                if (!isbns.isEmpty()) {
                    return isbns.get(0).toString();
                }
            }
        }

        // Try ISBN 10
        if (response.containsKey("isbn_10")) {
            Object isbn10 = response.get("isbn_10");
            if (isbn10 instanceof List) {
                List<?> isbns = (List<?>) isbn10;
                if (!isbns.isEmpty()) {
                    return isbns.get(0).toString();
                }
            }
        }

        return null;
    }

    private String getFirstCoverId(Map<String, Object> response) {
        if (!response.containsKey("covers")) {
            return null;
        }

        Object covers = response.get("covers");
        if (covers instanceof List) {
            List<?> coversList = (List<?>) covers;
            if (!coversList.isEmpty()) {
                return coversList.get(0).toString();
            }
        }

        return null;
    }
}