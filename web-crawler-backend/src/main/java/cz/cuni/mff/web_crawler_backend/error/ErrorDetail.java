package cz.cuni.mff.web_crawler_backend.error;

import lombok.Data;

@Data
public class ErrorDetail {
    private String code;
    private String scope;

    public ErrorDetail(String code, String scope) {
        this.code = code;
        this.scope = scope;
    }

}
