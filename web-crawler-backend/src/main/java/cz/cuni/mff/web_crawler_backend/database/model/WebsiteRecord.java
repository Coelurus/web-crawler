package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "websiterecords")
public class WebsiteRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "label")
    private String label;

    @Column(name = "url")
    private String url;

    @Column(name = "regex")
    private String boundaryRegExp;

    @OneToOne
    @JoinColumn(name = "time_id", referencedColumnName = "id", nullable = false)
    private PeriodicityTime periodicity;

    @Column(name = "active")
    private boolean active;

    @ManyToMany
    @JoinTable(
            name = "tags",
            joinColumns = @JoinColumn(name = "wr_id"),
            inverseJoinColumns = @JoinColumn(name = "id")
    )
    private List<Tag> tags;

    @Column(name = "result_record")
    private Integer crawledData;

    public WebsiteRecord(String label, String url, String boundaryRegExp, PeriodicityTime periodicity, boolean active) {
        this.label = label;
        this.url = url;
        this.boundaryRegExp = boundaryRegExp;
        this.periodicity = periodicity;
        this.active = active;
        this.tags = new ArrayList<>();
    }

    public WebsiteRecord() {

    }

    public WebsiteRecord update(WebsiteRecord newWR) {
        id = newWR.getId();
        label = newWR.getLabel();
        url = newWR.getUrl();
        boundaryRegExp = newWR.getBoundaryRegExp();
        periodicity = newWR.getPeriodicity();
        active = newWR.isActive();
        crawledData = newWR.getCrawledData();
        return this;
    }
}