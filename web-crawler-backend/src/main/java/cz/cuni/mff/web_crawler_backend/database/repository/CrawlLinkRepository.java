package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlLinkRepository extends JpaRepository<CrawlLink, Long> {
    boolean existsByFromAndTo(Long from, Long to);
}