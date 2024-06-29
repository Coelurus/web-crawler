package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;

@Entity
@Table(name="Tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long wr_id;

    public Tag(){}

    public Tag(String name, Long wr_id) {
        this.name = name;
        this.wr_id = wr_id;
    }

    public Tag(Long id, String name, Long wr_id) {
        this.id = id;
        this.name = name;
        this.wr_id = wr_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getWr_id() {
        return wr_id;
    }

    public void setWr_id(Long wr_id) {
        this.wr_id = wr_id;
    }
}
