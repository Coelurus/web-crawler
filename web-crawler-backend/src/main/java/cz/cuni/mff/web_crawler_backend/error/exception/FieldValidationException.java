package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class FieldValidationException extends RuntimeException {
    private final String field;
    private final String code;

    public FieldValidationException(String code, String field) {
        super(String.format("Validation failed for field: %s", field));
        this.code = code;
        this.field = field;
    }

}
