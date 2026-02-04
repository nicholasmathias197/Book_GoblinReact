package com.bookgoblin.util;

import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.model.entity.Book;
import com.bookgoblin.model.entity.UserBook;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BookMapper {

    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    @Mapping(source = "genre", target = "genre")
    @Mapping(source = "id", target = "id")
    BookResponse toResponse(Book book);

    @Mapping(source = "book.id", target = "id")
    @Mapping(source = "book.title", target = "title")
    @Mapping(source = "book.author", target = "author")
    @Mapping(source = "book.genre", target = "genre")
    @Mapping(source = "book.publishedYear", target = "publishedYear")
    @Mapping(source = "book.pages", target = "pages")
    @Mapping(source = "book.coverId", target = "coverId")
    @Mapping(source = "book.isbn", target = "isbn")
    @Mapping(source = "book.description", target = "description")
    @Mapping(source = "book.rating", target = "rating")
    @Mapping(source = "book.ratingCount", target = "ratingCount")
    @Mapping(source = "book.language", target = "language")
    @Mapping(source = "book.availableOnline", target = "availableOnline")
    @Mapping(source = "book.openLibraryId", target = "openLibraryId")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "currentPage", target = "currentPage")
    @Mapping(source = "rating", target = "userRating")
    @Mapping(source = "review", target = "review")
    BookResponse toResponseWithUserData(UserBook userBook);
}