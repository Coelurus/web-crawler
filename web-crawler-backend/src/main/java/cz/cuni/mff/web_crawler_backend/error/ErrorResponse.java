package cz.cuni.mff.web_crawler_backend.error;

import java.util.List;
import lombok.Data;

@Data
public class ErrorResponse {
    private List<ErrorDetail> errors;

    public ErrorResponse(List<ErrorDetail> errors) {
        this.errors = errors;
    }
}
