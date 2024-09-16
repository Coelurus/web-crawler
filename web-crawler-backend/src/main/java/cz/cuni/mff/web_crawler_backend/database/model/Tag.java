package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "wr_id")
    private Long wr_id;

    public Tag(){}

    public Tag(String name, Long wr_id) {
        this.name = name;
        this.wr_id = wr_id;
    }
}
