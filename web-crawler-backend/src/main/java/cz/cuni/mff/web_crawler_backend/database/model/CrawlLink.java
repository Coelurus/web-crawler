package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "crawllinks")
public class CrawlLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "from_id")
    private Long from;

    @Column(name = "to_id")
    private Long to;

    @Column(name = "execution_id")
    private Long executionId;

    public CrawlLink(Long from, Long to, Long executionId) {
        this.from = from;
        this.to = to;
        this.executionId = executionId;
    }

}
