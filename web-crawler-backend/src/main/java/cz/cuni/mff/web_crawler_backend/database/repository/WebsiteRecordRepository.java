package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteRecordRepository extends JpaRepository<WebsiteRecord, Long> {
    Optional<WebsiteRecord> findById(long id);

    @Transactional
    @Modifying
    @Query("update WebsiteRecord w set w.crawledData = ?1 where w.id = ?2")
    void updateCrawledData(CrawlResult crawledData, Long id);

    @Transactional
    @Modifying
    @Query("update WebsiteRecord w set w.active = ?1 where w.id = ?2")
    void setActivity(boolean active, Long id);

    @Modifying
    @Transactional
    void deleteById(long id);

    @Query("select max(id) from WebsiteRecord ")
    Long findMaxId();
}
