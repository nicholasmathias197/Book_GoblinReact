package com.bookgoblin.service;

import com.bookgoblin.model.dto.response.BookResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenLibraryService {

    private final RestTemplate restTemplate;

    @Value("${openlibrary.api.base-url}")
    private String baseUrl;

    @Cacheable(value = "bookSearch", key = "#query + #page + #limit")
    public List<BookResponse> searchBooks(String query, int page, int limit) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search.json")
                .queryParam("q", query)
                .queryParam("page", page)
                .queryParam("limit", limit)
                .queryParam("fields", "key,title,author_name,cover_i,first_publish_year,edition_count,number_of_pages_median,subject,language,isbn,ia,ratings_average,ratings_count")
                .toUriString();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> docs = (List<Map<String, Object>>) response.get("docs");

            List<BookResponse> books = new ArrayList<>();
            for (Map<String, Object> doc : docs) {
                BookResponse book = BookResponse.builder()
                        .title((String) doc.get("title"))
                        .author(doc.get("author_name") != null ?
                                ((List<String>) doc.get("author_name")).get(0) : "Unknown Author")
                        .genre(doc.get("subject") != null ?
                                ((List<String>) doc.get("subject")).get(0) : "General")
                        .publishedYear((Integer) doc.get("first_publish_year"))
                        .pages((Integer) doc.get("number_of_pages_median"))
                        .coverId(doc.get("cover_i") != null ?
                                doc.get("cover_i").toString() : null)
                        .isbn(doc.get("isbn") != null ?
                                ((List<String>) doc.get("isbn")).get(0) : null)
                        .rating(doc.get("ratings_average") != null ?
                                (Double) doc.get("ratings_average") : 0.0)
                        .ratingCount(doc.get("ratings_count") != null ?
                                (Integer) doc.get("ratings_count") : 0)
                        .language(doc.get("language") != null ?
                                ((List<String>) doc.get("language")).get(0) : "en")
                        .availableOnline(doc.get("ia") != null &&
                                ((List<String>) doc.get("ia")).size() > 0)
                        .openLibraryId((String) doc.get("key"))
                        .build();
                books.add(book);
            }
            return books;
        } catch (Exception e) {
            log.error("Error searching books: {}", e.getMessage());
            return List.of();
        }
    }

    @Cacheable(value = "bookDetails", key = "#bookId")
    public BookResponse getBookDetails(String bookId) {
        String url = baseUrl + bookId + ".json";
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            return BookResponse.builder()
                    .title((String) response.get("title"))
                    .author(response.get("authors") != null ?
                            ((List<Map<String, Object>>) response.get("authors")).get(0).get("name").toString() :
                            "Unknown Author")
                    .description(getDescription(response))
                    .pages((Integer) response.get("number_of_pages"))
                    .publishedYear(getPublishedYear(response))
                    .isbn(getFirstIsbn(response))
                    .openLibraryId(bookId)
                    .build();
        } catch (Exception e) {
            log.error("Error fetching book details: {}", e.getMessage());
            return null;
        }
    }

    @Cacheable(value = "bookByIsbn", key = "#isbn")
    public BookResponse getBookByISBN(String isbn) {
        String url = baseUrl + "/isbn/" + isbn + ".json";
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            return BookResponse.builder()
                    .title((String) response.get("title"))
                    .author(response.get("authors") != null ?
                            ((List<Map<String, Object>>) response.get("authors")).get(0).get("name").toString() :
                            "Unknown Author")
                    .pages((Integer) response.get("number_of_pages"))
                    .coverId(response.get("covers") != null ?
                            ((List<Integer>) response.get("covers")).get(0).toString() : null)
                    .isbn(isbn)
                    .publishedYear(getPublishedYear(response))
                    .description(getDescription(response))
                    .openLibraryId((String) response.get("key"))
                    .build();
        } catch (Exception e) {
            log.error("Error fetching book by ISBN: {}", e.getMessage());
            return null;
        }
    }

    public List<BookResponse> getTrendingBooks() {
        return searchBooks("fantasy OR science fiction OR mystery", 1, 12);
    }

    private String getDescription(Map<String, Object> response) {
        if (response.get("description") instanceof Map) {
            return (String) ((Map<?, ?>) response.get("description")).get("value");
        } else if (response.get("description") instanceof String) {
            return (String) response.get("description");
        }
        return "No description available";
    }

    private Integer getPublishedYear(Map<String, Object> response) {
        if (response.get("publish_date") != null) {
            String date = response.get("publish_date").toString();
            try {
                return Integer.parseInt(date.split("-")[0]);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private String getFirstIsbn(Map<String, Object> response) {
        if (response.get("isbn_13") != null) {
            List<String> isbns = (List<String>) response.get("isbn_13");
            if (!isbns.isEmpty()) return isbns.get(0);
        }
        if (response.get("isbn_10") != null) {
            List<String> isbns = (List<String>) response.get("isbn_10");
            if (!isbns.isEmpty()) return isbns.get(0);
        }
        return null;
    }
}