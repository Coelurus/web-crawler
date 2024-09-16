package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebsiteRecordRepository extends JpaRepository<WebsiteRecord, Long> {
    WebsiteRecord findById(long id);
}
