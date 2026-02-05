package com.bookgoblin.util;

import com.bookgoblin.model.dto.response.BookResponse;
import com.bookgoblin.model.entity.Book;
import com.bookgoblin.model.entity.UserBook;
import com.bookgoblin.model.enums.Genre;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-05T10:34:02-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.18 (Eclipse Adoptium)"
)
@Component
public class BookMapperImpl implements BookMapper {

    @Override
    public BookResponse toResponse(Book book) {
        if ( book == null ) {
            return null;
        }

        BookResponse.BookResponseBuilder bookResponse = BookResponse.builder();

        if ( book.getGenre() != null ) {
            bookResponse.genre( book.getGenre().name() );
        }
        bookResponse.id( book.getId() );
        bookResponse.title( book.getTitle() );
        bookResponse.author( book.getAuthor() );
        bookResponse.publishedYear( book.getPublishedYear() );
        bookResponse.pages( book.getPages() );
        bookResponse.coverId( book.getCoverId() );
        bookResponse.isbn( book.getIsbn() );
        bookResponse.description( book.getDescription() );
        bookResponse.rating( book.getRating() );
        bookResponse.ratingCount( book.getRatingCount() );
        bookResponse.language( book.getLanguage() );
        bookResponse.availableOnline( book.getAvailableOnline() );
        bookResponse.openLibraryId( book.getOpenLibraryId() );

        return bookResponse.build();
    }

    @Override
    public BookResponse toResponseWithUserData(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }

        BookResponse.BookResponseBuilder bookResponse = BookResponse.builder();

        bookResponse.id( userBookBookId( userBook ) );
        bookResponse.title( userBookBookTitle( userBook ) );
        bookResponse.author( userBookBookAuthor( userBook ) );
        Genre genre = userBookBookGenre( userBook );
        if ( genre != null ) {
            bookResponse.genre( genre.name() );
        }
        bookResponse.publishedYear( userBookBookPublishedYear( userBook ) );
        bookResponse.pages( userBookBookPages( userBook ) );
        bookResponse.coverId( userBookBookCoverId( userBook ) );
        bookResponse.isbn( userBookBookIsbn( userBook ) );
        bookResponse.description( userBookBookDescription( userBook ) );
        bookResponse.rating( userBookBookRating( userBook ) );
        bookResponse.ratingCount( userBookBookRatingCount( userBook ) );
        bookResponse.language( userBookBookLanguage( userBook ) );
        bookResponse.availableOnline( userBookBookAvailableOnline( userBook ) );
        bookResponse.openLibraryId( userBookBookOpenLibraryId( userBook ) );
        bookResponse.status( userBook.getStatus() );
        bookResponse.currentPage( userBook.getCurrentPage() );
        bookResponse.userRating( userBook.getRating() );
        bookResponse.review( userBook.getReview() );

        return bookResponse.build();
    }

    private Long userBookBookId(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Long id = book.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String userBookBookTitle(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String title = book.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }

    private String userBookBookAuthor(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String author = book.getAuthor();
        if ( author == null ) {
            return null;
        }
        return author;
    }

    private Genre userBookBookGenre(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Genre genre = book.getGenre();
        if ( genre == null ) {
            return null;
        }
        return genre;
    }

    private Integer userBookBookPublishedYear(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Integer publishedYear = book.getPublishedYear();
        if ( publishedYear == null ) {
            return null;
        }
        return publishedYear;
    }

    private Integer userBookBookPages(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Integer pages = book.getPages();
        if ( pages == null ) {
            return null;
        }
        return pages;
    }

    private String userBookBookCoverId(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String coverId = book.getCoverId();
        if ( coverId == null ) {
            return null;
        }
        return coverId;
    }

    private String userBookBookIsbn(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String isbn = book.getIsbn();
        if ( isbn == null ) {
            return null;
        }
        return isbn;
    }

    private String userBookBookDescription(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String description = book.getDescription();
        if ( description == null ) {
            return null;
        }
        return description;
    }

    private Double userBookBookRating(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Double rating = book.getRating();
        if ( rating == null ) {
            return null;
        }
        return rating;
    }

    private Integer userBookBookRatingCount(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Integer ratingCount = book.getRatingCount();
        if ( ratingCount == null ) {
            return null;
        }
        return ratingCount;
    }

    private String userBookBookLanguage(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String language = book.getLanguage();
        if ( language == null ) {
            return null;
        }
        return language;
    }

    private Boolean userBookBookAvailableOnline(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        Boolean availableOnline = book.getAvailableOnline();
        if ( availableOnline == null ) {
            return null;
        }
        return availableOnline;
    }

    private String userBookBookOpenLibraryId(UserBook userBook) {
        if ( userBook == null ) {
            return null;
        }
        Book book = userBook.getBook();
        if ( book == null ) {
            return null;
        }
        String openLibraryId = book.getOpenLibraryId();
        if ( openLibraryId == null ) {
            return null;
        }
        return openLibraryId;
    }
}
