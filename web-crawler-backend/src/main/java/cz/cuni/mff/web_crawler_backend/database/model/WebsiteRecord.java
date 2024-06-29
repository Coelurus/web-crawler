package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name="websiterecords")
public class WebsiteRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String regex;

    private String periodicity;

    private String label;

    private boolean active;
    public WebsiteRecord() {}

    public WebsiteRecord(String url, String regex, String periodicity, String label) {
        this.url = url;
        this.regex = regex;
        this.periodicity = periodicity;
        this.label = label;
        this.active = true;
    }

}