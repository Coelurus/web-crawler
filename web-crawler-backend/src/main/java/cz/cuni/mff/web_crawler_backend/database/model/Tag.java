package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "wr_id")
    private Long wrId;

    public Tag() {
    }

    public Tag(String name, Long wrId) {
        this.name = name;
        this.wrId = wrId;
    }

    @Override
    public String toString() {
        return name;
    }
}
