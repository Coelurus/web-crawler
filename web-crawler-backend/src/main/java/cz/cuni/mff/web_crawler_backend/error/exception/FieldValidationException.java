package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class FieldValidationException extends APIException {
    private static final String DEFAULT_CODE = "FIELD_INVALID";

    public FieldValidationException(String field) {
        super(DEFAULT_CODE, field);
    }
}
