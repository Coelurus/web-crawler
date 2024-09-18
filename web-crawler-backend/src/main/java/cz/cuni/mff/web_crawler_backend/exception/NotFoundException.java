package cz.cuni.mff.web_crawler_backend.exception;


import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {
    private final String field;
    private final String code;

    public NotFoundException(String code, String field) {
        super(String.format("Not found: %s", field));
        this.code = code;
        this.field = field;
    }
}

