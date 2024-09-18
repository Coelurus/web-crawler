package cz.cuni.mff.web_crawler_backend.exception;

import lombok.Getter;

@Getter
public class InternalServerException extends RuntimeException {
    private final String field;
    private final String code;

    public InternalServerException(String code, String field) {
        super(String.format("Internal server error: %s", field));
        this.code = code;
        this.field = field;
    }
}
