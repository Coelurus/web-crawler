package cz.cuni.mff.web_crawler_backend.database.repository;


import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExecutionRepository extends JpaRepository<Execution, Long> {
    Optional<Execution> findById(long id);

    List<Execution> findByWebsiteId(Long websiteId);

    @Transactional
    @Modifying
    @Query("update Execution e set e.status = ?1, e.endTime = ?2 where e.id = ?3")
    void updateStatusAndTime(String status, ZonedDateTime endTime, Long id);

    @Transactional
    @Modifying
    @Query("update Execution e set e.crawledCount = e.crawledCount + 1 where e.id = ?1")
    void updateCrawledCount(Long id);

    @Transactional
    @Modifying
    void deleteByWebsiteId(Long websiteId);
}
