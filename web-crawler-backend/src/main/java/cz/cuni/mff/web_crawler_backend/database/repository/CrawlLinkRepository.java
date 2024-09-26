package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrawlLinkRepository extends JpaRepository<CrawlLink, Long> {
    boolean existsByFromAndTo(Long from, Long to);

    List<CrawlLink> findByExecutionId(Long executionId);

    @Transactional
    @Modifying
    void deleteByExecutionId(Long executionId);
}
