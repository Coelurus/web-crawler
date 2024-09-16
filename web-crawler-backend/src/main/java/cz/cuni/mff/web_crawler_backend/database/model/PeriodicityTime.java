package cz.cuni.mff.web_crawler_backend.database.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="periodicitytimes")
public class PeriodicityTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "minute")
    private int minute;

    @Column(name = "hour")
    private int hour;

    @Column(name = "day")
    private int day;
}
