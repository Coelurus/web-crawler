package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.PeriodicityTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeriodicityTimeRepository extends JpaRepository<PeriodicityTime, Long> {
    PeriodicityTime findById(long id);
}
