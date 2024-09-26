package cz.cuni.mff.web_crawler_backend.error.exception;


import lombok.Getter;

@Getter
public class NotFoundException extends APIException {
    public NotFoundException(String code, String field) {
        super(code, field);
    }
}

