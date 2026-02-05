package com.bookgoblin.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBook is a Querydsl query type for Book
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBook extends EntityPathBase<Book> {

    private static final long serialVersionUID = 1129165262L;

    public static final QBook book = new QBook("book");

    public final StringPath author = createString("author");

    public final BooleanPath availableOnline = createBoolean("availableOnline");

    public final StringPath coverId = createString("coverId");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    public final EnumPath<com.bookgoblin.model.enums.Genre> genre = createEnum("genre", com.bookgoblin.model.enums.Genre.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath isbn = createString("isbn");

    public final StringPath language = createString("language");

    public final StringPath openLibraryId = createString("openLibraryId");

    public final NumberPath<Integer> pages = createNumber("pages", Integer.class);

    public final NumberPath<Integer> publishedYear = createNumber("publishedYear", Integer.class);

    public final NumberPath<Double> rating = createNumber("rating", Double.class);

    public final NumberPath<Integer> ratingCount = createNumber("ratingCount", Integer.class);

    public final StringPath title = createString("title");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QBook(String variable) {
        super(Book.class, forVariable(variable));
    }

    public QBook(Path<? extends Book> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBook(PathMetadata metadata) {
        super(Book.class, metadata);
    }

}

