package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteRecordRepository extends JpaRepository<WebsiteRecord, Long> {
    Optional<WebsiteRecord> findById(long id);
}
