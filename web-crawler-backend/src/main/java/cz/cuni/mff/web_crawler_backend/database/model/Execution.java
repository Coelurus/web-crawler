package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "executions")
public class Execution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wr_id", referencedColumnName = "id", nullable = false)
    private WebsiteRecord website;

    @Column(name = "status")
    private String status;

    @Column(name = "start_time")
    private ZonedDateTime startTime;

    @Column(name = "end_time")
    private ZonedDateTime endTime;

    @Column(name = "crawled_count")
    private Integer crawledCount;

    public Execution(WebsiteRecord caller) {
        website = caller;
        status = "PENDING";
        startTime = ZonedDateTime.now();
        endTime = null;
        crawledCount = 0;
    }

    public Execution(WebsiteRecord caller, Long id) {
        this(caller);
        this.id = id;
    }

    public Execution() {
    }
}
