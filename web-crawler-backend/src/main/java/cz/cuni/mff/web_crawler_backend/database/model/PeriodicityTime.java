package cz.cuni.mff.web_crawler_backend.database.model;

import cz.cuni.mff.web_crawler_backend.error.exception.FieldValidationException;
import jakarta.persistence.*;
import java.util.Arrays;
import lombok.Data;

@Data
@Entity
@Table(name = "periodicitytimes")
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

    public PeriodicityTime(String input) {
        String[] parts = input.split(":");
        if (parts.length == 0 || parts.length > 3) {
            throw new FieldValidationException("periodicity");
        }

        Integer[] parsedParts = Arrays.stream(parts).map(Integer::parseInt).toArray(Integer[]::new);

        setDay(parsedParts[0]);
        setHour(parsedParts[1]);
        setMinute(parsedParts[2]);
    }

    public PeriodicityTime() {
    }

    @Override
    public String toString() {
        return String.format("%d:%d:%d", day, hour, minute);
    }

    /**
     * Counts total time in seconds
     *
     * @return Sum of all attributes in seconds
     */
    public Long getTimeInSeconds() {
        return (((((day * 24L) + hour) * 60) + minute) * 60);
    }
}
