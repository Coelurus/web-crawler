package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class APIException extends RuntimeException {
    protected final String field;
    protected final String code;

    public APIException(String field, String code) {
        this.field = field;
        this.code = code;
    }
}
