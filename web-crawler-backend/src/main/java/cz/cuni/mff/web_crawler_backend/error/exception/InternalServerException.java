package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class InternalServerException extends APIException {
    private static final String DEFAULT_CODE = "INTERNAL_SERVER_ERROR";

    public InternalServerException(String field) {
        super(DEFAULT_CODE, field);
    }
}
