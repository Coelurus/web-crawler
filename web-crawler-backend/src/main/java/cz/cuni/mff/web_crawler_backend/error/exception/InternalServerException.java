package cz.cuni.mff.web_crawler_backend.error.exception;

import lombok.Getter;

@Getter
public class InternalServerException extends APIException {
    public InternalServerException(String code, String field) {
        super(code, field);
    }
}
