package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
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
    private Long crawlTime;

    @Column(name = "execution_id")
    private Long executionId;

    @Column(name = "state")
    private String state;

    public CrawlResult(String url, String title, Long crawlTime, Long executionId, String state) {
        this.url = url;
        this.title = title;
        this.crawlTime = crawlTime;
        this.executionId = executionId;
        this.state = state;
    }

    public CrawlResult(String url, String state, Long executionId) {
        this.url = url;
        this.title = url;
        this.state = state;
        this.executionId = executionId;
    }

    public void setSearched() {
        this.state = "SEARCHED";
    }
}
