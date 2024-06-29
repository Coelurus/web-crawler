package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
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

    //private LocalDateTime periodicity;
    private Short day;

    private Short hour;

    private Short minute;

    private String label;

    private boolean active;

    public WebsiteRecord(String url, String regex, Short day, Short hour, Short minute, String label) {
        this.url = url;
        this.regex = regex;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.label = label;
    }

    public Long getIntervalSeconds(){
        return (long) (day * 24 * 60 * 60 + hour * 60 * 60 + minute * 60);
    }
    public WebsiteRecord() {}



}