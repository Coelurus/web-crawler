package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "crawlresults")
public class CrawlResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "url")
    private String url;

    @Column(name = "title")
    private String title;

    @Column(name = "crawl_time")
    private String crawlTime;


}
