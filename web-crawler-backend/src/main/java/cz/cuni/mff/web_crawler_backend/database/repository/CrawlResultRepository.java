package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlResultRepository extends JpaRepository<CrawlResult, Long> {
}
