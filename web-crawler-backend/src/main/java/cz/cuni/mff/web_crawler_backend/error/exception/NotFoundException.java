package cz.cuni.mff.web_crawler_backend.error.exception;


import lombok.Getter;

@Getter
public class NotFoundException extends APIException {
    private static final String DEFAULT_CODE = "NOT_FOUND";

    public NotFoundException(String field) {
        super(DEFAULT_CODE, field);
    }
}

