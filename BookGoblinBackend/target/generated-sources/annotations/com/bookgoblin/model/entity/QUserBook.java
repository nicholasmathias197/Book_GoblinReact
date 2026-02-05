package com.bookgoblin.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserBook is a Querydsl query type for UserBook
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserBook extends EntityPathBase<UserBook> {

    private static final long serialVersionUID = 388315577L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserBook userBook = new QUserBook("userBook");

    public final DateTimePath<java.time.LocalDateTime> addedAt = createDateTime("addedAt", java.time.LocalDateTime.class);

    public final QBook book;

    public final NumberPath<Integer> currentPage = createNumber("currentPage", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> finishedReading = createDateTime("finishedReading", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> rating = createNumber("rating", Integer.class);

    public final StringPath review = createString("review");

    public final DateTimePath<java.time.LocalDateTime> startedReading = createDateTime("startedReading", java.time.LocalDateTime.class);

    public final EnumPath<com.bookgoblin.model.enums.BookStatus> status = createEnum("status", com.bookgoblin.model.enums.BookStatus.class);

    public final QUser user;

    public QUserBook(String variable) {
        this(UserBook.class, forVariable(variable), INITS);
    }

    public QUserBook(Path<? extends UserBook> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserBook(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserBook(PathMetadata metadata, PathInits inits) {
        this(UserBook.class, metadata, inits);
    }

    public QUserBook(Class<? extends UserBook> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new QBook(forProperty("book")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

