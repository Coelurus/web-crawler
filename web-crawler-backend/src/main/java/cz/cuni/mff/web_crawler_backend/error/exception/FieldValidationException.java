package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class FieldValidationException extends APIException {
    public FieldValidationException(String code, String field) {
        super(code, field);
    }

}
