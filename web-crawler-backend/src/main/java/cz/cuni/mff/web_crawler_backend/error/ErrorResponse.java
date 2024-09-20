package cz.cuni.mff.web_crawler_backend.error;

import lombok.Data;

import java.util.List;

@Data
public class ErrorResponse {
    private List<ErrorDetail> errors;

    public ErrorResponse(List<ErrorDetail> errors) {
        this.errors = errors;
    }

}
