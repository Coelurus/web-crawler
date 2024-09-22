package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrawlResultRepository extends JpaRepository<CrawlResult, Long> {
    boolean existsByUrlAndExecutionId(String url, Long executionId);

    CrawlResult findByUrlAndExecutionId(String url, Long executionId);
}
